# AuthenticaDetector SQL Fix Script
# This script copies the SQL to clipboard and opens Supabase SQL Editor

$SQL = @"
-- =====================================================
-- SUPABASE SQL FIXES - PASTE THIS ENTIRE BLOCK
-- =====================================================

-- Fix 1: Allow public read access to badge_definitions
DROP POLICY IF EXISTS "Allow public read access to badges" ON badge_definitions;
CREATE POLICY "Allow public read access to badges"
    ON badge_definitions
    FOR SELECT
    USING (true);

-- Fix 2: Grant SELECT on all leaderboard views to anonymous users
GRANT SELECT ON public_leaderboard TO anon;
GRANT SELECT ON truth_hunters_leaderboard TO anon;
GRANT SELECT ON squad_leaderboard TO anon;
GRANT SELECT ON leaderboard TO anon;

-- Fix 3: Add missing columns to submissions table
DO `$`$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'submissions' AND column_name = 'media_type'
    ) THEN
        ALTER TABLE submissions ADD COLUMN media_type TEXT DEFAULT 'image';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'submissions' AND column_name = 'thumbnail_url'
    ) THEN
        ALTER TABLE submissions ADD COLUMN thumbnail_url TEXT;
    END IF;
END `$`$;

-- Verify: This should return badge count
SELECT 'Fixes applied successfully!' as status, count(*) as badge_count FROM badge_definitions;
"@

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AuthenticaDetector SQL Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Copy SQL to clipboard
Set-Clipboard -Value $SQL
Write-Host "[OK] SQL copied to clipboard!" -ForegroundColor Green
Write-Host ""

# Open Supabase SQL Editor
$url = "https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new"
Write-Host "[INFO] Opening Supabase SQL Editor..." -ForegroundColor Yellow
Start-Process $url

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. The SQL Editor should open in your browser" -ForegroundColor White
Write-Host "2. If not logged in, log in to Supabase first" -ForegroundColor White
Write-Host "3. Press Ctrl+V to paste the SQL" -ForegroundColor White
Write-Host "4. Click 'Run' or press Ctrl+Enter" -ForegroundColor White
Write-Host "5. You should see 'Fixes applied successfully!'" -ForegroundColor White
Write-Host ""
Write-Host "The SQL has been copied to your clipboard." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
