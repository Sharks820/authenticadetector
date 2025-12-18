-- AuthenticaDetector v12 Database Schema
-- Run this in Supabase SQL Editor

-- ==================== PROFILES ====================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ==================== USER STATS ====================
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_scans INTEGER DEFAULT 0,
    ai_found INTEGER DEFAULT 0,
    deep_scans INTEGER DEFAULT 0,
    quick_scans INTEGER DEFAULT 0,
    forensics_scans INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats viewable by everyone" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==================== SCANS (PRIVATE) ====================
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL DEFAULT 'image',
    scan_mode TEXT NOT NULL CHECK (scan_mode IN ('quick', 'deep', 'forensics')),
    result_label TEXT NOT NULL,
    confidence TEXT CHECK (confidence IN ('low', 'medium', 'high')),
    ai_score INTEGER NOT NULL CHECK (ai_score >= 0 AND ai_score <= 100),
    is_ai BOOLEAN NOT NULL,
    file_name TEXT,
    detector_version TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);

ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Scans are PRIVATE - only owner can see
CREATE POLICY "Users can only view own scans" ON scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON scans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==================== BADGES ====================
CREATE TABLE IF NOT EXISTS badge_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement INTEGER NOT NULL,
    badge_type TEXT NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'))
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES badge_definitions(id),
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges viewable by everyone" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==================== FEEDBACK ====================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('correct', 'incorrect')),
    ai_score INTEGER,
    scan_mode TEXT,
    confidence TEXT,
    detector_version TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_created ON feedback(created_at DESC);
CREATE INDEX idx_feedback_version ON feedback(detector_version);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON feedback FOR INSERT WITH CHECK (true);

-- ==================== LEADERBOARD VIEW ====================
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    p.id,
    p.display_name,
    p.avatar_url,
    s.total_scans,
    s.ai_found,
    s.points,
    ROW_NUMBER() OVER (ORDER BY s.points DESC, s.total_scans DESC) as rank
FROM profiles p
JOIN user_stats s ON p.id = s.user_id
WHERE s.total_scans > 0
ORDER BY s.points DESC, s.total_scans DESC
LIMIT 100;

-- ==================== TRIGGERS ====================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO user_stats (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS user_stats_updated_at ON user_stats;
CREATE TRIGGER user_stats_updated_at BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== BADGE DEFINITIONS ====================
INSERT INTO badge_definitions (id, name, description, icon, requirement, badge_type, rarity) VALUES
    -- Common
    ('first_scan', 'First Steps', 'Complete your first scan', '🔰', 1, 'total', 'common'),
    ('ai_hunter', 'AI Spotter', 'Find your first AI image', '🎯', 1, 'ai', 'common'),
    ('five_scans', 'Getting Started', 'Complete 5 scans', '✋', 5, 'total', 'common'),
    ('ten_scans', 'Double Digits', 'Complete 10 scans', '🔟', 10, 'total', 'common'),
    ('first_deep', 'Deep Diver', 'First Deep Scan', '🤿', 1, 'deep', 'common'),
    ('quick_five', 'Speed Runner', '5 Quick Scans', '⚡', 5, 'quick', 'common'),
    -- Rare
    ('twenty_five', 'Detective', '25 total scans', '🕵️', 25, 'total', 'rare'),
    ('ten_ai', 'AI Expert', 'Find 10 AI images', '🤖', 10, 'ai', 'rare'),
    ('streak_3', 'On Fire', '3 AI finds in a row', '🔥', 3, 'streak', 'rare'),
    ('deep_ten', 'Deep Analyst', '10 Deep Scans', '🔬', 10, 'deep', 'rare'),
    ('fifty_scans', 'Dedicated', '50 total scans', '💪', 50, 'total', 'rare'),
    -- Epic
    ('hundred_scans', 'Centurion', '100 total scans', '💯', 100, 'total', 'epic'),
    ('fifty_ai', 'AI Hunter', 'Find 50 AI images', '🎖️', 50, 'ai', 'epic'),
    ('streak_5', 'Unstoppable', '5 AI finds in a row', '⚡', 5, 'streak', 'epic'),
    ('deep_fifty', 'Deep Master', '50 Deep Scans', '🧠', 50, 'deep', 'epic'),
    ('forensics_first', 'Forensics Pro', 'First Forensics scan', '🔎', 1, 'forensics', 'epic'),
    -- Legendary
    ('two_fifty', 'Legend', '250 total scans', '⭐', 250, 'total', 'legendary'),
    ('hundred_ai', 'AI Nemesis', 'Find 100 AI images', '👑', 100, 'ai', 'legendary'),
    ('streak_10', 'Perfect 10', '10 AI finds in a row', '🏆', 10, 'streak', 'legendary'),
    ('thousand', 'Grandmaster', '1000 total scans', '🌟', 1000, 'total', 'legendary')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    requirement = EXCLUDED.requirement,
    badge_type = EXCLUDED.badge_type,
    rarity = EXCLUDED.rarity;
