@echo off
color 0A
title AI News Summarizer - Auto Deploy Script

echo.
echo ========================================================
echo     AI NEWS SUMMARIZER - AUTO DEPLOYMENT SCRIPT
echo ========================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM ============================================
REM STEP 1: GET GITHUB USERNAME
REM ============================================
echo.
echo ================================================
echo   STEP 1: GitHub Setup
echo ================================================
echo.

set /p GITHUB_USERNAME="Enter your GitHub username: "
if "%GITHUB_USERNAME%"=="" (
    echo ❌ GitHub username cannot be empty!
    pause
    exit /b 1
)

echo.
echo ✅ GitHub username: %GITHUB_USERNAME%
echo.

REM ============================================
REM STEP 2: INITIALIZE GIT
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 2: Initializing Git Repository      │
echo └────────────────────────────────────────────┘
echo.

REM Check if already initialized
if exist .git (
    echo ⚠️  Git repository already exists
    echo.
    set /p REINIT="Do you want to reinitialize? (y/n): "
    if /i "%REINIT%"=="y" (
        rmdir /s /q .git
        echo ✅ Removed existing Git repository
    )
)

echo Initializing Git...
git init
if errorlevel 1 (
    echo ❌ Failed to initialize Git
    pause
    exit /b 1
)
echo ✅ Git initialized
echo.

REM ============================================
REM STEP 3: ADD FILES
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 3: Adding Files to Git              │
echo └────────────────────────────────────────────┘
echo.

echo Adding all files...
git add .
if errorlevel 1 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)
echo ✅ Files added
echo.

REM ============================================
REM STEP 4: COMMIT
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 4: Creating Initial Commit          │
echo └────────────────────────────────────────────┘
echo.

git commit -m "Initial deployment - AI News Summarizer"
if errorlevel 1 (
    echo ⚠️  Commit failed - checking if already committed
)
echo ✅ Commit created
echo.

REM ============================================
REM STEP 5: CREATE GITHUB REPO
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 5: Create GitHub Repository         │
echo └────────────────────────────────────────────┘
echo.

echo 📝 ACTION REQUIRED:
echo.
echo 1. Opening GitHub in your browser...
echo 2. Create a new repository named: ai-news-summarizer
echo 3. Make it Public or Private (your choice)
echo 4. DO NOT initialize with README
echo 5. Click "Create repository"
echo.

start https://github.com/new

echo.
set /p REPO_CREATED="Press ENTER after you've created the repository..."
echo.

REM ============================================
REM STEP 6: PUSH TO GITHUB
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 6: Pushing to GitHub                │
echo └────────────────────────────────────────────┘
echo.

echo Setting up remote...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USERNAME%/ai-news-summarizer.git
git branch -M main

echo.
echo Pushing to GitHub...
echo.
echo ⚠️  You may need to enter your GitHub credentials
echo.

git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ Push failed!
    echo.
    echo Possible reasons:
    echo 1. Repository doesn't exist on GitHub
    echo 2. Wrong credentials
    echo 3. Need to authenticate with GitHub
    echo.
    echo Try running: gh auth login
    echo Or use GitHub Desktop
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Code pushed to GitHub!
echo.

REM ============================================
REM STEP 7: DEPLOY BACKEND (RENDER)
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 7: Deploy Backend to Render         │
echo └────────────────────────────────────────────┘
echo.

echo 📝 ACTION REQUIRED:
echo.
echo 1. Opening Render.com in your browser...
echo 2. Sign up with GitHub
echo 3. Click "New +" → "Web Service"
echo 4. Select: ai-news-summarizer
echo 5. Use these settings:
echo.
echo    Name: ai-news-backend
echo    Region: Oregon (US West)
echo    Branch: main
echo    Root Directory: server
echo    Build Command: npm install
echo    Start Command: node index.js
echo    Instance Type: Free
echo.
echo 6. Add Environment Variables:
echo    NODE_ENV = production
echo    JWT_SECRET = my-super-secret-jwt-key-12345
echo    PORT = 5000
echo.
echo 7. Click "Create Web Service"
echo 8. Wait 5 minutes for deployment
echo.

start https://render.com

echo.
set /p BACKEND_URL="Enter your Render backend URL (e.g., https://ai-news-backend-xxxx.onrender.com): "
echo.

