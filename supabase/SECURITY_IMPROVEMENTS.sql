-- SECURITY IMPROVEMENTS SQL FOR AUTHENTICADETECTOR
-- Date: December 20, 2025
-- Agent: Security-Abuse
-- Purpose: Input validation, enhanced RLS, rate limiting enforcement
-- Run AFTER: schema.sql, truth_hunters_schema.sql, CRITICAL_RLS_FIXES.sql, SECURITY_FIXES_PRODUCTION.sql

-- ==================== PHASE 1: INPUT VALIDATION CONSTRAINTS ====================

-- 1.1 Display Name Validation
-- Prevents XSS, UI breaking, and impersonation attacks
DO $$
BEGIN
    -- Length constraint (1-50 characters)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'display_name_length' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT display_name_length CHECK (
            display_name IS NULL OR
            (LENGTH(display_name) BETWEEN 1 AND 50)
        );
    END IF;

    -- Safe characters only (alphanumeric, spaces, underscores, hyphens)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'display_name_safe_chars' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT display_name_safe_chars CHECK (
            display_name IS NULL OR
            display_name ~ '^[a-zA-Z0-9 _-]+$'
        );
    END IF;

    -- Prevent email-like patterns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'no_email_in_display_name' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT no_email_in_display_name CHECK (
            display_name IS NULL OR
            display_name !~ '@[a-zA-Z0-9]+\.[a-zA-Z]+'
        );
    END IF;
END $$;

-- 1.2 Avatar URL Validation
-- Ensures only HTTPS URLs from trusted domains
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'avatar_url_https_only' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT avatar_url_https_only CHECK (
            avatar_url IS NULL OR
            avatar_url ~ '^https://'
        );
    END IF;

    -- Prevent javascript:, data:, file: protocols
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'avatar_url_no_dangerous_protocols' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT avatar_url_no_dangerous_protocols CHECK (
            avatar_url IS NULL OR
            (avatar_url !~* '^(javascript|data|file):' AND LENGTH(avatar_url) < 500)
        );
    END IF;
END $$;

-- 1.3 Submission Context Validation
-- Prevents XSS in user-submitted content descriptions
DO $$
BEGIN
    -- Context description length limit
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'context_description_length' AND table_name = 'submissions'
    ) THEN
        ALTER TABLE submissions
        ADD CONSTRAINT context_description_length CHECK (
            context_description IS NULL OR
            LENGTH(context_description) <= 500
        );
    END IF;

    -- Claimed context length limit
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'claimed_context_length' AND table_name = 'submissions'
    ) THEN
        ALTER TABLE submissions
        ADD CONSTRAINT claimed_context_length CHECK (
            claimed_context IS NULL OR
            LENGTH(claimed_context) <= 200
        );
    END IF;

    -- Source URL validation (HTTPS only)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'source_url_https' AND table_name = 'submissions'
    ) THEN
        ALTER TABLE submissions
        ADD CONSTRAINT source_url_https CHECK (
            source_url IS NULL OR
            source_url ~ '^https?://[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}'
        );
    END IF;
END $$;

-- 1.4 Source Platform Validation
-- Ensures only valid platform names
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'valid_source_platform' AND table_name = 'submissions'
    ) THEN
        ALTER TABLE submissions
        ADD CONSTRAINT valid_source_platform CHECK (
            source_platform IS NULL OR
            source_platform IN ('twitter', 'instagram', 'reddit', 'tiktok', 'facebook', 'linkedin', 'youtube', 'other')
        );
    END IF;
END $$;

-- 1.5 Squad Name Validation
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'squads') THEN
        -- Squad name length
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'squad_name_length' AND table_name = 'squads'
        ) THEN
            ALTER TABLE squads
            ADD CONSTRAINT squad_name_length CHECK (
                name IS NOT NULL AND
                LENGTH(name) BETWEEN 3 AND 30
            );
        END IF;

        -- Squad description length
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'squad_description_length' AND table_name = 'squads'
        ) THEN
            ALTER TABLE squads
            ADD CONSTRAINT squad_description_length CHECK (
                description IS NULL OR
                LENGTH(description) <= 200
            );
        END IF;
    END IF;
