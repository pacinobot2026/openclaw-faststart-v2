# LOOKUP.md - Your Map

*When you don't know where something is, check here first.*

---

## 🔑 Credentials & API Keys

| What | Where |
|------|-------|
| Titanium Software (all 6 platforms) | `credentials/credentials-titanium.txt` |
| API Keys (GC, MintBird, Course Sprout, Letterman, Vimeo, SaaSOnboard) | `credentials/titanium-api-keys.txt` |
| Vimeo Personal Token | `credentials/titanium-api-keys.txt` → `Vimeo_PersonalToken` |

---

## 📚 Skills (Task-Specific Instructions)

| Skill | When to Use | Location |
|-------|-------------|----------|
| **Course Sprout** | Add users, create lessons, manage courses, gamification | `skills/coursesprout/SKILL.md` |
| **Letterman** | Create articles, manage publications, newsletters | `skills/letterman/SKILL.md` |
| **MintBird** | Bridge pages, lead pages, poplinks, ad stats | `skills/mintbird/SKILL.md` |
| **SaaSOnboard** | Grant product access across Titanium suite | `skills/saasonboard/SKILL.md` |
| **Vimeo Transcript** | Download transcripts, create recaps | `skills/vimeo-transcript/SKILL.md` |

---

## 🔄 Workflows (Step-by-Step Processes)

| Workflow | What It Does | Location |
|----------|--------------|----------|
| **Course Sprout Replay** | Vimeo URL → Lesson + Descriptions + Goal Block | `workflows/course-sprout-replay.md` |
| **Bridge Page Clone** | Clone & update PopLinks bridge pages | `workflows/bridge-page-complete.md` |
| **Newsletter Hour Weekly** | Pre-call setup (Zoom, emails, broadcast) | `workflows/newsletter-hour-weekly.md` |
| **Goal Block Framework** | How to write engaging goal blocks | `workflows/goal-block-framework.md` |

---

## 📊 Key IDs Reference

### Course Sprout
| Course | ID | Notes |
|--------|-----|-------|
| OpenClaw Shadow Intensive | 340 | Replays Chapter: 958 |
| Local Newsletter Hustle | 140 | |
| Newsletter Hour | 171 | |
| Round Table | 4 | |
| Titanium Tech Call | 6 | |
| Entourage Strategy Call | 7 | |
| PowerPlay Trainings | 8 | |
| OfferMint | 196 | |
| CompeteUp | 361 | |

### Pods (Memberships)
| Pod | ID |
|-----|-----|
| Entourage Mastermind | 3 |
| Power Plays Member | 4 |
| Local Newsletter Hustle | 57 |
| OfferMint | 67 |
| Chad Nicely's Vault | 98 |

### PopLinks Categories (Bridge Pages)
| Category | ID |
|----------|-----|
| Newsletter Hour | 1945 |
| Titanium Call | 1442 |
| Round Table | 1443 |
| Entourage | 1506 |
| PowerPlay Offers | 1666 |
| Promotions | 1656 |

### Global Control Tags
| Tag | ID |
|-----|-----|
| Newsletter Hour | 686d7742597629a956b34f54 |
| Newsletter Hour Open | 686d7b93597629a956b44185 |
| Chad Test | 6988c0453d20c61f8117c9c2 |

### Zoom Webinars
| Webinar | ID |
|---------|-----|
| Newsletter Hour | 88390841602 |
| Titanium Tech Call | 84103913926 |

---

## 🌐 API Base URLs

| Platform | Base URL | Auth Header |
|----------|----------|-------------|
| Course Sprout | `https://api.coursesprout.com/api/ai` | `X-API-KEY` |
| Global Control | `https://api.globalcontrol.io/api` | `X-API-KEY` |
| MintBird/PopLinks | `https://api.poplinks.io/api/ai` | `Authorization: Bearer` |
| Letterman | `https://api.letterman.ai/api` | `Authorization: Bearer` |
| SaaSOnboard | `https://app.saasonboard.com/api/ai` | `X-API-KEY` |
| Vimeo | `https://api.vimeo.com` | `Authorization: Bearer` |

---

## 📁 Important Directories

| What | Path |
|------|------|
| Daily logs | `memory/YYYY-MM-DD.md` |
| Long-term memory | `MEMORY.md` |
| Workflows | `workflows/` |
| Skills | `skills/` |
| Credentials | `credentials/` |
| Transcripts | `transcripts/` |
| Recaps | `recaps/` |
| Generated assets | `assets/` |
| API documentation | `docs/apis/` |
| **Content Queue** | `content-queue/` |

---

## 📰 Content Queue (Pre-Researched Articles)

| Publication | Queue File | Templates |
|-------------|------------|-----------|
| West Valley Shoutouts | `content-queue/west-valley-shoutouts.md` | `content-queue/article-templates.md` |

**How to use:** Say "write #1" (or any number) and I'll create the full article with image.

The queue is refreshed during overnight builds with local news topics.

---

## 📅 Recurring Schedules

| Event | When | What to Do |
|-------|------|------------|
| Newsletter Hour | Monday 10am-12pm PST | Pre-call: Update Zoom agenda + send broadcast email |
| Newsletter Hour Replay | Monday 2pm PST | Grab replay, create bridge page |
| Morning Brief | Daily 8:39am | Ask for top 3 priorities |
| Evening Review | Daily 9pm | Review what got done |
| Overnight Build | 1am (when triggered) | Build something useful, leave summary |

---

## 🛠️ Common Tasks - Quick Reference

### "Add user to X"
→ Check `skills/saasonboard/SKILL.md` for cross-product access
→ Check `skills/coursesprout/SKILL.md` for course-specific access

### "Grab a replay"
→ Follow `workflows/course-sprout-replay.md` (ALL 5 STEPS!)

### "Clone a bridge page"
→ Use PopLinks API: `POST /bridge-pages/:id/clone` then rename/update

### "Send an email"
→ Check `TOOLS.md` → GC Broadcast Email section

### "Check API status"
→ Titanium Health Check in morning brief

---

## ⚠️ Gotchas & Lessons Learned

| Issue | Solution |
|-------|----------|
| Emojis in Course Sprout descriptions | DON'T - causes 422 error |
| PopLinks URL | Use `.io` not `.ai` |
| Vimeo "Hide from Vimeo" | Videos must be public for API access |
| GC = ? | Global Control Center |
| Bridge page automation | Use API, not browser (Vue.js issues) |
| "Grab a replay" | ALL 5 steps: transcript, lesson, short desc, long desc, goal block |

---

*Last updated: 2026-02-13*
