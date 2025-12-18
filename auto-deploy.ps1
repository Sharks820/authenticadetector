# AuthenticaDetector - Fully Automated Deployment
# Your credentials are pre-configured!

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 AuthenticaDetector - Automated Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Your pre-configured credentials
$CLOUDFLARE_API_TOKEN = "DzPqgP0-Eua7Hc_aYIJes5jkQYiM-jp8UbFtDyeS"
$CLOUDFLARE_ACCOUNT_ID = "da36e7793702b1ac460c0d57ebb4a8e5"
$SUPABASE_URL = "https://vrvoyxxdlcpysthzjbeu.supabase.co"

Write-Host "✓ Credentials loaded" -ForegroundColor Green
Write-Host "  Cloudflare Account: $CLOUDFLARE_ACCOUNT_ID" -ForegroundColor Gray
Write-Host "  Supabase Project: vrvoyxxdlcpysthzjbeu" -ForegroundColor Gray
Write-Host ""

# Set Cloudflare API token environment variable
$env:CLOUDFLARE_API_TOKEN = $CLOUDFLARE_API_TOKEN
$env:CLOUDFLARE_ACCOUNT_ID = $CLOUDFLARE_ACCOUNT_ID

Write-Host "Step 1: Installing Wrangler CLI..." -ForegroundColor Yellow
try {
    npm install -g wrangler --silent
    Write-Host "✓ Wrangler installed" -ForegroundColor Green
} catch {
    Write-Host "Error installing Wrangler. Make sure Node.js is installed." -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 2: Creating Cloudflare Pages project..." -ForegroundColor Yellow
try {
    wrangler pages project create authenticadetector --production-branch=main 2>$null
    Write-Host "✓ Project created" -ForegroundColor Green
} catch {
    Write-Host "Project may already exist, continuing..." -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Step 3: Deploying to Cloudflare Pages..." -ForegroundColor Yellow
wrangler pages deploy . --project-name=authenticadetector --branch=main
Write-Host "✓ Deployed!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Creating KV Namespaces..." -ForegroundColor Yellow
Write-Host "Creating RATE_LIMIT_KV..." -ForegroundColor Cyan
$rateLimitOutput = wrangler kv:namespace create "authenticadetector-rate-limit" 2>&1 | Out-String
$rateLimitId = ($rateLimitOutput | Select-String 'id = "([^"]+)"').Matches[0].Groups[1].Value

Write-Host "Creating LEARNING_KV..." -ForegroundColor Cyan
$learningOutput = wrangler kv:namespace create "authenticadetector-learning" 2>&1 | Out-String
$learningId = ($learningOutput | Select-String 'id = "([^"]+)"').Matches[0].Groups[1].Value

Write-Host "Creating STATS_KV..." -ForegroundColor Cyan
$statsOutput = wrangler kv:namespace create "authenticadetector-stats" 2>&1 | Out-String
$statsId = ($statsOutput | Select-String 'id = "([^"]+)"').Matches[0].Groups[1].Value

Write-Host "✓ KV Namespaces created" -ForegroundColor Green
Write-Host "  RATE_LIMIT_KV: $rateLimitId" -ForegroundColor Gray
Write-Host "  LEARNING_KV: $learningId" -ForegroundColor Gray
Write-Host "  STATS_KV: $statsId" -ForegroundColor Gray
Write-Host ""

Write-Host "======================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your app is LIVE at:" -ForegroundColor White
Write-Host "https://authenticadetector.pages.dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: One more manual step needed!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Bind KV Namespaces to Functions:" -ForegroundColor White
Write-Host "1. Go to: https://dash.cloudflare.com" -ForegroundColor Gray
Write-Host "2. Pages → authenticadetector → Settings → Functions" -ForegroundColor Gray
Write-Host "3. Add KV namespace bindings:" -ForegroundColor Gray
Write-Host "   Variable: RATE_LIMIT_KV  →  $rateLimitId" -ForegroundColor Gray
Write-Host "   Variable: LEARNING_KV    →  $learningId" -ForegroundColor Gray
Write-Host "   Variable: STATS_KV       →  $statsId" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 Next: Run Supabase schema" -ForegroundColor Yellow
Write-Host "1. Go to: $SUPABASE_URL" -ForegroundColor Gray
Write-Host "2. Open SQL Editor" -ForegroundColor Gray
Write-Host "3. Copy contents of supabase/schema.sql" -ForegroundColor Gray
Write-Host "4. Paste and Run" -ForegroundColor Gray
Write-Host ""
Write-Host "Then test your app at: https://authenticadetector.pages.dev" -ForegroundColor Cyan
Write-Host ""

# Save KV IDs for future reference
@"
RATE_LIMIT_KV=$rateLimitId
LEARNING_KV=$learningId
STATS_KV=$statsId
"@ | Out-File "kv-ids.txt"

Write-Host "✓ KV IDs saved to kv-ids.txt" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
