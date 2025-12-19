-- URGENT SUPABASE FIXES
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new

-- ==================== FIX 1: Badge Definitions Public Access ====================
-- Issue: badge_definitions has data but anon users can't see it
-- Fix: Add public read policy

DROP POLICY IF EXISTS "Allow public read access to badges" ON badge_definitions;

CREATE POLICY "Allow public read access to badges"
ON badge_definitions FOR SELECT
USING (true);

-- ==================== FIX 2: Public Leaderboard Materialized View Permission ====================
-- Issue: public_leaderboard returns permission denied
-- Fix: Grant SELECT to anon role

GRANT SELECT ON public_leaderboard TO anon;

-- ==================== FIX 3: Verify Submissions Table Schema ====================
-- Check if submissions table has all required columns

DO $$
BEGIN
    -- Add media_type column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'submissions' AND column_name = 'media_type'
    ) THEN
        ALTER TABLE submissions ADD COLUMN media_type TEXT DEFAULT 'image';
    END IF;

    -- Add thumbnail_url if missing (already in schema but verify)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'submissions' AND column_name = 'thumbnail_url'
    ) THEN
        ALTER TABLE submissions ADD COLUMN thumbnail_url TEXT;
    END IF;
END $$;

-- ==================== FIX 4: Ensure Truth Hunters Leaderboard Views are Public ====================

-- Grant access to leaderboard views
GRANT SELECT ON truth_hunters_leaderboard TO anon;
GRANT SELECT ON squad_leaderboard TO anon;
GRANT SELECT ON leaderboard TO anon;

-- ==================== VERIFICATION QUERIES ====================
-- Run these to verify fixes worked

-- Should return 20 badges (run as anon to test):
-- SELECT COUNT(*) FROM badge_definitions;

-- Should return empty array without errors:
-- SELECT * FROM public_leaderboard LIMIT 5;

-- Should return 0 or submissions if any exist:
-- SELECT COUNT(*) FROM submissions;

-- Should not error:
-- SELECT * FROM truth_hunters_leaderboard LIMIT 5;
-- SELECT * FROM squad_leaderboard LIMIT 5;

-- ==================== SUCCESS MESSAGE ====================
SELECT 'All fixes applied successfully!' as status;
