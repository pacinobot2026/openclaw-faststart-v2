# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

---

## 🌐 Global Control Center (GC) API

**📚 Official Docs:** https://api.globalcontrol.io/ai-api-docs
**Base URL:** `https://api.globalcontrol.io/api/ai`

**Authentication:** API Key in header
```
X-API-KEY: {{apiToken}}
```

**Get API Token:**
1. Log into Global Control dashboard
2. Settings > API Access
3. Generate/copy token

**Response format:**
```json
{
  "type": "response",
  "data": { ... }
}
```

### User
| Action | Method | Endpoint |
|--------|--------|----------|
| Get authenticated user | GET | `/me` |

### Integrations
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all integrations | GET | `/integrations` |
| Get connected integrations | GET | `/platform/connected-integrations` |
| Get connected categories | GET | `/integrations/connected-categories` |

### Contacts
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all contacts | GET | `/contacts` |
| Get a contact | GET | `/contacts/{contactId}` |
| Create a contact | POST | `/contacts` |
| Update a contact | PUT | `/contacts/{contactId}` |
| Delete a contact | DELETE | `/contacts/{contactId}` |

### Sub-Users
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all users | GET | `/sub-users` |
| Get a user | GET | `/sub-users/{userId}` |
| Create a user | POST | `/sub-users` |
| Update a user | PUT | `/sub-users/{userId}` |
| Delete a user | DELETE | `/sub-users/{userId}` |

### Tags
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all tags | GET | `/tags` |
| Get a tag | GET | `/tags/{tagId}` |
| Create a tag | POST | `/tags` |
| Update a tag | PUT | `/tags/{tagId}` |
| Delete a tag | DELETE | `/tags/{tagId}` |

**Create/Update Tag Body:**
```json
{"name": "tag name", "description": "", "groupId": "...", "isHot": false}
```

### Tag Groups
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all groups | GET | `/tag-groups` |
| Get a group | GET | `/tag-groups/{groupId}` |
| Create a group | POST | `/tag-groups` |
| Update a group | PUT | `/tag-groups/{groupId}` |
| Delete a group | DELETE | `/tag-groups/{groupId}` |

### Tag Labels
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all labels | GET | `/tags/labels` |
| Get a label | GET | `/tags/labels/{labelId}` |
| Create a label | POST | `/tags/labels` |
| Update a label | PUT | `/tags/labels/{labelId}` |
| Delete a label | DELETE | `/tags/labels/{labelId}` |

### Custom Fields
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all fields | GET | `/custom-fields` |
| Get a field | GET | `/custom-fields/{customFieldId}` |
| Create a field | POST | `/custom-fields` |
| Update a field | PUT | `/custom-fields/{customFieldId}` |
| Delete a field | DELETE | `/custom-fields/{customFieldId}` |

### Custom Field Groups
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all groups | GET | `/custom-field-groups` |
| Get a group | GET | `/custom-field-groups/{groupId}` |
| Create a group | POST | `/custom-field-groups` |
| Update a group | PUT | `/custom-field-groups/{groupId}` |
| Delete a group | DELETE | `/custom-field-groups/{groupId}` |

### Domains (Email)
| Action | Method | Endpoint |
|--------|--------|----------|
| Get all domains | GET | `/domains` |
| Get a domain | GET | `/domains/{domainId}` |
| Get integration domains | POST | `/domains/smtp-domain-list` |
| Create a domain | POST | `/domains` |
| Delete a domain | DELETE | `/domains/{domainId}` |

### Broadcast Emails
| Action | Method | Endpoint |
|--------|--------|----------|
| Send email | POST | `/broadcast-emails/send-email` |
| Create a field | POST | `/broadcast-emails/create-field` |
| Get active contacts count | POST | `/broadcast-emails/active-contacts-count` |
| Get fields | GET | `/broadcast-emails/get-fields` |

### Email Reports
| Action | Method | Endpoint |
|--------|--------|----------|
| Get broadcast report | POST | `/email-reports/broadcast` |
| Get newsletter report | POST | `/email-reports/newsletter` |
| Get workflow report | POST | `/email-reports/workflow` |

**Full API docs:** `docs/apis/Global Control API.json.json`

---

## ⚠️ IMPORTANT - Titanium Suite

**6 Platforms (unified login from credentials-titanium.txt):**
- **MintBird:** app.mintbird.com
- **PopLinks:** app.poplinks.com (NOT .io or .ai)
  - **Bridge Pages Direct:** https://app.poplinks.io/app/funnels/bridge-pages
