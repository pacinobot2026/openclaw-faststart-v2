# Letterman Article Creation Workflow

*Last updated: 2026-02-13*

## Before Creating ANY Article - ASK:

1. **Blank or AI-generated?**
   - Blank = I write the content with `keepOriginal: true`
   - AI-generated = Letterman AI writes from URL or text

2. **Local or Niche article?**
   - **LOCAL** = Follow local SEO strategy (location keywords, local landmarks, community focus)
   - **NICHE** = Topic-focused SEO strategy

3. **How many words?** (e.g., 350)

4. **Do you have an image URL?** Or should I generate one?

---

## Article Creation Process

### Step 1: Gather Requirements
- Publication ID (e.g., West Valley Shoutouts = `677895a2584a3ce5878fcf5b`)
- Word count
- Topic/source
- Local vs Niche
- Image (URL or generate with DALL-E)

### Step 2: Generate Image (if needed)
```powershell
$env:OPENAI_API_KEY = "[key from config]"
C:\Python314\python.exe "C:\Users\Administrator\AppData\Roaming\npm\node_modules\openclaw\skills\openai-image-gen\scripts\gen.py" --prompt "[descriptive prompt]" --count 1 --model dall-e-3 --quality hd --size 1792x1024 --out-dir "./images/[article-name]"
```

Then upload to catbox:
```powershell
curl.exe -F "reqtype=fileupload" -F "fileToUpload=@[image-path]" "https://catbox.moe/user/api.php"
```

### Step 3: Create Article with keepOriginal

**CRITICAL FORMATTING:**
- Every sentence gets its own `<p>` tag
- Add `<p>&nbsp;</p>` after EACH sentence for spacing
- Include image URL in `articleOptions.imageUrl`
- Include image URL in `summary.imageUrl`

```powershell
$body = @{
  storageId = "[publication_id]"
  type = "ARTICLE"
  articleOptions = @{
    contentFrom = "CONTENT"
    keepOriginal = $true
    headline = "[Main Headline]"
    subHeadline = "[Subtitle]"
    content = "[HTML content with proper spacing]"
    imageUrl = "[image_url]"
    keywords = @("keyword1", "keyword2", ...)
    summary = @{
      title = "[Summary Title]"
      description = "[Summary Description]"
      imageUrl = "[image_url]"
      content = "[Summary HTML]"
    }
  }
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod -Uri "https://api.letterman.ai/api/ai/newsletters" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Step 4: Set ALL Image Fields via SEO Endpoint

```powershell
$seoBody = @{
  urlPath = "[clean-url-slug]"
  previewImageUrl = "[image_url]"
  archiveThumbnailImageUrl = "[image_url]"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.letterman.ai/api/ai/newsletters/update-seo-settings/$($response._id)" -Method POST -Headers $headers -Body $seoBody -ContentType "application/json"
```

### Alternative: Upload Image Directly to Letterman (NEW!)

Instead of catbox.moe, upload directly to Letterman storage:

```powershell
$form = @{
    images = Get-Item -Path "images/my-image.png"
}
$uploadResponse = Invoke-RestMethod -Uri "https://api.letterman.ai/api/ai/images" -Method POST -Headers $headers -Form $form
$imageUrl = $uploadResponse.imageUrls[0]
```

### Step 5: Update Sections if Needed (NEW!)

Articles have sections (content blocks). The HEADLINE_COMBO section contains:
- `title` = Main Article Headline
- `promptOutPut` = Article Sub Headline

To update headline/subheadline directly:

```powershell
# Get sections
$sections = Invoke-RestMethod -Uri "https://api.letterman.ai/api/ai/newsletters/$articleId/sections" -Headers $headers

# Find HEADLINE_COMBO section
$headlineSection = $sections | Where-Object { $_.type -eq "HEADLINE_COMBO" }

# Update it
$updateBody = @{
  title = "Main Article Headline"
  promptOutPut = "Article Sub Headline"
  imageUrl = "[image_url]"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.letterman.ai/api/ai/newsletters/$articleId/sections/$($headlineSection._id)" -Method PUT -Headers $headers -Body $updateBody -ContentType "application/json"
```

---

## Content Formatting Rules

### Paragraph Spacing (CRITICAL!)
```html
<p>First sentence here.</p>
<p>&nbsp;</p>
<p>Second sentence here.</p>
<p>&nbsp;</p>
<p>Third sentence here.</p>
```

Every period = new paragraph + blank line after it.

### Strategic Bolding (for readability + light SEO)
Bold sparingly - only the most important terms:
- **Location names** (Summerlin, Las Vegas, Nevada)
- **Program/business names** (Acting Through Law, With Love Always)
- **Organization names** (Clark County, Red Rock Resort)
- **Key people's names** when introduced

**DON'T bold:**
- Every keyword (looks spammy)
- Common words
- Entire sentences

Example:
```html
<p>A 16-year-old <strong>Las Vegas</strong> teen launched "<strong>Acting Through Law</strong>," a program for young performers in <strong>Southern Nevada</strong>.</p>
```

---

## SEO Strategy

**Both LOCAL and NICHE articles get SEO optimized. LOCAL is easier (location keywords). NICHE requires more research.**

---

## Local SEO Strategy (EASIER)

When article is LOCAL (e.g., West Valley Shoutouts, Summerlin Shoutouts):

### Keywords Must Include:
- Neighborhood name (Summerlin, West Valley, etc.)
- City (Las Vegas)
- State (Nevada, NV)
- Specific landmarks/locations mentioned
- Local business names

### Content Should:
- Mention specific streets, intersections, or addresses
- Reference local landmarks residents would recognize
- Include "Summerlin residents" or similar local callouts
- Mention nearby businesses or areas
- Use phrases like "west side of the valley"

### Headline Tips:
- Lead with location when possible
- Example: "Summerlin's Red Rock Resort Getting Viral Burger Spot"
- Include neighborhood name in headline or subheadline

---

## Niche SEO Strategy (REQUIRES MORE RESEARCH)

When article is NICHE (e.g., Save The Doggy, Vegas Fork):

### Keywords Research:
- Search for trending terms in the niche
- Check what competitors rank for
- Use long-tail keywords (more specific = less competition)
- Include problem/solution keywords people search for

### Keywords Should Include:
- Primary topic keyword
- Related search terms
- Industry terminology
- Common questions people ask about this topic

### Content Should:
- Answer common search queries
- Include relevant statistics or facts
- Reference authoritative sources
- Use niche-specific language
- Target "People Also Ask" type questions
- Include semantic keywords (related terms)

---

## Publication IDs Reference

| Publication | ID | Type |
|-------------|-----|------|
| West Valley Shoutouts | 677895a2584a3ce5878fcf5b | LOCAL |
| Summerlin Shoutouts | 66569dc96c58db7f4dfff4a5 | LOCAL |
| Save The Doggy | 68a78eba3ce3e647df7fefaa | NICHE |
| Vegas Fork | 68a790aa3ce3e647df7ff272 | NICHE |
| Summerlin Hair Salons | 68bc9ab49f0ba7c81fd95a90 | NICHE |
| United Patriots | 68cd923993abe8e0c5d90e4e | NICHE |

---

## Quick Checklist Before Creating

- [ ] Asked: Blank or AI-generated?
- [ ] Asked: Local or Niche?
- [ ] Asked: Word count?
- [ ] Asked: Image URL or generate?
- [ ] Have publication ID
- [ ] Content has proper `<p>&nbsp;</p>` spacing
- [ ] All image fields will be set (articleOptions, summary, SEO)
- [ ] Keywords include location terms (if LOCAL)
