#!/usr/bin/env node
/**
 * Split multi-statement SQL files into individual migration files
 * Usage: node split_sql_to_migrations.js <sql_file>
 *
 * This is the workaround for Supabase's migration system which doesn't
 * support multi-statement SQL files.
 */

const fs = require('fs');
const path = require('path');

function splitSQLFile(filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.sql');

    // Split on semicolons (rough split - doesn't handle all edge cases)
    const statements = sql
        .split(/;\s*$/gm)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.match(/^--.*$/) && s !== '');

    console.log(`Found ${statements.length} statements in ${filePath}`);

    // Create migration files
    const timestamp = Date.now();
    statements.forEach((stmt, index) => {
        const migrationName = `${timestamp + index}_${fileName}_part${index + 1}.sql`;
        const migrationPath = path.join('supabase', 'migrations', migrationName);

        fs.writeFileSync(migrationPath, stmt + ';\n');
        console.log(`Created: ${migrationPath}`);
    });

    console.log(`\nNow run: supabase db push --linked`);
}

const sqlFile = process.argv[2];
if (!sqlFile) {
    console.error('Usage: node split_sql_to_migrations.js <sql_file>');
    process.exit(1);
}

splitSQLFile(sqlFile);