- **Course Sprout:** app.coursesprout.com
- **Quizforma:** app.quizforma.com
- **Global Control Center:** app.globalcontrol.io
- **Letterman:** app.letterman.io

**OpenClaw browser** is isolated — no saved logins. Need Chad to attach Chrome tab for logged-in sessions, OR use credentials.

---

## 🔥 PopLinks / MintBird API (SAME API!)

**MintBird and PopLinks share the SAME API!**

### API Versions
| API | Base URL | Use For |
|-----|----------|---------|
| **AI API** (Primary) | `https://api.poplinks.io/api/ai` | Bridge pages, lead pages, poplinks, stats, products, orders |
| **Ad Stats API** | `https://api.poplinks.io/api/ai/ad-stats` | Campaign insights, spend, sales |

**Auth:** `Authorization: Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW`
**API Key Location:** `credentials/titanium-api-keys.txt` (Mintbird key)
**Full Docs:** https://api.poplinks.io/ai-api-docs

### Bridge Page Endpoints (use /api/ai) - FULL DOCUMENTATION

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| List all | GET | `/bridge-pages` | Returns array of bridge page objects |
| Get one | GET | `/bridge-pages/:id` | Includes settings, links, views |
| Create | POST | `/bridge-pages` | Body: `{name, template_id?, category_id?}` |
| **Clone** | POST | `/bridge-pages/:id/clone` | Clones ALL settings, appends "(Copy)" to name |
| **Rename** | PUT | `/bridge-pages/:id/rename` | Body: `{name}` |
| **Update Category** | PUT | `/bridge-pages/:id/category` | Body: `{category_id}` |
| **Update URL** | PUT | `/bridge-pages/:id/url` | Body: `{leadpage_keyword, redirect_url?, domain_id?, domain_type?, redirect_type?}` |
| **Update SEO** | PUT | `/bridge-pages/:id/seo` | Body: `{title?, description?, keywords?, author?, image?}` |
| **Update Pre-Headline** | PUT | `/bridge-pages/:id/pre-headline` | Body: `{sub_headline}` |
| **Update Headline** | PUT | `/bridge-pages/:id/headline` | Body: `{main_headline}` |
| **Update Post-Headline** | PUT | `/bridge-pages/:id/post-headline` | Body: `{cta_statement}` |
| **Update Video** | PUT | `/bridge-pages/:id/video` | Body: `{is_video_enabled, video_type?, video_url?}` |
| **Update Description** | PUT | `/bridge-pages/:id/description` | Body: `{is_textblock_enabled, textblock_content?}` |
| **Update Bullets** | PUT | `/bridge-pages/:id/bullets` | Body: `{bullet_title?, bullets: [{name, rotation_number?}]}` - REPLACES all bullets |
| **Update Template** | PUT | `/bridge-pages/:id/template` | Body: `{template_id}` - Regenerates CSS |

#### Bridge Page Headline Update Body
```json
{
  "main_headline": "Check Out This Amazing Offer!"
}
```

#### Bridge Page Video Update Body
```json
{
  "is_video_enabled": true,
  "video_type": "vimeo",
  "video_url": "https://vimeo.com/123456789"
}
```

#### Bridge Page Bullets Update Body
```json
{
  "bullet_title": "Why You Should Act Now:",
  "bullets": [
    { "name": "Limited time offer available" },
    { "name": "Exclusive bonuses included", "rotation_number": 1 },
    { "name": "100% satisfaction guaranteed", "rotation_number": 2 }
  ]
}
```
*Note: ALL existing bullets are DELETED and replaced with the provided array.*

