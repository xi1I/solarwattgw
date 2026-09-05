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

template_dhcp='iface IFACE inet dhcp\n'

def dprint(s):
    f=open(LOGFILE,"a")
    f.write("%s: %s\n"%(datetime.datetime.now(),s))
    f.close()
#end dprint

def print_result():
    js={}


    js["action"]="factoryReset"
    js["detail"]=detail
    js["info"]="info"
    js["jsin"]= []

    print("Content-Type: text/plain;charset=utf-8")
    print()
    
    print(json.dumps(js))
    
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
                raise OSError("os error")
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

phys=CABLE
logical=DHCP

linesnew=[]

info=""

###################################
#handle wpa_supplicant
###################################

if action=="ACTION_OK":
   
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


#handle interface file for eth0

outfile=""

linesnew=[]
if action=="ACTION_OK":

    iface="eth0"
    searchb=eth0b
    searche=eth0e
    
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

                linesnew.append(template_dhcp.replace("IFACE",iface ))
                info+=linesnew[-1]
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




###################################
#handle interface file for wlan0
###################################

outfile=""

linesnew=[]
if action=="ACTION_OK":

    iface="wlan0"
    searchb=wlan0b
    searche=wlan0e
    
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

                linesnew.append(template_dhcp.replace("IFACE",iface ))
                info+=linesnew[-1]
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

###################################
#handle MyReserve Bluetooth-binding
###################################

outfile="/home/work/SW/data/config_private.json"

if action == "ACTION_OK":
    try:
        os.system("sudo /bin/chmod o+rw %s" % (outfile,))
        fdj={}
            
        info=json.dumps(fdj)
        fd=open(outfile,"w")
        fd.write(info)
        fd.close()
    except Exception as e:
        dprint (e)
        info=repr(e)
        action="ACTION_NOK"
        print_result()
        sys.exit()
    #end try
#endif


###################################
#handle hostname
###################################

outfile="/etc/hostname"
newName="solarwattgw"

if action == "ACTION_OK":
    try:
        ex='echo "%s" > %s' % (newName,outfile,)
        dprint(ex)
        os.system(ex)
        ex="/etc/init.d/hostname.sh"
        dprint(ex)
        os.system(ex)
    
        action="ACTION_OK"
    except Exception as e:
        dprint (e)
        info=repr(e)
        action="ACTION_NOK"
        print_result()
        sys.exit()
    #end try
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






