# Content Automation Fallback System

**Created:** 2026-03-03 1:00 AM (Overnight Build)
**Purpose:** Ensure Monday articles ALWAYS get created, even without web access

---

## Problem Solved

**Before:** Content automation failed completely when web tools were unavailable:
- Article Bank Refresh needs Brave API + browser
- Article Creation Day needs content bank sources
- Result: Zero articles created, manual work required

**After:** Fallback system uses evergreen templates when web tools fail:
- 30+ pre-written templates (10 per publication)
- Automated fallback script
- Articles ALWAYS created on schedule

---

## System Architecture

### Component 1: Evergreen Template Library

**Location:** `content-bank/templates/`

**Files:**
- `west-valley-shoutouts.md` - 10 LOCAL templates
- `save-the-doggy.md` - 10 NICHE templates
- `vegas-fork.md` - 10 NICHE templates

**Template Structure:**
```markdown
## Template N: [Category]
**Hook:** "[Compelling headline]"
**Angle:** [Article approach]
**Content Structure:** [Outline]
**Keywords:** [SEO terms]
```

**Topics Covered:**
- **West Valley:** Hidden businesses, safety, family activities, new resident guides, schools, fitness, pets, local support, history, events
- **Save The Doggy:** Urgent appeals, success stories, breed spotlights, senior dogs, fostering, shelter partnerships, education, special needs, events, volunteer opportunities
- **Vegas Fork:** Hidden gems, best-of lists, chef profiles, recipes, new openings, closings, seasonal menus, food trends, neighborhood guides, budget dining

---

### Component 2: Fallback Creation Script

**Location:** `scripts/create-articles-with-fallback.ps1`

**Functionality:**
1. Checks for content bank sources (`content-bank/YYYY-MM-DD/sources.md`)
2. If sources exist → Recommends manual creation (higher quality)
3. If sources missing → Uses templates (fallback mode)
4. Picks random template per publication
5. Creates AI-generated article via Letterman API
6. Saves as DRAFT for Chad's review

**Usage:**
```powershell
# Normal run (only if no sources)
./scripts/create-articles-with-fallback.ps1

# Force template use even with sources
./scripts/create-articles-with-fallback.ps1 -Force

# Test without creating articles
./scripts/create-articles-with-fallback.ps1 -DryRun
```

**Output:**
- 3 DRAFT articles (1 per publication)
- Summary report
- Article IDs for tracking

---

## Monday Workflow (Updated)

### 10:00 AM - Article Bank Refresh

**Preferred Path (with web access):**
1. Search for fresh sources (2-3 weeks old)
2. Save to `content-bank/YYYY-MM-DD/sources.md`
3. Curate 5-7 sources per publication
4. Rank by priority

**Fallback (no web access):**
1. Create empty sources file as marker
2. Skip to 11:30 AM for template-based creation

### 11:30 AM - Article Creation Day

**Preferred Path (with sources):**
1. Chad manually creates articles from curated sources
2. Higher quality, timelier content
3. AI-generates from specific URLs

**Fallback (no sources):**
1. Script runs automatically
2. Uses random evergreen templates
3. AI-generates from template prompts
4. Creates DRAFT articles for review

---

## Benefits

### Reliability
✅ Articles ALWAYS created on schedule
✅ No more Monday failures
✅ System degrades gracefully

### Quality
✅ Templates are SEO-optimized
✅ Evergreen topics work year-round
✅ Still requires human review (DRAFT state)

### Flexibility
✅ Can force template use anytime
✅ Easy to add new templates
✅ Manual override available

### Time Savings
✅ Zero manual work when web fails
✅ 30-45 minutes saved per week
✅ Maintains publication schedule

---

## Maintenance

### Adding New Templates

1. Edit template file: `content-bank/templates/[publication].md`
2. Follow existing format
3. Include: Hook, Angle, Structure, Keywords
4. Keep evergreen (no dates or seasons)

### Updating Publications

Edit script variables:
```powershell
$publications = @{
    "NewPub" = @{
        ID = "pub_id_here"
        Name = "Publication Name"
        Type = "LOCAL or NICHE"
        TemplateFile = "path/to/templates.md"
    }
}
```

### Testing

```powershell
# Test without creating articles
./scripts/create-articles-with-fallback.ps1 -DryRun

# Test with verbose output
$VerbosePreference = "Continue"
./scripts/create-articles-with-fallback.ps1
```

---

## Integration with Cron

**Current Setup:**
- Monday 11:30 AM: Tries to create from sources
- Falls back to templates if missing

**Recommended Enhancement:**
- Add retry logic (check sources every 30 min)
- Use templates if sources still missing after 2 hours
- Alert Chad when fallback is used

---

## Future Improvements

### Short-Term
- [ ] Add more templates (20 per publication)
- [ ] Seasonal template variations
- [ ] Image URL suggestions per template
- [ ] Auto-generate SEO metadata

### Medium-Term
- [ ] Web scraping fallback (basic extraction without Brave)
- [ ] RSS feed monitoring for article ideas
- [ ] Template rotation tracking (avoid repeats)
- [ ] A/B test template performance

### Long-Term
- [ ] AI-generated templates on demand
- [ ] Multi-publication template sharing
- [ ] Automated image selection
- [ ] Full end-to-end automation (DRAFT → PUBLISHED)

---

## Troubleshooting

### Script Fails with "Unauthorized"
- Check Letterman API key in `credentials/titanium-api-keys.txt`
- Verify key hasn't expired

### Template Parsing Fails
- Ensure templates follow exact format
- Check for `## Template N:` headers
- Validate `**Hook:**` lines exist

### Articles Not Created
- Check Letterman API is online
- Verify publication IDs are correct
- Review error messages in script output

### Templates Feel Repetitive
- Add more template variations
- Rotate templates manually
- Update with fresh angles

---

## Documentation

**See Also:**
- `content-bank/templates/` - All template files
- `scripts/create-articles-with-fallback.ps1` - Implementation
- `skills/letterman/SKILL.md` - Letterman API docs

**Created During:** Overnight Build 2026-03-03
**Status:** ✅ Production Ready
**Last Updated:** 2026-03-03
