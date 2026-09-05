#!/usr/bin/env python
# -*- coding: utf-8 -*-


from pynetlinux import ifconfig
from pynetlinux import route
import json
import cgi
import time
import os
import subprocess
import datetime
import os
import copy
import socket

#####################
# globals 
js={}
LASTBLEDATAFILE="/home/work/SW/HttpServerData/BMSData.shtml"
BLEFILE="/tmp/bleConnectedDevice.txt"
#####################

def scrub(x):
  # Converts None to empty string
  ret = copy.deepcopy(x)
  # Handle dictionaries, lits & tuples. Scrub all values
  if isinstance(x, dict):
    for k, v in ret.items():
      ret[k] = scrub(v)
  if isinstance(x, (list, tuple)):
    for k, v in enumerate(ret):
      ret[k] = scrub(v)
  # Handle None
  if x is None:
    ret = ''
  # Finished scrubbing
  return ret
#end scrub


#test internet connection
REMOTE_SERVER = "www.google.com"

def is_connected():
  try:
    #test DNS resolution and internet connection
    s=socket.create_connection((REMOTE_SERVER, 80))
    return True
  except:
     pass
  return False
#end is_connected

def parse_lines_wpa(lines):
  sid=pw=""
  searchstring="id_str=\"act\""

  i=0
  openb=-1
  closeb=-1
  s=-1

  obfound=-1
  sfound=-1
  cbfound=-1
  for line in lines:
    if obfound==-1:
      openb=line.find("{")
    #endif

    if openb>=0:
      obfound=i
      #print "found open at ", obfound
      openb=-1
    #endif
    
    if sfound == -1:
      s=line.find(searchstring)
    #endif

    if s >=0:
      sfound=i
      #print "searchstring found at ",sfound
      s=-1
    #endif
    if sfound != -1:
      closeb=line.find("}")
    #endif

    if closeb>=0:
      cbfound=i
      #print "found close at ", cbfound
      closeb=-1

    #endif 
    i=i+1
  #end for

  if sfound >=0:
    i=obfound
    while i <=cbfound:
      indsid=lines[i].find("ssid")
      if sid=="" and indsid >=0:
        vals=lines[i].split("ssid=")
        sid=vals[1].split('\"')[1]

        
      #endif
      indpsk=lines[i].find("psk")
      if pw=="" and indpsk >=0:
        vals=lines[i].split("psk=")
        pw=vals[1].split('\"')[1]
        
      #endif
      i=i+1
    #end while
  #endif

  return sid[:],pw[:]
#end parse_lines_wpa



#config file

def checkConfig():
  global js
  js={}
  

  fr=open("net_config.json","r")
  if fr:
    t=fr.read()
    js=json.loads(t)
  #endif    


  #act IP config
  ifs = ifconfig.list_ifs()


  try:
    js["ACT_GATEWAY"]=route.get_default_gw()
  except:
    js["ACT_GATEWAY"]=""
  #end try

  try:
    js["PREF_INTERFACE"] = route.get_default_if()
  except:
    js["PREF_INTERFACE"] = ""
  #endif

  for i in ifs:

      if i.name not in js:
         js[i.name]={}
      #endif

      js[i.name]["MAC"]=repr(i.mac)
      js[i.name]["IS_UP"]=i.is_up()
      js[i.name]["ACT_IP"]=i.get_ip()
      js[i.name]["ACT_NETMASK"]=i.get_netmask()
  #end for



  js["SIDS"]=[]

  #available WLANs and auth methods
  if "wlan0" in js.keys():

      available_sids={}
      actSID=""
      try:
           s=subprocess.check_output(['/sbin/ifconfig','wlan0'], text=True)
           info=s.split("\n")[1]
           s2=subprocess.check_output(['iwlist', 'wlan0', 'scan'], text=True)

           s2lines=s2.split('\n')
           for line in s2lines:

             if line.find("ESSID:")>=0:

               try:
                 actSID=line.split('"')[1]
                 available_sids[actSID]={"auth":[]}

               except:
                 pass
               #end try

             #endif
             found=False
             if line.upper().find("IE:")>=0:
               line=line.upper().split("IE: ")[1]
               if line.upper().find ("IEEE 802.1")>=0:
                 found=True
               #endif
               if line.upper().find ("WPA")>=0:
                 found=True
               #endif
               if found:
                   available_sids[actSID]["auth"].append(line.strip())
               #endif
           #end for
      except:
           pass
      #end try
                                
  #endif

  js["SIDS"]=available_sids



  #DNS:
  js["DNS"]=""
  try:
      s=subprocess.check_output(['cat','/etc/resolv.conf'], text=True)
      info=s.split("\n")

      for l in info:
        ind=l.find("nameserver")

        if ind>=0:
          js["DNS"]=l[ind+11:]
        #endif

      #end for
  except:
       pass
  #end try
  
  #acual connection to the internet?
  js["IS_CONNECTED"]=is_connected()

  #Systeminfos:
  try:
      js["HOSTTIME"]=subprocess.check_output(['date','+%Y-%m-%d:%H:%M:%S'], text=True).split("\n")[0]
  except:
      js["HOSTTIME"]=""
  #end try
  js["HOSTNAME"]=socket.gethostname()

  #parse wpa_supplicant.conf to get known networks: assume only one is active
  #assigned with id_str="act"

  lines=[]
  sidr=pwr="unknown"
  js["wlan0"]["SID"]=""
  js["wlan0"]["PW"]=""

  if "wlan0" in js.keys():
    try:
      f=open("/etc/wpa_supplicant/wpa_supplicant.conf","r")
      lines=f.readlines()
      f.close()
    except:
      pass
    #end try

    (sidr,pwr)=parse_lines_wpa(lines)

  #endif


  js["wlan0"]["SID"]=sidr
  js["wlan0"]["PW"]=pwr


  #Routing

  try:
      routing=subprocess.check_output(['route',], text=True)
      js["ROUTING"]=routing
  except:
      js["ROUTING"]=""
  #end try


  #Bluetooth:
  #get file modification time of HttpServerfile written by Senderservice

  lastble="???"
  try:
    filemod=os.path.getmtime(LASTBLEDATAFILE)

    lastble=datetime.datetime.fromtimestamp(filemod).strftime('%Y-%m-%d %H:%M:%S')
    
  except:
    filemod=0
  #endif


  
  js["LAST_BTLE_DATA"]= lastble


  #we consider BLE up if last received data was at most 60 secs ago
  js["BTLE_IS_UP"]=time.time()-filemod < 60


  try:

    fd=open(BLEFILE,"r")
    fdt=fd.read()
    fdr=json.loads(fdt)
    fd.close()
    js["MYRESERVE_NAME"]=fdr["connectedDevName"]
    js["MYRESERVE_ADDR"]=fdr["connectedDevAddr"]
    
  except:
    js["MYRESERVE_NAME"]=""
    js["MYRESERVE_ADDR"]=""
  #endif



  #overall: replace None with ""
  js=scrub(js)
  
  outf=open("/tmp/mrconfig.txt","w")
  if outf:
    try:
        outf.write(json.dumps(js))
        outf.close()
        print("wrote to file /tmp/mrconfig.txt")
    except:
        print("can not open file /tmp/mrconfig.txt")
    #end try
  else:
    print("can not open file /tmp/mrconfig.txt")
  
  #endif

#end checkConfig  

while True:
  checkConfig()
  time.sleep(8)
#end while


