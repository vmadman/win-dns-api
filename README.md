Windows DNS API (Node.JS)
===========

A simple Node.JS server for updating the integrated DNS server that ships with windows.

I wrote this application years ago to solve a problem as quickly as possible. I was still new to Node.js and REST API design at the time and made very little effort in designing its architecture. Practically everything about the code is ugly and bad.

In fact, I would take it down (out of embarassment), except for the fact that some people seem to find it useful. So, I leave it here as a proof-of-concept and a suggestion as to what someone else should build properly, someday.

But, why?
-----
Windows, especially in its legacy versions, seems to go out of its way to prevent integrations with anything other than Microsoft products. I needed to find a way to control Windows DNS remotely, so I wrote this app in an attempt to work-around the problem.

The Rundown
----
The app implements a basic Restify driven REST API that translates HTTP requests into 'dnscmd' calls.  It has minimal validation, very few features, and absolutely zero security.. but it does the job.

Currently, it only exposes two endpoints:

### GET /dns/:zone/a/:node/set/:ip

This will set the target IP for an `A` record and it is equivalent to running the following `dnscmd` commands:

```
# e.g. http://your-dns-server:3111/dns/acme.local/a/server1/set/1.2.3.4   
# First, delete any existing records
dnscmd /recorddelete acme.local server1 A /f
    
# Add the new IP
dnscmd /recordadd acme.local server1 A 1.2.3.4

# A server1.acme.local -> 1.2.3.4
```

### GET /dns/:zone/a/:node/remove

This will remove a target `A` record and it is equivalent to running the following `dnscmd` command:

```
# e.g. http://your-dns-server:3111/dns/acme.local/a/server1/remove
dnscmd /recorddelete acme.local server1 A /f

# A server1.acme.local -> (deleted)
```

Other Notes
----

* Don't forget to unblock the port (3111) in Windows Firewall
* Forever.monitor had a windows related bug that occurs when your NodeJS path has a space in it.  I've added simple workaround code that seems to work fine (and universally), but if you run into ENOENT errors, that bug is likely to blame.
* If you'd like to run this as a service, you may need to adjust the paths in bin/install-service.bat
