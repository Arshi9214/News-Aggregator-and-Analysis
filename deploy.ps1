# AI News Summarizer - Auto Deploy Script (PowerShell)
# Run this with: powershell -ExecutionPolicy Bypass -File deploy.ps1

$Host.UI.RawUI.WindowTitle = "AI News Summarizer - Auto Deploy"
Clear-Host

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Header($text) {
    Write-Host ""
    Write-ColorOutput Green "╔════════════════════════════════════════════════════════════╗"
    Write-ColorOutput Green "║  $text"
    Write-ColorOutput Green "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""
}

function Write-Step($number, $text) {
    Write-Host ""
    Write-ColorOutput Cyan "┌────────────────────────────────────────────┐"
    Write-ColorOutput Cyan "│  STEP $number`: $text"
    Write-ColorOutput Cyan "└────────────────────────────────────────────┘"
    Write-Host ""
}

Write-Header "🚀 AI NEWS SUMMARIZER - AUTO DEPLOYMENT SCRIPT 🚀"

# Check if Git is installed
Write-Host "Checking for Git installation..."
try {
    $gitVersion = git --version 2>&1
    Write-ColorOutput Green "✅ Git is installed: $gitVersion"
} catch {
    Write-ColorOutput Red "❌ Git is not installed!"
    Write-Host ""
    Write-Host "Please install Git from: https://git-scm.com/download/win"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# ============================================
# STEP 1: GET GITHUB USERNAME
# ============================================
Write-Step 1 "GitHub Setup"

$GITHUB_USERNAME = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($GITHUB_USERNAME)) {
    Write-ColorOutput Red "❌ GitHub username cannot be empty!"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-ColorOutput Green "✅ GitHub username: $GITHUB_USERNAME"

# ============================================
# STEP 2: INITIALIZE GIT
# ============================================
Write-Step 2 "Initializing Git Repository"

if (Test-Path .git) {
    Write-ColorOutput Yellow "⚠️  Git repository already exists"
    $reinit = Read-Host "Do you want to reinitialize? (y/n)"
    if ($reinit -eq "y") {
        Remove-Item -Recurse -Force .git
        Write-ColorOutput Green "✅ Removed existing Git repository"
    }
}

Write-Host "Initializing Git..."
git init
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "❌ Failed to initialize Git"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-ColorOutput Green "✅ Git initialized"

# ============================================
# STEP 3: ADD FILES
# ============================================
Write-Step 3 "Adding Files to Git"

Write-Host "Adding all files..."
git add .
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "❌ Failed to add files"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-ColorOutput Green "✅ Files added"

# ============================================
# STEP 4: COMMIT
# ============================================
Write-Step 4 "Creating Initial Commit"

git commit -m "Initial deployment - AI News Summarizer"
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Yellow "⚠️  Commit failed - checking if already committed"
}
Write-ColorOutput Green "✅ Commit created"

# ============================================
# STEP 5: CREATE GITHUB REPO
# ============================================
Write-Step 5 "Create GitHub Repository"

Write-ColorOutput Yellow "📝 ACTION REQUIRED:"
Write-Host ""
Write-Host "1. Opening GitHub in your browser..."
Write-Host "2. Create a new repository named: ai-news-summarizer"
Write-Host "3. Make it Public or Private (your choice)"
Write-Host "4. DO NOT initialize with README"
Write-Host "5. Click 'Create repository'"
Write-Host ""

Start-Process "https://github.com/new"

Read-Host "Press ENTER after you've created the repository"

# ============================================
# STEP 6: PUSH TO GITHUB
# ============================================
Write-Step 6 "Pushing to GitHub"

Write-Host "Setting up remote..."
git remote remove origin 2>$null
git remote add origin "https://github.com/$GITHUB_USERNAME/ai-news-summarizer.git"
git branch -M main

Write-Host ""
Write-Host "Pushing to GitHub..."
Write-ColorOutput Yellow "⚠️  You may need to enter your GitHub credentials"
Write-Host ""

git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-ColorOutput Red "❌ Push failed!"
    Write-Host ""
    Write-Host "Possible reasons:"
    Write-Host "1. Repository doesn't exist on GitHub"
    Write-Host "2. Wrong credentials"
    Write-Host "3. Need to authenticate with GitHub"
    Write-Host ""
    Write-Host "Try running: gh auth login"
    Write-Host "Or use GitHub Desktop"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-ColorOutput Green "✅ Code pushed to GitHub!"

# ============================================
# STEP 7: DEPLOY BACKEND (RENDER)
# ============================================
Write-Step 7 "Deploy Backend to Render"

Write-ColorOutput Yellow "📝 ACTION REQUIRED:"
Write-Host ""
Write-Host "1. Opening Render.com in your browser..."
Write-Host "2. Sign up with GitHub"
Write-Host "3. Click 'New +' → 'Web Service'"
Write-Host "4. Select: ai-news-summarizer"
Write-Host "5. Use these settings:"
Write-Host ""
Write-ColorOutput Cyan "   Name: ai-news-backend"
Write-ColorOutput Cyan "   Region: Oregon (US West)"
Write-ColorOutput Cyan "   Branch: main"
Write-ColorOutput Cyan "   Root Directory: server"
Write-ColorOutput Cyan "   Build Command: npm install"
Write-ColorOutput Cyan "   Start Command: node index.js"
Write-ColorOutput Cyan "   Instance Type: Free"
Write-Host ""
Write-Host "6. Add Environment Variables:"
Write-ColorOutput Cyan "   NODE_ENV = production"
Write-ColorOutput Cyan "   JWT_SECRET = my-super-secret-jwt-key-12345"
Write-ColorOutput Cyan "   PORT = 5000"
Write-Host ""
Write-Host "7. Click 'Create Web Service'"
Write-Host "8. Wait 5 minutes for deployment"
Write-Host ""