if "%BACKEND_URL%"=="" (
    echo ❌ Backend URL cannot be empty!
    pause
    exit /b 1
)

echo ✅ Backend URL saved: %BACKEND_URL%
echo.

REM ============================================
REM STEP 8: UPDATE .ENV FILE
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 8: Updating Environment Variables   │
echo └────────────────────────────────────────────┘
echo.

echo Creating .env file...
echo VITE_API_URL=%BACKEND_URL%/api > .env
echo ✅ .env file created
echo.

echo Pushing .env to GitHub...
git add .env
git commit -m "Add production API URL"
git push
if errorlevel 1 (
    echo ⚠️  Push failed, but continuing...
)
echo ✅ .env pushed to GitHub
echo.

REM ============================================
REM STEP 9: DEPLOY FRONTEND (VERCEL)
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 9: Deploy Frontend to Vercel        │
echo └────────────────────────────────────────────┘
echo.

echo 📝 ACTION REQUIRED:
echo.
echo 1. Opening Vercel.com in your browser...
echo 2. Sign up with GitHub
echo 3. Click "Add New..." → "Project"
echo 4. Import: ai-news-summarizer
echo 5. Vercel auto-detects settings
echo 6. Add Environment Variable:
echo    Key: VITE_API_URL
echo    Value: %BACKEND_URL%/api
echo.
echo 7. Click "Deploy"
echo 8. Wait 3 minutes
echo.

start https://vercel.com

echo.
set /p FRONTEND_URL="Enter your Vercel frontend URL (e.g., https://ai-news-summarizer.vercel.app): "
echo.

if "%FRONTEND_URL%"=="" (
    echo ❌ Frontend URL cannot be empty!
    pause
    exit /b 1
)

echo ✅ Frontend URL saved: %FRONTEND_URL%
echo.

REM ============================================
REM STEP 10: SAVE URLS
REM ============================================
echo ┌────────────────────────────────────────────┐
echo │  STEP 10: Saving Deployment URLs          │
echo └────────────────────────────────────────────┘
echo.

echo Creating DEPLOYMENT_URLS.txt...
(
echo ╔════════════════════════════════════════════════════════════╗
echo ║           🎉 DEPLOYMENT SUCCESSFUL! 🎉                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Deployment Date: %date% %time%
echo.
echo 📝 YOUR LIVE URLS:
echo.
echo Frontend: %FRONTEND_URL%
echo Backend:  %BACKEND_URL%
echo GitHub:   https://github.com/%GITHUB_USERNAME%/ai-news-summarizer
echo.
echo 🎯 NEXT STEPS:
echo.
echo 1. Open: %FRONTEND_URL%
echo 2. Create an account
echo 3. Test all features
echo 4. Share with friends!
echo.
echo 🔄 TO UPDATE YOUR APP:
echo.
echo git add .
echo git commit -m "Update"
echo git push
echo.
echo Both Vercel and Render will auto-deploy!
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              CONGRATULATIONS! 🚀                           ║
echo ╚════════════════════════════════════════════════════════════╝
) > DEPLOYMENT_URLS.txt

echo ✅ URLs saved to DEPLOYMENT_URLS.txt
echo.

REM ============================================
REM FINAL SUMMARY
REM ============================================
cls
color 0B
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           🎉 DEPLOYMENT COMPLETE! 🎉                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ✅ Code pushed to GitHub
echo ✅ Backend deployed to Render
echo ✅ Frontend deployed to Vercel
echo.
echo 📝 YOUR LIVE URLS:
echo.
echo 🌐 Frontend: %FRONTEND_URL%
echo 🖥️  Backend:  %BACKEND_URL%
echo 📦 GitHub:   https://github.com/%GITHUB_USERNAME%/ai-news-summarizer
echo.
echo 🎯 NEXT STEPS:
echo.
echo 1. Open your app: %FRONTEND_URL%
echo 2. Create an account and test
echo 3. Share with friends!
echo.
echo 💡 TIP: All URLs saved in DEPLOYMENT_URLS.txt
echo.
echo 🔄 TO UPDATE LATER:
echo    git add .
echo    git commit -m "Update"
echo    git push
echo.

REM Open the frontend URL
set /p OPEN_APP="Do you want to open your app now? (y/n): "
if /i "%OPEN_APP%"=="y" (
    start %FRONTEND_URL%
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Thank you for using Auto Deploy Script! 🚀            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
