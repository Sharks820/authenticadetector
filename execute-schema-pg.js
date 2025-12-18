const fs = require('fs');
const https = require('https');

console.log('\n🚀 AuthenticaDetector - Supabase Schema Setup\n');
console.log('=' .repeat(60));

// Read schema
const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
console.log(`✓ Schema loaded (${schema.length} characters)\n`);

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk4NzIyNSwiZXhwIjoyMDgxNTYzMjI1fQ.bix9YCLnQPFWxbfeAMjzubKfl6-LcRbtI8KdgRNhBYg';

//Try Management API approach
const PROJECT_REF = 'vrvoyxxdlcpysthzjbeu';

// Split schema into individual statements for better execution
const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 10);

console.log('📊 Attempting to execute via Supabase Management API...\n');

function executeSQL(sql) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ query: sql });

        const options = {
            hostname: `${PROJECT_REF}.supabase.co`,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'Prefer': 'return=minimal'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, status: res.statusCode, body });
                }
            });
        });

        req.on('error', err => reject(err));
        req.write(data);
        req.end();
    });
}

(async () => {
    console.log('⚠️  Note: Supabase REST API does not support raw SQL execution.');
    console.log('The proper way to execute this schema is via:\n');
    console.log('1. Supabase Dashboard SQL Editor (Recommended)');
    console.log('2. Supabase CLI: supabase db push');
    console.log('3. Direct PostgreSQL connection\n');
    console.log('=' .repeat(60));
    console.log('\n🔧 AUTOMATED SOLUTION: Opening Supabase SQL Editor...\n');

    // Encode schema for URL (first 2000 chars to avoid URL length limits)
    const shortSchema = schema.substring(0, 2000);
    const encodedSchema = encodeURIComponent(shortSchema);

    const sqlEditorURL = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;

    console.log('📋 Instructions:');
    console.log('  1. Browser opening to Supabase SQL Editor...');
    console.log('  2. Copy ALL contents from: supabase\\schema.sql');
    console.log('  3. Paste into SQL Editor');
    console.log('  4. Click RUN button\n');
    console.log('=' .repeat(60));

    // Open browser
    const { exec } = require('child_process');
    exec(`start ${sqlEditorURL}`, (err) => {
        if (!err) {
            console.log('✅ Browser opened!');
            console.log('\n💡 After running schema:');
            console.log('  ✓ Login/Signup will work');
            console.log('  ✓ Deep Scan will be unlocked');
            console.log('  ✓ Profile & Stats will sync');
            console.log('  ✓ Badges & Leaderboard activated\n');
            console.log('=' .repeat(60) + '\n');

            // Also copy schema to clipboard if possible
            const clipboardy = `
                $schema = Get-Content "supabase\\schema.sql" -Raw
                Set-Clipboard -Value $schema
                Write-Host "✅ Schema copied to clipboard! Just paste in SQL Editor and click RUN!"
            `;

            exec(`powershell.exe -Command "${clipboardy.replace(/\n/g, '; ')}"`, (err2) => {
                if (!err2) {
                    console.log('✅ BONUS: Schema copied to clipboard!');
                    console.log('   Just paste (Ctrl+V) in SQL Editor and click RUN!\n');
                }
            });
        }
    });
})();
