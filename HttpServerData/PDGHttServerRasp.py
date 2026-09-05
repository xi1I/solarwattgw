HTTP_SERVER=''


PORT=8080

LOGFILE=None
LOGFILENAME="/tmp/PGDHttpServer.log"

DEFAULTFILE="/home/work/SW/HttpServerData/BMSData.shtml"

import SimpleHTTPServer
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from SocketServer import ThreadingMixIn
from urlparse import urlparse,parse_qs
import threading
import datetime,time


def dprint(s):
    t1=time.time()
    t=datetime.datetime.fromtimestamp(t1)
    ts=t.strftime("%d-%m-%y %H:%M:%S.%f")
    ds="%s(%s): %s\n" %(ts,t1,s)
    if LOGFILE==None:
        print(ds )
    else:
        LOGFILE.write(ds)
    #endif

#end dprint

class Handler(BaseHTTPRequestHandler):

    def do_GET(self):

        t1=time.time()
        query_components = parse_qs(urlparse(self.path).query)

        dprint ("received GET %s" % repr(query_components))
        ok=False

        wantedfile=DEFAULTFILE

        try:
            fd=open(wantedfile,"r")
        except Exception,e:
            fd=None
        #end try
        
        if fd == None:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain') 
            self.end_headers()
            message =  threading.currentThread().getName() + \
                       " %s NOT FOUND" % (wantedfile)
            self.wfile.write(message)                
        else:
            dprint ("begin read %s"%wantedfile)
            data=fd.read()
            fd.close()
            dprint ("end read %s (len=%s)"%(wantedfile,len(data)))
            self.send_response(200)
            self.send_header('Content-type', 'text/plain') 
            self.end_headers()
            message =  "%s" % (data,)
            self.wfile.write(message)
            ok=True
            fd.close()
        #endif

        t2=time.time()
        dprint ("send done: len=%s, duration=%s"%\
                (len(message),t2-t1))
        return
#end class Handler

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""
#end class  ThreadedHTTPServe



if __name__ == '__main__':
   # if logging wanted open LOGFILE
    LOGFILE=open(LOGFILENAME,"a")
    server = ThreadedHTTPServer((HTTP_SERVER, PORT), Handler)

    dprint ("PDGHttpServer serving on %s/%s"%(HTTP_SERVER, PORT))
    dprint ('Starting server, use <Ctrl-C> to stop')
    server.serve_forever()
#end __main__
