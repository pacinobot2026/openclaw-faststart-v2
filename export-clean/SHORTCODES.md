# SHORTCODES.md — Command Reference

Quick commands for common tasks. Say the shortcode to trigger the workflow.

**⚠️ This version includes ONLY implemented commands with available skills.**

---

## 📧 EMAIL COMMANDS

### `/broadcast`
Create and send broadcast email via Global Control.

**Available:** ✅ (globalcontrol skill)

**Workflow:**
1. Ask what the email is about (or accept user's draft)
2. Rewrite the email content
3. Create subject line + pre-header
4. Ask for the link → create PopLink

**Step 5: THE FORK 🍴**
> "Do you want to re-engage your inactives with this email?"

- **YES** → Re-engagement path (see below)
- **NO** → Normal broadcast path

**Before Sending — Ask if not provided:**
- Sending domain
- From name + email
- Reply-to email
- Test email address

**Normal Broadcast Path:**
6. Show summary
7. Send test to [test email — ask if not provided]
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

Primary Source: [X] Openers
Target: [Y] contacts ([Z]%)

Inactive: Y | New: 0 | Passive: 0 | Dead: 0
Total: Y
```
13. Send test to [test email — ask if not provided]
14. Wait for user to confirm received
15. Ask: "Ready to send?"
16. User says "send it" → Live broadcast

**CRITICAL:** Test emails OK anytime, LIVE sends require explicit "send it" command

**Skill:** `globalcontrol`

---

### `/reactivation`
Long-term progressive campaign from CSV file (NOT instant broadcast).

**Available:** ✅ (reengagement skill)

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

**Skill:** `reengagement`

---

## 🔗 LINK & PAGE COMMANDS

### `/poplink`
Create shortened PopLink quickly.

**Available:** ✅ (poplinks-manager skill)

**Workflow:**
1. User gives destination URL ONLY
2. **Ask if not provided:** domain (ask user which domain to use)
3. Auto-generate slug (short and relevant to destination)
4. Create internal name based on destination
5. Create via PopLinks API

**Example:** User says "https://jvzoo.com" → ask for domain → create `[domain]/jvz`

**Skill:** `poplinks-manager`

---

### `/leadstep`
Create lead capture page in PopLinks.

**Available:** ✅ (poplinks-manager skill)

**Workflow:**
1. Ask for page name
2. Ask for headline/offer
3. Ask for domain (required — no default)
4. Ask for URL slug
5. Create via PopLinks lead page API
6. Set up confirmation page

**Example:** Capture leads for webinar, product launch, free download

**Skill:** `poplinks-manager`

---

### `/bridgepage`
Create or clone bridge page in PopLinks.

**Available:** ✅ (poplinks-manager skill)

**Workflow:**
1. Ask: Clone existing or create new?
2. If clone: Ask for source page ID/name
3. Ask for new name
4. Ask for destination URL
5. Ask for domain + slug
6. Create/clone via PopLinks API
7. Update headline, video (if needed)

**Example:** Newsletter Hour bridge pages, promo bridge pages

**Skill:** `poplinks-manager`

---

## 👤 CONTACT COMMANDS

### `/tag`
Fire a tag on a contact in Global Control.

**Available:** ✅ (globalcontrol skill)

**Workflow:**
1. Ask for contact name
2. Ask for email
3. Ask which tag to fire
4. Fire tag via GC API
5. Confirm success

**Skill:** `globalcontrol`

---

### `/contact`
Get contact history from Global Control.

**Available:** ✅ (globalcontrol skill)

**Workflow:**
1. Ask for contact name
2. Ask for email
3. Search GC for contact
4. Show full history: tags, emails sent, activity, purchases, etc.

**Skill:** `globalcontrol`

---

## ❌ UNAVAILABLE COMMANDS

The following commands were removed because their skills are not yet implemented:

- **`/replay`** — Course Sprout lesson creation (no coursesprout skill)
- **`/article`** — Letterman article creation (no letterman skill)
- **`/systemhealth`** — API health check (runs via cron, no interactive skill)
- **`/teamcall`** — Zoom call processing (no zoom skill)

**To add these commands:** Create the corresponding skills and add them back to this file.

---

## Summary Table

| Shortcode | Category | Purpose | Skill |
|-----------|----------|---------|-------|
| `/broadcast` | Email | Create/send broadcast email (with re-engagement fork) | globalcontrol |
| `/reactivation` | Email | CSV upload → progressive daily campaign | reengagement |
| `/poplink` | Links | Create shortened link | poplinks-manager |
| `/leadstep` | Pages | Create lead capture page | poplinks-manager |
| `/bridgepage` | Pages | Create/clone bridge page | poplinks-manager |
| `/tag` | Contacts | Fire tag on contact | globalcontrol |
| `/contact` | Contacts | Pull contact history | globalcontrol |

**Total: 7 available commands**

---

## Skills Included

1. **globalcontrol** — Global Control CRM API
   - Contacts, tags, broadcasts, custom fields, domains
   - Commands: `/broadcast`, `/tag`, `/contact`

2. **reengagement** — Email re-engagement campaigns
   - CSV import, progressive sending, pace control
   - Commands: `/reactivation`

3. **poplinks-manager** — PopLinks/MintBird API
   - URL shortener, lead pages, bridge pages
   - Commands: `/poplink`, `/leadstep`, `/bridgepage`

---

*Last updated: 2026-02-19*  
*Version: 2.0 (Available Commands Only)*
