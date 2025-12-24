#!/usr/bin/env node
/**
 * Execute SQL on Supabase using pg library
 * This will be run via npx pg to avoid permanent installation
 */

import { readFileSync } from 'fs';
import pg from 'pg';

const { Client } = pg;

// Supabase connection config
const client = new Client({
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.vrvoyxxdlcpysthzjbeu',
    password: process.env.SUPABASE_DB_PASSWORD || 'YOUR_DB_PASSWORD_HERE',
    ssl: { rejectUnauthorized: false }
});

async function executeSQLFile(filePath) {
    try {
        console.log(`[SQL] Connecting to Supabase...`);
        await client.connect();
        console.log(`[SQL] ✅ Connected!`);

        console.log(`[SQL] Reading ${filePath}...`);
        const sql = readFileSync(filePath, 'utf8');

        console.log(`[SQL] Executing ${filePath.split('/').pop()}...`);
        const result = await client.query(sql);

        console.log(`[SQL] ✅ Success!`);
        if (result.rows && result.rows.length > 0) {
            console.log(`[SQL] Result:`, result.rows);
        }

        return true;

    } catch (error) {
        console.error(`[SQL] ❌ Error:`, error.message);
        console.error(`[SQL] Details:`, error);
        return false;
    } finally {
        await client.end();
        console.log(`[SQL] Disconnected`);
    }
}

// Main
const sqlFile = process.argv[2];
if (!sqlFile) {
    console.error('Usage: node run_sql.mjs <sql_file_path>');
    process.exit(1);
}

executeSQLFile(sqlFile)
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
