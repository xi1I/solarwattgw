#!/usr/bin/env python
# -*- coding: utf-8 -*-



import os
import cgi
import json
import html

# enable debugging
import cgitb
cgitb.enable()

f=open("/tmp/mrconfig.txt","r")

if f:
  js1=f.read()
  f.close()
  js=json.loads(js1)

  js["REMOTE_ADDR"] = html.escape(os.environ.get("REMOTE_ADDR",""))
  js["USER_AGENT"] = os.environ.get("HTTP_USER_AGENT","")
  
else:
  js={}
#endif
print("Content-Type: text/plain;charset=utf-8")
print()
print(json.dumps(js))