### Lead Page Endpoints (use /api/ai) - FULL DOCUMENTATION

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| List all | GET | `/lead-pages` | Returns array of lead page objects |
| Get one | GET | `/lead-pages/:id` | Includes bullets, links, views, leads |
| Create | POST | `/lead-pages` | Body: `{name, template_id?, category_id?}` |
| **Clone** | POST | `/lead-pages/:id/clone` | Clones ALL settings, appends "(Copy)" to name |
| **Rename** | PUT | `/lead-pages/:id/rename` | Body: `{name}` |
| **Update Category** | PUT | `/lead-pages/:id/category` | Body: `{category_id}` |
| **Update URL** | PUT | `/lead-pages/:id/url` | Body: `{leadpage_keyword, conf_keyword?, domain_id?, domain_type?, redirect_type?}` |
| **Update SEO** | PUT | `/lead-pages/:id/seo` | Body: `{title?, description?, keywords?, author?, image?}` |
| **Update Pre-Headline** | PUT | `/lead-pages/:id/pre-headline` | Body: `{sub_headline}` |
| **Update Headline** | PUT | `/lead-pages/:id/headline` | Body: `{main_headline}` |
| **Update Post-Headline** | PUT | `/lead-pages/:id/post-headline` | Body: `{cta_statement}` |
| **Update Video** | PUT | `/lead-pages/:id/video` | Body: `{is_video_enabled, video_type?, video_url?}` |
| **Update Description** | PUT | `/lead-pages/:id/description` | Body: `{is_textblock_enabled, textblock_content?}` |
| **Update Bullets** | PUT | `/lead-pages/:id/bullets` | Body: `{bullet_title?, bullets: [{name, rotation_number?}]}` - REPLACES all bullets |
| **Update Template** | PUT | `/lead-pages/:id/template` | Body: `{template_id}` - Regenerates CSS |
| **Update Step Settings** | PUT | `/lead-pages/:id/step-settings` | Body: `{two_step_optin?, exit_intent_popup?, special_offer_popup?}` - Enable/disable popup behaviors |
| **Get Popup Settings** | GET | `/lead-pages/:id/popup` | Returns popup CSS styling and template |
| **Update Popup Content** | PUT | `/lead-pages/:id/popup/content` | Body: `{headline?, sub_headline?, button_text?, privacy_statement?, redirect?}` |
| **Update Popup Form Fields** | PUT | `/lead-pages/:id/popup/form-fields` | Body: `{email?, name?, phone?}` (each with enable, placeholder, required) |

#### Lead Page Create Body
```json
{
  "name": "My New Lead Page",
  "template_id": null,
  "category_id": null
}
```
*Note: Beta users limited to 5 lead pages. Auto-generates landing page settings, confirmation page, popup settings, and funnel links.*

#### Lead Page URL Update Body
```json
{
  "leadpage_keyword": "my-updated-slug",
  "conf_keyword": "my-updated-conf-slug",
  "domain_id": 1,
  "domain_type": "personal",
  "redirect_type": "conf_page"
}
```
*Note: `leadpage_keyword` and `conf_keyword` must be different. Keywords must be unique across poplinks, funnels, links on same domain.*

#### Lead Page Video Update Body
```json
{
  "is_video_enabled": true,
  "video_type": "vimeo",
  "video_url": "https://vimeo.com/123456789"
}
```

#### Lead Page Bullets Update Body
```json
{
  "bullet_title": "Here's What You'll Learn:",
  "bullets": [
    { "name": "Step-by-step blueprint for success" },
    { "name": "Proven strategies that work", "rotation_number": 1 },
    { "name": "Bonus templates included", "rotation_number": 2 }
  ]
}
```
*Note: ALL existing bullets are DELETED and replaced with the provided array.*

#### Lead Page Step Settings Update Body
```json
{
  "two_step_optin": true,
  "exit_intent_popup": false,
  "special_offer_popup": true
}
```
*Controls popup behaviors: 2-step (button → popup with form), exit intent, and special offers.*

#### Lead Page Popup Content Update Body
```json
{
  "headline": "Wait! Get Your Free Guide",
  "sub_headline": "Enter your email below",
  "button_text": "Get Instant Access",
  "privacy_statement": "We respect your privacy. Unsubscribe anytime.",
  "redirect": "https://yoursite.com/thank-you"
}
```

#### Lead Page Popup Form Fields Update Body
```json
{
  "email": {
    "enabled": true,
    "placeholder": "Your email address",
    "required": true
  },
  "name": {
    "enabled": true,
    "placeholder": "Your first name",
    "required": false
  },
  "phone": {
    "enabled": false,
    "placeholder": "Your phone number",
    "required": false
  }
}
```

#### Lead Page SEO Update Body
```json
{
  "title": "My Lead Page - Capture Leads",
  "description": "A high-converting lead capture page.",
  "keywords": "leads, marketing, funnel",
  "author": "Chad Nicely"
}
```
*Note: Send as multipart/form-data if uploading image. Fields set to "null" string = null.*

### PopLinks (Link Shortener) Endpoints (use /api/ai)

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| List all | GET | `/poplinks` | Returns array of poplink objects |
| Get one | GET | `/poplinks/:id` | Single poplink details |
| **Create** | POST | `/poplinks` | Body: `{name, destination_url, visible_url, domain_id, domain_type}` |
| Update | PUT | `/poplinks/:id` | Same fields as create |
| Delete | DELETE | `/poplinks/:id` | Removes the poplink |

