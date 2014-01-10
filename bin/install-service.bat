@echo off&setlocal
"%~dp0nssm.exe" install WinDnsApi "C:\Program Files\nodejs\node.exe"
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\WinDnsApi\Parameters" /v "AppDirectory" /t REG_EXPAND_SZ /d "C:\Program Files (x86)\WinDnsApi" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\WinDnsApi\Parameters" /v "Application" /t REG_EXPAND_SZ /d "C:\Program Files\nodejs\node.exe" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\WinDnsApi\Parameters" /v "AppParameters" /t REG_EXPAND_SZ /d """"C:\Program Files (x86)\WinDnsApi\app.js"""" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\WinDnsApi\Parameters" /v "AppStderr" /t REG_EXPAND_SZ /d "C:\Program Files (x86)\WinDnsApi\logs\error.log" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\WinDnsApi\Parameters" /v "AppStderrCreationDisposition" /t REG_DWORD /d 2 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\WinDnsApi\Parameters" /v "AppStdout" /t REG_EXPAND_SZ /d "C:\Program Files (x86)\WinDnsApi\logs\service.log" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\WinDnsApi\Parameters" /v "AppStdoutCreationDisposition" /t REG_DWORD /d 2 /f
net start WinDnsApi