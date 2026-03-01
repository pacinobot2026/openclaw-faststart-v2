# SHORTCODES.md — Command Reference

Quick commands for common tasks. Say the shortcode to trigger the workflow.

---

## 🚀 BUSINESS COMMANDS

### `/create business`
**PRODUCT CREATION ENGINE — FULL REVENUE MODE**

End-to-end product creation, launch, and scale system. 6 structured stages.

**⚡ BUSINESS BOARD INTEGRATION (MANDATORY):**
When starting `/create business`:
1. **Create business entry** in Business Board (boards.nicelycontrol.com/businesses)
2. **Auto-populate tasks** across columns (Marketing, Follow-up, Research, Delivery)
3. **Add resources** as they're created (sales page URL, Stripe link, VSL, GitHub repo, etc.)
4. **Mark tasks DONE** as each stage completes
5. **Track progress** via the board's progress bars

**⚠️ CRITICAL:** After EVERY stage completion → Update Business Board (or tell Chad what to update)

**API:** `POST /api/businesses` with `action: 'add'` or `action: 'update'`
**Board URL:** https://boards.nicelycontrol.com/businesses

**STAGE 1 — OPPORTUNITY INTELLIGENCE**
Generate 10 product opportunities. For each:
- Target buyer, painful problem, demand indicators
- Market price range, 2-3 competitors
- Profit potential (low/medium/high)
- Score: urgency, speed to revenue, competition, scalability
→ Output: Opportunity Report with best pick

**STAGE 2 — PRODUCT ARCHITECTURE**
Business Blueprint:
- Core offer + unique positioning
- Pricing strategy + upsell/backend potential
- Traffic entry point + fulfillment model
- Revenue model (one-time/subscription/hybrid)
→ Don't proceed if blueprint is weak

**STAGE 3 — BUILD + DEPLOY**
Using available skills:
- Create product asset
- Build sales page (Next.js)
- Push to GitHub (pacinobot2026)
- Deploy to Vercel → live URL
- Create Stripe product + checkout link
- Connect checkout to page
- Set up automated delivery
- Create 5-min VSL script (pattern interrupt → problem → solution → mechanism → offer stack → CTA)
- Generate VSL audio via ElevenLabs TTS
- Upload to Vimeo
- Embed VSL on sales page
→ Output: Live sales page URL, VSL script, Vimeo URL, Stripe checkout

**🔴 MANDATORY CHECKPOINT:**
Before proceeding to Stage 4, TELL CHAD:
"✅ Stage 3 complete! Update Business Board:
- Marketing: Mark VSL + sales page tasks DONE
- Delivery: Mark product assets + deploy DONE
- Resources: Add sales page URL, VSL URL, GitHub repo"

