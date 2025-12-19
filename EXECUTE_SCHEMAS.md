# Execute Database Schemas

## Instructions:

1. **Go to Supabase SQL Editor**: https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new

2. **Run Main Schema** (copy and paste the entire schema.sql file):
   - File location: `C:\Users\Conner\Downloads\files_extracted\supabase\schema.sql`
   - Click "RUN" in the SQL Editor

3. **Run Truth Hunters Schema** (copy and paste the entire truth_hunters_schema.sql file):
   - File location: `C:\Users\Conner\Downloads\files_extracted\supabase\truth_hunters_schema.sql`
   - Click "RUN" in the SQL Editor

## Both schemas are ready in your files!

**Main Schema** creates:
- profiles table
- user_stats table
- scans table (private)
- badge_definitions table
- user_badges table
- feedback table
- leaderboard view
- Auto-create profile trigger
- 20 badge definitions

**Truth Hunters Schema** creates:
- submissions table (user-submitted suspicious images)
- votes table (community voting)
- squads table (5-person teams)
- squad_members table
- outbreak_events table (48hr challenges)
- user_progression table (levels, XP, coins)
- truth_hunters_leaderboard view
- squad_leaderboard view
- Consensus calculation trigger

## Quick Links:
- **Supabase SQL Editor**: https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/editor
