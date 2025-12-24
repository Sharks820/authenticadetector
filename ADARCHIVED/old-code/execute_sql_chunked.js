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
                console.log(`Status: ${res.statusCode} ${description}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`Response: ${responseData.substring(0, 200)}...`);
                    resolve(true);
                } else {
                    console.log(`Error Response: ${responseData}`);
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
    // Read the preload SQL file
    const preloadSQL = fs.readFileSync('supabase/PRELOAD_GAME_CONTENT.sql', 'utf8');

    // Split by semicolons and filter out empty statements and comments
    const statements = preloadSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        try {
            await executeSQLViaAPI(stmt + ';', `[${i + 1}/${statements.length}]`);
            successCount++;
            console.log(`✅ Statement ${i + 1} executed\n`);
            // Add delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`❌ Statement ${i + 1} failed:`, error.message);
            console.error(`Statement: ${stmt.substring(0, 100)}...\n`);
        }
    }

    console.log(`\n========== EXECUTION COMPLETE ==========`);
    console.log(`Successfully executed: ${successCount}/${statements.length} statements`);

    if (successCount === statements.length) {
        console.log(`\n✅ PRELOAD_GAME_CONTENT.sql executed successfully!`);
    } else {
        console.log(`\n⚠️ Some statements failed. Check output above.`);
    }
}

main().catch(console.error);
