@echo off
title AuthenticaDetector Cloudflare Fix
color 0B

echo.
echo ========================================
echo   AuthenticaDetector Cloudflare Fix
echo ========================================
echo.
echo The custom domains need to be added to your
echo Cloudflare Pages project.
echo.
echo This will open the Cloudflare Pages dashboard
echo where you can add the custom domains.
echo.
echo ========================================
echo   STEPS TO FIX 522 ERROR:
echo ========================================
echo.
echo   1. Click on "authenticadetector-v7" project
echo   2. Go to "Custom domains" tab
echo   3. Click "Set up a custom domain"
echo   4. Enter: authenticadetector.com
echo   5. Click Continue and Complete setup
echo   6. Repeat for: www.authenticadetector.com
echo.
echo ========================================
echo.

:: Open Cloudflare Pages dashboard
start "" "https://dash.cloudflare.com/?to=/:account/pages/view/authenticadetector-v7/domains"

echo [INFO] Cloudflare dashboard opened in browser.
echo.
echo If you see a login page, log in first.
echo.

pause
