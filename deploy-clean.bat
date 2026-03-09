@echo off
color 0A
title AI News Summarizer - Deploy Script

cls
echo.
echo ========================================================
echo     AI NEWS SUMMARIZER - DEPLOYMENT SCRIPT
echo ========================================================
echo.

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo Please install from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git is installed
echo.

REM Get GitHub username
echo ================================================
echo   STEP 1: GitHub Setup
echo ================================================
echo.
set /p GITHUB_USERNAME="Enter your GitHub username: "
if "%GITHUB_USERNAME%"=="" (
    echo [ERROR] Username cannot be empty!
    pause
    exit /b 1
)
echo [OK] Username: %GITHUB_USERNAME%
echo.

REM Set repository name
set REPO_NAME=News-Aggregator-and-Analysis

REM Initialize Git
echo ================================================
echo   STEP 2: Initialize Git
echo ================================================
echo.
if exist .git (
    echo [WARNING] Git repo already exists
    set /p REINIT="Reinitialize? (y/n): "
    if /i "%REINIT%"=="y" (
        rmdir /s /q .git
        echo [OK] Removed existing repo
    )
)
git init
if errorlevel 1 (
    echo [ERROR] Git init failed
    pause
    exit /b 1
)
echo [OK] Git initialized
echo.

REM Add files
echo ================================================
echo   STEP 3: Add Files
echo ================================================
echo.
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added
echo.

REM Commit
echo ================================================
echo   STEP 4: Create Commit
echo ================================================
echo.
git commit -m "Initial deployment"
echo [OK] Commit created
echo.

REM Create GitHub repo
echo ================================================
echo   STEP 5: Create GitHub Repository
echo ================================================
echo.
echo ACTION REQUIRED:
echo 1. Opening GitHub in browser...
echo 2. Create repo: News-Aggregator-and-Analysis
echo 3. Make it Public or Private
echo 4. DO NOT add README
echo 5. Click "Create repository"
echo.
start https://github.com/new
set /p REPO_CREATED="Press ENTER after creating repo..."
echo.

REM Push to GitHub
echo ================================================
echo   STEP 6: Push to GitHub
echo ================================================
echo.
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
git branch -M main
echo Pushing to GitHub...
echo You may need to enter credentials
echo.
git push -u origin main
if errorlevel 1 (
    echo [ERROR] Push failed!
    echo Check: Repository exists, credentials correct
    pause
    exit /b 1
)
echo [OK] Code pushed to GitHub!
echo.

REM Deploy backend
echo ================================================
echo   STEP 7: Deploy Backend (Render)
echo ================================================
echo.
echo ACTION REQUIRED:
echo 1. Opening Render.com...
echo 2. Sign up with GitHub
echo 3. New + -^> Web Service
echo 4. Select: News-Aggregator-and-Analysis
echo 5. Settings:
echo    - Name: ai-news-backend
echo    - Region: Oregon
echo    - Branch: main
echo    - Root Directory: server
echo    - Build: npm install
echo    - Start: node index.js
echo    - Type: Free
echo 6. Environment Variables:
echo    - NODE_ENV = production
echo    - JWT_SECRET = my-secret-key-12345
echo    - PORT = 5000
echo 7. Create Web Service
echo 8. Wait 5 minutes
echo.
start https://render.com
set /p BACKEND_URL="Enter Render URL (https://ai-news-backend-xxxx.onrender.com): "
if "%BACKEND_URL%"=="" (
    echo [ERROR] URL cannot be empty!
    pause
    exit /b 1
)
echo [OK] Backend URL: %BACKEND_URL%
echo.

REM Update .env
echo ================================================
echo   STEP 8: Update Environment
echo ================================================
echo.
echo VITE_API_URL=%BACKEND_URL%/api > .env
echo [OK] .env created
git add .env
git commit -m "Add API URL"
git push
echo [OK] Pushed to GitHub
echo.

REM Deploy frontend
echo ================================================
echo   STEP 9: Deploy Frontend (Vercel)
echo ================================================
echo.
echo ACTION REQUIRED:
echo 1. Opening Vercel.com...
echo 2. Sign up with GitHub
echo 3. Add New -^> Project
echo 4. Import: News-Aggregator-and-Analysis
echo 5. Environment Variable:
echo    - Key: VITE_API_URL
echo    - Value: %BACKEND_URL%/api
echo 6. Deploy
echo 7. Wait 3 minutes
echo.
start https://vercel.com
set /p FRONTEND_URL="Enter Vercel URL (https://ai-news-summarizer.vercel.app): "
if "%FRONTEND_URL%"=="" (
    echo [ERROR] URL cannot be empty!
    pause
    exit /b 1
)
echo [OK] Frontend URL: %FRONTEND_URL%
echo.

REM Save URLs
echo ================================================
echo   STEP 10: Save URLs
echo ================================================
echo.
(
echo ========================================================
echo           DEPLOYMENT SUCCESSFUL!
echo ========================================================
echo.
echo Date: %date% %time%
echo.
echo YOUR LIVE URLS:
echo.
echo Frontend: %FRONTEND_URL%
echo Backend:  %BACKEND_URL%
echo GitHub:   https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
echo TO UPDATE:
echo   git add .
echo   git commit -m "Update"
echo   git push
echo.
echo ========================================================
) > DEPLOYMENT_URLS.txt
echo [OK] URLs saved to DEPLOYMENT_URLS.txt
echo.

REM Final summary
cls
color 0B
echo.
echo ========================================================
echo           DEPLOYMENT COMPLETE!
echo ========================================================
echo.
echo [OK] Code on GitHub
echo [OK] Backend on Render
echo [OK] Frontend on Vercel
echo.
echo YOUR LIVE URLS:
echo.
echo Frontend: %FRONTEND_URL%
echo Backend:  %BACKEND_URL%
echo GitHub:   https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
echo NEXT STEPS:
echo 1. Open: %FRONTEND_URL%
echo 2. Create account and test
echo 3. Share with friends!
echo.
set /p OPEN_APP="Open app now? (y/n): "
if /i "%OPEN_APP%"=="y" start %FRONTEND_URL%
echo.
echo ========================================================
echo     Thank you for using Deploy Script!
echo ========================================================
echo.
pause
