-- VERIFICATION QUERIES FOR CRITICAL RLS FIXES
-- Run these to confirm all policies are in place

-- ==================== Verify Votes Policies ====================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'votes'
ORDER BY policyname;

-- ==================== Verify Squads Policies ====================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'squads'
ORDER BY policyname;

-- ==================== Verify Squad Members Policies ====================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'squad_members'
ORDER BY policyname;

-- ==================== Verify Submissions Policies ====================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'submissions'
ORDER BY policyname;