#### Create PopLink Body
```json
{
  "name": "FlexiFunnels",
  "destination_url": "https://flexifunnels.com",
  "visible_url": "flexifunnels",
  "domain_id": 1977,
  "domain_type": "personal"
}
```
*Creates: `chadnicely.com/flexifunnels` → `https://flexifunnels.com`*

#### Key Fields
- `name` — Internal name for the link
- `destination_url` — Full URL with https:// (where traffic goes)
- `visible_url` — The slug/path (no leading slash)
- `domain_id` — ID from `/domains` endpoint
- `domain_type` — `"personal"` or `"system"`
- `status` — 1 = active, 0 = inactive

### Domains Endpoints (use /api/ai)

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| Get personal domains | GET | `/domains` | Chad's custom domains |
| Get system domains | GET | `/system-domains` | Shared domains (zipbeam, flexylinks, etc.) |

#### Key Personal Domain IDs (Chad's)
| Domain | ID |
|--------|-----|
| chadnicely.com | 1977 |
| localnewsletterhustle.com | (check /domains) |
| mintbird.com | (check /domains) |

### Templates Endpoint (use /api/ai)

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| List all | GET | `/templates` | Returns template IDs (names often empty) |

*Templates are numbered (1, 3, 4, 5... up to 252+). Use trial and error or check PopLinks UI for visual preview.*

### Stats Endpoints (use /api/ai)
| Action | Method | Endpoint |
|--------|--------|----------|
| Overview | GET | `/stats/overview` |
| Poplink stats | GET | `/stats/poplinks` |
| Funnel stats | GET | `/stats/funnels` |
| **Date range** | POST | `/stats/date-range` (body: start_date, end_date) |

### Create Bridge Page Body
```json
{
  "name": "My Bridge Page",
  "category_id": 1945,
  "template_id": null
}
```

### Update Bridge Page URL Body
```json
{
  "leadpage_keyword": "my-url-slug",
  "redirect_url": "https://destination.com",
  "domain_id": 1667,
  "domain_type": "personal",
  "redirect_type": "url"
}
```

### Key Category IDs
| Category | ID |
|----------|-----|
| Newsletter Hour | 1945 |
| Titanium Tech Call | 1442 |
| Round Table | 1443 |
| Entourage Strategy | 1506 |
| PowerPlay Offers | 1666 |
| Promotions | 1656 |

### Other Useful Endpoints
| Action | Method | Endpoint |
|--------|--------|----------|
| Get categories | GET | `/categories?type=2` |
| Get personal domains | GET | `/domains` |
| Get system domains | GET | `/system-domains` |
| Get templates | GET | `/templates` |
| List poplinks | GET | `/poplinks` |
| Create poplink | POST | `/poplinks` |

### PowerShell Quick Templates
```powershell
$headers = @{
    "Authorization" = "Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW"
    "Content-Type" = "application/json"
}

# ===== POPLINKS (Link Shortener) =====

# Create a poplink
$body = @{
    name = "FlexiFunnels"
    destination_url = "https://flexifunnels.com"
    visible_url = "flexifunnels"
    domain_id = 1977
    domain_type = "personal"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/poplinks" -Method POST -Headers $headers -Body $body

# ===== LEAD PAGES =====

# Create lead page
$body = @{ name = "My Lead Page" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/lead-pages" -Method POST -Headers $headers -Body $body

# Update headline
$body = @{ main_headline = "Your Amazing Headline Here" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/lead-pages/12345/headline" -Method PUT -Headers $headers -Body $body

# Update URL to personal domain
$body = @{ leadpage_keyword = "mypage"; conf_keyword = "mypage-thanks"; domain_id = 1977; domain_type = "personal" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/lead-pages/12345/url" -Method PUT -Headers $headers -Body $body

# Change template
$body = @{ template_id = 100 } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/lead-pages/12345/template" -Method PUT -Headers $headers -Body $body

# ===== BRIDGE PAGES =====

# List bridge pages
$pages = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages" -Method GET -Headers $headers
$pages.data.bridge_pages | Select-Object id, name, @{N='url';E={$_.funnel_links.leadpage_keyword}}

# Create bridge page
$body = @{ name = "27. Newsletter Hour"; category_id = 1945 } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages" -Method POST -Headers $headers -Body $body
```

