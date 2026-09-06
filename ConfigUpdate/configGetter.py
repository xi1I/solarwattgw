#!/usr/bin/python
# -*- coding: utf-8 -*-

######################################################################################
#File: configGetter.py
#Purpose:config-/software update client, main program
#Author: IvN for Solarwatt Innovation
#Date: 18.04.2017
#Usage: python configGetter.py
#Remarks:
#Last changes:
######################################################################################

######################
# global SVNId
######################
Svnid="$Id: configGetter.py 1962 2017-07-06 12:33:53Z irvn $"


######################
# Imports
######################
import sys
from subprocess import call

import configIntern

######################
# Main
######################

if __name__ == '__main__':
    ret=configIntern.configStart()
    if ret:
        configIntern.dprint ("config update SUCCESS")
    else:
        configIntern.dprint ("config update FAILED")
    #endif

    if not ret:
        sys.exit()
    #endif

    
    ret2=configIntern.swStart()
    if ret2:
        configIntern.dprint ("SW update SUCCESS")
    else:
        configIntern.dprint ("SW update FAILED")
    #endif

    if ret and ret2:
        configIntern.finish(True,False)
    #endif
#endif