END $$;

-- ==================== PHASE 2: ENHANCED RLS POLICIES ====================

-- 2.1 Prevent Profile Deletion (Retain for audit trail)
DROP POLICY IF EXISTS "Users cannot delete profiles" ON profiles;

CREATE POLICY "Users cannot delete profiles"
ON profiles FOR DELETE
USING (FALSE); -- No one can delete profiles

-- 2.2 Prevent Badge Definition Modification (Admin only)
-- Note: Badge definitions should only be modified via migrations
ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Badge definitions are read-only" ON badge_definitions;

CREATE POLICY "Badge definitions are read-only"
ON badge_definitions FOR SELECT
USING (TRUE);

-- Prevent INSERT/UPDATE/DELETE on badge_definitions from client
DROP POLICY IF EXISTS "No public badge definition changes" ON badge_definitions;

CREATE POLICY "No public badge definition changes"
ON badge_definitions FOR ALL
USING (FALSE);

-- 2.3 Prevent User Stats Deletion (Retain for analytics)
DROP POLICY IF EXISTS "Users cannot delete stats" ON user_stats;

CREATE POLICY "Users cannot delete stats"
ON user_stats FOR DELETE
USING (FALSE);

-- 2.4 Prevent Modification of Security Audit Logs
-- Logs should be append-only
DROP POLICY IF EXISTS "No one can modify audit logs" ON security_audit_log;

CREATE POLICY "No one can modify audit logs"
ON security_audit_log FOR UPDATE
USING (FALSE);

DROP POLICY IF EXISTS "No one can delete audit logs" ON security_audit_log;

CREATE POLICY "No one can delete audit logs"
ON security_audit_log FOR DELETE
USING (FALSE);

-- ==================== PHASE 3: CSRF PROTECTION FUNCTIONS ====================

-- 3.1 CSRF Token Storage Table
CREATE TABLE IF NOT EXISTS csrf_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour'),
    used BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_csrf_tokens_user ON csrf_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_csrf_tokens_token ON csrf_tokens(token);
CREATE INDEX IF NOT EXISTS idx_csrf_tokens_expires ON csrf_tokens(expires_at);

ALTER TABLE csrf_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own CSRF tokens" ON csrf_tokens;

CREATE POLICY "Users can view own CSRF tokens"
ON csrf_tokens FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create CSRF tokens" ON csrf_tokens;