**Full API docs:** `docs/apis/MintBird_API.json.json`

---

## 📊 MintBird Ad Stats API

**Base URL:** `https://api.poplinks.io/api/ai/ad-stats`
**Auth:** `Authorization: Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW` (same MintBird key)

### Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| List all campaigns | GET | `/campaigns` |
| Get single campaign | GET | `/campaigns/:id` |
| Get campaign plans | GET | `/campaigns/:id/plans` |
| Get campaign insights | GET | `/campaigns/:id/insights` |

### Get Campaign Insights (with date filtering)

```
GET /campaigns/:id/insights?date_range={preset}&status={status}
```

**`date_range` options:**
| Preset | Description | Example Range |
|--------|-------------|---------------|
| `today` | Today only | Feb 9 → Feb 9 |
| `yesterday` | Yesterday only | Feb 8 → Feb 8 |
| `week` | Last 7 days | Feb 2 → Feb 9 |
| `month` | Last 30 days | Jan 10 → Feb 9 |
| `year` | Last 365 days | Feb 9 2025 → Feb 9 2026 |
| `custom` | Custom range | Requires `date_start` & `date_stop` |

**Custom date range example:**
```
?date_range=custom&date_start=2026-02-01&date_stop=2026-02-09
```

**`status` options:** `ALL`, `ACTIVE`, `PAUSED` (default: ALL)

### Key Campaign IDs

| Campaign | ID |
|----------|-----|
| Local Newsletter Hustle | 118 |
| WVS | 443 |
| SaveTheDoggy | 69 |
| Training Test | 59 |

### Response Fields (totals)

| Field | Description |
|-------|-------------|
| `spend` | Total ad spend |
| `clicks` | Total clicks |
| `impressions` | Total impressions |
| `leads_count` | Total leads |
| `likes_count` | Total likes |
| `sales_count` | Total sales |
| `sales_amount` | Total sales revenue |
| `ctr` | Click-through rate % |
| `cpc` | Cost per click |
| `cpl` | Cost per lead |
| `cpa` | Cost per acquisition |
| `profit` | Calculated profit (sales - spend) |

### PowerShell Quick Example

```powershell
$headers = @{ "Authorization" = "Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW" }

# Get yesterday's stats for Local Newsletter Hustle
$result = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/ad-stats/campaigns/118/insights?date_range=yesterday" -Headers $headers
$result.data.totals

# Get last 30 days
$result = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/ad-stats/campaigns/118/insights?date_range=month" -Headers $headers
$result.data.totals
```

### Calculated Metrics

| Metric | Formula |
|--------|---------|
| ROAS | sales_amount / spend |
| AOV | sales_amount / sales_count |
| Profit per Sale | profit / sales_count |

### 📋 Report Format (Chad's Preferred)

**Template for daily reports:**
```
**Yesterday (DATE) - Verified:**

| Metric      | Value     |
|-------------|-----------|
| Total Sales | $X.XX     |
| Ad Spend    | $X.XX     |
| CPA         | $X.XX     |
| AOV         | $X.XX     |
| ROAS        | X.XXx     |
| PROFIT      | $X.XX     |
```

**Field Mapping from API:**
- Total Sales = `sales_amount`
- Ad Spend = `spend`
- CPA = `cpa`
- AOV = `sales_amount / sales_count`
- ROAS = `sales_amount / spend`
- PROFIT = `profit`

---

## 📰 Letterman API

**Base URL:** `https://api.letterman.ai/api/ai`
**Official Docs:** https://api.letterman.ai/ai-api-docs

**Authentication:**
```
Authorization: Bearer {jwt_token}
```

**Get Token:** `credentials/titanium-api-keys.txt` → `Letterman`

### Available AI Models
- `OPEN_AI` - OpenAI GPT models
- `GOOGLE_GEN_AI` - Google Gemini
- `GROK` - xAI Grok
- `CLAUDE` - Anthropic Claude

### Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Get current user | GET | `/user` |
| List publications | GET | `/newsletters-storage` |
| List articles | GET | `/newsletters-storage/{pubId}/newsletters?state={state}&type=ARTICLE` |
| Create article | POST | `/newsletters` |
| Get article | GET | `/newsletters/{id}` |
| Check URL path | POST | `/newsletters/check-url-path` |
| Update SEO | POST | `/newsletters/update-seo-settings/{id}` |
| Update summary | POST | `/newsletters/update-article-summary/{id}` |
| Add to newsletter cue | POST | `/newsletters/update-add-to-newsletter-cue/{id}` |
| Add to news feed | POST | `/newsletters/update-add-to-news-feed/{id}` |
| Get keyword suggestions | POST | `/newsletters/get-suggested-article-keywords` |

