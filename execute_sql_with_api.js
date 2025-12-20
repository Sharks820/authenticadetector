const fs = require('fs');
const https = require('https');

const API_KEY = 'sbp_ea5e51a9a6193e36ba0199229ba109553853e483';
const PROJECT_REF = 'vrvoyxxdlcpysthzjbeu';

async function executeSQLViaAPI(sqlContent) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ query: sqlContent });

        const options = {
            hostname: 'api.supabase.com',
            port: 443,
            path: `/v1/projects/${PROJECT_REF}/database/query`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => { responseData += chunk; });
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                console.log(`Response: ${responseData}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(true);
                } else {
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
    const files = ['supabase/URGENT_FIXES.sql', 'supabase/PERSISTENCE_FIXES.sql'];

    for (const file of files) {
        console.log(`\n========== Executing ${file} ==========`);
        const sql = fs.readFileSync(file, 'utf8');
        try {
            await executeSQLViaAPI(sql);
            console.log(`✅ ${file} executed successfully!`);
        } catch (error) {
            console.error(`❌ ${file} failed:`, error.message);
        }
    }
}

main().catch(console.error);
