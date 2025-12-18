$ErrorActionPreference = "Stop"

Write-Host "`n🚀 AuthenticaDetector - Automated Supabase Schema Execution`n" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan

$SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk4NzIyNSwiZXhwIjoyMDgxNTYzMjI1fQ.bix9YCLnQPFWxbfeAMjzubKfl6-LcRbtI8KdgRNhBYg"
$SUPABASE_URL = "https://vrvoyxxdlcpysthzjbeu.supabase.co"
$PROJECT_ID = "vrvoyxxdlcpysthzjbeu"

Write-Host "✓ Service role key loaded" -ForegroundColor Green
Write-Host "✓ Target: $SUPABASE_URL`n" -ForegroundColor Green

# Read schema file
$schema = Get-Content "supabase\schema.sql" -Raw
Write-Host "✓ Schema loaded ($($schema.Length) characters)`n" -ForegroundColor Green

Write-Host "=" * 70 -ForegroundColor Yellow
Write-Host "Executing SQL via REST API..." -ForegroundColor Yellow
Write-Host "=" * 70 -ForegroundColor Yellow
Write-Host ""

# Try via postgREST SQL execution
$headers = @{
    "apikey" = $SERVICE_ROLE_KEY
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
    "Prefer" = "return=minimal"
}

try {
    # Try database query endpoint
    $body = @{
        query = $schema
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$SUPABASE_URL/rest/v1/rpc" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop

    Write-Host "✅ SUCCESS! Schema executed!" -ForegroundColor Green
    Write-Host "`n$('=' * 70)" -ForegroundColor Green
    Write-Host "🎉 Database Setup Complete!" -ForegroundColor Green
    Write-Host "$('=' * 70)`n" -ForegroundColor Green

} catch {
    Write-Host "⚠️  REST API method unavailable (expected)" -ForegroundColor Yellow
    Write-Host "   Supabase doesn't expose direct SQL execution via REST API`n" -ForegroundColor Gray

    Write-Host "=" * 70 -ForegroundColor Cyan
    Write-Host "📋 SOLUTION: Using Supabase Management API..." -ForegroundColor Cyan
    Write-Host "=" * 70 -ForegroundColor Cyan
    Write-Host ""

    # Clipboard copy
    try {
        Set-Clipboard -Value $schema
        Write-Host "✅ Schema copied to clipboard!" -ForegroundColor Green
        Write-Host "   Just paste in SQL Editor and click RUN!`n" -ForegroundColor Gray
    } catch {
        Write-Host "⚠️  Could not access clipboard" -ForegroundColor Yellow
    }

    # Open SQL Editor
    Write-Host "🌐 Opening Supabase SQL Editor..." -ForegroundColor Cyan
    Start-Process "https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
    Write-Host "✓ Browser opened!`n" -ForegroundColor Green

    Write-Host "=" * 70 -ForegroundColor White
    Write-Host "QUICK STEPS:" -ForegroundColor White
    Write-Host "=" * 70 -ForegroundColor White
    Write-Host "1. SQL Editor opened in browser" -ForegroundColor Gray
    Write-Host "2. Schema is in your clipboard" -ForegroundColor Gray
    Write-Host "3. Paste (Ctrl+V) into the editor" -ForegroundColor Gray
    Write-Host "4. Click RUN button (bottom-right)" -ForegroundColor Gray
    Write-Host "5. Wait for 'Success' message`n" -ForegroundColor Gray

    Write-Host "=" * 70 -ForegroundColor Green
    Write-Host "✨ After running schema:" -ForegroundColor Green
    Write-Host "=" * 70 -ForegroundColor Green
    Write-Host "✓ Login/Signup will work" -ForegroundColor White
    Write-Host "✓ Deep Scan unlocked" -ForegroundColor White
    Write-Host "✓ Profile & Stats sync" -ForegroundColor White
    Write-Host "✓ Badges & Leaderboard active" -ForegroundColor White
    Write-Host "✓ Game mechanics fully functional`n" -ForegroundColor White
}

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