**Article states:** `DRAFT`, `PUBLISHED`, `NEED_APPROVAL`

### Key Publication IDs (Chad's Account - via ConnyJo)

| Publication | ID | Domain |
|-------------|-----|--------|
| West Valley Shoutouts | 677895a2584a3ce5878fcf5b | westvalleyshoutouts.com |
| Summerlin Shoutouts | 66569dc96c58db7f4dfff4a5 | summerlinshoutouts.com |
| Save The Doggy | 68a78eba3ce3e647df7fefaa | savethedoggy.com |
| Vegas Fork | 68a790aa3ce3e647df7ff272 | vegasfork.com |
| Summerlin Hair Salons | 68bc9ab49f0ba7c81fd95a90 | summerlinhairsalons.com |
| United Patriots | 68cd923993abe8e0c5d90e4e | unitedpatriotsassocation.com |

### Create Article - 3 Modes

**Mode 1: AI from URL**
```json
POST /newsletters
{
  "storageId": "{publication_id}",
  "type": "ARTICLE",
  "articleOptions": {
    "contentFrom": "URL",
    "url": "https://source-article.com/article",
    "wordsCount": 500,
    "keywords": "topic1,topic2",
    "aiModel": "OPEN_AI"
  }
}
```

**Mode 2: AI from Content**
```json
POST /newsletters
{
  "storageId": "{publication_id}",
  "type": "ARTICLE",
  "articleOptions": {
    "contentFrom": "CONTENT",
    "content": "Your source text here...",
    "wordsCount": 300,
    "keywords": "keyword1,keyword2",
    "aiModel": "OPEN_AI"
  }
}
```

**⚠️ Mode 3: keepOriginal (NO AI) - Use when I write content myself!**
```json
POST /newsletters
{
  "storageId": "{publication_id}",
  "type": "ARTICLE",
  "articleOptions": {
    "contentFrom": "CONTENT",
    "keepOriginal": true,
    "headline": "My Exact Title - Preserved",
    "subHeadline": "My exact subtitle",
    "content": "<p>My exact HTML content - no AI modification.</p>",
    "keywords": ["keyword1", "keyword2"],
    "imageUrl": "https://example.com/image.jpg",
    "summary": {
      "title": "Summary Title",
      "description": "Summary description",
      "content": "<p>Summary HTML</p>"
    }
  }
}
```

### Update Article SEO

```json
POST /newsletters/update-seo-settings/{id}
{
  "urlPath": "my-article-slug",
  "title": "SEO Title for Search",
  "description": "Meta description for search results",
  "noIndex": false
}
```

### Check URL Availability

```json
POST /newsletters/check-url-path
{
  "urlPath": "desired-slug",
  "newsletterId": "{article_id}"
}
```

### PowerShell Quick Examples

