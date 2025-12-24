#!/usr/bin/env node
/**
 * Execute SQL files on Supabase Database
 * Usage: node execute_sql.js <sql_file_path>
 */

const fs = require('fs');
const https = require('https');

// Supabase credentials
const PROJECT_URL = 'https://vrvoyxxdlcpysthzjbeu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydm95eHhkbGNweXN0aHpqYmV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk4NzIyNSwiZXhwIjoyMDgxNTYzMjI1fQ.bix9YCLnQPFWxbfeAMjzubKfl6-LcRbtI8KdgRNhBYg';

// Supabase provides direct Postgres connection via pooler
const DB_HOST = 'aws-0-us-east-1.pooler.supabase.com';
const DB_PORT = 6543;
const DB_NAME = 'postgres';
const DB_USER = 'postgres.vrvoyxxdlcpysthzjbeu';
const DB_PASSWORD = 'TomJam$h4rks!2025'; // This needs to be the actual password

async function executeSQLFile(filePath) {
    try {
        console.log(`[SQL Executor] Reading ${filePath}...`);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`[SQL Executor] File size: ${sql.length} bytes`);
        console.log(`[SQL Executor] Executing SQL via Supabase REST API...`);

        // Split SQL into individual statements (rough split on semicolons not in strings)
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && s !== '');

        console.log(`[SQL Executor] Found ${statements.length} SQL statements to execute`);

        // Execute each statement using fetch to Supabase SQL editor API
        // Note: We'll use a different approach - direct pg connection

        // Since we don't have pg installed, let's use curl with proper escaping
        const tempFile = `/tmp/sql_to_execute_${Date.now()}.sql`;
        fs.writeFileSync(tempFile, sql);

        console.log(`[SQL Executor] Attempting to use PostgreSQL connection...`);
        console.log(`[SQL Executor] This requires the 'pg' npm package or psql`);
        console.log(`[SQL Executor] Falling back to manual method...`);

        console.log('\n========================================');
        console.log('SQL EXECUTION REQUIRED');
        console.log('========================================\n');
        console.log(`Please run the following SQL in Supabase SQL Editor:`);
        console.log(`https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new\n`);
        console.log('--- SQL CONTENT START ---');
        console.log(sql);
        console.log('--- SQL CONTENT END ---\n');

        return false; // Indicates manual execution needed

    } catch (error) {
        console.error(`[SQL Executor] Error: ${error.message}`);
        throw error;
    }
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node execute_sql.js <sql_file_path>');
    process.exit(1);
}

const sqlFile = args[0];
if (!fs.existsSync(sqlFile)) {
    console.error(`File not found: ${sqlFile}`);
    process.exit(1);
}

executeSQLFile(sqlFile)
    .then(success => {
        if (!success) {
            console.log('\n[SQL Executor] Manual execution required - see output above');
            process.exit(2); // Exit code 2 = manual action needed
        } else {
            console.log('[SQL Executor] ✅ SQL executed successfully!');
            process.exit(0);
        }
    })
    .catch(error => {
        console.error('[SQL Executor] ❌ Failed:', error.message);
        process.exit(1);
    });
