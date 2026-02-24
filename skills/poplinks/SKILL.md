# PopLinks / MintBird API Skill

> **Same API!** MintBird and PopLinks share the identical API.

## Overview
- **API Name:** PopLinks AI API (shared with MintBird)
- **Base URL:** `https://api.poplinks.io/api/ai`
- **Auth:** Bearer token in `Authorization` header
- **API Key Location:** `credentials/titanium-api-keys.txt` (MintBird key)

## Authentication
```
Authorization: Bearer {api_key}
Content-Type: application/json
```

## Quick Reference

### Helpers (Reference Data)
| Action | Method | Endpoint |
|--------|--------|----------|
| Get System Domains | GET | `/system-domains` |
| Get Personal Domains | GET | `/domains` |
| Get Groups | GET | `/groups` |
| Get Vendors | GET | `/vendors` |
| Get Templates | GET | `/templates` |

### PopLinks (Short Links)
| Action | Method | Endpoint |
|--------|--------|----------|
| List All | GET | `/poplinks` |
| Get Single | GET | `/poplinks/:id` |
| Get Clicks | GET | `/poplinks/:id/clicks?page=1` |
| Create | POST | `/poplinks` |

### Lead Pages
| Action | Method | Endpoint |
|--------|--------|----------|
| List All | GET | `/lead-pages` |
| Get Single | GET | `/lead-pages/:id` |
| Create | POST | `/lead-pages` |
| Clone | POST | `/lead-pages/:id/clone` |
| Rename | PUT | `/lead-pages/:id/rename` |
| Update URL | PUT | `/lead-pages/:id/url` |
| Update Category | PUT | `/lead-pages/:id/category` |
| Update SEO | PUT | `/lead-pages/:id/seo` |
| Update Pre-Headline | PUT | `/lead-pages/:id/pre-headline` |
| Update Headline | PUT | `/lead-pages/:id/headline` |
| Update Post-Headline | PUT | `/lead-pages/:id/post-headline` |
| Update Video | PUT | `/lead-pages/:id/video` |
| Update Description | PUT | `/lead-pages/:id/description` |
| Update Bullets | PUT | `/lead-pages/:id/bullets` |
| Update Template | PUT | `/lead-pages/:id/template` |

### Bridge Pages
| Action | Method | Endpoint |
|--------|--------|----------|
| List All | GET | `/bridge-pages` |
| Get Single | GET | `/bridge-pages/:id` |
| Create | POST | `/bridge-pages` |
| Clone | POST | `/bridge-pages/:id/clone` |
| Rename | PUT | `/bridge-pages/:id/rename` |
| Update URL | PUT | `/bridge-pages/:id/url` |
| Update Category | PUT | `/bridge-pages/:id/category` |
| Update SEO | PUT | `/bridge-pages/:id/seo` |
| Update Pre-Headline | PUT | `/bridge-pages/:id/pre-headline` |
| Update Headline | PUT | `/bridge-pages/:id/headline` |
| Update Post-Headline | PUT | `/bridge-pages/:id/post-headline` |
| Update Video | PUT | `/bridge-pages/:id/video` |
| Update Description | PUT | `/bridge-pages/:id/description` |
| Update Bullets | PUT | `/bridge-pages/:id/bullets` |
| Update Template | PUT | `/bridge-pages/:id/template` |

### Leads
| Action | Method | Endpoint |
|--------|--------|----------|
| List All | GET | `/leads?page=1` |
| By Funnel | GET | `/leads/funnel/:funnel_id?page=1` |

### Categories
| Action | Method | Endpoint |
|--------|--------|----------|
| List All | GET | `/categories` |
| Create | POST | `/categories` |
| Update | PUT | `/categories/:id` |
| Delete | DELETE | `/categories/:id` |

### Stats
| Action | Method | Endpoint |
|--------|--------|----------|
| Overview | GET | `/stats/overview` |
| Poplink Stats | GET | `/stats/poplinks` |
| Funnel Stats | GET | `/stats/funnels` |
| Date Range | POST | `/stats/date-range` |

### Products & Orders
| Action | Method | Endpoint |
|--------|--------|----------|
| Get Products | GET | `/products?type=physical` |
| Get Orders | POST | `/orders?page=1` |

### Ad Stats (Campaign Insights)
| Action | Method | Endpoint |
|--------|--------|----------|
| List Campaigns | GET | `/ad-stats/campaigns` |
| Get Campaign | GET | `/ad-stats/campaigns/:id` |
| Get Plans | GET | `/ad-stats/campaigns/:id/plans` |
| Get Insights | GET | `/ad-stats/campaigns/:id/insights` |

---

## Request Body Schemas

### Create PopLink
```json
{
  "name": "Link Name",
  "destination_url": "https://example.com",
  "domain_type": "personal|system",
  "domain_id": 1667,
  "visible_url": "my-slug",
  "group_id": null,
  "vendor_id": null,
  "status": 1
}
```

### Create Lead Page / Bridge Page
```json
{
  "name": "Page Name",
  "template_id": null,
  "category_id": null
}
```

### Update URL (Lead/Bridge Page)
```json
{
  "leadpage_keyword": "my-slug",
  "conf_keyword": "my-conf-slug",
  "redirect_url": "https://destination.com",
  "domain_id": 1667,
  "domain_type": "personal",
  "redirect_type": "url|conf_page"
}
```

### Update Headline
```json
{
  "main_headline": "Your Headline Text"
}
```

