const fs = require('fs');
const https = require('https');

const API_KEY = 'sbp_ea5e51a9a6193e36ba0199229ba109553853e483';
const PROJECT_REF = 'vrvoyxxdlcpysthzjbeu';

async function executeSQLViaAPI(sqlContent, description = '') {
    return new Promise((resolve, reject) => {
        const payload = {
            query: sqlContent
        };
        const data = JSON.stringify(payload);

        const options = {
            hostname: 'api.supabase.com',
            port: 443,
            path: `/v1/projects/${PROJECT_REF}/database/query`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => { responseData += chunk; });
            res.on('end', () => {
                console.log(`\n[${description}] Status: ${res.statusCode}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(responseData);
                        console.log(`Response:`, JSON.stringify(parsed, null, 2).substring(0, 500));
                    } catch (e) {
                        console.log(`Response: ${responseData.substring(0, 300)}`);
                    }
                    resolve(true);
                } else {
                    console.log(`Error: ${responseData}`);
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    const statements = [
        {
            name: '1. Insert Sample Submissions - AI Images (10 items)',
            sql: `INSERT INTO submissions (
    submitter_id,
    image_url,
    thumbnail_url,
    source_platform,
    context_description,
    claimed_context,
    status,
    created_at
) VALUES
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai1/800/600', 'https://picsum.photos/seed/ai1/200/150', 'twitter', 'Lighting looks unnatural, facial features too perfect', 'Politician making controversial statement', 'pending', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai2/800/600', 'https://picsum.photos/seed/ai2/200/150', 'instagram', 'Background inconsistencies, weird shadows', 'Celebrity in unusual location', 'pending', NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai3/800/600', 'https://picsum.photos/seed/ai3/200/150', 'reddit', 'Too many artifacts, unrealistic reflections', 'Breaking news event', 'pending', NOW() - INTERVAL '3 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai4/800/600', 'https://picsum.photos/seed/ai4/200/150', 'twitter', 'Obvious deepfake, temporal inconsistency', 'Historical figure in modern setting', 'pending', NOW() - INTERVAL '4 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai5/800/600', 'https://picsum.photos/seed/ai5/200/150', 'tiktok', 'Text artifacts, impossible physics', 'Product advertisement', 'pending', NOW() - INTERVAL '5 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai6/800/600', 'https://picsum.photos/seed/ai6/200/150', 'instagram', 'Skin texture too smooth, AI-generated hands', 'Social media influencer post', 'pending', NOW() - INTERVAL '6 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai7/800/600', 'https://picsum.photos/seed/ai7/200/150', 'reddit', 'Unnatural color grading, perfect symmetry', 'Scientific discovery announcement', 'pending', NOW() - INTERVAL '7 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai8/800/600', 'https://picsum.photos/seed/ai8/200/150', 'twitter', 'Motion blur inconsistencies, fake crowd', 'Sports highlight moment', 'pending', NOW() - INTERVAL '8 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai9/800/600', 'https://picsum.photos/seed/ai9/200/150', 'instagram', 'Animal features distorted, unnatural pose', 'Wildlife photography', 'pending', NOW() - INTERVAL '9 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/ai10/800/600', 'https://picsum.photos/seed/ai10/200/150', 'other', 'Architecture impossible, perspective wrong', 'Travel destination photo', 'pending', NOW() - INTERVAL '10 hours');`
        },
        {
            name: '2. Insert Sample Submissions - Real Images (10 items)',
            sql: `INSERT INTO submissions (
    submitter_id,
    image_url,
    thumbnail_url,
    source_platform,
    context_description,
    claimed_context,
    status,
    created_at
) VALUES
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real1/800/600', 'https://picsum.photos/seed/real1/200/150', 'twitter', 'Checking if real or staged', 'Street photography', 'pending', NOW() - INTERVAL '11 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real2/800/600', 'https://picsum.photos/seed/real2/200/150', 'reddit', 'Verifying authenticity', 'News article photo', 'pending', NOW() - INTERVAL '12 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real3/800/600', 'https://picsum.photos/seed/real3/200/150', 'instagram', 'Colors seem too vibrant', 'Nature landscape', 'pending', NOW() - INTERVAL '13 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real4/800/600', 'https://picsum.photos/seed/real4/200/150', 'tiktok', 'Want to verify this is real', 'Concert crowd photo', 'pending', NOW() - INTERVAL '14 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real5/800/600', 'https://picsum.photos/seed/real5/200/150', 'twitter', 'Checking for manipulation', 'Family gathering', 'pending', NOW() - INTERVAL '15 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real6/800/600', 'https://picsum.photos/seed/real6/200/150', 'instagram', 'Building looks unusual', 'Urban architecture', 'pending', NOW() - INTERVAL '16 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real7/800/600', 'https://picsum.photos/seed/real7/200/150', 'reddit', 'Too perfect to be real?', 'Food photography', 'pending', NOW() - INTERVAL '17 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real8/800/600', 'https://picsum.photos/seed/real8/200/150', 'other', 'Unusual animal behavior', 'Pet photo', 'pending', NOW() - INTERVAL '18 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real9/800/600', 'https://picsum.photos/seed/real9/200/150', 'twitter', 'Verifying authenticity', 'Artistic portrait', 'pending', NOW() - INTERVAL '19 hours'),
('00000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/real10/800/600', 'https://picsum.photos/seed/real10/200/150', 'reddit', 'Need community verification', 'Historical document', 'pending', NOW() - INTERVAL '20 hours');`
        },
        {
            name: '3. Create Active Outbreak Event',
            sql: `INSERT INTO outbreak_events (
    title,
    description,
    theme,
    difficulty,
    bonus_multiplier,
    starts_at,
    ends_at,
    status,
    target_submissions,
    created_at
) VALUES (
    'Deepfake Political Crisis',
    'A massive surge of AI-generated political deepfakes has flooded social media. Help identify and stop the spread of misinformation before it influences public opinion!',
    'Political Deepfakes',
    5,
    2.0,
    NOW() - INTERVAL '6 hours',
    NOW() + INTERVAL '42 hours',
    'active',
    100,
    NOW() - INTERVAL '6 hours'
) ON CONFLICT DO NOTHING;`
        },
        {
            name: '4. Create Sample Squad',
            sql: `INSERT INTO squads (
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
) ON CONFLICT (name) DO NOTHING;`
        },
        {
            name: '5. Verification - Sample Submissions Count',
            sql: `SELECT 'Sample submissions created:' as status, COUNT(*) as count FROM submissions WHERE submitter_id = '00000000-0000-0000-0000-000000000001';`
        },
        {
            name: '6. Verification - Active Outbreaks Count',
            sql: `SELECT 'Active outbreaks:' as status, COUNT(*) as count FROM outbreak_events WHERE status = 'active';`
        },
        {
            name: '7. Verification - Public Squads Count',
            sql: `SELECT 'Public squads:' as status, COUNT(*) as count FROM squads WHERE is_public = true;`
        },
        {
            name: '8. Verification - Active Outbreak Details',
            sql: `SELECT
    title,
    description,
    theme,
    difficulty,
    bonus_multiplier,
    TO_CHAR(ends_at - NOW(), 'HH24h MIm') as time_remaining,
    status
FROM outbreak_events
WHERE status = 'active'
ORDER BY ends_at DESC
LIMIT 1;`
        }
    ];

    console.log(`========== EXECUTING PRELOAD_GAME_CONTENT.sql (CORRECTED) ==========\n`);
    console.log(`Found ${statements.length} statements to execute\n`);

    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        try {
            await executeSQLViaAPI(stmt.sql, stmt.name);
            successCount++;
            console.log(`✅ ${stmt.name} executed successfully`);
            // Add delay between requests
            if (i < statements.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        } catch (error) {
            console.error(`❌ ${stmt.name} failed:`, error.message);
        }
    }

    console.log(`\n========== EXECUTION COMPLETE ==========`);
    console.log(`Successfully executed: ${successCount}/${statements.length} statements\n`);

    if (successCount === statements.length) {
        console.log(`✅ PRELOAD_GAME_CONTENT.sql executed successfully!`);
        console.log(`\nGame content populated with:`);
        console.log(`- 20 sample submissions`);
        console.log(`- Active outbreak "Deepfake Political Crisis"`);
        console.log(`- Sample squad "Truth Seekers Elite"`);
    } else {
        console.log(`⚠️ Some statements failed. Check output above.`);
    }
}

main().catch(console.error);
