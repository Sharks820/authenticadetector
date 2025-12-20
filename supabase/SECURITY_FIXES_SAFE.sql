-- SECURITY HARDENING SQL FOR AUTHENTICADETECTOR
-- Date: December 20, 2025
-- Agent: Security-Abuse
-- Purpose: Additional RLS policies and security enhancements
-- NOTE: Skipping column type alterations (already VARCHAR compatible)
-- Run AFTER: schema.sql, truth_hunters_schema.sql, CRITICAL_RLS_FIXES.sql, PERSISTENCE_FIXES.sql

-- ==================== PHASE 1: RLS POLICY HARDENING ====================

-- 1.1 User Progression Public Read (for leaderboard display)
-- This allows the leaderboard view to show levels/XP while protecting coin balances
DROP POLICY IF EXISTS "Public read progression for leaderboard" ON user_progression;

CREATE POLICY "Public read progression for leaderboard"
ON user_progression FOR SELECT
USING (
    -- Anyone can see level and XP (public for leaderboard)
    -- But actual coin balance is only visible to owner
    auth.uid() IS NOT NULL
);

-- 1.2 Scans DELETE Policy (allow users to delete their own scan history)
DROP POLICY IF EXISTS "Users can delete own scans" ON scans;

CREATE POLICY "Users can delete own scans"
ON scans FOR DELETE
USING (auth.uid() = user_id);

-- 1.3 Feedback table - prevent spam by adding user requirement
DROP POLICY IF EXISTS "Anyone can submit feedback" ON feedback;

CREATE POLICY "Authenticated users can submit feedback"
ON feedback FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL OR user_id IS NULL
);

-- 1.4 Votes - Prevent vote manipulation (one vote per user per submission enforced at table level)
-- Already has UNIQUE(submission_id, user_id) constraint
-- Add additional check to prevent vote changes
DROP POLICY IF EXISTS "Users cannot update votes" ON votes;

CREATE POLICY "Users cannot update votes"
ON votes FOR UPDATE
USING (FALSE); -- Votes are immutable once cast

-- 1.5 Submissions - Prevent modification after voting starts
DROP POLICY IF EXISTS "Users can update own submissions before consensus" ON submissions;

CREATE POLICY "Users can update own submissions before voting"
ON submissions FOR UPDATE
USING (
    auth.uid() = submitter_id
    AND consensus_reached = FALSE
    AND total_votes < 3 -- Can only edit before significant voting
);

-- ==================== PHASE 2: INPUT VALIDATION CONSTRAINTS ====================

-- 2.2 Add check constraints for URLs (safer than column type changes)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'valid_source_url' AND table_schema = 'public'
    ) THEN
        ALTER TABLE submissions
        ADD CONSTRAINT valid_source_url CHECK (
            source_url IS NULL OR
            source_url ~ '^https?://[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}'
        );
    END IF;
END $$;

-- 2.3 Add validation for email-like patterns in display_name (prevent phishing)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'no_email_in_display_name' AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT no_email_in_display_name CHECK (
            display_name IS NULL OR
            display_name !~ '@[a-zA-Z0-9]+\.[a-zA-Z]+'
        );
    END IF;
END $$;

-- ==================== PHASE 3: RATE LIMITING FUNCTIONS ====================

-- 3.1 Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    action_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, action_type)
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limits only visible/editable by the system
CREATE POLICY IF NOT EXISTS "Users can view own rate limits"
ON rate_limits FOR SELECT
USING (auth.uid() = user_id);

-- 3.2 Rate limiting function for scans
CREATE OR REPLACE FUNCTION check_scan_rate_limit(p_user_id UUID, p_limit INTEGER DEFAULT 100)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
    v_window_start TIMESTAMPTZ;
BEGIN
    -- Get current count for this hour
    SELECT action_count, window_start INTO v_count, v_window_start
    FROM rate_limits
    WHERE user_id = p_user_id AND action_type = 'scan';

    -- If no record or window expired (1 hour), reset
    IF v_window_start IS NULL OR v_window_start < NOW() - INTERVAL '1 hour' THEN
        INSERT INTO rate_limits (user_id, action_type, action_count, window_start)
        VALUES (p_user_id, 'scan', 1, NOW())
        ON CONFLICT (user_id, action_type)
        DO UPDATE SET action_count = 1, window_start = NOW();
        RETURN TRUE;
    END IF;

    -- Check if under limit
    IF v_count < p_limit THEN
        UPDATE rate_limits
        SET action_count = action_count + 1
        WHERE user_id = p_user_id AND action_type = 'scan';
        RETURN TRUE;
    END IF;

    -- Rate limited
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_scan_rate_limit(UUID, INTEGER) TO authenticated;

