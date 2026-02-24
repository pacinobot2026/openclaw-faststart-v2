# Course Sprout Replay Workflow

**MEMORIZED: Do ALL steps automatically when Chad says "grab a replay"**

## Trigger
Chad gives Vimeo URL + course/chapter location

## Process (Do ALL Steps - NO SKIPPING)

### Step 1: Get Video Info from Vimeo
```powershell
$headers = @{ "Authorization" = "Bearer eb92fbe6d5c5b83445569d900b7917c9" }
Invoke-RestMethod -Uri "https://api.vimeo.com/videos/{VIDEO_ID}" -Headers $headers
```

### Step 2: Get Transcript from Vimeo
```powershell
$headers = @{ "Authorization" = "Bearer eb92fbe6d5c5b83445569d900b7917c9" }
$tracks = Invoke-RestMethod -Uri "https://api.vimeo.com/videos/{VIDEO_ID}/texttracks" -Headers $headers
# Get the VTT file URL and download it
```

### Step 3: Create the Lesson
```powershell
$body = @{
    name = "[Video Title]"
    course_id = [COURSE_ID]
    course_chapter_id = [CHAPTER_ID]
    video_name = "[Video Title]"
    video_url = "https://vimeo.com/[VIDEO_ID]"
    video_tags = @("[course-tag]")
} | ConvertTo-Json
```

### Step 4: Generate Short Description
From transcript, create a 1-2 sentence summary:
"In this replay, you'll learn [main topic from transcript]..."

### Step 5: Generate Long Description
From transcript, create detailed description with:
- What was covered
- Key takeaways
- NO EMOJIS (causes 422 error!)

### Step 6: Create Goal Block
```powershell
$body = @{
    name = "[Goal Name]"
    course_id = [COURSE_ID]
    lesson_id = [LESSON_ID]
    type = "points"
    points = 10
    description = "[Goal block HTML - see framework]"
    is_add_to_comment = 1
    is_user_input_field = 1
} | ConvertTo-Json
```

**Goal Block Framework:**
1. **"Here's the deal"** — Reinforce the big breakthrough from the replay
2. **"Your one thing"** — ONE simple action
3. **"Drop a comment below"** — Engagement prompt
4. **Reinforcement questions** — Must MATCH actual content!

## Key IDs

### OpenClaw Shadow Intensive
- **Course ID:** 340
- **Shadow Replays Chapter ID:** 958

## NEVER SKIP STEPS
- ❌ Don't just create lesson and stop
- ✅ Transcript → Lesson → Short desc → Long desc → Goal block
- ✅ ALL FIVE OUTPUTS every time

---
*Created: 2026-02-12 after Chad reminded me I forgot*
