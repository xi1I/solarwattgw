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
LOGFILE="/tmp/cc3.log"

OUTFILE="/etc/hostname"

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
if newupper.find("SOLARWATTGW")==0:
    correct=True
#endif

if correct:
    action="ACTION_OK"
    info=newName
    detail="reset PDG"
else:
    action="ACTION_NOK"
    info="wrong name"
    detail=newName
    print_result()
    sys.exit()
#endif

try:
    dprint("write hostname to %s" % OUTFILE)
    subprocess.run(
        ["sudo", "/usr/bin/tee", OUTFILE],
        input=(newName + "\n").encode(),
        stdout=subprocess.DEVNULL,
        check=True,
    )
    hostname_script="/etc/init.d/hostname.sh"
    dprint(hostname_script)
    subprocess.run([hostname_script], check=True)
    
    action="ACTION_OK"
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
    subprocess.run(["sudo", "/sbin/reboot"], check=False)
#endif
            
sys.exit()
