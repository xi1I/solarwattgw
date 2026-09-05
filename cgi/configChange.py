#!/usr/bin/env python
# -*- coding: utf-8 -*-



import os,sys
import time
import cgi
import json
import datetime

# enable debugging
import cgitb
cgitb.enable(1)

# constants
LOGFILE="/tmp/cc.log"

# logical config
DHCP="0"
STATIC="1"

# physical config
CABLE="0"
WIFI="1"

#strings to search for in interfaces file
eth0b="####eth0 BEGIN"
eth0e="####eth0 END"

wlan0b="####wlan0 BEGIN"
wlan0e="####wlan0 END"

#strings to match in wpa_supplicant.cong
wlan0b_wpa="network={"
wlan0e_wpa="}"

#result vals, default: all ok
action="ACTION_OK"  #ACTION_OK, ACTION_NOK
detail="RESET_DONE" #RESET_DONE, CONFIG_ERR1,NO_PERM

#template to fill config files
hidden_template='scan_ssid=1\n'
sid_template= 'ssid="SID"\n'
key_template= 'psk="PW"\n'
wpa_template='priority=10\n'\
    'proto= RSN WPA\n'\
    'pairwise=CCMP TKIP\n'\
    'group=CCMP TKIP\n'\
    'id_str="act"\n'

wep_template='priority=10\n'\
    'wep_key0="PW"\n'\
    'wep_tx_keidx=0\n'\
    'key_mgmt=NONE\n'

template_dhcp='iface IFACE inet dhcp\n'
template_static=\
                 'iface IFACE inet static\n'\
                 'address ADDRESS\n'\
                 'netmask NETMASK\n'\
                 'gateway GW\n'

def dprint(s):
    f=open(LOGFILE,"a")
    f.write("%s: %s\n"%(datetime.datetime.now(),s))
    f.close()
#end dprint

def print_result():
    js={}


    js["action"]=action
    js["detail"]=detail
    js["info"]=info
    js["jsin"]= [phys,logical,ip,netmask,gateway,sid,pw,mode]

    print "Content-Type: text/plain;charset=utf-8"
    print
    
    print json.dumps(js)
    
#end print_result


def writeToOutfile(outfile):
    global info,action,detail
    dprint ("writeToOutfile 1 %s"%outfile)
    os.system("sudo /bin/chmod o+rw %s" % (outfile,))
    dprint ("writeToOutfile 2 %s"%outfile)
    try:
        fo=open (outfile,"w")
    except:
        fo=None
    #endif

    if fo:
        for line in linesnew:
            fo.write(line)
        #end for
        fo.close()
        
        try:
            ret=os.system("sudo /bin/cp %s %s"%(outfile,configfile))
            info+=repr(ret)
            info+=" "
            info+="sudo /bin/cp %s %s"%(outfile,configfile)
            if ret!=0:
                raise ("os error")
            #endif
            action="ACTION_OK"
            detail="IN_PROGRESS"

        except:
            action="ACTION_NOK"
            detail="NO_PERM"
        #end try
    else:
        action="ACTION_NOK"
        detail="NO_PERM"
    #endif

#end writeToOutfile


form=cgi.FieldStorage()

jsin=form.getvalue("config","{}")

configuration=json.loads(jsin)

phys=configuration.get("phys","0")
logical=configuration.get("logical","0")
ip=configuration.get("IP","")
netmask=configuration.get("NM","")
gateway=configuration.get("GW","")
sid=configuration.get("SID","")
pw=configuration.get("PW","")
mode=configuration.get("MODE","")
hidden=configuration.get("HIDDEN",0)
try:
    hidden=int(hidden)
except:
    hidden=0
#endif

linesnew=[]

info=""

if phys == CABLE:
    iface="eth0"
    searchb=eth0b
    searche=eth0e
else:
    iface="wlan0"
    searchb=wlan0b
    searche=wlan0e
#endif


if phys==WIFI:
    #first handle wpa_supplicant
    configfile="/etc/wpa_supplicant/wpa_supplicant.conf"
    outfile="/tmp/wpa_supplicant.conf"
    os.system("sudo /bin/cp %s %s" % (configfile,outfile))
    os.system("sudo /bin/chmod o+rw %s" % (outfile,))
    fd=open(outfile,"r")
    if fd:
        lines=fd.readlines()
        fd.close()
        appendmode=True
        for line in lines:
            if appendmode:
                linesnew.append(line)
            #endif
            if line.find (wlan0b_wpa)>-1:
                appendmode=False
                if mode.find("WPA")>=0 or mode =="":
                    linesnew.append(wpa_template)
                else:
                    linesnew.append(wep_template.replace("PW",pw))
                #endif
                if sid!="":
                    linesnew.append(sid_template.replace("SID",sid))
                #endif
                if pw!="":
                    linesnew.append(key_template.replace("PW",pw))
                #endif
                if hidden!=0:
                    linesnew.append(hidden_template)
                #endif
            
            #endif
            if line.find (wlan0e_wpa)>-1:
                linesnew.append(line)
                break
            #endif

        #end for
        writeToOutfile(outfile)
    else:
        action="ACTION_NOK"
        detail="NO_PERM"
    #endif
#endif
outfile=""

linesnew=[]
if action=="ACTION_OK":

    configfile="/etc/network/interfaces"
    outfile="/tmp/interfaces"
    os.system("sudo /bin/cp %s %s" % (configfile,outfile))
    os.system("sudo /bin/chmod o+rw %s" % (outfile,))
    fd=open(outfile,"r")
    if fd:
        lines=fd.readlines()
        fd.close()
        appendmode=True
        for line in lines:
            if line.find (searche)>-1:
                appendmode=True
            #endif
            if appendmode:
                linesnew.append(line)
            #endif
            if line.find (searchb)>-1:
                appendmode=False

                if logical==DHCP:
                    linesnew.append(template_dhcp.replace("IFACE",iface ))
                    info+=linesnew[-1]

                else :
                    #auto eth0/wlan0
                    #iface eth0/wlan0 inet static
                    #address e.g. 192.168.2.114
                    #netmask e.g 255.255.255.0
                    #gateway e.g.address e.g. 192.168.2.1
                    
                    if "" not in (ip,netmask,gateway):
                        t1=template_static.replace("IFACE",iface)
                        t1=t1.replace("ADDRESS",ip)
                        t1=t1.replace("NETMASK",netmask)
                        t1=t1.replace("GW",gateway)
                        linesnew.append(t1)
                        info+=linesnew[-1]
                    else:
                        action="ACTION_NOK"
                        detail="CONFIG_ERR1"
                    #endif
            #endif
        #end for
    else:
        action="ACTION_NOK"
        detail="NO_PERM"
    #endif
#endif



if action == "ACTION_OK":
    if outfile!="":
        writeToOutfile(outfile)
    #endif
#endif
if action == "ACTION_OK":
    detail="RESET_DONE"
#endif

#send result to gui, reset and exit
print_result()
sys.stdout.flush()

if action == "ACTION_OK":
    time.sleep(3)
    os.system("sudo /sbin/reboot")
#endif
sys.exit(0)






