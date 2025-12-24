@echo off
title AuthenticaDetector - Verify Fixes
color 0E

echo.
echo ========================================
echo   Verifying AuthenticaDetector Fixes
echo ========================================
echo.

echo [TEST 1] Checking badge_definitions access...
curl -s "https://vrvoyxxdlcpysthzjbeu.supabase.co/rest/v1/badge_definitions?select=name&limit=3" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODcyMjUsImV4cCI6MjA4MTU2MzIyNX0.zwakHpqJY4moTqDyggoEx01CIo76gzFIgjtaPcamHkg"
echo.
echo.

echo [TEST 2] Checking public_leaderboard access...
curl -s "https://vrvoyxxdlcpysthzjbeu.supabase.co/rest/v1/public_leaderboard?select=display_name&limit=3" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODcyMjUsImV4cCI6MjA4MTU2MzIyNX0.zwakHpqJY4moTqDyggoEx01CIo76gzFIgjtaPcamHkg"
echo.
echo.

echo [TEST 3] Checking truth_hunters_leaderboard access...
curl -s "https://vrvoyxxdlcpysthzjbeu.supabase.co/rest/v1/truth_hunters_leaderboard?select=display_name&limit=3" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODcyMjUsImV4cCI6MjA4MTU2MzIyNX0.zwakHpqJY4moTqDyggoEx01CIo76gzFIgjtaPcamHkg"
echo.
echo.

echo [TEST 4] Checking custom domain...
curl -s -I "https://authenticadetector.com" 2>&1 | findstr "HTTP"
echo.
echo.

echo [TEST 5] Checking pages.dev site...
curl -s -I "https://authenticadetector-v7.pages.dev" 2>&1 | findstr "HTTP"
echo.

echo ========================================
echo   Results Interpretation:
echo ========================================
echo.
echo - If badge_definitions shows JSON array with names: FIX 1 WORKED
echo - If leaderboards show [] or data: FIX 2 WORKED
echo - If custom domain shows HTTP/1.1 200: CLOUDFLARE FIX WORKED
echo - If pages.dev shows HTTP/1.1 200: Site is deployed
echo.
echo ========================================
echo.

pause
