-- Truth Hunters Game Schema
-- Run this AFTER the main schema.sql

-- ==================== SUBMISSIONS ====================
-- User-submitted suspicious images from the wild
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submitter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Image data
    image_url TEXT,
    image_data BYTEA, -- Stored image if uploaded
    thumbnail_url TEXT,

    -- Context
    source_url TEXT, -- Where they found it (Twitter, Instagram, etc.)
    source_platform TEXT, -- twitter, instagram, reddit, tiktok, other
    found_date TIMESTAMPTZ,
    context_description TEXT, -- Why suspicious
    claimed_context TEXT, -- What the image claims to be

    -- Detection results
    ai_score INTEGER, -- Our detector's score
    detection_breakdown JSONB, -- Full breakdown

    -- Community voting
    total_votes INTEGER DEFAULT 0,
    ai_votes INTEGER DEFAULT 0, -- Votes saying it's AI
    real_votes INTEGER DEFAULT 0, -- Votes saying it's real
    consensus_reached BOOLEAN DEFAULT FALSE,
    consensus_result TEXT, -- 'ai' or 'real'
    consensus_confidence FLOAT, -- 0-1

    -- Gamification
    points_awarded INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE, -- Featured in feed
    outbreak_id UUID, -- If part of an outbreak event

    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'voting', 'resolved', 'disputed', 'flagged')),
    resolution_date TIMESTAMPTZ,

    -- Metadata
    tags TEXT[],
    difficulty_rating INTEGER, -- 1-5 how hard to detect

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_submitter ON submissions(submitter_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);
CREATE INDEX idx_submissions_outbreak ON submissions(outbreak_id);
CREATE INDEX idx_submissions_featured ON submissions(featured) WHERE featured = TRUE;

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can view submissions for voting
CREATE POLICY "Submissions viewable by authenticated users"
ON submissions FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users can insert their own submissions
CREATE POLICY "Users can create submissions"
ON submissions FOR INSERT
WITH CHECK (auth.uid() = submitter_id);

-- ==================== VOTES ====================
-- Community votes on submissions
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    vote TEXT NOT NULL CHECK (vote IN ('ai', 'real')),
    confidence INTEGER CHECK (confidence BETWEEN 1 AND 5), -- How confident (1-5)

    -- Accuracy tracking (set after consensus)
    was_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,

    -- Voting context
    time_spent_seconds INTEGER, -- How long they looked at it

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(submission_id, user_id) -- One vote per submission per user
);

CREATE INDEX idx_votes_submission ON votes(submission_id);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_created ON votes(created_at DESC);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Users can view their own votes
CREATE POLICY "Users can view own votes"
ON votes FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own votes
CREATE POLICY "Users can create votes"
ON votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ==================== SQUADS ====================
-- Teams of 5 users
CREATE TABLE IF NOT EXISTS squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    avatar_url TEXT,

    -- Settings
    is_public BOOLEAN DEFAULT TRUE,
    max_members INTEGER DEFAULT 5,
    join_code TEXT UNIQUE, -- Private code to join

    -- Stats
    total_points INTEGER DEFAULT 0,
    total_submissions INTEGER DEFAULT 0,
    total_correct_votes INTEGER DEFAULT 0,
    squad_rank INTEGER,

    -- Weekly challenge
    weekly_goal INTEGER DEFAULT 100, -- Points goal
    weekly_progress INTEGER DEFAULT 0,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_squads_rank ON squads(squad_rank);
CREATE INDEX idx_squads_public ON squads(is_public) WHERE is_public = TRUE;

ALTER TABLE squads ENABLE ROW LEVEL SECURITY;

-- Public squads viewable by everyone
CREATE POLICY "Public squads viewable by all"
ON squads FOR SELECT
USING (is_public = TRUE OR auth.uid() IS NOT NULL);

-- Squad creators can update their squad
CREATE POLICY "Squad creators can update squad"
ON squads FOR UPDATE
USING (auth.uid() = created_by);

-- ==================== SQUAD MEMBERS ====================
CREATE TABLE IF NOT EXISTS squad_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'officer', 'member')),
    weekly_contribution INTEGER DEFAULT 0,

    joined_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(squad_id, user_id)
);

CREATE INDEX idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX idx_squad_members_user ON squad_members(user_id);

ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;

-- Squad members can view their squad
CREATE POLICY "Squad members viewable"
ON squad_members FOR SELECT
USING (TRUE);

-- Users can join squads
CREATE POLICY "Users can join squads"
ON squad_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ==================== OUTBREAK EVENTS ====================
-- Time-limited challenge events every 48 hours
CREATE TABLE IF NOT EXISTS outbreak_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,
    description TEXT NOT NULL,
    theme TEXT, -- e.g., "Political Deepfakes", "Celebrity Fakes", "Product Scams"
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),

    -- Timing
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    duration_hours INTEGER DEFAULT 48,

    -- Goals
    target_submissions INTEGER DEFAULT 50, -- How many submissions needed
    target_votes INTEGER DEFAULT 200, -- How many votes needed

    -- Rewards
    bonus_multiplier FLOAT DEFAULT 1.5, -- Points multiplier during event
    exclusive_badge_id TEXT, -- Exclusive badge for participants

    -- Status
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),

    -- Stats
    total_participants INTEGER DEFAULT 0,
    total_submissions INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outbreak_status ON outbreak_events(status);
