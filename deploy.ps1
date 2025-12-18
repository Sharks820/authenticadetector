# AuthenticaDetector - Automated Deployment Script (Windows PowerShell)
# This script deploys your app to Cloudflare Pages with one command

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 AuthenticaDetector Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check prerequisites
if (-not (Test-Command "git")) {
    Write-Host "Error: Git is not installed. Please install from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "Error: Node.js/npm is not installed. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Installing Wrangler CLI..." -ForegroundColor Yellow
npm install -g wrangler
Write-Host "✓ Wrangler installed" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Cloudflare Authentication" -ForegroundColor Yellow
Write-Host "This will open a browser window to authenticate with Cloudflare"
wrangler login
Write-Host "✓ Authenticated with Cloudflare" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Supabase Credentials" -ForegroundColor Yellow
Write-Host "Please provide your Supabase credentials:"
Write-Host ""
$SUPABASE_URL = Read-Host "Supabase Project URL (https://xxx.supabase.co)"
$SUPABASE_ANON_KEY = Read-Host "Supabase Anon Key"

Write-Host ""
Write-Host "Updating index.html with Supabase credentials..." -ForegroundColor Yellow
$indexContent = Get-Content "index.html" -Raw
$indexContent = $indexContent -replace "const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';", "const SUPABASE_URL = '$SUPABASE_URL';"
$indexContent = $indexContent -replace "const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';", "const SUPABASE_ANON_KEY = '$SUPABASE_ANON_KEY';"
$indexContent | Set-Content "index.html" -NoNewline

Write-Host "✓ Credentials updated" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Setting up Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}

# Create .gitignore
@"
node_modules/
.env
.DS_Store
*.log
.wrangler/
dist/
"@ | Set-Content ".gitignore"

Write-Host "✓ .gitignore created" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Committing code..." -ForegroundColor Yellow
git add .
try {
    git commit -m "Initial deployment - AuthenticaDetector v12"
    Write-Host "✓ Code committed" -ForegroundColor Green
} catch {
    Write-Host "Nothing new to commit" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Step 6: Creating Cloudflare Pages project..." -ForegroundColor Yellow
try {
    wrangler pages project create authenticadetector
} catch {
    Write-Host "Project may already exist, continuing..." -ForegroundColor Yellow
}

Write-Host "Step 7: Deploying to Cloudflare Pages..." -ForegroundColor Yellow
wrangler pages deploy . --project-name=authenticadetector

Write-Host ""
Write-Host "✓ Deployed to Cloudflare Pages!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 8: Creating KV Namespaces..." -ForegroundColor Yellow
Write-Host "Creating rate limit KV..." -ForegroundColor Cyan
$RATE_LIMIT_OUTPUT = wrangler kv:namespace create "authenticadetector-rate-limit" --preview false
Write-Host "Creating learning KV..." -ForegroundColor Cyan
$LEARNING_OUTPUT = wrangler kv:namespace create "authenticadetector-learning" --preview false
Write-Host "Creating stats KV..." -ForegroundColor Cyan
$STATS_OUTPUT = wrangler kv:namespace create "authenticadetector-stats" --preview false

Write-Host "✓ KV Namespaces created" -ForegroundColor Green
Write-Host ""

Write-Host "======================================" -ForegroundColor Green
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your app is live at:"
Write-Host "https://authenticadetector.pages.dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Complete these manual steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Bind KV Namespaces:" -ForegroundColor White
Write-Host "   - Go to https://dash.cloudflare.com" -ForegroundColor Gray
Write-Host "   - Navigate to: Pages → authenticadetector → Settings → Functions" -ForegroundColor Gray
Write-Host "   - Add 3 KV namespace bindings:" -ForegroundColor Gray
Write-Host "     Variable: RATE_LIMIT_KV  (select authenticadetector-rate-limit)" -ForegroundColor Gray
Write-Host "     Variable: LEARNING_KV    (select authenticadetector-learning)" -ForegroundColor Gray
Write-Host "     Variable: STATS_KV       (select authenticadetector-stats)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run Supabase Schema:" -ForegroundColor White
Write-Host "   - Go to your Supabase project → SQL Editor" -ForegroundColor Gray
Write-Host "   - Open supabase/schema.sql and run it" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test your app!" -ForegroundColor White
Write-Host ""
Write-Host "For custom domain setup, see DEPLOYMENT.md Part 4" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
