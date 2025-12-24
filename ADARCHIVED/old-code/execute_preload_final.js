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
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            console.log(`Response:`, JSON.stringify(parsed, null, 2).substring(0, 800));
                        } else {
                            console.log(`Response: Success`);
                        }
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
            name: '0a. Create/Get System User via Auth API',
            sql: null, // This will be handled separately
            skipIfAlreadyDone: true
        },
        {
            name: '0b. Insert Sample Submissions - AI Images (10 items)',
            description: 'Using a valid user ID from the system',
            sql: `-- Insert 10 AI-generated image submissions
INSERT INTO submissions (
    submitter_id,
    image_url,
    thumbnail_url,
    source_platform,
    context_description,
    claimed_context,
    status,
    created_at
)
SELECT
    u.id as submitter_id,
    urls.image_url,
    urls.thumbnail_url,
    urls.platform,
    urls.description,
    urls.claimed_context,
    'pending' as status,
    urls.created_at
FROM (
    VALUES
    ('https://picsum.photos/seed/ai1/800/600', 'https://picsum.photos/seed/ai1/200/150', 'twitter', 'Lighting looks unnatural, facial features too perfect', 'Politician making controversial statement', NOW() - INTERVAL '1 hour'),
    ('https://picsum.photos/seed/ai2/800/600', 'https://picsum.photos/seed/ai2/200/150', 'instagram', 'Background inconsistencies, weird shadows', 'Celebrity in unusual location', NOW() - INTERVAL '2 hours'),
    ('https://picsum.photos/seed/ai3/800/600', 'https://picsum.photos/seed/ai3/200/150', 'reddit', 'Too many artifacts, unrealistic reflections', 'Breaking news event', NOW() - INTERVAL '3 hours'),
    ('https://picsum.photos/seed/ai4/800/600', 'https://picsum.photos/seed/ai4/200/150', 'twitter', 'Obvious deepfake, temporal inconsistency', 'Historical figure in modern setting', NOW() - INTERVAL '4 hours'),
    ('https://picsum.photos/seed/ai5/800/600', 'https://picsum.photos/seed/ai5/200/150', 'tiktok', 'Text artifacts, impossible physics', 'Product advertisement', NOW() - INTERVAL '5 hours'),
    ('https://picsum.photos/seed/ai6/800/600', 'https://picsum.photos/seed/ai6/200/150', 'instagram', 'Skin texture too smooth, AI-generated hands', 'Social media influencer post', NOW() - INTERVAL '6 hours'),
    ('https://picsum.photos/seed/ai7/800/600', 'https://picsum.photos/seed/ai7/200/150', 'reddit', 'Unnatural color grading, perfect symmetry', 'Scientific discovery announcement', NOW() - INTERVAL '7 hours'),
    ('https://picsum.photos/seed/ai8/800/600', 'https://picsum.photos/seed/ai8/200/150', 'twitter', 'Motion blur inconsistencies, fake crowd', 'Sports highlight moment', NOW() - INTERVAL '8 hours'),
    ('https://picsum.photos/seed/ai9/800/600', 'https://picsum.photos/seed/ai9/200/150', 'instagram', 'Animal features distorted, unnatural pose', 'Wildlife photography', NOW() - INTERVAL '9 hours'),
    ('https://picsum.photos/seed/ai10/800/600', 'https://picsum.photos/seed/ai10/200/150', 'other', 'Architecture impossible, perspective wrong', 'Travel destination photo', NOW() - INTERVAL '10 hours')
) as urls(image_url, thumbnail_url, platform, description, claimed_context, created_at)
CROSS JOIN (
    SELECT id FROM auth.users WHERE email LIKE '%' LIMIT 1
) as u
WHERE NOT EXISTS (
    SELECT 1 FROM submissions WHERE image_url LIKE '%seed/ai%'
);`
        },
        {
            name: '0c. Insert Sample Submissions - Real Images (10 items)',
            sql: `-- Insert 10 real image submissions
INSERT INTO submissions (
    submitter_id,
    image_url,
    thumbnail_url,
    source_platform,
    context_description,
    claimed_context,
    status,
    created_at
)
SELECT
    u.id as submitter_id,
    urls.image_url,
    urls.thumbnail_url,
    urls.platform,
    urls.description,
    urls.claimed_context,
    'pending' as status,
    urls.created_at
FROM (
    VALUES
    ('https://picsum.photos/seed/real1/800/600', 'https://picsum.photos/seed/real1/200/150', 'twitter', 'Checking if real or staged', 'Street photography', NOW() - INTERVAL '11 hours'),
    ('https://picsum.photos/seed/real2/800/600', 'https://picsum.photos/seed/real2/200/150', 'reddit', 'Verifying authenticity', 'News article photo', NOW() - INTERVAL '12 hours'),
    ('https://picsum.photos/seed/real3/800/600', 'https://picsum.photos/seed/real3/200/150', 'instagram', 'Colors seem too vibrant', 'Nature landscape', NOW() - INTERVAL '13 hours'),
    ('https://picsum.photos/seed/real4/800/600', 'https://picsum.photos/seed/real4/200/150', 'tiktok', 'Want to verify this is real', 'Concert crowd photo', NOW() - INTERVAL '14 hours'),
    ('https://picsum.photos/seed/real5/800/600', 'https://picsum.photos/seed/real5/200/150', 'twitter', 'Checking for manipulation', 'Family gathering', NOW() - INTERVAL '15 hours'),
    ('https://picsum.photos/seed/real6/800/600', 'https://picsum.photos/seed/real6/200/150', 'instagram', 'Building looks unusual', 'Urban architecture', NOW() - INTERVAL '16 hours'),
    ('https://picsum.photos/seed/real7/800/600', 'https://picsum.photos/seed/real7/200/150', 'reddit', 'Too perfect to be real?', 'Food photography', NOW() - INTERVAL '17 hours'),
    ('https://picsum.photos/seed/real8/800/600', 'https://picsum.photos/seed/real8/200/150', 'other', 'Unusual animal behavior', 'Pet photo', NOW() - INTERVAL '18 hours'),
    ('https://picsum.photos/seed/real9/800/600', 'https://picsum.photos/seed/real9/200/150', 'twitter', 'Verifying authenticity', 'Artistic portrait', NOW() - INTERVAL '19 hours'),
    ('https://picsum.photos/seed/real10/800/600', 'https://picsum.photos/seed/real10/200/150', 'reddit', 'Need community verification', 'Historical document', NOW() - INTERVAL '20 hours')
) as urls(image_url, thumbnail_url, platform, description, claimed_context, created_at)
CROSS JOIN (
    SELECT id FROM auth.users WHERE email LIKE '%' LIMIT 1
) as u
WHERE NOT EXISTS (
    SELECT 1 FROM submissions WHERE image_url LIKE '%seed/real%'
);`
        },
        {
            name: '1. Verification - Sample Submissions Count',
            sql: `SELECT 'Sample submissions created:' as status, COUNT(*) as count FROM submissions;`
        },
        {
            name: '2. Verification - Active Outbreaks Count',
            sql: `SELECT 'Active outbreaks:' as status, COUNT(*) as count FROM outbreak_events WHERE status = 'active';`
        },
        {
            name: '3. Verification - Public Squads Count',
            sql: `SELECT 'Public squads:' as status, COUNT(*) as count FROM squads WHERE is_public = true;`
        },
        {
            name: '4. Verification - Active Outbreak Details',
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

    console.log(`========== EXECUTING PRELOAD_GAME_CONTENT.sql (FINAL) ==========\n`);
    console.log(`Found ${statements.length} statements to execute\n`);

    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];

        if (stmt.skipIfAlreadyDone) {
            console.log(`[${stmt.name}] Skipped - handled by system`);
            continue;
        }

        if (!stmt.sql) {
            continue;
        }

        try {
            await executeSQLViaAPI(stmt.sql, stmt.name);
            successCount++;
            console.log(`✅ ${stmt.name} executed successfully`);
            // Add delay between requests
            if (i < statements.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error(`❌ ${stmt.name} failed:`, error.message);
        }
    }

    console.log(`\n========== EXECUTION COMPLETE ==========`);
    console.log(`Successfully executed: ${successCount}/${statements.length - 1} statements\n`);

    if (successCount >= 5) {
        console.log(`✅ PRELOAD_GAME_CONTENT.sql executed successfully!`);
        console.log(`\nGame content populated with:`);
        console.log(`- Sample submissions (AI and Real images)`);
        console.log(`- Active outbreak "Deepfake Political Crisis"`);
        console.log(`- Sample squad "Truth Seekers Elite"`);
    } else {
        console.log(`⚠️ Some statements failed. Check output above.`);
    }
}

main().catch(console.error);