CREATE INDEX idx_outbreak_active ON outbreak_events(starts_at, ends_at)
WHERE status = 'active';

ALTER TABLE outbreak_events ENABLE ROW LEVEL SECURITY;

-- Everyone can view outbreak events
CREATE POLICY "Outbreak events viewable by all"
ON outbreak_events FOR SELECT
USING (TRUE);

-- ==================== PROGRESSION ====================
-- User levels and unlocks
CREATE TABLE IF NOT EXISTS user_progression (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Level
    level INTEGER DEFAULT 1 CHECK (level BETWEEN 1 AND 50),
    xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,

    -- Truth Coins (economy)
    truth_coins INTEGER DEFAULT 0,
    lifetime_coins_earned INTEGER DEFAULT 0,

    -- Reputation
    reputation_score INTEGER DEFAULT 100, -- 0-1000
    accuracy_rate FLOAT DEFAULT 0.0, -- % of correct votes

    -- Unlocks
    unlocked_features TEXT[] DEFAULT ARRAY[]::TEXT[], -- Feature IDs unlocked

    -- Activity
    login_streak INTEGER DEFAULT 0,
    last_login_date DATE,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_progression ENABLE ROW LEVEL SECURITY;

-- Users can view their own progression
CREATE POLICY "Users can view own progression"
ON user_progression FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own progression
CREATE POLICY "Users can update own progression"
ON user_progression FOR UPDATE
USING (auth.uid() = user_id);

-- Auto-create progression on user signup
CREATE OR REPLACE FUNCTION handle_new_user_progression()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_progression (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_progression_created ON auth.users;
CREATE TRIGGER on_user_progression_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user_progression();

-- ==================== LEADERBOARDS ====================
-- Global leaderboard view
CREATE OR REPLACE VIEW truth_hunters_leaderboard AS
SELECT
    p.id,
    p.display_name,
    p.avatar_url,
    prog.level,
    prog.xp,
    prog.reputation_score,
    prog.accuracy_rate,
    s.points,
    COUNT(DISTINCT sub.id) as total_submissions,
    COUNT(DISTINCT v.id) as total_votes,
    COUNT(DISTINCT v.id) FILTER (WHERE v.was_correct = TRUE) as correct_votes,
    ROW_NUMBER() OVER (ORDER BY prog.level DESC, prog.xp DESC, prog.reputation_score DESC) as rank
FROM profiles p
JOIN user_progression prog ON p.id = prog.user_id
LEFT JOIN user_stats s ON p.id = s.user_id
LEFT JOIN submissions sub ON p.id = sub.submitter_id
LEFT JOIN votes v ON p.id = v.user_id
GROUP BY p.id, p.display_name, p.avatar_url, prog.level, prog.xp, prog.reputation_score, prog.accuracy_rate, s.points
ORDER BY rank
LIMIT 100;

-- Squad leaderboard view
CREATE OR REPLACE VIEW squad_leaderboard AS
SELECT
    s.id,
    s.name,
    s.avatar_url,
    s.total_points,
    s.total_submissions,
    s.total_correct_votes,
    COUNT(DISTINCT sm.user_id) as member_count,
    s.weekly_progress,
    s.weekly_goal,
    ROW_NUMBER() OVER (ORDER BY s.total_points DESC) as rank
FROM squads s
LEFT JOIN squad_members sm ON s.id = sm.squad_id
GROUP BY s.id, s.name, s.avatar_url, s.total_points, s.total_submissions,
         s.total_correct_votes, s.weekly_progress, s.weekly_goal
ORDER BY rank
LIMIT 100;

-- ==================== FUNCTIONS ====================

-- Update submission consensus
CREATE OR REPLACE FUNCTION update_submission_consensus(submission_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total INTEGER;
    ai_count INTEGER;
    real_count INTEGER;
    consensus TEXT;
    confidence FLOAT;
BEGIN
    -- Count votes
    SELECT COUNT(*),
           COUNT(*) FILTER (WHERE vote = 'ai'),
           COUNT(*) FILTER (WHERE vote = 'real')
    INTO total, ai_count, real_count
    FROM votes
    WHERE submission_id = submission_uuid;

    -- Need at least 10 votes for consensus
    IF total >= 10 THEN
        IF ai_count > real_count THEN
            consensus := 'ai';
            confidence := ai_count::FLOAT / total;
        ELSE
            consensus := 'real';
            confidence := real_count::FLOAT / total;
        END IF;

        -- Require 70% agreement
        IF confidence >= 0.7 THEN
            UPDATE submissions
            SET consensus_reached = TRUE,
                consensus_result = consensus,
                consensus_confidence = confidence,
                status = 'resolved',
                resolution_date = NOW()
            WHERE id = submission_uuid;

            -- Award points to correct voters
            UPDATE votes
            SET was_correct = (vote = consensus),
                points_earned = CASE
                    WHEN vote = consensus THEN 10
                    ELSE 0
                END
            WHERE submission_id = submission_uuid;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update consensus after each vote
CREATE OR REPLACE FUNCTION trigger_consensus_update()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_submission_consensus(NEW.submission_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_vote_update_consensus ON votes;
CREATE TRIGGER after_vote_update_consensus
    AFTER INSERT ON votes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_consensus_update();
