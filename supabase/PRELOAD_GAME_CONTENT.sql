-- ==================== TRUTH HUNTERS GAME - PRELOAD CONTENT ====================
-- Run this in Supabase SQL Editor to populate the game with sample content
-- This makes the game immediately playable without waiting for user submissions

-- ==================== 1. CREATE SAMPLE USER FOR SUBMISSIONS ====================
-- Create a "System" user for sample submissions
DO $$
DECLARE
    system_user_id uuid;
BEGIN
    -- Check if system user already exists
    SELECT id INTO system_user_id
    FROM auth.users
    WHERE email = 'system@authenticadetector.com'
    LIMIT 1;

    -- If not, create sample profile entries
    -- Note: We can't create auth users via SQL, so we'll use existing user IDs
    -- or create profiles without auth users for sample data

    -- For now, use a fixed UUID for system submissions
    system_user_id := '00000000-0000-0000-0000-000000000001';

    -- Insert system profile if doesn't exist
    INSERT INTO profiles (id, email, display_name, avatar_url, created_at, updated_at)
    VALUES (
        system_user_id,
        'system@authenticadetector.com',
        'Truth Hunters System',
        NULL,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert system user stats
    INSERT INTO user_stats (user_id, total, deep, quick, ai, real, uncertain, updated_at)
    VALUES (system_user_id, 0, 0, 0, 0, 0, 0, NOW())
    ON CONFLICT (user_id) DO NOTHING;

    -- Insert system user progression
    INSERT INTO user_progression (user_id, level, xp, truth_coins, updated_at)
    VALUES (system_user_id, 1, 0, 0, NOW())
    ON CONFLICT (user_id) DO NOTHING;
END $$;

-- ==================== 2. INSERT SAMPLE SUBMISSIONS ====================
-- Insert 20 diverse sample submissions for users to vote on

INSERT INTO submissions (
    user_id,
    image_url,
    thumbnail_url,
    media_type,
    claim,
    suspicion_reason,
    status,
    consensus,
    vote_count,
    created_at
) VALUES
-- AI Generated Images (10)
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai1/800/600', 'https://picsum.photos/seed/ai1/200/150', 'image', 'Politician making controversial statement', 'Lighting looks unnatural, facial features too perfect', 'pending', NULL, 0, NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai2/800/600', 'https://picsum.photos/seed/ai2/200/150', 'image', 'Celebrity in unusual location', 'Background inconsistencies, weird shadows', 'pending', NULL, 0, NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai3/800/600', 'https://picsum.photos/seed/ai3/200/150', 'image', 'Breaking news event', 'Too many artifacts, unrealistic reflections', 'pending', NULL, 0, NOW() - INTERVAL '3 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai4/800/600', 'https://picsum.photos/seed/ai4/200/150', 'image', 'Historical figure in modern setting', 'Obvious deepfake, temporal inconsistency', 'pending', NULL, 0, NOW() - INTERVAL '4 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai5/800/600', 'https://picsum.photos/seed/ai5/200/150', 'image', 'Product advertisement', 'Text artifacts, impossible physics', 'pending', NULL, 0, NOW() - INTERVAL '5 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai6/800/600', 'https://picsum.photos/seed/ai6/200/150', 'image', 'Social media influencer post', 'Skin texture too smooth, AI-generated hands', 'pending', NULL, 0, NOW() - INTERVAL '6 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai7/800/600', 'https://picsum.photos/seed/ai7/200/150', 'image', 'Scientific discovery announcement', 'Unnatural color grading, perfect symmetry', 'pending', NULL, 0, NOW() - INTERVAL '7 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai8/800/600', 'https://picsum.photos/seed/ai8/200/150', 'image', 'Sports highlight moment', 'Motion blur inconsistencies, fake crowd', 'pending', NULL, 0, NOW() - INTERVAL '8 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai9/800/600', 'https://picsum.photos/seed/ai9/200/150', 'image', 'Wildlife photography', 'Animal features distorted, unnatural pose', 'pending', NULL, 0, NOW() - INTERVAL '9 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai10/800/600', 'https://picsum.photos/seed/ai10/200/150', 'image', 'Travel destination photo', 'Architecture impossible, perspective wrong', 'pending', NULL, 0, NOW() - INTERVAL '10 hours'),

-- Real Images (10)
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real1/800/600', 'https://picsum.photos/seed/real1/200/150', 'image', 'Street photography', 'Checking if real or staged', 'pending', NULL, 0, NOW() - INTERVAL '11 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real2/800/600', 'https://picsum.photos/seed/real2/200/150', 'image', 'News article photo', 'Verifying authenticity', 'pending', NULL, 0, NOW() - INTERVAL '12 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real3/800/600', 'https://picsum.photos/seed/real3/200/150', 'image', 'Nature landscape', 'Colors seem too vibrant', 'pending', NULL, 0, NOW() - INTERVAL '13 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real4/800/600', 'https://picsum.photos/seed/real4/200/150', 'image', 'Concert crowd photo', 'Want to verify this is real', 'pending', NULL, 0, NOW() - INTERVAL '14 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real5/800/600', 'https://picsum.photos/seed/real5/200/150', 'image', 'Family gathering', 'Checking for manipulation', 'pending', NULL, 0, NOW() - INTERVAL '15 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real6/800/600', 'https://picsum.photos/seed/real6/200/150', 'image', 'Urban architecture', 'Building looks unusual', 'pending', NULL, 0, NOW() - INTERVAL '16 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real7/800/600', 'https://picsum.photos/seed/real7/200/150', 'image', 'Food photography', 'Too perfect to be real?', 'pending', NULL, 0, NOW() - INTERVAL '17 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real8/800/600', 'https://picsum.photos/seed/real8/200/150', 'image', 'Pet photo', 'Unusual animal behavior', 'pending', NULL, 0, NOW() - INTERVAL '18 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real9/800/600', 'https://picsum.photos/seed/real9/200/150', 'image', 'Artistic portrait', 'Verifying authenticity', 'pending', NULL, 0, NOW() - INTERVAL '19 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real10/800/600', 'https://picsum.photos/seed/real10/200/150', 'image', 'Historical document', 'Need community verification', 'pending', NULL, 0, NOW() - INTERVAL '20 hours');

-- ==================== 3. CREATE ACTIVE OUTBREAK EVENT ====================
-- Create a 48-hour outbreak event that's active NOW

INSERT INTO outbreak_events (
    title,
    description,
    category,
    difficulty,
    points_multiplier,
    starts_at,
    ends_at,
    status,
    target_submissions,
    created_at
) VALUES (
    'Deepfake Political Crisis',
    'A massive surge of AI-generated political deepfakes has flooded social media. Help identify and stop the spread of misinformation before it influences public opinion!',
    'political',
    'hard',
    2.0,
    NOW() - INTERVAL '6 hours',  -- Started 6 hours ago
    NOW() + INTERVAL '42 hours', -- Ends in 42 hours (48hr total)
    'active',
    100,
    NOW() - INTERVAL '6 hours'
) ON CONFLICT DO NOTHING;

-- ==================== 4. CREATE SAMPLE SQUAD ====================
-- Create a sample squad for users to see and join

INSERT INTO squads (
    name,
    description,
    is_public,
    max_members,
    created_at
) VALUES (
    'Truth Seekers Elite',
    'Top-tier AI hunters dedicated to protecting digital authenticity. Join us in the fight against misinformation!',
    true,
    5,
    NOW() - INTERVAL '7 days'
) ON CONFLICT DO NOTHING;

-- ==================== VERIFICATION ====================
-- Check what was created

SELECT 'Sample submissions created:' as status, COUNT(*) as count FROM submissions WHERE user_id = '00000000-0000-0000-0000-000000000001';
SELECT 'Active outbreaks:' as status, COUNT(*) as count FROM outbreak_events WHERE status = 'active';
SELECT 'Public squads:' as status, COUNT(*) as count FROM squads WHERE is_public = true;

-- Show active outbreak details
SELECT
    title,
    description,
    difficulty,
    points_multiplier,
    TO_CHAR(ends_at - NOW(), 'HH24h MIm') as time_remaining,
    status
FROM outbreak_events
WHERE status = 'active'
ORDER BY ends_at DESC
LIMIT 1;

SELECT '✅ Game content preloaded successfully!' as message;