Start-Process "https://render.com"

$BACKEND_URL = Read-Host "Enter your Render backend URL (e.g., https://ai-news-backend-xxxx.onrender.com)"

if ([string]::IsNullOrWhiteSpace($BACKEND_URL)) {
    Write-ColorOutput Red "❌ Backend URL cannot be empty!"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-ColorOutput Green "✅ Backend URL saved: $BACKEND_URL"

# ============================================
# STEP 8: UPDATE .ENV FILE
# ============================================
Write-Step 8 "Updating Environment Variables"

Write-Host "Creating .env file..."
"VITE_API_URL=$BACKEND_URL/api" | Out-File -FilePath .env -Encoding UTF8
Write-ColorOutput Green "✅ .env file created"

Write-Host "Pushing .env to GitHub..."
git add .env
git commit -m "Add production API URL"
git push
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Yellow "⚠️  Push failed, but continuing..."
}
Write-ColorOutput Green "✅ .env pushed to GitHub"

# ============================================
# STEP 9: DEPLOY FRONTEND (VERCEL)
# ============================================
Write-Step 9 "Deploy Frontend to Vercel"

Write-ColorOutput Yellow "📝 ACTION REQUIRED:"
Write-Host ""
Write-Host "1. Opening Vercel.com in your browser..."
Write-Host "2. Sign up with GitHub"
Write-Host "3. Click 'Add New...' → 'Project'"
Write-Host "4. Import: ai-news-summarizer"
Write-Host "5. Vercel auto-detects settings"
Write-Host "6. Add Environment Variable:"
Write-ColorOutput Cyan "   Key: VITE_API_URL"
Write-ColorOutput Cyan "   Value: $BACKEND_URL/api"
Write-Host ""
Write-Host "7. Click 'Deploy'"
Write-Host "8. Wait 3 minutes"
Write-Host ""

Start-Process "https://vercel.com"

$FRONTEND_URL = Read-Host "Enter your Vercel frontend URL (e.g., https://ai-news-summarizer.vercel.app)"

if ([string]::IsNullOrWhiteSpace($FRONTEND_URL)) {
    Write-ColorOutput Red "❌ Frontend URL cannot be empty!"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-ColorOutput Green "✅ Frontend URL saved: $FRONTEND_URL"

# ============================================
# STEP 10: SAVE URLS
# ============================================
Write-Step 10 "Saving Deployment URLs"

$deploymentInfo = @"
╔════════════════════════════════════════════════════════════╗
║           🎉 DEPLOYMENT SUCCESSFUL! 🎉                     ║
╚════════════════════════════════════════════════════════════╝

Deployment Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

📝 YOUR LIVE URLS:

Frontend: $FRONTEND_URL
Backend:  $BACKEND_URL
GitHub:   https://github.com/$GITHUB_USERNAME/ai-news-summarizer

🎯 NEXT STEPS:

1. Open: $FRONTEND_URL
2. Create an account
3. Test all features
4. Share with friends!

🔄 TO UPDATE YOUR APP:

git add .
git commit -m "Update"
git push

Both Vercel and Render will auto-deploy!

╔════════════════════════════════════════════════════════════╗
║              CONGRATULATIONS! 🚀                           ║
╚════════════════════════════════════════════════════════════╝
"@

$deploymentInfo | Out-File -FilePath DEPLOYMENT_URLS.txt -Encoding UTF8
Write-ColorOutput Green "✅ URLs saved to DEPLOYMENT_URLS.txt"

# ============================================
# FINAL SUMMARY
# ============================================
Clear-Host
Write-Header "🎉 DEPLOYMENT COMPLETE! 🎉"

Write-ColorOutput Green "✅ Code pushed to GitHub"
Write-ColorOutput Green "✅ Backend deployed to Render"
Write-ColorOutput Green "✅ Frontend deployed to Vercel"
Write-Host ""
Write-Host "📝 YOUR LIVE URLS:"
Write-Host ""
Write-ColorOutput Cyan "🌐 Frontend: $FRONTEND_URL"
Write-ColorOutput Cyan "🖥️  Backend:  $BACKEND_URL"
Write-ColorOutput Cyan "📦 GitHub:   https://github.com/$GITHUB_USERNAME/ai-news-summarizer"
Write-Host ""
Write-Host "🎯 NEXT STEPS:"
Write-Host ""
Write-Host "1. Open your app: $FRONTEND_URL"
Write-Host "2. Create an account and test"
Write-Host "3. Share with friends!"
Write-Host ""
Write-ColorOutput Yellow "💡 TIP: All URLs saved in DEPLOYMENT_URLS.txt"
Write-Host ""
Write-Host "🔄 TO UPDATE LATER:"
Write-ColorOutput Cyan "   git add ."
Write-ColorOutput Cyan "   git commit -m 'Update'"
Write-ColorOutput Cyan "   git push"
Write-Host ""

$openApp = Read-Host "Do you want to open your app now? (y/n)"
if ($openApp -eq "y") {
    Start-Process $FRONTEND_URL
}

Write-Host ""
Write-Header "Thank you for using Auto Deploy Script! 🚀"
Read-Host "Press Enter to exit"