### Update Pre-Headline
```json
{
  "sub_headline": "Your Pre-Headline Text"
}
```

### Update Post-Headline
```json
{
  "cta_statement": "Your CTA Text"
}
```

### Update Video
```json
{
  "is_video_enabled": true,
  "video_type": "vimeo|youtube",
  "video_url": "https://vimeo.com/123456789"
}
```

### Update Description
```json
{
  "is_textblock_enabled": true,
  "textblock_content": "<p>HTML content here</p>"
}
```

### Update Bullets
```json
{
  "bullet_title": "Why You Should Act Now:",
  "bullets": [
    { "name": "Bullet point 1" },
    { "name": "Bullet point 2", "rotation_number": 1 },
    { "name": "Bullet point 3", "rotation_number": 2 }
  ]
}
```
*Note: ALL existing bullets are DELETED and replaced.*

### Update SEO
```json
{
  "title": "SEO Title",
  "description": "Meta description",
  "keywords": "keyword1, keyword2",
  "author": "Author Name"
}
```
*Note: For image upload, use multipart/form-data*

### Update Category
```json
{
  "category_id": 1945
}
```

### Update Template
```json
{
  "template_id": 1
}
```

### Rename Page
```json
{
  "name": "New Page Name"
}
```

### Create Category
```json
{
  "name": "Category Name",
  "type": "1|2",
  "domain_id": null
}
```
*Type: 1 = Lead Pages, 2 = Bridge Pages*

### Stats Date Range
```json
{
  "start_date": "2025-01-01",
  "end_date": "2025-01-31"
}
```

### Get Orders
```json
{
  "product_ids": [1, 2, 3]
}
```

---

## Key Category IDs (Chad's Account)
| Category | ID | Type |
|----------|-----|------|
| Newsletter Hour | 1945 | Bridge |
| Titanium Tech Call | 1442 | Bridge |
| Round Table | 1443 | Bridge |
| Entourage Strategy | 1506 | Bridge |
| PowerPlay Offers | 1666 | Bridge |
| Promotions | 1656 | Bridge |

## Key Domain IDs (Chad's Account)
| Domain | ID |
|--------|-----|
| chadnicely.com | 1638 |
| entouragemastermind.org | 1644 |
| nicelymediallc.com | 1662 |
| titaniumtechcall.com | 1667 |
| chadsroundtable.com | 1668 |
| titaniumsessions.com | 1695 |
| titaniumintensive.com | 1698 |
| poplinksapp.com | 1735 |
| nicelysupport.com | 1790 |

## Key Campaign IDs (Ad Stats)
| Campaign | ID |
|----------|-----|
| Local Newsletter Hustle | 118 |
| WVS | 443 |
| SaveTheDoggy | 69 |

---

## Ad Stats Insights Parameters

### date_range options
| Value | Description |
|-------|-------------|
| `today` | Today only |
| `yesterday` | Yesterday only |
| `week` | Last 7 days |
| `month` | Last 30 days |
| `year` | Last 365 days |
| `all` | All time |
| `custom` | Requires date_start & date_stop |

### status options
| Value | Description |
|-------|-------------|
| `ALL` | All ads (default) |
| `ACTIVE` | Active ads only |
| `PAUSED` | Paused ads only |

### Custom date range
```
?date_range=custom&date_start=2026-02-01&date_stop=2026-02-11
```

---

## Pagination

Endpoints returning lists are paginated:
- Default: 20 results per page (leads, orders: 10 per page)
- Use `?page=X` to navigate
- Response includes: `current_page`, `last_page`, `per_page`, `total`

---

## Response Structure

### Success
```json
{
  "success": true,
  "message": "Action completed successfully.",
  "data": { ... }
}
```

### Error (404)
```json
{
  "success": false,
  "message": "Resource not found."
}
```

### Validation Error (422)
```json
{
  "success": false,
  "message": {
    "field_name": ["Error message"]
  }
}
```

---

## Common Workflows

### Find a PopLink by name/search
1. GET `/poplinks` — returns all links
2. Filter locally by name or destination_url
3. Extract domain + visible_url for the short link

### Create Newsletter Hour Bridge Page
1. POST `/bridge-pages` with `{name, category_id: 1945}`
2. PUT `/bridge-pages/:id/url` with slug + domain
3. PUT `/bridge-pages/:id/headline` with headline
4. PUT `/bridge-pages/:id/video` with Vimeo URL
5. Done!

### Clone Existing Page
1. POST `/bridge-pages/:id/clone` — returns new page with "(Copy)" suffix
2. PUT `/bridge-pages/:newid/rename` to fix name
3. PUT `/bridge-pages/:newid/url` to set new slug
4. Update content as needed

### Get Yesterday's Ad Stats
```
GET /ad-stats/campaigns/118/insights?date_range=yesterday
```

---

## Safety Rules

1. **Never delete without confirmation** — categories can only be deleted if empty
2. **Bullets replace entirely** — always provide full bullet list
3. **URL slugs must be unique** — across poplinks, funnels, links on same domain
4. **Test in dry-run first** — verify endpoints before bulk operations

---

## PowerShell Quick Test
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_API_KEY"
    "Content-Type" = "application/json"
}

# List poplinks
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/poplinks" -Headers $headers

# List bridge pages
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages" -Headers $headers

# Get ad stats
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/ad-stats/campaigns/118/insights?date_range=yesterday" -Headers $headers
```
