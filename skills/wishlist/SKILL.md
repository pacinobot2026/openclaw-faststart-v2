# WISHLIST SKILL

Manage Chad's wishlist of products, courses, and tools to buy.

## WHEN TO USE

Trigger: `/wishlist <URL>` or "add to wishlist"

## WHAT IT DOES

Automatically extracts metadata from any URL and adds it to the wishlist with:
- Clean URL (strips all UTM tracking parameters)
- Page title
- Meta description
- Meta image (og:image or twitter:image)
- Auto-categorization based on content

## WORKFLOW

### 1. Clean the URL
**Strip ALL tracking parameters:**
- `?fbclid=...`
- `&utm_source=`, `&utm_medium=`, `&utm_campaign=`, `&utm_term=`, `&utm_content=`, `&utm_id=`
- `&fbc_id=`, `&h_ad_id=`
- Any other UTM or tracking params

**Keep only:**
- Base domain
- Path
- Essential query params (like `?r=` for referral codes)

**Example:**
```
Before: https://example.com/product?r=abc123&utm_source=fb&fbclid=xyz
After:  https://example.com/product?r=abc123
```

### 2. Fetch Metadata (MANDATORY - ALWAYS)
**For ANY URL, ALWAYS extract all three:**
- Meta title
- Meta description
- Meta image (og:image or twitter:image)

Use PowerShell `Invoke-WebRequest` to grab:
```powershell
$response = Invoke-WebRequest -Uri $cleanUrl -UseBasicParsing
$html = $response.Content

# Extract title
$title = if ($html -match '<title>([^<]+)</title>') { $matches[1] } else { "Unknown" }

# Extract og:image or twitter:image
$ogImage = if ($html -match 'property="og:image" content="([^"]+)"') { 
    $matches[1] 
} elseif ($html -match 'name="twitter:image" content="([^"]+)"') { 
    $matches[1] 
} else { 
    $null 
}

# Extract description
$ogDesc = if ($html -match 'property="og:description" content="([^"]+)"') { 
    $matches[1] 
} elseif ($html -match 'name="description" content="([^"]+)"') { 
    $matches[1] 
} else { 
    "" 
}
```

### 3. Auto-Categorize
Analyze title, URL, and description to pick category:

**Categories:**
- **Software/Tools** - SaaS, apps, tech products
- **Training/Courses** - Workshops, masterminds, courses, education
- **Marketing** - Ad tools, marketing platforms, agency services
- **Business Models** - Systems, frameworks, opportunities
- **Books/Resources** - Guides, ebooks, templates
- **Services** - Done-for-you, consulting, agencies

**Detection logic:**
```javascript
const url = cleanUrl.toLowerCase();
const text = (title + ' ' + description).toLowerCase();

if (url.includes('gumroad') || url.includes('udemy') || url.includes('course') || 
    text.includes('workshop') || text.includes('training') || text.includes('mastery')) {
    category = 'Training/Courses';
}
else if (url.includes('.app') || url.includes('saas') || text.includes('software')) {
    category = 'Software/Tools';
}
else if (text.includes('marketing') || text.includes('ads') || text.includes('agency')) {
    category = 'Marketing';
}
else if (text.includes('business model') || text.includes('system') || text.includes('framework')) {
    category = 'Business Models';
}
// Default: Training/Courses
```

### 4. Insert to Database
```javascript
const { data, error } = await supabase
  .from('shopping_items')
  .insert({
    user_id: '08dee908-d31b-4c19-ae7d-227ccbb068cf',
    title: extractedTitle,
    url: cleanUrl,
    description: extractedDescription,
    category: autoCategory,
    status: 'need-to-buy',  // ALWAYS default
    price: null,
    image: extractedImage || null,
    tags: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
```

### 5. Response
**Format:** `Added to Wishlist: [Item Name]`

**Example:** `Added to Wishlist: OpenClaw Mastery`

## DATABASE SCHEMA

**Table:** `shopping_items`

```sql
id              INTEGER PRIMARY KEY
user_id         UUID (always: 08dee908-d31b-4c19-ae7d-227ccbb068cf)
title           TEXT (from meta title or page title)
url             TEXT (clean, no tracking params)
description     TEXT (from og:description or meta description)
category        TEXT (auto-detected)
status          TEXT (default: 'need-to-buy')
price           TEXT (null unless specified)
image           TEXT (from og:image or twitter:image)
tags            TEXT (null)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## STATUS COLUMNS

**Dashboard has 3 columns:**
1. **Need to Buy** (status: `need-to-buy`) - Default for all new items
2. **Research** (status: `research`) - Items being evaluated
3. **Bought** (status: `bought`) - Purchased items

## CREDENTIALS

**Supabase:**
- URL: `https://jqqvqdjxviqnsgpxcgfs.supabase.co`
- Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXZxZGp4dmlxbnNncHhjZ2ZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2MjIwOSwiZXhwIjoyMDg3NTM4MjA5fQ.ibJyHrxx2TlfRbfh-9IKD3-kY9aSXAfrDJ1ZHVFijOQ`

## DASHBOARD

**URL:** https://vizard-clips-app.vercel.app/wish-list

**Features:**
- View items by status (Need to Buy / Research / Bought)
- Expandable descriptions (hidden by default, click "Show details")
- Images displayed above title
- Edit/delete items
- Filter by category
- Search items

## ERROR HANDLING

**If meta image not found:**
- Use placeholder: `https://placehold.co/600x400/1a1a2e/00d4ff?text=ItemName`
- Replace spaces with `+` in text param

**If page load fails:**
- Still save the item with URL
- Title: Extract from URL or use "Unknown"
- Description: Empty string
- Category: "Training/Courses" (default)

## COMPLETE EXAMPLE

**User says:** `/wishlist https://example.com/course?utm_source=fb`

**What happens:**
1. Strip tracking: `https://example.com/course`
2. Fetch page metadata
3. Extract: title="Amazing Course", og:image="...", description="Learn..."
4. Auto-categorize: "Training/Courses"
5. Insert to database with status="need-to-buy"
6. Reply: `Added to Wishlist: Amazing Course`

**Result visible at:** https://vizard-clips-app.vercel.app/wish-list in "Need to Buy" column

## NOTES

- **ALWAYS strip UTM parameters** - this is mandatory
- **ALWAYS default to "need-to-buy" status**
- **ALWAYS try to fetch meta image**
- **Response format:** Simple one-liner only
- **If no category detected:** Use "Training/Courses" as fallback
