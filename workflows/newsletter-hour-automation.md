# Newsletter Hour Automation Workflow

**Purpose:** Automate the entire Newsletter Hour weekly call process from recording → transcript → recap → Course Sprout lesson

**Schedule:** Every Monday, 10 AM - 12 PM PST

---

## 🎯 What This Automates

### Current Manual Process:
1. Record Zoom call to Vimeo
2. Wait for Vimeo processing
3. Download transcript manually
4. Write recap from transcript
5. Create Course Sprout lesson
6. Add video URL + transcript
7. Write descriptions + goal block

### New Automated Process:
1. ✅ Cron job runs Monday 2 PM (2 hours after call ends)
2. ✅ Auto-search Vimeo for latest "Newsletter Hour" recording
3. ✅ Check if video is public (remind Chad if not)
4. ✅ Download transcript via Vimeo API
5. ✅ Generate recap with AI (key topics, highlights, action items)
6. ✅ Create Course Sprout lesson automatically
7. ✅ Notify Chad for review

---

## 📋 Implementation Steps

### 1. Vimeo Search & Transcript Extraction

**Skill:** vimeo-transcript (already exists!)
**Location:** `skills/vimeo-transcript/`

**Usage:**
```bash
node main.js <vimeo-url>
```

**What it does:**
- Fetches video metadata
- Downloads VTT transcript
- Converts to clean text
- Saves to `transcripts/vimeo/`

### 2. AI Recap Generation

**Create new script:** `scripts/generate-newsletter-recap.js`

**Input:** Transcript text file
**Output:** Markdown recap with:
- 🎙️ **The Big News** - Main announcements
- 📌 **Key Topics** - What was covered
- ⭐ **Highlights** - Memorable moments, quotes
- 👥 **Shoutouts** - Names mentioned
- ✅ **Action Items** - What to do next
- 💬 **Quotable Quote** - One standout line

### 3. Course Sprout Integration

**Use existing skill:** coursesprout
**API endpoint:** `POST /courses/{courseId}/chapters/{chapterId}/lessons`

**Auto-populate:**
- Title: "Newsletter Hour [DATE]"
- Video URL: Vimeo share link
- Short description: (from recap summary)
- Long description: (full recap content)
- Goal block: (AI-generated from transcript)

### 4. Cron Job Setup

**When:** Every Monday, 2:00 PM PT
**Cron expression:** `0 14 * * 1` (weekly Monday at 2 PM)

**Task chain:**
1. Search Vimeo for latest recording (created in last 24 hours)
2. Check privacy = "anybody" (public)
3. If private → notify Chad to make public
4. Download transcript
5. Generate recap
6. Create Course Sprout lesson (DRAFT status)
7. Notify Chad: "Newsletter Hour recap ready for review"

---

## 🔑 Configuration

### Vimeo API
- User ID: 41953625
- Folder: "Zoom Recordings"
- Search pattern: `Local Newsletter Hour YYYY-MM-DD`

### Course Sprout
- Course ID: 340 (OpenClaw Shadow Intensive)
- Chapter ID: 958 (Replays)

### Credentials
- Vimeo token: `credentials/vimeo-access-token.txt`
- Course Sprout API: `credentials/titanium-api-keys.txt`

---

## 📁 File Structure

```
workflows/
  newsletter-hour-automation.md         (this file)

scripts/
  newsletter-hour-automation.js          (main automation script)
  generate-newsletter-recap.js           (AI recap generator)

transcripts/vimeo/
  newsletter-hour-YYYY-MM-DD.txt        (auto-saved)

recaps/
  newsletter-hour-YYYY-MM-DD.md         (auto-generated)
```

---

## 🚀 Usage

### Manual Run (Test):
```bash
node scripts/newsletter-hour-automation.js --date 2026-02-24
```

### Automated Run:
Cron job runs automatically every Monday at 2 PM PT

### Check Status:
```bash
# View automation log
cat logs/newsletter-hour-automation.log

# Check last run
node scripts/newsletter-hour-automation.js --status
```

---

## ⚠️ Error Handling

### Video Not Found
- Check Vimeo folder
- Verify naming convention
- Notify Chad if no video found

### Video Not Public
- Send notification: "Newsletter Hour video is private - please make public"
- Retry in 1 hour (up to 3 times)

### Transcript Unavailable
- Wait 30 minutes (Vimeo processing delay)
- Retry up to 5 times
- Fall back to manual notification if fails

### Course Sprout API Error
- Save recap locally
- Notify Chad with file path
- Manual upload required

---

## 📊 Success Metrics

**Time Saved:**
- Manual process: ~45 minutes
- Automated process: ~2 minutes (just review)
- **Savings: 43 minutes/week = 3 hours/month**

**Quality:**
- Consistent recap format every week
- Never miss a recording
- Transcripts always saved for reference

---

## 🔄 Future Enhancements

1. **Auto-post to Discord** - Share recap in Entourage channel
2. **Email summary** - Send to all attendees
3. **Blog post generation** - Auto-create newsletter article
4. **Social clips** - Extract key moments for short-form video

---

**Status:** 🚧 Ready to build - implementation pending
**Created:** 2026-02-23 1:00 AM
**Last Updated:** 2026-02-23 1:00 AM
