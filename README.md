Windows DNS API (Node.JS)
===========

> Important note.  Although I only have like three lines of code left on my proof of concept here, my wife is wearing that thing I got her for our anniversary and I'm going to need to step away for the night.. so don't use this, yet.

A simple Node.JS server for updating the integrated DNS server that ships with windows.

This is really only a proof of concept at this point, but the idea is to launch a simple Node.JS daemon on a windows based domain controller / dns server that allows DNS records to be manipulated via REST API calls.

But, why?
-----
I found myself in an awkward position, akin to realizing half way through the night at a bar that you forgot to put on deoderant before you left the house.  Our SysAdmin, being constantly overloaded with work, took the path of least resistence when setting up our domain controller inside of our VPN.  He setup..... windows dns.  I don't blame him, but its just another episode in my DevOps bad dream.

Months, and many DNS records later, I needed to add this DNS to our provisioning processes.

Windows loathes the idea of integrating with the open world, so they only provide you with this 'dnscmd' utility as a way of remotely controlling your DNS server.  So, I did what any warm blooded, beer drinking, womanizing, redneck American man would do... I wrote a Node.JS app.

The Rundown
----
This app is so simple that it could easily be included in a "Beginners Guide to Node.JS" book on the page immediately after "Hello World", except for the fact that it's no where near to the quality of code one would expect to find in any book claiming to be informative.

The app implements a basic Restify driven REST API that translates HTTP requests into 'dnscmd' calls.  It has minimal validation, very few features, and absolutely zero security.. but it does the job.

So, without further adieu, here are the two supported commands and how they translate to dnscmd.

    http://dns-server.acme.local:3111/dns/acme.local/a/server1/set/1.2.3.4
    
    # First, delete any existing records
    > dnscmd /recorddelete acme.local server1 A /f
    
    # Add the new IP
    > dnscmd /recordadd acme.local server1 A 1.2.3.4
    
    # Result:  server1.acme.local -> 1.2.3.4
    
----
    
    http://dns-server.acme.local:3111/dns/acme.local/a/server1/remove
    
    # Right?
    > dnscmd /recorddelete acme.local server1 A /f
    
    # Result:  server1.acme.local -> Poof!

----

### Congrats, you are now certified!
