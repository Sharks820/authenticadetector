@echo off
REM VERA V5.0.0-PERFECT Deployment Script
REM Updates index.html to cache-bust vera-controller.css

echo ========================================
echo VERA V5.0.0-PERFECT Deployment
echo ========================================
echo.

REM Backup index.html
echo Creating backup...
copy index.html index.html.backup_v5
if errorlevel 1 (
    echo ERROR: Failed to create backup
    pause
    exit /b 1
)
echo Backup created: index.html.backup_v5
echo.

REM Update CSS version
echo Updating CSS version to v5.0.0-PERFECT...
powershell -Command "(Get-Content index.html) -replace 'vera-controller.css\?v=4\.0\.0', 'vera-controller.css?v=5.0.0-PERFECT' | Set-Content index.html"
if errorlevel 1 (
    echo ERROR: Failed to update CSS version
    echo Restoring backup...
    copy index.html.backup_v5 index.html
    pause
    exit /b 1
)
echo CSS version updated successfully
echo.

REM Verify change
echo Verifying update...
findstr /C:"vera-controller.css?v=5.0.0-PERFECT" index.html >nul
if errorlevel 1 (
    echo WARNING: Verification failed - CSS version not found
    echo Please manually verify index.html
) else (
    echo Verification successful - CSS version updated to v5.0.0-PERFECT
)
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open authenticadetector.com
echo 2. Hard refresh (Ctrl+F5)
echo 3. Test all 4 VERA forms (fairy, partial, takeover, monster)
echo 4. Verify smooth animations
echo.
echo If issues occur, restore backup:
echo   copy index.html.backup_v5 index.html
echo.
pause
