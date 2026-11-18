@echo off
title Portfolio preview server
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js is not installed.
  echo  Download the LTS version from https://nodejs.org , install it, then double-click this file again.
  echo.
  pause
  exit /b
)

echo.
echo  ==========================================================
echo   On your PHONE (same Wi-Fi as this PC), open one of these:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  for /f "tokens=*" %%b in ("%%a") do echo      http://%%b:3000
)
echo.
echo   On this PC: http://localhost:3000
echo   If Windows asks about the firewall, tick "Private networks" and click Allow.
echo   To stop the server, close this window.
echo  ==========================================================
echo.

npx --yes serve . -l tcp://0.0.0.0:3000
pause
