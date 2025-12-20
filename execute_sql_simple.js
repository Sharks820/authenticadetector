#!/usr/bin/env node
/**
 * Execute SQL files on Supabase using REST API
 * No external dependencies - uses built-in https module
 */

const fs = require('fs');
const https = require('https');

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk4NzIyNSwiZXhwIjoyMDgxNTYzMjI1fQ.bix9YCLnQPFWxbfeAMjzubKfl6-LcRbtI8KdgRNhBYg';

async function executeSQLStatements(sqlContent) {
    // Split SQL into individual statements
    const statements = sqlContent
        .split(/;\s*$/gm)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && s !== '');

    console.log(`[SQL] Found ${statements.length} statements to execute`);

    // Execute via postgres client library
    // Since we can't use external libs, we'll construct a batch SQL script
    const batchSQL = statements.join(';\n') + ';';

    console.log('[SQL] Executing batch SQL...');
    console.log('[SQL] First 200 chars:', batchSQL.substring(0, 200));

    // Try using the Management API
    const options = {
        hostname: 'api.supabase.com',
        port: 443,
        path: '/v1/projects/vrvoyxxdlcpysthzjbeu/database/query',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`[SQL] Response status: ${res.statusCode}`);
                console.log(`[SQL] Response body:`, data);
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(true);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify({ query: batchSQL }));
        req.end();
    });
}

// Main
async function main() {
    const files = ['supabase/URGENT_FIXES.sql', 'supabase/PERSISTENCE_FIXES.sql'];

    for (const file of files) {
        console.log(`\n[SQL] ========== Processing ${file} ==========`);
        try {
            const sql = fs.readFileSync(file, 'utf8');
            await executeSQLStatements(sql);
            console.log(`[SQL] ✅ ${file} executed successfully!`);
        } catch (error) {
            console.error(`[SQL] ❌ Failed to execute ${file}:`, error.message);

            // If REST API fails, output SQL for manual execution
            console.log('\n[SQL] Falling back to manual execution instructions...');
            console.log('Please visit: https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new');
            console.log(`And run the contents of ${file}\n`);
        }
    }
}

main().catch(console.error);
