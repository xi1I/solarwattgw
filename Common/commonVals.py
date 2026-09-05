#!/usr/bin/python
# -*- coding: utf-8 -*-

######################################################################################
#File: commonVals.py
#Purpose: some definitions for MyReserve Bluetooth App
#Author: IvN forSolarwatt Innovation
#Date: 13.12.2016
#Usage: from commonVals import *
#Remarks:
#Last changes:
######################################################################################
Svnid="$Id: $"

######################
# imports
######################
import os

######################
# globals
######################

SQLiteDBName='BLEData.db'
ConfigTableName="configdata"
BasePath="../data"
InitFileName=os.path.join(BasePath,"config.json")
InitFileNameP=os.path.join(BasePath,"config_private.json")
DefaultDataServer="87.79.76.201"
DefaultDataServerPort=8090
EOFMessageInd='\r'
RecBufferSize=2048