```powershell
$token = "[LETTERMAN_JWT_TOKEN]"
$headers = @{ "Authorization" = "Bearer $token" }

# List publications
$pubs = Invoke-RestMethod -Uri "https://api.letterman.ai/api/newsletters-storage" -Headers $headers
$pubs | ForEach-Object { "$($_._id) - $($_.name)" }

# List articles for West Valley Shoutouts
$pubId = "677895a2584a3ce5878fcf5b"
$articles = Invoke-RestMethod -Uri "https://api.letterman.ai/api/newsletters-storage/$pubId/newsletters?state=DRAFT&type=ARTICLE" -Headers $headers
$articles | Select-Object _id, title, state

# Create blank article
$body = @{ storageId = $pubId; type = "ARTICLE"; title = "My New Article" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.letterman.ai/api/newsletters" -Method POST -Headers $headers -Body $body -ContentType "application/json"

# Create AI article from URL
$body = @{
  storageId = $pubId
  type = "ARTICLE"
  articleOptions = @{
    contentFrom = "URL"
    url = "https://example.com/source-article"
    wordsCount = 400
    keywords = "las vegas,local news"
    aiModel = "OPEN_AI"
  }
} | ConvertTo-Json -Depth 3
Invoke-RestMethod -Uri "https://api.letterman.ai/api/newsletters" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### ⚠️ IMPORTANT RULES
1. **NEVER auto-publish** — Articles ALWAYS stay in DRAFT until Chad explicitly says "publish"
2. **Ask before creating** — AI-generated (costs tokens) vs Blank (no tokens)?
3. **Read operations** — Safe to run anytime
4. **Create article** — Creates new content, but starts as draft (safe)

---

## AgentMail - Email Drafts
- **Inbox:** nicelycollabs@agentmail.to
- **Workflow:** Chad forwards emails → I draft responses for review
- Check inbox with: `python -c "from agentmail import AgentMail; client = AgentMail(api_key='...'); print(client.inboxes.messages.list('nicelycollabs@agentmail.to'))"`

## Poplinks - Bridge Pages

**📚 COMPLETE WORKFLOW:** See `workflows/bridge-page-complete.md` for the full automation guide with token management and Vue.js solutions.

### Cloning a Bridge Page (Quick Reference)

1. **Find the last bridge page** for that call type (e.g., "26. Newsletter Hour")
2. **Note the number** - You'll create the next sequential number (26 → 27)
3. **Clone the page** - 3-dot menu → Clone Bridge Page
4. **Rename** - Remove "(Copy)" from name, change to next number (e.g., "27. Newsletter Hour"), **click checkmark to save**
5. **Category** - Usually inherited from cloned page. If not, 3-dot menu → Update Category
6. **Setup URL** - 3-dot menu → Setup URL's → Change to next number (e.g., `/27`)
7. **Save** - Click "Save Links"

**Stay on the dashboard!** Don't click into "Edit Bridge Page" unless actually editing content.

### Editing Bridge Page Content

After setup is complete, THEN go into Edit Bridge Page:
1. 3-dot menu → Edit Bridge Page
2. **For text**: Click on text → edit inline → click out (auto-saves)
3. **For video**: Click on video → right panel shows Video URL field → update URL
4. **Set video to PUBLIC** in Vimeo (manage view → Privacy dropdown → Public)
5. No Ctrl+S needed - changes auto-save when you click out

**TEXT EDITING IS SIMPLE:**
- Click text element in preview
- Type/edit directly inline
- Click anywhere else to save
- NO panel needed, NO DOM manipulation

### Categories by Page Type

| Page Type | Category |
|-----------|----------|
| Newsletter Hour | Newsletter Hour |
| Titanium Tech Call | Titanium Call |
| Round Table | Round Table |
| Entourage Strategy Call | Entourage |
| PPTraining | PowerPlay Offers |

---

## Vimeo API (Primary Method)

**Credentials:** `credentials/credentials-vimeo.txt`

| Key | Value |
|-----|-------|
| Access Token | `a82262ce7559e59ecd280a402a94b0a9` |
| User ID | `41953625` |
| Scopes | public, private, video_files |
| Client ID | `6b63507fbfb7e24ec56c09ce1d60a64081672e17` |
| Client Secret | `S5dURNGLqiNAcxiCB8zsJw9h/NTDb1G0r1gPS8cvJiC4xy5EmN6MF/E4fRmjggR/IIVETuNNPRHziOd30giVemw8QmQrjCx3LcITCHDIslv/g33yFzDKOB8EoosXXXuY` |

### API Endpoints
| Action | Endpoint |
|--------|----------|
| Search videos | `GET /users/41953625/videos?query=TERM` |
| Get video | `GET /videos/{video_id}` |
| Get transcripts | `GET /videos/{video_id}/texttracks` |

### Quick PowerShell Template
```powershell
$token = "a82262ce7559e59ecd280a402a94b0a9"
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.vimeo.*+json;version=3.4"
}

# Search for Newsletter Hour
$response = Invoke-RestMethod -Uri "https://api.vimeo.com/users/41953625/videos?query=newsletter&per_page=5&sort=date&direction=desc" -Method Get -Headers $headers
$response.data | ForEach-Object { Write-Output "$($_.name) - $($_.uri)" }

