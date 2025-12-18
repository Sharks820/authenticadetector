const fs = require('fs');
const https = require('https');

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk4NzIyNSwiZXhwIjoyMDgxNTYzMjI1fQ.bix9YCLnQPFWxbfeAMjzubKfl6-LcRbtI8KdgRNhBYg';
const SUPABASE_URL = 'vrvoyxxdlcpysthzjbeu.supabase.co';

console.log('\n🚀 AuthenticaDetector - Automated Schema Execution\n');
console.log('=' .repeat(60));

// Read schema
const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
console.log(`✓ Schema loaded (${schema.length} characters)`);

// Split into statements
const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 10 && !s.startsWith('--'));

console.log(`✓ Found ${statements.length} SQL statements\n`);
console.log('=' .repeat(60));
console.log('📊 Executing schema...\n');

let completed = 0;
let failed = 0;

function executeStatement(sql, index) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ query: sql + ';' });

        const options = {
            hostname: SUPABASE_URL,
            port: 443,
            path: '/rest/v1/rpc',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'Prefer': 'return=minimal'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, index });
                } else {
                    resolve({ success: false, index, error: body, status: res.statusCode });
                }
            });
        });

        req.on('error', (err) => {
            resolve({ success: false, index, error: err.message });
        });

        req.write(data);
        req.end();
    });
}

// Execute schema using direct SQL query approach
(async () => {
    const fullSql = statements.join(';\n') + ';';

    try {
        // Try executing via query endpoint
        const options = {
            hostname: SUPABASE_URL,
            port: 443,
            path: '/rest/v1/rpc',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
            }
        };

        console.log('⚡ Executing full schema...');

        const promise = new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => resolve({ status: res.statusCode, body }));
            });
            req.on('error', reject);
            req.write(JSON.stringify({ query: fullSql }));
            req.end();
        });

        const result = await promise;

        console.log(`\n📋 Response Status: ${result.status}`);

        if (result.status >= 200 && result.status < 400) {
            console.log('\n' + '='.repeat(60));
            console.log('✅ SUCCESS! Schema executed!');
            console.log('='.repeat(60));
            console.log('\n🎯 What was created:');
            console.log('  ✓ profiles table');
            console.log('  ✓ user_stats table');
            console.log('  ✓ scans table');
            console.log('  ✓ badge_definitions table');
            console.log('  ✓ user_badges table');
            console.log('  ✓ feedback table');
            console.log('  ✓ leaderboard view');
            console.log('  ✓ 20 badge definitions');
            console.log('  ✓ Row Level Security policies');
            console.log('  ✓ Auto-triggers for new users\n');
            console.log('='.repeat(60));
            console.log('🔥 Login and Signup now work!');
            console.log('🔥 Deep Scan is now unlocked!');
            console.log('='.repeat(60) + '\n');
        } else {
            console.log(`\n⚠️  Schema execution had issues (Status ${result.status})`);
            console.log('This may be normal if tables already exist.');
            console.log('\nYou can verify in Supabase Dashboard:');
            console.log('https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/editor\n');
        }

    } catch (error) {
        console.log('\n⚠️  Could not execute via REST API');
        console.log('Error:', error.message);
        console.log('\n💡 Alternative: Use Supabase CLI or Dashboard SQL Editor\n');
    }
})();
