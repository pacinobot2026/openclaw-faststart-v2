# SHORTCODES.md — Command Reference

Quick commands for common tasks. Say the shortcode to trigger the workflow.

---

## 📧 EMAIL COMMANDS

### `/broadcast`
Create and send broadcast email via Global Control.

**Workflow:**
1. Ask what the email is about (or accept user's draft)
2. Rewrite the email content
3. Create subject line + pre-header
4. Ask for the link → create PopLink

**Step 5: THE FORK 🍴**
> "Do you want to re-engage your inactives with this email?"

- **YES** → Re-engagement path (see below)
- **NO** → Normal broadcast path

**Normal Broadcast Path:**
6. Show summary
7. Send test to cnicely32@gmail.com
8. Wait for user to confirm received
9. Ask: "Ready to send?"
10. User says "send it" → Live broadcast

**Re-engagement Path:**
6. Ask: Activity level or tag? (Primary source)
7. Ask: All / 7d / 14d / 30d? (Date range)
8. Show: "You have X contacts"
9. Suggest: "Recommend 10-15% = ~Y contacts"
10. Confirm target number
11. Pull from priority: Inactive → New → Passive → Dead
12. Show final screen:
```
# Active Re-engagement

Primary Source: 4,847 Openers
Target: 600 contacts (12%)

Inactive: 600 | New: 0 | Passive: 0 | Dead: 0
Total: 600
```
13. Send test to cnicely32@gmail.com
14. Wait for user to confirm received
15. Ask: "Ready to send?"
16. User says "send it" → Live broadcast

**Sending Defaults:**
- Domain: mg.chadnicely.com
- From: Chad Nicely <chad@mg.chadnicely.com>
- Reply-to: support@nicelysupport.com

**CRITICAL:** Test emails OK anytime, LIVE sends require explicit "send it" command

---

### `/reactivation`
Long-term progressive campaign from CSV file (NOT instant broadcast).

**Trigger:** User says `/reactivation` directly

**Process:**
1. Ask how many contacts
2. Ask pace (Mild/Normal/Aggressive)
3. Upload CSV/XLS file
4. Verify emails (EmailListVerify API)
5. Choose GC tag + workflow
6. Progressive daily sending via cron jobs
7. Kanban board tracking
8. Pause/Resume/Cancel anytime

**Different from /broadcast:** Uses CSV file + progressive tagging over days, NOT instant broadcast to GC segments

---

## 🎓 CONTENT COMMANDS

### `/replay`
Create Course Sprout lesson from Vimeo video.

**Workflow:**
1. Ask for Vimeo URL
2. Ask for lesson title (or auto-generate from video name)
3. Download transcript from Vimeo API
4. Create lesson with short + long descriptions (NO EMOJIS)
5. Create goal block (10 points, comments, user input, standard framework)

**Defaults:** Course 340 (OpenClaw Shadow), Chapter 958 (Replays)
**Override:** `/replay course:X chapter:Y points:Z`

---

### `/article`
Create Letterman article with full workflow.

**Workflow:**
1. Ask: Blank or AI-generated?
2. Ask: Local or Niche?
3. Ask: How many words?
4. Ask: Image URL or generate?
5. If AI: Generate content from topic/URL
6. If Local: Apply local SEO strategy (neighborhood, landmarks, etc.)
7. Create article as DRAFT with proper formatting
8. Update SEO settings (preview images, slug, etc.)
9. **WAIT for Chad to say "publish"** — NEVER auto-publish

**Remember:** Every sentence = `<p>` tag + `<p>&nbsp;</p>` for spacing

---

## 🔗 LINK & PAGE COMMANDS

### `/poplink`
Create shortened PopLink quickly.

**Workflow:**
1. User gives destination URL ONLY
2. **I automatically:**
   - Use **chadnicely.com** (domain_id: 1977) — ALWAYS default
   - Come up with simple slug myself (keep it short and relevant)
   - Create internal name based on destination
3. Create via PopLinks API

**Example:** User says "https://jvzoo.com" → I create `chadnicely.com/jvz`

**NEVER ask for domain or slug — I decide both automatically**

---

### `/leadstep`
Create lead capture page in PopLinks.

**Workflow:**
1. Ask for page name
2. Ask for headline/offer
3. Ask for domain (or default to chadnicely.com)
4. Ask for URL slug
5. Create via PopLinks lead page API
6. Set up confirmation page

**Example:** Capture leads for webinar, product launch, free download

---

### `/bridgepage`
Create or clone bridge page in PopLinks.

**Workflow:**
1. Ask: Clone existing or create new?
2. If clone: Ask for source page ID/name
3. Ask for new name
4. Ask for destination URL
5. Ask for domain + slug
6. Create/clone via PopLinks API
7. Update headline, video (if needed)

**Example:** Newsletter Hour bridge pages, promo bridge pages

---

## 👤 CONTACT COMMANDS

### `/tag`
Fire a tag on a contact in Global Control.

**Workflow:**
1. Ask for contact name
2. Ask for email
3. Ask which tag to fire
4. Fire tag via GC API
5. Confirm success

---

### `/contact`
Get contact history from Global Control.

**Workflow:**
1. Ask for contact name
2. Ask for email
3. Search GC for contact
4. Show full history: tags, emails sent, activity, purchases, etc.

---

### `/sob`
Look up user credentials in SaaSOnboard (access management system).

**Workflow:**
1. Ask for name and email
2. Ask what product they need (MintBird, PopLinks, Course Sprout, etc.)
3. Search SOB API for that email
4. Show results:
   - If found: Show access details
   - If not found: Offer to create access

**⚠️ IMPORTANT:**
- SOB does NOT expose existing passwords via API (security)
- DO NOT call add-user when trying to retrieve - this RESETS passwords!
- For password retrieval: Use web dashboard or reset it (with confirmation)

**Example Output:**
```
✅ Found in SaaSOnboard!

Name: John Doe
Email: john@example.com
Product: MintBird
Access Level: Admin

⚠️ Password: Not available via API
Use: https://app.saasonboard.com
Or: Reset password (creates new one)
```

---

## 🛠️ SYSTEM COMMANDS

### `/systemhealth`
Run health check on all APIs and properties.

**Workflow:**
1. Check 5 APIs: GC, PopLinks/MintBird, Course Sprout, Letterman, SaaSOnboard
2. Check 9 URLs: Key properties across platforms
3. Save results to `health-checks/YYYY-MM-DD.json`
4. Report any failures

**Runs automatically:** 10 AM and 4 PM CST via cron

---

### `/teamcall`
Extract assignments from team Zoom call and update management dashboard.

**Workflow:**
1. Fetch latest recording from team Zoom (meeting ID: 82250425529)
2. Download and parse transcript
3. Extract assignments per team member
4. Update TEAM-KANBAN.md
5. Post summary to Telegram team room

---

## Summary Table

| Shortcode | Category | Purpose |
|-----------|----------|---------|
| `/broadcast` | Email | Create/send broadcast email (with re-engagement fork) |
| `/reactivation` | Email | CSV upload → progressive daily campaign |
| `/replay` | Content | Create Course Sprout lesson from Vimeo |
| `/article` | Content | Create Letterman article |
| `/poplink` | Links | Create shortened link |
| `/leadstep` | Pages | Create lead capture page |
| `/bridgepage` | Pages | Create/clone bridge page |
| `/tag` | Contacts | Fire tag on contact |
| `/contact` | Contacts | Pull contact history |
| `/sob` | Access | Look up user credentials in SaaSOnboard |
| `/systemhealth` | System | API health check |
| `/teamcall` | System | Process team Zoom call |

**Total: 12 commands**

---

*Last updated: 2026-02-20*