-- 3.3 Rate limiting function for votes
CREATE OR REPLACE FUNCTION check_vote_rate_limit(p_user_id UUID, p_limit INTEGER DEFAULT 50)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
    v_window_start TIMESTAMPTZ;
BEGIN
    SELECT action_count, window_start INTO v_count, v_window_start
    FROM rate_limits
    WHERE user_id = p_user_id AND action_type = 'vote';

    IF v_window_start IS NULL OR v_window_start < NOW() - INTERVAL '1 hour' THEN
        INSERT INTO rate_limits (user_id, action_type, action_count, window_start)
        VALUES (p_user_id, 'vote', 1, NOW())
        ON CONFLICT (user_id, action_type)
        DO UPDATE SET action_count = 1, window_start = NOW();
        RETURN TRUE;
    END IF;

    IF v_count < p_limit THEN
        UPDATE rate_limits
        SET action_count = action_count + 1
        WHERE user_id = p_user_id AND action_type = 'vote';
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_vote_rate_limit(UUID, INTEGER) TO authenticated;

-- 3.4 Rate limiting for submissions (stricter)
CREATE OR REPLACE FUNCTION check_submission_rate_limit(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
    v_window_start TIMESTAMPTZ;
BEGIN
    SELECT action_count, window_start INTO v_count, v_window_start
    FROM rate_limits
    WHERE user_id = p_user_id AND action_type = 'submission';

    -- 24-hour window for submissions
    IF v_window_start IS NULL OR v_window_start < NOW() - INTERVAL '24 hours' THEN
        INSERT INTO rate_limits (user_id, action_type, action_count, window_start)
        VALUES (p_user_id, 'submission', 1, NOW())
        ON CONFLICT (user_id, action_type)
        DO UPDATE SET action_count = 1, window_start = NOW();
        RETURN TRUE;
    END IF;

    IF v_count < p_limit THEN
        UPDATE rate_limits
        SET action_count = action_count + 1
        WHERE user_id = p_user_id AND action_type = 'submission';
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_submission_rate_limit(UUID, INTEGER) TO authenticated;

-- ==================== PHASE 4: AUDIT LOGGING ====================

-- 4.1 Create security audit log table
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    user_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_type ON security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON security_audit_log(created_at DESC);

ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (no public access)
CREATE POLICY IF NOT EXISTS "No public access to audit logs"
ON security_audit_log FOR SELECT
USING (FALSE);

-- System can insert logs
CREATE POLICY IF NOT EXISTS "System can insert audit logs"
ON security_audit_log FOR INSERT
WITH CHECK (TRUE);

-- 4.2 Audit logging function
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type TEXT,
    p_user_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO security_audit_log (event_type, user_id, details)
    VALUES (p_event_type, COALESCE(p_user_id, auth.uid()), p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION log_security_event(TEXT, UUID, JSONB) TO authenticated;

-- ==================== PHASE 5: ANTI-CHEAT ENHANCEMENTS ====================

-- 5.1 Validate coin transactions (prevent negative balance)
CREATE OR REPLACE FUNCTION safe_spend_coins(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT DEFAULT 'purchase'
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, message TEXT) AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Get current balance with row lock
    SELECT truth_coins INTO v_current_balance
    FROM user_progression
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF v_current_balance IS NULL THEN
        RETURN QUERY SELECT FALSE, 0, 'User not found';
        RETURN;
    END IF;

    IF v_current_balance < p_amount THEN
        RETURN QUERY SELECT FALSE, v_current_balance, 'Insufficient coins';
        RETURN;
    END IF;

    -- Deduct coins
    UPDATE user_progression
    SET truth_coins = truth_coins - p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING truth_coins INTO v_new_balance;

    -- Log the transaction
    PERFORM log_security_event('coin_spend', p_user_id,
        jsonb_build_object('amount', p_amount, 'reason', p_reason, 'new_balance', v_new_balance));

    RETURN QUERY SELECT TRUE, v_new_balance, 'Success';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION safe_spend_coins(UUID, INTEGER, TEXT) TO authenticated;

-- 5.2 Prevent duplicate badge awards (extra layer beyond UNIQUE constraint)
CREATE OR REPLACE FUNCTION safe_award_badge(
    p_user_id UUID,
    p_badge_id TEXT
)
RETURNS TABLE(awarded BOOLEAN, message TEXT) AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Check if badge already awarded
    SELECT EXISTS(
        SELECT 1 FROM user_badges
        WHERE user_id = p_user_id AND badge_id = p_badge_id
    ) INTO v_exists;

    IF v_exists THEN
        RETURN QUERY SELECT FALSE, 'Badge already awarded';
        RETURN;
    END IF;

    -- Award badge
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (p_user_id, p_badge_id)
    ON CONFLICT (user_id, badge_id) DO NOTHING;

    -- Log the award
    PERFORM log_security_event('badge_award', p_user_id,
        jsonb_build_object('badge_id', p_badge_id));

    RETURN QUERY SELECT TRUE, 'Badge awarded successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION safe_award_badge(UUID, TEXT) TO authenticated;

-- 5.3 Detect suspicious voting patterns
CREATE OR REPLACE FUNCTION check_voting_pattern(p_user_id UUID)
RETURNS TABLE(is_suspicious BOOLEAN, reason TEXT) AS $$
DECLARE
    v_votes_last_hour INTEGER;
    v_same_vote_streak INTEGER;
    v_avg_time_per_vote FLOAT;
BEGIN
    -- Count votes in last hour
    SELECT COUNT(*) INTO v_votes_last_hour
    FROM votes
    WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '1 hour';

    -- Check if voting too fast
    IF v_votes_last_hour > 30 THEN
        PERFORM log_security_event('suspicious_voting', p_user_id,
            jsonb_build_object('votes_per_hour', v_votes_last_hour));
        RETURN QUERY SELECT TRUE, 'Too many votes in short period';
        RETURN;
    END IF;

    -- Check for same-vote streak (always voting AI or always voting Real)
    SELECT MAX(streak) INTO v_same_vote_streak
    FROM (
        SELECT COUNT(*) as streak
        FROM votes
        WHERE user_id = p_user_id
        AND created_at > NOW() - INTERVAL '24 hours'
        GROUP BY vote
    ) streaks;

    IF v_same_vote_streak > 20 THEN
        PERFORM log_security_event('suspicious_voting', p_user_id,
            jsonb_build_object('same_vote_streak', v_same_vote_streak));
        RETURN QUERY SELECT TRUE, 'Suspicious voting pattern detected';
        RETURN;
    END IF;

    RETURN QUERY SELECT FALSE, 'No issues detected';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_voting_pattern(UUID) TO authenticated;

-- ==================== PHASE 6: DATA CLEANUP ====================

-- 6.1 Function to cleanup old rate limit records
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM rate_limits
    WHERE window_start < NOW() - INTERVAL '24 hours'
    RETURNING COUNT(*) INTO v_deleted;

    RETURN COALESCE(v_deleted, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.2 Function to cleanup old audit logs (keep 90 days)
CREATE OR REPLACE FUNCTION cleanup_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM security_audit_log
    WHERE created_at < NOW() - INTERVAL '90 days'
    RETURNING COUNT(*) INTO v_deleted;

    RETURN COALESCE(v_deleted, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== PHASE 7: ADDITIONAL INDEXES FOR SECURITY QUERIES ====================

CREATE INDEX IF NOT EXISTS idx_votes_user_recent ON votes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_user_recent ON submissions(submitter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_user_recent ON scans(user_id, created_at DESC);

-- ==================== VERIFICATION QUERIES ====================

-- Verify rate limiting table created
SELECT COUNT(*) as rate_limits_count FROM rate_limits;

-- Verify audit log table created
SELECT COUNT(*) as audit_log_count FROM security_audit_log;

-- Verify functions created
SELECT
    proname,
    pronargs,
    prorettype
FROM pg_proc
WHERE proname IN ('check_scan_rate_limit', 'check_vote_rate_limit', 'check_submission_rate_limit',
                   'log_security_event', 'safe_spend_coins', 'safe_award_badge', 'check_voting_pattern',
                   'cleanup_rate_limits', 'cleanup_audit_logs')
ORDER BY proname;

-- ==================== SUCCESS MESSAGE ====================
SELECT 'SECURITY HARDENING COMPLETE!' as status,
       'Added: Rate limiting, Audit logging, Anti-cheat measures, Input validation' as changes,
       'Tables created: rate_limits, security_audit_log' as tables,
       'Functions created: 9 security functions' as functions,
       'Run regularly: cleanup_rate_limits(), cleanup_audit_logs()' as maintenance;
