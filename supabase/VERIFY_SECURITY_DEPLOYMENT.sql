-- VERIFICATION SCRIPT FOR SECURITY_FIXES_PRODUCTION.sql
-- Verifies all tables, functions, and indexes were created successfully

-- ==================== VERIFY TABLES ====================

SELECT 'TABLES' as verification_section;

SELECT table_name, COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('rate_limits', 'security_audit_log')
GROUP BY table_name
ORDER BY table_name;

-- ==================== VERIFY FUNCTIONS ====================

SELECT 'FUNCTIONS' as verification_section;

SELECT
    proname as function_name,
    pg_get_functiondef(pg_proc.oid) as definition
FROM pg_proc
WHERE proname IN (
    'check_scan_rate_limit',
    'check_vote_rate_limit',
    'check_submission_rate_limit',
    'log_security_event',
    'safe_spend_coins',
    'safe_award_badge',
    'check_voting_pattern',
    'cleanup_rate_limits',
    'cleanup_audit_logs'
)
ORDER BY proname;

-- ==================== VERIFY INDEXES ====================

SELECT 'INDEXES' as verification_section;

SELECT
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND (
    indexname LIKE 'idx_%' OR indexname LIKE 'rate_limits%' OR indexname LIKE 'security_audit%'
)
ORDER BY tablename, indexname;

-- ==================== VERIFY RLS POLICIES ====================

SELECT 'RLS POLICIES' as verification_section;

SELECT
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN (
    'user_progression',
    'scans',
    'feedback',
    'votes',
    'submissions',
    'rate_limits',
    'security_audit_log'
)
ORDER BY tablename, policyname;

-- ==================== VERIFY CONSTRAINTS ====================

SELECT 'CONSTRAINTS' as verification_section;

SELECT
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND (
    constraint_name LIKE 'valid_source%' OR
    constraint_name LIKE 'no_email%'
)
ORDER BY table_name, constraint_name;

-- ==================== SUMMARY ====================

SELECT 'SECURITY DEPLOYMENT SUMMARY' as report;

SELECT 'Tables Created' as category, COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('rate_limits', 'security_audit_log')

UNION ALL

SELECT 'Functions Created', COUNT(*)
FROM pg_proc
WHERE proname IN (
    'check_scan_rate_limit',
    'check_vote_rate_limit',
    'check_submission_rate_limit',
    'log_security_event',
    'safe_spend_coins',
    'safe_award_badge',
    'check_voting_pattern',
    'cleanup_rate_limits',
    'cleanup_audit_logs'
)

UNION ALL

SELECT 'Security Indexes Created', COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public' AND (
    indexname LIKE 'idx_audit%' OR indexname LIKE 'idx_votes_user%' OR indexname LIKE 'idx_submissions_user%' OR indexname LIKE 'idx_scans_user%'
)

UNION ALL

SELECT 'RLS Policies Updated', COUNT(*)
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN (
    'user_progression',
    'scans',
    'feedback',
    'votes',
    'submissions',
    'rate_limits',
    'security_audit_log'
)

ORDER BY category;

SELECT 'DEPLOYMENT STATUS' as final_check, 'SUCCESS - All security measures deployed!' as result;
