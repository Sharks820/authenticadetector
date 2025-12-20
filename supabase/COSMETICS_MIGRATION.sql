-- ============================================================
-- COSMETICS SYSTEM DATABASE MIGRATION
-- ============================================================
-- Creates tables and functions for avatar/cosmetics system

-- Create user_cosmetics table
CREATE TABLE IF NOT EXISTS user_cosmetics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_id TEXT DEFAULT 'default',
    equipped JSONB DEFAULT '{
        "top": null,
        "bottom": null,
        "fullbody": null,
        "weapon": null,
        "hat": null,
        "glasses": null,
        "pet": null,
        "badge": null
    }'::jsonb,
    owned JSONB DEFAULT '{
        "avatars": ["default"],
        "clothing": [],
        "weapons": [],
        "accessories": []
    }'::jsonb,
    stats JSONB DEFAULT '{
        "totalPurchases": 0,
        "totalRolls": 0,
        "coinsSpent": 0,
        "favoriteItem": null
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_cosmetics_user_id ON user_cosmetics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cosmetics_avatar_id ON user_cosmetics(avatar_id);

-- Enable RLS
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own cosmetics"
    ON user_cosmetics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cosmetics"
    ON user_cosmetics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cosmetics"
    ON user_cosmetics FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to spend coins atomically
CREATE OR REPLACE FUNCTION spend_coins_atomic(
    p_user_id UUID,
    p_amount INTEGER
)
RETURNS TABLE(truth_coins INTEGER) AS $$
DECLARE
    v_current_coins INTEGER;
BEGIN
    -- Get current coins with lock
    SELECT up.truth_coins INTO v_current_coins
    FROM user_progression up
    WHERE up.user_id = p_user_id
    FOR UPDATE;

    -- Check if enough coins
    IF v_current_coins IS NULL OR v_current_coins < p_amount THEN
        RAISE EXCEPTION 'Insufficient coins';
    END IF;

    -- Deduct coins
    UPDATE user_progression
    SET truth_coins = truth_coins - p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Return new balance
    RETURN QUERY
    SELECT up.truth_coins
    FROM user_progression up
    WHERE up.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to initialize cosmetics for new users
CREATE OR REPLACE FUNCTION initialize_user_cosmetics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_cosmetics (user_id, avatar_id, equipped, owned, stats)
    VALUES (
        NEW.user_id,
        'default',
        '{"top": null, "bottom": null, "fullbody": null, "weapon": null, "hat": null, "glasses": null, "pet": null, "badge": null}'::jsonb,
        '{"avatars": ["default"], "clothing": [], "weapons": [], "accessories": []}'::jsonb,
        '{"totalPurchases": 0, "totalRolls": 0, "coinsSpent": 0, "favoriteItem": null}'::jsonb
    )
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-initialize cosmetics when user_progression is created
CREATE TRIGGER trigger_initialize_cosmetics
    AFTER INSERT ON user_progression
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_cosmetics();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_cosmetics TO authenticated;
GRANT EXECUTE ON FUNCTION spend_coins_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION initialize_user_cosmetics TO authenticated;

-- Create analytics view for admin
CREATE OR REPLACE VIEW cosmetics_analytics AS
SELECT
    (SELECT COUNT(DISTINCT user_id) FROM user_cosmetics) as total_users,
    (SELECT SUM((stats->>'totalPurchases')::integer) FROM user_cosmetics) as total_purchases,
    (SELECT SUM((stats->>'totalRolls')::integer) FROM user_cosmetics) as total_rolls,
    (SELECT SUM((stats->>'coinsSpent')::integer) FROM user_cosmetics) as total_coins_spent,
    avatar_id,
    COUNT(*) as avatar_count
FROM user_cosmetics
GROUP BY avatar_id;

-- Migration complete
SELECT 'Cosmetics system migration completed successfully!' as status;