**STAGE 4 — TRAFFIC + CONVERSION ASSETS**
A) Organic: 1 launch post, 5 follow-ups, 10 hooks, 5 authority posts
B) Paid Ads: 5 short hooks, 3 long-form, 2 retargeting, 10 headlines
C) Email Sequence (7 emails) — **FOR NON-BUYERS TO CONVERT**
1. Announcement → 2. Problem agitation → 3. Solution breakdown
4. Mechanism deep dive → 5. Objection handling → 6. Urgency → 7. Final call
Each email: subject, preview, body, CTA
*(These target people who viewed but didn't buy)*

**→ BUILD IN GC:** Create workflow via API with all 7 emails + timers between them

**🔴 MANDATORY CHECKPOINT:**
Before proceeding to Stage 5, TELL CHAD:
"✅ Stage 4 complete! Update Business Board:
- Marketing: Mark organic posts + paid ads + emails DONE
- Resources: Add traffic assets folder path"

**STAGE 5 — ACTIVE TRAFFIC DEPLOYMENT**
- Publish organic posts
- Schedule follow-ups
- Launch paid ads (if connected)
- Set budget, targeting, tracking events
- Install pixels if missing
- Monitor early signals
→ If accounts not connected, state required credentials and pause that step only

**STAGE 6 — OPTIMIZATION + SCALE PLAN**
- 3 optimization levers
- 3 scaling strategies
- 1 long-term brand expansion opportunity
- Daily revenue target + scaling threshold

**FINAL OUTPUT REQUIREMENTS:**
✅ Sales page URL
✅ Stripe product ID + checkout link
✅ Product delivery link
✅ VSL script
✅ Ad copy set
✅ Email sequence
✅ Traffic deployment confirmation

**Rules:** No fake urgency. No fake proof. No exaggerated income claims. Build sustainable revenue assets.

---

### `/salespage`
Build professional Next.js sales page and deploy to Vercel.

**Workflow:**
1. Ask for product name and offer details
2. Generate sales page structure with:
   - Compelling headline + subheadline
   - Video embed section (optional)
   - Bullet points showcasing benefits
   - Call-to-action buttons
   - Stripe checkout integration
3. Push to GitHub (pacinobot2026)
4. Deploy to Vercel
5. Return live URL

---

### `/create course`
Create and deploy a complete online course in Course Sprout.

**Workflow:**
1. Ask for course topic and target audience
2. Generate course structure:
   - Course title and description
   - Chapter breakdown (4-8 chapters)
   - Lesson titles for each chapter
3. Create course in Course Sprout via API
4. Auto-generate lesson content:
   - Short description (1-2 sentences)
   - Long description (detailed breakdown)
   - Goal blocks (points + engagement prompts)
5. Set up course access and pricing
6. Return course URL and enrollment link

**Output:** Live course URL + admin dashboard link

---

### `/salescopy`
Generate high-converting sales copy using proven frameworks.

**Workflow:**
1. Ask about product/offer
2. Choose framework:
   - PAS (Problem-Agitate-Solve)
   - AIDA (Attention-Interest-Desire-Action)
   - 4Ps (Problem-Promise-Proof-Proposal)
3. Generate:
   - Headline + subheadline
   - Bullet points
   - CTA and urgency elements
4. Deliver formatted copy ready to use

---

### `/vsl`
Create complete VSL — script, audio, and video with text slides.

**Workflow:**
1. Generate VSL script (pattern interrupt → problem → solution → mechanism → offer → CTA)
2. Create audio with ElevenLabs using Chad's voice (PeMXWXe7DDCb8HldBr2s)
3. Generate word-level timestamps with OpenAI Whisper
4. Build text slides synced to audio:
   - Auto-fit font sizes based on word count (4-8 words per slide ideal)
   - Dark background, white text, yellow highlights
   - 16:9 horizontal format
5. Compile final video with FFmpeg
6. Upload to Vimeo or return file URL

**Output:** Script document + audio file + final video URL

---

### `/videoavatar`
Generate AI avatar video with HeyGen or ElevenLabs.

**Workflow:**
1. Ask for script/message
2. Choose platform:
   - HeyGen (realistic avatar)
   - ElevenLabs (voice + simple avatar)
3. Select avatar style
4. Generate video
5. Return video URL or downloadable file

**Use cases:** Product demos, testimonials, explainer videos

---

## 📧 EMAIL COMMANDS

### `/emailstats`
Get email performance stats from Global Control.

**Workflow:**
1. Ask: "Broadcast or Workflow?"
2. User answers → Ask: "What date?" (or confirm date range)
3. Pull stats from GC and return:
```
Subject: [subject line]
Sent: X | Opens: X | Clicks: X
```

**API Endpoints:**
- Broadcast: `POST /email-reports/broadcast`
- Workflow: `POST /email-reports/workflow`

---

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

### `/bulkimport`
Bulk import contacts from CSV and tag them (creates contacts if needed).

**Workflow:**
1. Ask for spreadsheet (CSV file)
2. Ask for tag name
3. For each contact in CSV:
   - If exists in GC → Fire tag (update)
   - If doesn't exist → Create contact AND fire tag
4. Generate report:
   ```
   Tag Applied: [tag name]
   
   Total Contacts Tagged: X
     ├─ Updated: Y
     └─ New Contacts Created: Z
   
   Detailed Results:
   [table with Email | Name | Action | Status]
   ```

**CSV Format Required:**
```csv
email,firstName,lastName
john@example.com,John,Doe
jane@example.com,Jane,Smith
```

**Report includes:**
- Total contacts tagged
- Breakdown: Updated vs New
- Tag(s) applied
- Detailed results table
- Saved CSV report file

**Script:** `scripts/bulk-import.ps1`

**⚠️ Note:** Currently there's a GC API bug preventing contact creation. Updates work fine, but new contact creation may fail until API is fixed.

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

### `/makelive`
Deploy any project to Vercel with one command.

**Workflow:**
1. Commit & push to GitHub
2. Ensure Vercel project connected to GitHub
3. Trigger Vercel deployment via API
4. Return live URL + confirm auto-deploy enabled

**Tokens:**
- Vercel: `credentials/vercel-token.txt`
- GitHub: Project `.env.local` (GITHUB_TOKEN)

**Response format:** GitHub URL + Live Vercel URL + Auto-deploy status

---

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
| `/create business` | Business | Full 6-stage product creation engine |
| `/salespage` | Business | Build Next.js sales page + deploy |
| `/create course` | Business | Create complete online course in Course Sprout |
| `/salescopy` | Business | Generate high-converting sales copy |
| `/vsl` | Business | Create VSL script + audio + video |
| `/videoavatar` | Business | Generate AI avatar video |
| `/broadcast` | Email | Create/send broadcast email (with re-engagement fork) |
| `/emailstats` | Email | Get email performance stats |
| `/reactivation` | Email | CSV upload → progressive daily campaign |
| `/replay` | Content | Create Course Sprout lesson from Vimeo |
| `/article` | Content | Create Letterman article |
| `/poplink` | Links | Create shortened link |
| `/leadstep` | Pages | Create lead capture page |
| `/bridgepage` | Pages | Create/clone bridge page |
| `/tag` | Contacts | Fire tag on contact |
| `/bulkimport` | Contacts | Bulk import contacts from CSV |
| `/contact` | Contacts | Pull contact history |
| `/sob` | Access | Look up user credentials in SaaSOnboard |
| `/makelive` | System | Deploy project to Vercel |
| `/systemhealth` | System | API health check |
| `/teamcall` | System | Process team Zoom call |

**Total: 20 commands**

---

*Last updated: 2026-03-01*

