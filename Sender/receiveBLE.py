#!/usr/bin/python
# -*- coding: utf-8 -*-

######################################################################################
#File: receiveBLE.py
#Purpose:Bluetooth receiver for MyReserve, write message to Server
#Author: IvN for Solarwatt Innovation
#Date: 13.12.2016
#Usage: python receiveBLE.py -o  (only test, default false)
#                            -c (stay connected to device, default true)
#                            -b (no hard bluetooth reset, default: hard reset)
#                            -w <wanted device> (dev to connect to, default: all)
#       further options see pythone receiveBLE.py --help
#Remarks:
#Last changes:
#03.02.2017: Use pygatt or bluepy as bluetooth LE library
#03.04.2017: search Myreserve with strongest RSSI
#            do not send if "Fastdata" is in dict
#18.04.2017: Devide into main and worker:
#            in main only import receiveBLEWorker 
######################################################################################

######################
# global SVNId
######################
Svnid="$Id: $"

######################
# globals config
######################


######################
# imports
######################

from receiveBLEWorker import *



######################
# globals
######################

TEST=0

########################
#main 
########################



if __name__ == '__main__':


    if not TEST:
        startBLEWorker(sys.argv)
    #endif

    

#endif __main__
