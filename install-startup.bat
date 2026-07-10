@echo off
echo Configuring CV Builder Server to run automatically on startup...
echo.

set "SCRIPT_DIR=%~dp0"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_PATH=%STARTUP_FOLDER%\cv-builder-server.vbs"

echo Creating silent startup script...
echo Set WshShell = CreateObject("WScript.Shell") > "%VBS_PATH%"
echo WshShell.CurrentDirectory = "%SCRIPT_DIR%" >> "%VBS_PATH%"
echo WshShell.Run "cmd /c npm start", 0, False >> "%VBS_PATH%"

echo.
echo ==============================================================
echo Auto-Run Successfully Configured!
echo ==============================================================
echo.
echo The CV Builder server will now start automatically (and silently in the background) 
echo every time you turn on or log in to this PC.
echo.
echo If you ever want to stop the auto-run, simply go to your Windows Startup folder:
echo %STARTUP_FOLDER%
echo and delete the file "cv-builder-server.vbs".
echo.
pause
