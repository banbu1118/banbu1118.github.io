#### RDP修改端口脚本

适用于win7，win10，win11，保存为*.bat双击执行即可

```powershell
@echo off
:: Check for administrator rights (compatible with Win7)
net session >nul 2>&1
if %errorlevel% NEQ 0 (
    goto UACPrompt
) else (
    goto gotAdmin
)

:UACPrompt
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\GetAdmin.vbs"
echo UAC.ShellExecute "cmd.exe", "/c %~fs0", "", "runas", 1 >> "%temp%\GetAdmin.vbs"
"%temp%\GetAdmin.vbs"
del "%temp%\GetAdmin.vbs"
exit /b

:gotAdmin
cd /d "%~dp0"
echo Administrator privileges obtained successfully.

:input
set c=
set /p c=Please enter the new Remote Desktop port (1025-65535):
:: Check if input is empty
if "%c%"=="" (
    echo Error: Input cannot be empty.
    goto input
)

:: Check if input is numeric
setlocal enabledelayedexpansion
set num=%c%
for /f "delims=0123456789" %%i in ("!num!") do (
    echo Error: Invalid input! Please input numeric digits only.
    endlocal
    goto input
)
endlocal

:: Check numeric range
if %c% lss 1025 (
    echo Error: Port number too small. Please choose a number between 1025-65535.
    goto input
)
if %c% gtr 65535 (
    echo Error: Port number too large. Please choose a number between 1025-65535.
    goto input
)

echo Adding firewall rules...
:: Add firewall rule (compatible with Win7, Win10, Win11)
netsh advfirewall firewall add rule name="Remote Desktop Custom Port" dir=in action=allow protocol=TCP localport=%c% >nul 2>&1
netsh firewall add portopening protocol=TCP port=%c% name="Remote Desktop Custom Port" mode=ENABLE scope=ALL profile=ALL >nul 2>&1

echo Updating registry settings...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v PortNumber /t REG_DWORD /d %c% /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Wds\rdpwd\Tds\tcp" /v PortNumber /t REG_DWORD /d %c% /f >nul

echo Successfully modified. The system will reboot to apply changes.
pause
shutdown /r /t 0
exit
```

