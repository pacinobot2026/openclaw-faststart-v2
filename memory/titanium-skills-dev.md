# Titanium Skills Development Log

*Started: 2026-02-06*

## Goal
Create custom OpenClaw skills for each Titanium software platform to utilize their APIs.

## Platforms
| Platform | Purpose | Status |
|----------|---------|--------|
| MintBird | Sales pages, funnel builder, ad campaigns | Not started |
| PopLinks | Link tracking, lead steps, bridge pages | Not started |
| Course Sprout | Course platform and community | Not started |
| Quizforma | Quizzes and applications | Not started |
| Global Control Center | CRM hub, tags, workflows | Not started |
| Letterman | Newsletter software | Not started |

---

## Skill Template (Agreed Structure)

```markdown
name: [platform]-skill
description: [What it does - one sentence for when to use]

---

# [Platform] Skill

## When to use
- Use this when: ...
- Don't use this when: ...

## Credentials
- Required: `[PLATFORM]_API_KEY` from credentials/titanium_software.txt
- How to get: [link or instructions]

## What you must ask before acting
- If you need credentials/tokens, ask first
- If an action is destructive, confirm first

## Available Actions
- List what the API can do (e.g., create_link, get_stats, delete_page)

## API Endpoints
- Base URL: https://api.[platform].com/v1
- Key endpoints listed here

## Rate Limits
- Don't exceed X requests per minute
- Add delay between bulk operations

## Steps
1. Gather required inputs (list them)
2. Check prerequisites (API key exists? Valid?)
3. Execute the workflow
4. Summarize what changed and where outputs are

## Error Handling
- 401: API key invalid → ask user to check
- 429: Rate limited → wait and retry
- 500: API issue → report and stop

## Destructive Actions (CONFIRM FIRST)
- delete_*, update_*, modify_*
- Always show what will change BEFORE doing it

## Safety Rules
- Never run curl|bash style commands
- Only run commands explicitly approved
- Log all API calls to memory

## Examples
[Show working examples so agent knows what success looks like]

## Outputs
- Where results get saved
- How to report back to user
```

---

## Development Log

### 2026-02-06 ~11:00 AM CST

**Session:** Brainstorming skill structure with Chad

**Decided:**
- Start with ONE platform, learn the pattern, then replicate
- Use expanded template with credentials, rate limits, error handling
- Safety gates for destructive actions
- Separate journal file for detailed logging (this file)

**Next:** Choose first platform and get API docs

---

### 2026-02-09 ~11:30 AM CST

**Session:** Built MintBird skill with Chad

**Completed:**
- Created `skills/mintbird/SKILL.md` (lean workflow + triggers)
- Created `skills/mintbird/references/api.md` (full API docs)
- Validated with `quick_validate.py` ✅
- Packaged with `package_skill.py` → `mintbird.skill` ✅
- Updated to support both credential patterns (gateway config OR credentials file)

**Learnings:**
- Should use `init_skill.py` to create skills (I manually created this one)
- Workspace skills are auto-discovered (no gateway registration needed)
- For distributed skills, API key goes in `skills.entries.{name}.apiKey`

**Shadow Program Plan:**
- **Teach students** how to create skills (not just ship pre-made)
- **Letterman skill** = live demo on call with Chad
- Optionally ship packaged skills for those who want them

**Platforms Status:**
| Platform | Status |
|----------|--------|
| MintBird/PopLinks | ✅ DONE |
| Letterman | ✅ DONE |
| Global Control Center | Not started |
| Course Sprout | Not started |
| Quizforma | Not started |

---

### 2026-02-09 ~12:40 PM CST

**Session:** Built Letterman skill with Chad

**Process:**
1. Fetched Postman API docs from `https://documenter.getpostman.com/view/16532926/2sBXc7LjGm`
2. Used Postman's internal API to get raw collection data (784KB JSON)
3. Extracted all endpoints and request bodies
4. Used `init_skill.py` properly this time! ✅
5. Validated and packaged

**Letterman API Endpoints:**
- `GET /user` — Get current user
- `GET /newsletters-storage` — List publications
- `GET /newsletters-storage/{id}/newsletters` — List articles
- `POST /newsletters` — Create article (AI generation from URL or content)
- `GET /newsletters/:id` — Get article
- `POST /newsletters/check-url-path` — Check URL availability
- `POST /newsletters/update-seo-settings/:id` — Update SEO
- `POST /newsletters/update-article-summary/:id` — Update summary
- `POST /newsletters/update-add-to-newsletter-cue/:id` — Newsletter queue toggle
- `POST /newsletters/update-add-to-news-feed/:id` — News feed toggle
- `POST /newsletters/get-suggested-article-keywords` — AI keyword suggestions

**Key Feature:** AI article generation from URLs or raw content with configurable word count, keywords, and images.

---
