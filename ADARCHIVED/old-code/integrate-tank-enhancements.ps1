# PowerShell script to integrate tank game enhancements
# This script automatically applies all necessary changes to index.html

Write-Host "=== Tank Game Enhancement Integration Script ===" -ForegroundColor Cyan
Write-Host ""

$indexPath = "C:\Users\Conner\Downloads\files_extracted\index.html"
$backupPath = "C:\Users\Conner\Downloads\files_extracted\index.html.backup"

# Create backup
Write-Host "Creating backup..." -ForegroundColor Yellow
Copy-Item $indexPath $backupPath -Force
Write-Host "Backup created: $backupPath" -ForegroundColor Green
Write-Host ""

# Read the file
Write-Host "Reading index.html..." -ForegroundColor Yellow
$content = Get-Content $indexPath -Raw

$changesMade = 0

# Change 1: Add script tag
Write-Host "Step 1: Adding script tag..." -ForegroundColor Yellow
$scriptPattern = '<script src="tank-shooter-enhanced.js"></script>'
$scriptReplacement = '<script src="tank-shooter-enhanced.js"></script>
<script src="tank-game-enhancements.js"></script>'

if ($content -like "*tank-shooter-enhanced.js*") {
    if ($content -notlike "*tank-game-enhancements.js*") {
        $content = $content.Replace($scriptPattern, $scriptReplacement)
        $changesMade++
        Write-Host "  Script tag added" -ForegroundColor Green
    } else {
        Write-Host "  Script tag already exists" -ForegroundColor Gray
    }
}

# Save the file
if ($changesMade -gt 0) {
    Write-Host ""
    Write-Host "Saving changes..." -ForegroundColor Yellow
    $content | Set-Content $indexPath -NoNewline
    Write-Host "Changes saved successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Summary:" -ForegroundColor Cyan
    Write-Host "  - $changesMade changes applied" -ForegroundColor White
    Write-Host "  - Backup saved to: $backupPath" -ForegroundColor White
    Write-Host ""
    Write-Host "IMPORTANT: You still need to manually integrate the wave system." -ForegroundColor Yellow
    Write-Host "See TANK_GAME_INTEGRATION_GUIDE.md for detailed steps." -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Script tag already added - check TANK_GAME_INTEGRATION_GUIDE.md" -ForegroundColor Yellow
    Write-Host "for remaining manual integration steps." -ForegroundColor White
}

Write-Host ""
Write-Host "=== Integration Complete ===" -ForegroundColor Cyan
