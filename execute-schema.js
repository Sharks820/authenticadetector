// Execute Supabase Schema
const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://vrvoyxxdlcpysthzjbeu.supabase.co';
const SUPABASE_PROJECT_ID = 'vrvoyxxdlcpysthzjbeu';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2Mzk4NDcsImV4cCI6MjA1MjIxNTg0N30.K5B-RqWyxEwSZCmPQhPKGmN16cMtJdaU3TzqJ6G-SB8';

console.log('🔧 AuthenticaDetector - Schema Executor\n');

// Read schema file
const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
console.log(`✓ Schema loaded (${schema.length} characters)\n`);

// Split schema into individual statements
const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements to execute\n`);

// Function to execute SQL via Supabase REST API
async function executeSQL(sql) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ query: sql });

        const options = {
            hostname: SUPABASE_PROJECT_ID + '.supabase.co',
            port: 443,
            path: '/rest/v1/rpc',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(body);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Try to execute schema
(async () => {
    console.log('🚀 Attempting to execute schema...\n');

    try {
        // Try to execute full schema at once
        await executeSQL(schema);
        console.log('✅ Schema executed successfully!');
    } catch (error) {
        console.log('⚠️  Automated execution requires service_role key.');
        console.log('    Anon key has insufficient permissions.\n');

        console.log('📋 ALTERNATIVE: Manual Execution Required');
        console.log('=' .repeat(50));
        console.log('1. Go to: https://supabase.com/dashboard/project/' + SUPABASE_PROJECT_ID + '/sql/new');
        console.log('2. Copy contents of: supabase\\schema.sql');
        console.log('3. Paste into SQL Editor');
        console.log('4. Click "Run" button');
        console.log('=' .repeat(50));
        console.log('\n⚠️  Opening browser to SQL Editor...\n');

        // Open browser
        const { exec } = require('child_process');
        exec(`start https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`);

        console.log('✓ Browser opened!');
        console.log('\nAfter running the schema, login/signup will work! ✨');
    }
})();
