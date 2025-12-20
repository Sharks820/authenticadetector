import pg from 'pg';
import { readFileSync } from 'fs';

const client = new pg.Client({
    connectionString: 'postgresql://postgres.vrvoyxxdlcpysthzjbeu:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
});

async function run() {
    await client.connect();
    
    const files = ['supabase/URGENT_FIXES.sql', 'supabase/PERSISTENCE_FIXES.sql'];
    for (const file of files) {
        console.log(`Executing ${file}...`);
        const sql = readFileSync(file, 'utf8');
        try {
            await client.query(sql);
            console.log(`✅ ${file} executed`);
        } catch (err) {
            console.error(`❌ ${file} failed:`, err.message);
        }
    }
    
    await client.end();
}

run().catch(console.error);
