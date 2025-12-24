@echo off
title AuthenticaDetector Database Fix
color 0A

echo.
echo ========================================
echo   AuthenticaDetector Database Fix
echo ========================================
echo.

:: Create temp file with SQL
set "TEMPFILE=%TEMP%\supabase_fix.sql"

(
echo -- SUPABASE SQL FIXES - PASTE THIS ENTIRE BLOCK
echo.
echo -- Fix 1: Allow public read access to badge_definitions
echo DROP POLICY IF EXISTS "Allow public read access to badges" ON badge_definitions;
echo CREATE POLICY "Allow public read access to badges"
echo     ON badge_definitions
echo     FOR SELECT
echo     USING ^(true^);
echo.
echo -- Fix 2: Grant SELECT on all leaderboard views
echo GRANT SELECT ON public_leaderboard TO anon;
echo GRANT SELECT ON truth_hunters_leaderboard TO anon;
echo GRANT SELECT ON squad_leaderboard TO anon;
echo GRANT SELECT ON leaderboard TO anon;
echo.
echo -- Fix 3: Add missing columns
echo DO $$
echo BEGIN
echo     IF NOT EXISTS ^(SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'media_type'^) THEN
echo         ALTER TABLE submissions ADD COLUMN media_type TEXT DEFAULT 'image';
echo     END IF;
echo     IF NOT EXISTS ^(SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'thumbnail_url'^) THEN
echo         ALTER TABLE submissions ADD COLUMN thumbnail_url TEXT;
echo     END IF;
echo END $$;
echo.
echo SELECT 'Fixes applied!' as status, count^(*^) as badge_count FROM badge_definitions;
) > "%TEMPFILE%"

:: Copy to clipboard using clip command
type "%TEMPFILE%" | clip

echo [OK] SQL has been copied to your clipboard!
echo.

:: Open Supabase SQL Editor
echo [INFO] Opening Supabase SQL Editor in your browser...
start "" "https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new"

echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo.
echo   1. Log in to Supabase if needed
echo   2. Press Ctrl+V to paste the SQL
echo   3. Click "Run" button
echo   4. Done!
echo.
echo ========================================
echo.

:: Clean up
del "%TEMPFILE%" 2>nul

pause
