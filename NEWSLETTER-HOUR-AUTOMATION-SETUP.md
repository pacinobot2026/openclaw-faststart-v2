# Newsletter Hour Automation - Quick Start Guide

**Built:** 2026-02-23 Overnight Build Session
**Status:** ✅ Ready for Testing

---

## 🎯 What This Does

Automates your entire Newsletter Hour recap process:
1. ✅ Finds latest Vimeo recording
2. ✅ Downloads transcript
3. ✅ Generates formatted recap
4. ✅ Creates Course Sprout lesson
5. ✅ Notifies you when ready

**Time Saved:** 43 minutes every week!

---

## 🚀 Quick Test (Do This First)

### 1. Test with Last Week's Video
```powershell
cd C:\Users\Administrator\.openclaw\workspace
node scripts/newsletter-hour-automation.js --date 2026-02-17
```

### 2. Check the Output
The automation will:
- Download transcript → `transcripts/vimeo/newsletter-hour-2026-02-17.txt`
- Generate recap → `recaps/newsletter-hour-2026-02-17.md`
- Create Course Sprout lesson (DRAFT)
- Show you a summary

### 3. Review the Recap
Open `recaps/newsletter-hour-2026-02-17.md` and check quality:
- Are the topics accurate?
- Are the action items relevant?
- Is the quotable quote good?

---

## 📋 If Test Works - Set Up Weekly Automation

### Option A: OpenClaw Cron (Recommended)
```bash
openclaw cron add --name "Newsletter Hour Automation" --schedule "0 14 * * 1" --command "node C:\Users\Administrator\.openclaw\workspace\scripts\newsletter-hour-automation.js"
```

**This runs every Monday at 2 PM** (2 hours after your call ends)

### Option B: Manual Run Each Week
Just run this command Monday afternoon:
```bash
node scripts/newsletter-hour-automation.js
```
(Automatically uses today's date)

---

## 🔧 Configuration

Everything is pre-configured, but you can customize:

### Video Search
Edit `scripts/newsletter-hour-automation.js` line 15-20:
```javascript
vimeo: {
  userId: '41953625',                    // Your Vimeo user ID
  searchPattern: 'Local Newsletter Hour' // Video title pattern
}
```

### Course Sprout Destination
Edit line 22-25:
```javascript
coursesprout: {
  courseId: 340,  // OpenClaw Shadow Intensive
  chapterId: 958  // Replays chapter
}
```

---

## ⚠️ Important: Video Must Be Public!

The automation checks if your video is public:
- ✅ Public → Automation continues
- ❌ Private → You get notified to make it public

**After recording, remember to:**
1. Go to Vimeo
2. Settings → Privacy
3. Set to "Anyone can watch"

---

## 📊 Monitoring

### Check Last Run Status
```bash
node scripts/newsletter-hour-automation.js --status
```

### View Full Log
```powershell
type logs\newsletter-hour-automation.log
```

### Check Today's Recap
```powershell
Get-Content recaps\newsletter-hour-$(Get-Date -Format yyyy-MM-dd).md
```

---

## 🐛 Troubleshooting

### "Video not found"
- Check Vimeo folder name matches "Local Newsletter Hour"
- Verify date format in video title: YYYY-MM-DD

### "Transcript download failed"
- Vimeo may still be processing (wait 30 min)
- Video must be public
- Check Vimeo API token in `credentials/vimeo-access-token.txt`

### "Course Sprout error"
- Check API key in `credentials/titanium-api-keys.txt`
- Verify course ID 340 and chapter ID 958 exist
- Recap is still saved locally even if upload fails

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `workflows/newsletter-hour-automation.md` | Full documentation |
| `scripts/newsletter-hour-automation.js` | Main automation |
| `scripts/generate-newsletter-recap.js` | Recap generator |
| `logs/newsletter-hour-automation.log` | Execution logs |
| `transcripts/vimeo/*.txt` | Downloaded transcripts |
| `recaps/*.md` | Generated recaps |

---

## ✅ Quick Checklist

- [ ] Run test with `--date 2026-02-17`
- [ ] Review generated recap quality
- [ ] Check Course Sprout lesson was created
- [ ] Set up weekly cron job (or decide manual)
- [ ] Delete this file after setup complete

---

## 🎬 Next Monday

**If using cron:**
- Automation runs at 2 PM automatically
- You get notification when ready
- Review and publish lesson

**If running manually:**
- Run: `node scripts/newsletter-hour-automation.js`
- Review output
- Done!

---

**Questions?** Check `workflows/newsletter-hour-automation.md` for full details.

**Ready to save 43 minutes every week? Let's go! 🚀**
