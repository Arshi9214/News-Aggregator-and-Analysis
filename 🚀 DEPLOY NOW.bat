@echo off
color 0A
title AI News Summarizer - Auto Deploy

cls
echo.
echo ========================================================
echo.
echo     AI NEWS SUMMARIZER - AUTO DEPLOY SCRIPT
echo.
echo ========================================================
echo.
echo   This script will deploy your app to the internet!
echo.
echo   Time needed: 15 minutes
echo   Cost: $0 (completely free!)
echo.
echo   What you need:
echo      - GitHub account (free)
echo      - Your GitHub username
echo      - Internet connection
echo.
echo   What will happen:
echo      1. Push code to GitHub
echo      2. Deploy backend to Render
echo      3. Deploy frontend to Vercel
echo      4. Your app goes LIVE!
echo.
echo ========================================================
echo   Press any key to start deployment...
echo ========================================================
echo.
pause >nul

REM Run the main deployment script
call deploy.bat
