#!/usr/bin/env python
# -*- coding: utf-8 -*-



import sys
import time
import cgi
import json
import datetime
import subprocess

# enable debugging
#import cgitb
#cgitb.enable(0)

# constants
LOGFILE="/tmp/cc2.log"

OUTFILE="/home/work/SW/data/config_private.json"

def dprint(s):
    f=open(LOGFILE,"a")
    f.write("%s: %s\n"%(datetime.datetime.now(),s))
    f.close()
#end dprint

#result vals, default: all ok
action="ACTION_OK"  #ACTION_OK, ACTION_NOK
detail="RESET_DONE" #RESET_DONE, CONFIG_ERR1,NO_PERM
info=""

def print_result():
    js={}


    js["action"]=action
    js["detail"]=detail
    js["info"]=info
    js["jsin"]= []
    
    print("Content-Type: text/plain;charset=utf-8")
    print()
    
    print(json.dumps(js))

#end print_result

try:
    form=cgi.FieldStorage()
    
    newName=form.getvalue("config","")
    dprint(newName)

except Exception as e:
    dprint (e)
    info=e
    action="ACTION_NOK"
    print_result()
    sys.exit()
#end try

correct=False
newupper=newName.upper()
if newupper.find("MYRESERVE-")>=0:
    hexpart=newupper.split("-")[1]
    if len(hexpart)==4:
        correct=True
        newName="MyReserve-"+hexpart
    #endif
else:
    if newupper=="":
        correct=True
        newName="default"
    #endif
#endif

if correct:
    action="ACTION_OK"
    info=newName
    detail="reset service"
else:
    action="ACTION_NOK"
    info="wrong name"
    detail=newName
#endif

try:
    subprocess.run(["sudo", "/bin/chmod", "o+rw", OUTFILE], check=False)
    if newName == "default":
        fdj={}
    else:
        
        fd=open(OUTFILE,"r")
        fdr=fd.read()
        fdj=json.loads(fdr)
        fd.close()
        fdj.update({"device_algo":"DEDICATED"})
        fdj.update({"wanteddevice":newName})
    #endif

    info=json.dumps(fdj)
    fd=open(OUTFILE,"w")
    fd.write(info)
    fd.close()
except Exception as e:
    dprint (e)
    info=repr(e)
    action="ACTION_NOK"
    print_result()
    sys.exit()
#end try    
    
print_result()
        
sys.stdout.flush()
if action == "ACTION_OK":
    time.sleep(3)
    subprocess.run(
        ["sudo", "systemctl", "restart", "myreserve.service"],
        check=False,
    )
#endif
            
sys.exit()
