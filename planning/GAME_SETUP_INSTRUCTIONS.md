# Truth Hunters Game Setup Instructions

## Critical: Run These SQL Files in Order

The game requires database content to function. Follow these steps:

### Step 1: Run URGENT_FIXES.sql (If not already done)
**File:** `supabase/URGENT_FIXES.sql`
**URL:** https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new

This fixes permissions and table structure.

### Step 2: Preload Game Content (NEW - DO THIS NOW!)
**File:** `supabase/PRELOAD_GAME_CONTENT.sql`
**URL:** https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new

**What it does:**
- Creates 20 sample submissions for users to vote on (10 AI, 10 real)
- Creates an active 48-hour "Deepfake Political Crisis" outbreak
- Creates a sample squad "Truth Seekers Elite"
- Populates the game so it's immediately playable

**Time:** 30 seconds

**Result:** Game will have content to interact with immediately!

---

## What This Fixes

### Before Running SQL:
- ❌ Verify Mode shows "No submissions to verify"
- ❌ Outbreak Mode shows nothing
- ❌ Squads list is empty
- ❌ Game feels dead

### After Running SQL:
- ✅ Verify Mode has 20 cards to swipe through
- ✅ Outbreak Mode shows active "Deepfake Political Crisis" with countdown
- ✅ Squads shows "Truth Seekers Elite" available to join
- ✅ Game feels alive and playable

---

## Sample Content Details

### 20 Sample Submissions:
- 10 AI-generated images with suspicious claims
- 10 Real images for verification
- All with realistic claims and suspicion reasons
- Uses Lorem Picsum for placeholder images

### Active Outbreak:
- **Title:** Deepfake Political Crisis
- **Duration:** 48 hours (42 hours remaining when created)
- **Difficulty:** Hard (🔥🔥🔥)
- **Points:** 2x multiplier
- **Description:** "A massive surge of AI-generated political deepfakes has flooded social media..."

### Sample Squad:
- **Name:** Truth Seekers Elite
- **Members:** 0/5 (public, anyone can join)
- **Description:** "Top-tier AI hunters dedicated to protecting digital authenticity..."

---

## Quick Links

- **Supabase SQL Editor:** https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu/editor
- **Live Site:** https://authenticadetector-v7.pages.dev

---

## Testing After Setup

1. Go to https://authenticadetector-v7.pages.dev
2. Sign in (if not already)
3. Open the main menu or click "Play Truth Hunters"
4. **Hunt Mode:** You should see the active outbreak banner at the top
5. **Verify Mode:** Swipe through 20 sample submissions
6. **Outbreaks:** See the "Deepfake Political Crisis" with timer
7. **Squads:** See "Truth Seekers Elite" available to join

---

## Notes

- Sample submissions use Lorem Picsum placeholder images
- System user ID: `00000000-0000-0000-0000-000000000001`
- Outbreak runs for 48 hours from when you execute the SQL
- You can run the SQL multiple times safely (uses ON CONFLICT)
- Real users can submit their own content which will mix with samples

---

## What's Next

After the game has content:
1. Test all game modes work properly
2. Verify navigation between modes is smooth
3. Check that coins and XP are awarded correctly
4. Test voting and consensus system
5. Join the sample squad and test team features
