@echo off
title FamVault - Family Emergency Document Archive
cd /d "%~dp0"
echo ========================================================
echo   Starting FamVault - Family Emergency Document Archive
echo ========================================================
echo.
python server.py
if errorlevel 1 (
    echo.
    echo Python not detected, opening index.html directly...
    start "" index.html
)
pause
