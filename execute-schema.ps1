$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\nodejs;" + $env:Path

Write-Host "`n🔧 Installing Supabase CLI..." -ForegroundColor Cyan
npm install -g supabase --silent

$SUPABASE_PROJECT_ID = "vrvoyxxdlcpysthzjbeu"
$SUPABASE_URL = "https://vrvoyxxdlcpysthzjbeu.supabase.co"

Write-Host "✓ Supabase CLI installed" -ForegroundColor Green
Write-Host "`n📊 Reading schema.sql..." -ForegroundColor Cyan

$schema = Get-Content "supabase\schema.sql" -Raw

Write-Host "✓ Schema loaded ($($schema.Length) characters)" -ForegroundColor Green

# Try to execute via REST API with anon key
$ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2Mzk4NDcsImV4cCI6MjA1MjIxNTg0N30.K5B-RqWyxEwSZCmPQhPKGmN16cMtJdaU3TzqJ6G-SB8"

Write-Host "`n🚀 Executing schema in Supabase..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" `
        -Method POST `
        -Headers @{
            "apikey" = $ANON_KEY
            "Authorization" = "Bearer $ANON_KEY"
            "Content-Type" = "application/json"
        } `
        -Body (@{ query = $schema } | ConvertTo-Json) `
        -ErrorAction Stop

    Write-Host "✓ Schema executed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  REST API approach failed. Trying alternative method..." -ForegroundColor Yellow

    # Write SQL to temp file and use psql if available
    $schema | Out-File "temp-schema.sql" -Encoding UTF8

    Write-Host "`n📋 Schema saved to temp-schema.sql" -ForegroundColor Cyan
    Write-Host "`n⚠️  MANUAL STEP REQUIRED:" -ForegroundColor Yellow
    Write-Host "Please run this schema manually in Supabase:" -ForegroundColor White
    Write-Host "1. Go to: $SUPABASE_URL" -ForegroundColor Gray
    Write-Host "2. Click 'SQL Editor' in left sidebar" -ForegroundColor Gray
    Write-Host "3. Copy contents of: supabase\schema.sql" -ForegroundColor Gray
    Write-Host "4. Paste and click 'Run'" -ForegroundColor Gray

    # Open browser to SQL editor
    Start-Process "https://supabase.com/dashboard/project/$SUPABASE_PROJECT_ID/sql/new"

    Write-Host "`n✓ Browser opened to SQL Editor" -ForegroundColor Green
}

Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
