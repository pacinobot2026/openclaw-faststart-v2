---
name: mintbird
description: MintBird/PopLinks API automation for sales funnels, bridge pages, lead pages, poplinks, and ad campaign stats. Use when asked to create/clone/edit bridge pages, create poplinks, pull ad campaign stats, get leads, or manage funnel categories. Also triggers for "PopLinks" tasks since they share the same API.
---

# MintBird Skill

MintBird and PopLinks share the same API.

## API Versions

| API | Base URL | Use For |
|-----|----------|---------|
| **AI API** (Primary) | `https://api.poplinks.io/api/ai` | Bridge pages, lead pages, poplinks, categories, stats, products, orders |
| **Ad Stats API** | `https://api.poplinks.io/api/ai/ad-stats` | Campaign insights, spend, sales tracking |

## Credentials

**API Key:** `z12Y1nJjkG275WIEJKM58QsnGoAoIhuW`
**Credentials file:** `credentials/titanium-api-keys.txt`

**Headers:**
```powershell
$headers = @{
    "Authorization" = "Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW"
    "Content-Type" = "application/json"
}
```

---

## 🎯 Complete Bridge Page Replay Workflow

This is the full workflow for creating a Newsletter Hour replay page.

### Step 1: Find Latest Bridge Page to Clone

```powershell
$response = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages" -Method GET -Headers $headers

# Filter by Newsletter Hour category (1945) and sort by name
$nlhPages = $response.data.bridge_pages | Where-Object { $_.category_id -eq 1945 } | Sort-Object name -Descending
$latest = $nlhPages[0]
Write-Host "Latest: ID $($latest.id) | $($latest.name)"
```

### Step 2: Clone the Page

```powershell
$sourceId = $latest.id
$clone = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/$sourceId/clone" -Method POST -Headers $headers
$newId = $clone.data.bridge_page.id
Write-Host "Cloned! New ID: $newId"
```

### Step 3: Rename

```powershell
$body = @{ name = "27. Newsletter Hour" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/$newId/rename" -Method PUT -Headers $headers -Body $body
```

### Step 4: Update URL

```powershell
$body = @{
    leadpage_keyword = "27"
    domain_id = 2473  # localnewsletterhustle.com
    domain_type = "personal"
    redirect_type = "url"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/$newId/url" -Method PUT -Headers $headers -Body $body
```

### Step 5: Update Video

```powershell
$body = @{
    is_video_enabled = $true
    video_type = "vimeo"
    video_url = "https://vimeo.com/1161210235"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/$newId/video" -Method PUT -Headers $headers -Body $body
```

### Step 6: Update Sub-headline (Date)

```powershell
$body = @{
    sub_headline = '<div>Replay from the Local Newsletter Hour - <u style="font-weight: bold;">02/02/26</u></div>'
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/$newId/pre-headline" -Method PUT -Headers $headers -Body $body
```

### Step 7: Update Headline

```powershell
$body = @{
    main_headline = "We Just Cracked The Code On 100% Hands-Free Newsletter Creation... And It's Insane!"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/$newId/headline" -Method PUT -Headers $headers -Body $body
```

### Step 8: Update CTA

```powershell
$body = @{
    cta_statement = "Plus: The 'Inbox Syndicate' strategy that's changing everything for local newsletter publishers"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/$newId/post-headline" -Method PUT -Headers $headers -Body $body
```

### Step 9: Update Text Block (Meeting Notes)

```powershell
$notes = @"
<div style="padding: 15px 5px; font-size: 18px; line-height: 2; color: #222;">
<p style="font-size: 20px; font-weight: 600; margin-bottom: 25px;">Local Newsletter Hour — February 2</p>
<p>✅ Description of segment one. 00:00:00 - 00:05:00</p>
<p>✅ Description of segment two. 00:05:00 - 00:12:00</p>
</div>
"@

$body = @{
    is_textblock_enabled = $true
    textblock_content = $notes
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/$newId/description" -Method PUT -Headers $headers -Body $body
```

⚠️ **IMPORTANT:** The API saves text block content but does NOT enable visibility. The user must toggle "Text Block" ON in the PopLinks page editor UI. Same applies to Bullets.

---

## Meeting Notes Format (Chad's Preferred Style)

```
<Call Name> — <Month Day>

✅ Brief description of what happened in this segment. 00:00:00 - 00:05:00

✅ Another topic with timestamp range at end. 00:05:00 - 00:12:00
```

**Rules:**
- Start each bullet with ✅ checkmark
- One concise sentence per bullet
- Timestamp range at END (HH:MM:SS - HH:MM:SS)
- Cover the ENTIRE video length, not just first few minutes
- Personal/casual tone, not formal
- "Executive clear" — no rambling or filler

---

## All Bridge Page Update Endpoints

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| Rename | PUT | `/bridge-pages/:id/rename` | `{name}` |
| Category | PUT | `/bridge-pages/:id/category` | `{category_id}` |
| URL | PUT | `/bridge-pages/:id/url` | `{leadpage_keyword, domain_id, domain_type, redirect_type}` |
| SEO | PUT | `/bridge-pages/:id/seo` | `{title, description, keywords, author}` |
| Pre-headline | PUT | `/bridge-pages/:id/pre-headline` | `{sub_headline}` |
| Headline | PUT | `/bridge-pages/:id/headline` | `{main_headline}` |
| Post-headline | PUT | `/bridge-pages/:id/post-headline` | `{cta_statement}` |
| Video | PUT | `/bridge-pages/:id/video` | `{is_video_enabled, video_type, video_url}` |
| Description | PUT | `/bridge-pages/:id/description` | `{is_textblock_enabled, textblock_content}` |
| Bullets | PUT | `/bridge-pages/:id/bullets` | `{bullet_title, bullets: [{name}]}` |
| Template | PUT | `/bridge-pages/:id/template` | `{template_id}` |

---

## Key IDs

### Bridge Page Categories
| Category | ID |
|----------|-----|
| Newsletter Hour | 1945 |
| Titanium Tech Call | 1442 |
| Round Table | 1443 |
| Entourage Strategy | 1506 |
| PowerPlay Offers | 1666 |
| Promotions | 1656 |

### Personal Domains
| Domain | ID | Used For |
|--------|-----|----------|
| localnewsletterhustle.com | 2473 | Newsletter Hour replays |
| chadnicely.com | 1977 | General |
| titaniumtechcall.com | 1667 | Tech calls |
| chadsroundtable.com | 1668 | Round table |

### Ad Campaigns
| Campaign | ID |
|----------|-----|
| Local Newsletter Hustle | 118 |
| WVS | 443 |
| SaveTheDoggy | 69 |

---

## Ad Stats

```powershell
# Yesterday's stats
$r = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/ad-stats/campaigns/118/insights?date_range=yesterday" -Headers $headers
$r.data.totals

# Custom date range
$r = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/ad-stats/campaigns/118/insights?date_range=custom&date_start=2026-02-01&date_stop=2026-02-10" -Headers $headers
```

**Date Range Options:** today, yesterday, week, month, year, custom

---

## Known Limitations

1. **Text Block / Bullets visibility** — API can save content but cannot enable the display toggle. User must enable in UI.

2. **Rotation settings** — The `rotation_setting` array controls which modules display (Textblock, Bullets, etc.) but there's no API endpoint to modify it.

3. **Beta limits** — Some accounts limited to 5 lead pages.

---

## Full API Reference

→ https://api.poplinks.io/ai-api-docs
