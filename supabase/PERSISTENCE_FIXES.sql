-- PERSISTENCE FIXES FOR COINS/BADGES/LEADERBOARD
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new
-- Date: Dec 20, 2025

-- ==================== FIX 1: Atomic Coin Updates (Race Condition Fix) ====================
CREATE OR REPLACE FUNCTION award_coins_atomic(
    p_user_id UUID,
    p_amount INTEGER
)
RETURNS TABLE(truth_coins INTEGER, lifetime_coins_earned INTEGER) AS $$
BEGIN
    RETURN QUERY
    UPDATE user_progression
    SET
        truth_coins = truth_coins + p_amount,
        lifetime_coins_earned = COALESCE(lifetime_coins_earned, 0) + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING user_progression.truth_coins, user_progression.lifetime_coins_earned;

    IF NOT FOUND THEN
        INSERT INTO user_progression (user_id, truth_coins, lifetime_coins_earned)
        VALUES (p_user_id, p_amount, p_amount)
        ON CONFLICT (user_id) DO UPDATE
        SET
            truth_coins = user_progression.truth_coins + p_amount,
            lifetime_coins_earned = COALESCE(lifetime_coins_earned, 0) + p_amount,
            updated_at = NOW()
        RETURNING user_progression.truth_coins, user_progression.lifetime_coins_earned;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION award_coins_atomic(UUID, INTEGER) TO authenticated;

-- ==================== FIX 2: Badge Awarding RLS Policy (400 Error Fix) ====================
DROP POLICY IF EXISTS "Users can update own badges" ON user_badges;
CREATE POLICY "Users can update own badges"
ON user_badges FOR UPDATE
USING (auth.uid() = user_id);

-- ==================== FIX 3: Idempotent Badge Awards ====================
CREATE OR REPLACE FUNCTION award_badge_atomic(
    p_user_id UUID,
    p_badge_id TEXT,
    p_coin_reward INTEGER DEFAULT 0
)
RETURNS TABLE(
    awarded BOOLEAN,
    already_had BOOLEAN,
    new_coins INTEGER
) AS $$
DECLARE
    v_already_exists BOOLEAN;
    v_new_coins INTEGER;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM user_badges
        WHERE user_id = p_user_id AND badge_id = p_badge_id
    ) INTO v_already_exists;

    IF v_already_exists THEN
        RETURN QUERY SELECT FALSE, TRUE, 0;
        RETURN;
    END IF;

    INSERT INTO user_badges (user_id, badge_id, earned_at)
    VALUES (p_user_id, p_badge_id, NOW())
    ON CONFLICT (user_id, badge_id) DO NOTHING;

    IF p_coin_reward > 0 THEN
        UPDATE user_progression
        SET
            truth_coins = truth_coins + p_coin_reward,
            lifetime_coins_earned = COALESCE(lifetime_coins_earned, 0) + p_coin_reward,
            updated_at = NOW()
        WHERE user_id = p_user_id
        RETURNING truth_coins INTO v_new_coins;
    ELSE
        v_new_coins := 0;
    END IF;

    RETURN QUERY SELECT TRUE, FALSE, COALESCE(v_new_coins, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION award_badge_atomic(UUID, TEXT, INTEGER) TO authenticated;

-- ==================== FIX 4: User Progression RLS Policy (Missing INSERT) ====================
DROP POLICY IF EXISTS "Users can insert own progression" ON user_progression;
CREATE POLICY "Users can insert own progression"
ON user_progression FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ==================== FIX 5: Badge Definitions Public Read ====================
DROP POLICY IF EXISTS "Allow public read access to badges" ON badge_definitions;
CREATE POLICY "Allow public read access to badges"
ON badge_definitions FOR SELECT
USING (true);

-- ==================== FIX 6: Leaderboard View Permissions ====================
GRANT SELECT ON truth_hunters_leaderboard TO anon, authenticated;
GRANT SELECT ON squad_leaderboard TO anon, authenticated;
GRANT SELECT ON leaderboard TO anon, authenticated;

-- ==================== VERIFICATION QUERIES ====================
-- Test atomic coin award: SELECT * FROM award_coins_atomic('YOUR_USER_ID'::UUID, 100);
-- Test badge award: SELECT * FROM award_badge_atomic('YOUR_USER_ID'::UUID, 'first_scan', 50);

SELECT 'All persistence fixes applied successfully!' as status;