# Get transcripts
$tracks = Invoke-RestMethod -Uri "https://api.vimeo.com/videos/VIDEO_ID/texttracks" -Method Get -Headers $headers
$vttUrl = $tracks.data[0].link
Invoke-WebRequest -Uri $vttUrl -OutFile "transcripts/vimeo/filename.vtt"
```

**Full skill documentation:** `skills/vimeo-transcript/SKILL.md`

---

## Vimeo - Browser Fallback

### Search in Library
1. Go to `https://vimeo.com/manage/videos`
2. Use search bar and type video name (e.g., "newsletter 26")
3. Click "Library" tab (not "Vimeo" tab - that's public search)
4. Click on the video to open it
5. Click "Manage" to get settings page
6. URL format: `https://vimeo.com/{VIDEO_ID}` (e.g., `https://vimeo.com/1158544081`)

### Check Permissions
- In Manage view, right panel shows "Privacy"
- Should be set to **Public** ("Anyone on the internet can view")
- If not public, click dropdown and change it

### Video Naming Convention
- Newsletter Hour: `Local Newsletter Hour YYYY-MM-DD HH:MM:SS`
- Videos are in "Zoom Recordings" folder by default

### Newsletter Hour Schedule
- **Every Monday:** 10 AM - 12 PM PST
- **Automatic recap:** 2 PM PST every Monday
- **Process:** Use API to search → get transcript → create recap

### yt-dlp Fallback (if API fails)
```bash
yt-dlp --username "chad@chadnicely.com" --password "chad5148**" \
  --write-subs --write-auto-subs --sub-format vtt --skip-download \
  --output "transcripts/vimeo/newsletter-hour-YYYY-MM-DD" https://vimeo.com/VIDEO_ID
```

### Recap Format
Save to `recaps/[call-name]-YYYY-MM-DD.md` with:
- Video URL + transcript path at top
- **The Big News** - Main announcements
- **Key Topics** - What was covered
- **Highlights** - Memorable moments, quotes
- **Shoutouts** - Names mentioned
- **Action Items** - What to do next
- **Quotable Quote** - One standout line

**Save locations:**
- Transcript: `transcripts/vimeo/`
- Recap: `recaps/`

---

## Short-Form Video Tools (Researching)

### OpusClip (opus.pro)
- **Purpose:** Clip long-form video → short viral clips
- **Best for:** Repurposing recordings, podcasts, trainings into shorts
- **Features:** Auto-captions, reframing, works on any video type

### Blotato (blotato.com)
- **Purpose:** Content remixing & cross-posting
- **Best for:** Creating content from YouTube/articles, distributing everywhere
- **Features:** AI writer (trained on 1M+ viral posts), carousels, multi-platform scheduling

**Workflow idea:** Record training → OpusClip clips it → Blotato distributes to all platforms

---

Add whatever helps you do your job. This is your cheat sheet.

---

## 🌱 Course Sprout Image Sizes

| Asset | Dimensions |
|-------|------------|
| Course Image | 196px × 160px |
| Course Logo | 600px × 150px |
| Tab Icon | 600px × 150px |

## PopLinks - Complete Workflow

### Creating a PopLink

1. Login to https://app.poplinks.io/login
2. Click **PopLinks** in sidebar (menu expands)
3. Click **Create PopLink**
4. Fill form:
   - **Link Name:** Descriptive name (e.g., "Amazon Test")
   - **Destination URL:** Full URL with https:// (e.g., https://amazon.com)
   - **Status:** Click dropdown → Select "Active"
   - **Domain Settings:** 
     - System Domain = shared domains (zipBeam.com, flexyLinks.com, etc.)
     - Personal = your own domains (chadnicely.com, etc.)
   - **Domain:** Click dropdown → Select domain
   - **Visible URL:** Path without domain (e.g., /amazon)
   - Optional: Select Vendor, Select Group
5. Click **Save Changes**
6. Redirects to Link Bank showing new poplink

**Result:** Creates shortened link like `chadnicely.com/amazon` → `amazon.com`

### Editing a PopLink

1. Go to **PopLinks** → **Link Bank**
2. Find the link in the table
3. Click the **3-dot menu** (Action column) on that row
4. Select **Edit Link**
5. Make changes to any field
6. Click **Save Changes**

### Changing Domain (System → Personal)

When you need to use a personal domain like chadnicely.com instead of system domains:

1. In the Edit Link form, find **Domain Settings**
2. Click **Personal** radio button (switches from System Domain)
3. Click the domain dropdown - now shows personal domains:
   - chadnicely.com
   - localnewsletterhustle.com
   - titaniumsessions.com
   - etc.
4. Select your preferred domain
5. Click **Save Changes**

**Note:** If the Personal radio button won't click via automation, use JavaScript:
```javascript
document.querySelectorAll('input[type="radio"]')[1]?.click()
```

### Available Personal Domains (Chad's Account)
- chadnicely.com
- localnewsletterhustle.com
- titaniumsessions.com
- titaniumtechcall.com
- chadsroundtable.com
- entouragemastermind.org
- powerplayoffers.com
- mintbird.com
- coursesprout.com
- globalcontrol.io
- And many more...
