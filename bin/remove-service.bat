@ECHO OFF
net stop WinDnsApi
"%~dp0nssm.exe" remove WinDnsApi 
pause