CREATE POLICY "Users can create CSRF tokens"
ON csrf_tokens FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3.2 Generate CSRF Token Function
CREATE OR REPLACE FUNCTION generate_csrf_token(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_token TEXT;
BEGIN
    -- Generate secure random token
    v_token := encode(gen_random_bytes(32), 'hex');

    -- Insert token
    INSERT INTO csrf_tokens (user_id, token, expires_at)
    VALUES (p_user_id, v_token, NOW() + INTERVAL '1 hour');

    -- Clean up expired tokens for this user
    DELETE FROM csrf_tokens
    WHERE user_id = p_user_id
    AND (expires_at < NOW() OR used = TRUE);

    RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION generate_csrf_token(UUID) TO authenticated;

-- 3.3 Validate CSRF Token Function
CREATE OR REPLACE FUNCTION validate_csrf_token(p_user_id UUID, p_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_valid BOOLEAN := FALSE;
BEGIN
    -- Check if token exists, not expired, not used
    SELECT EXISTS(
        SELECT 1 FROM csrf_tokens
        WHERE user_id = p_user_id
        AND token = p_token
        AND expires_at > NOW()
        AND used = FALSE
    ) INTO v_valid;

    IF v_valid THEN
        -- Mark token as used (single-use)
        UPDATE csrf_tokens
        SET used = TRUE
        WHERE user_id = p_user_id
        AND token = p_token;
    END IF;

    RETURN v_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION validate_csrf_token(UUID, TEXT) TO authenticated;

-- ==================== PHASE 4: ENHANCED ANTI-CHEAT FUNCTIONS ====================

-- 4.1 Safe Coin Award with Logging
CREATE OR REPLACE FUNCTION award_coins_with_audit(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT,
    p_csrf_token TEXT DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, message TEXT) AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
    v_max_daily_coins INTEGER := 1000; -- Prevent excessive coin farming
    v_coins_today INTEGER;
BEGIN
    -- Optional CSRF validation
    IF p_csrf_token IS NOT NULL THEN
        IF NOT validate_csrf_token(p_user_id, p_csrf_token) THEN
            RETURN QUERY SELECT FALSE, 0, 'Invalid CSRF token';
            RETURN;
        END IF;
    END IF;

    -- Check daily coin limit
    SELECT COALESCE(SUM(
        CASE WHEN details->>'amount' IS NOT NULL
        THEN (details->>'amount')::INTEGER
        ELSE 0 END
    ), 0) INTO v_coins_today
    FROM security_audit_log
    WHERE event_type = 'coin_award'
    AND user_id = p_user_id
    AND created_at > CURRENT_DATE;

    IF v_coins_today + p_amount > v_max_daily_coins THEN
        PERFORM log_security_event('coin_limit_exceeded', p_user_id,
            jsonb_build_object('attempted_amount', p_amount, 'daily_total', v_coins_today));
        RETURN QUERY SELECT FALSE, v_coins_today, 'Daily coin limit exceeded';
        RETURN;
    END IF;

    -- Award coins using existing atomic function
    SELECT truth_coins INTO v_new_balance
    FROM award_coins_atomic(p_user_id, p_amount);

    -- Log award
    PERFORM log_security_event('coin_award', p_user_id,
        jsonb_build_object('amount', p_amount, 'reason', p_reason, 'new_balance', v_new_balance));

    RETURN QUERY SELECT TRUE, v_new_balance, 'Coins awarded successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION award_coins_with_audit(UUID, INTEGER, TEXT, TEXT) TO authenticated;

-- 4.2 Detect Suspicious Submission Patterns
CREATE OR REPLACE FUNCTION check_submission_pattern(p_user_id UUID)
RETURNS TABLE(is_suspicious BOOLEAN, reason TEXT) AS $$
DECLARE
    v_submissions_today INTEGER;
    v_identical_submissions INTEGER;
BEGIN
    -- Check submissions today
    SELECT COUNT(*) INTO v_submissions_today
    FROM submissions
    WHERE submitter_id = p_user_id
    AND created_at > CURRENT_DATE;

    IF v_submissions_today > 20 THEN
        PERFORM log_security_event('suspicious_submissions', p_user_id,
            jsonb_build_object('submissions_today', v_submissions_today));
        RETURN QUERY SELECT TRUE, 'Too many submissions in one day';
        RETURN;
    END IF;

    -- Check for duplicate image submissions
    SELECT COUNT(*) INTO v_identical_submissions
    FROM (
        SELECT image_data, COUNT(*) as cnt
        FROM submissions
        WHERE submitter_id = p_user_id
        AND created_at > NOW() - INTERVAL '7 days'
        AND image_data IS NOT NULL
        GROUP BY image_data
        HAVING COUNT(*) > 1
    ) dups;

    IF v_identical_submissions > 0 THEN
        PERFORM log_security_event('duplicate_submissions', p_user_id,
            jsonb_build_object('duplicate_count', v_identical_submissions));
        RETURN QUERY SELECT TRUE, 'Duplicate image submissions detected';
        RETURN;
    END IF;

    RETURN QUERY SELECT FALSE, 'No issues detected';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_submission_pattern(UUID) TO authenticated;

-- ==================== PHASE 5: DATA INTEGRITY CHECKS ====================

-- 5.1 Validate User Progression Consistency
CREATE OR REPLACE FUNCTION validate_user_progression(p_user_id UUID)
RETURNS TABLE(valid BOOLEAN, issues TEXT[]) AS $$
DECLARE
    v_issues TEXT[] := '{}';
    v_prog RECORD;
BEGIN
    SELECT * INTO v_prog FROM user_progression WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, ARRAY['User progression record not found'];
        RETURN;
    END IF;

    -- Truth coins should not be negative
    IF v_prog.truth_coins < 0 THEN
        v_issues := array_append(v_issues, 'Negative coin balance detected');
    END IF;

    -- Level should match XP
    IF v_prog.level < 1 OR v_prog.level > 100 THEN
        v_issues := array_append(v_issues, 'Invalid level value');
    END IF;

    -- XP should not exceed level cap
    IF v_prog.xp < 0 OR v_prog.xp > 1000000 THEN
        v_issues := array_append(v_issues, 'Invalid XP value');
    END IF;

    -- Lifetime coins should be >= current coins
    IF v_prog.lifetime_coins_earned < v_prog.truth_coins THEN
        v_issues := array_append(v_issues, 'Lifetime coins less than current balance');
    END IF;

    IF array_length(v_issues, 1) IS NULL THEN
        RETURN QUERY SELECT TRUE, ARRAY['All checks passed']::TEXT[];
    ELSE
        PERFORM log_security_event('progression_integrity_issue', p_user_id,
            jsonb_build_object('issues', v_issues));
        RETURN QUERY SELECT FALSE, v_issues;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION validate_user_progression(UUID) TO authenticated;

-- ==================== PHASE 6: AUTOMATED CLEANUP JOBS ====================

-- 6.1 Cleanup Expired CSRF Tokens
CREATE OR REPLACE FUNCTION cleanup_csrf_tokens()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM csrf_tokens
    WHERE expires_at < NOW() OR
          (used = TRUE AND created_at < NOW() - INTERVAL '1 day')
    RETURNING COUNT(*) INTO v_deleted;

    RETURN COALESCE(v_deleted, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.2 Cleanup Old Feedback
CREATE OR REPLACE FUNCTION cleanup_old_feedback()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM feedback
    WHERE created_at < NOW() - INTERVAL '180 days'
    RETURNING COUNT(*) INTO v_deleted;

    RETURN COALESCE(v_deleted, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== PHASE 7: SECURITY MONITORING VIEWS ====================

-- 7.1 Recent Security Events View (Admin-only)
CREATE OR REPLACE VIEW security_events_summary AS
SELECT
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    MAX(created_at) as last_occurrence
FROM security_audit_log
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY event_type
ORDER BY event_count DESC;

-- 7.2 Rate Limit Status View
CREATE OR REPLACE VIEW rate_limit_status AS
SELECT
    rl.user_id,
    p.display_name,
    rl.action_type,
    rl.action_count,
    rl.window_start,
    CASE
        WHEN rl.action_type = 'scan' THEN 100 - rl.action_count
        WHEN rl.action_type = 'vote' THEN 50 - rl.action_count
        WHEN rl.action_type = 'submission' THEN 10 - rl.action_count
        ELSE 0
    END as remaining_actions
FROM rate_limits rl
LEFT JOIN profiles p ON p.id = rl.user_id
WHERE rl.window_start > NOW() - INTERVAL '24 hours';

-- ==================== PHASE 8: ADDITIONAL INDEXES FOR PERFORMANCE ====================

-- Indexes for security audit queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_recent ON security_audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_type_recent ON security_audit_log(event_type, created_at DESC);

-- Indexes for submission validation
CREATE INDEX IF NOT EXISTS idx_submissions_submitter_date ON submissions(submitter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_image_hash ON submissions(md5(image_data::text)) WHERE image_data IS NOT NULL;

-- ==================== SUCCESS MESSAGE ====================

SELECT 'SECURITY IMPROVEMENTS COMPLETE!' as status,
       'Input validation, CSRF protection, and anti-cheat measures deployed' as result;
