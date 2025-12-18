$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AuthenticaDetector - Schema Execution" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "vrvoyxxdlcpysthzjbeu"
$schema = Get-Content "supabase\schema.sql" -Raw
$schemaLen = $schema.Length

Write-Host "Schema loaded: $schemaLen characters" -ForegroundColor Green
Write-Host ""

# Copy to clipboard
try {
    Set-Clipboard -Value $schema
    Write-Host "[OK] Schema copied to clipboard!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[WARN] Could not copy to clipboard" -ForegroundColor Yellow
    Write-Host ""
}

# Open SQL Editor
Write-Host "Opening Supabase SQL Editor..." -ForegroundColor Cyan
$url = "https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
Start-Process $url
Write-Host "[OK] Browser opened!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor White
Write-Host "INSTRUCTIONS:" -ForegroundColor White
Write-Host "========================================" -ForegroundColor White
Write-Host "1. SQL Editor is now open in browser"
Write-Host "2. Schema is copied to clipboard"
Write-Host "3. Paste (Ctrl+V) in editor"
Write-Host "4. Click RUN button"
Write-Host "5. Wait for Success message"
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "After schema runs:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "* Login/Signup works"
Write-Host "* Deep Scan unlocked"
Write-Host "* Profile & Stats sync"
Write-Host "* Badges active"
Write-Host "* Game mechanics work"
Write-Host ""

Write-Host "Press Enter to continue..."
Read-Host
