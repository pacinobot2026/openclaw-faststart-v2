# Local News Research Skill

Find recent local news articles for newsletter content in specific cities/areas.

## When to Use This Skill
- User asks for newsletter article ideas for a specific location
- Need to find recent local news stories
- Research trending topics in a community

## Process

### 1. Identify the Location
Extract the city/area name from the request (e.g., "Summerlin, Nevada")

### 2. Use Google News RSS (Primary Method)
Google News aggregates all local news sources automatically.

**URL Pattern:**
```
https://news.google.com/rss/search?q=[location]+when:[timeframe]&hl=en-US&gl=US&ceid=US:en
```

**Timeframe options:**
- `when:1d` = last 24 hours
- `when:7d` = last 7 days
- `when:1m` = last month

**Example:**
```
web_fetch(url: "https://news.google.com/rss/search?q=summerlin+nevada+when:1d&hl=en-US&gl=US&ceid=US:en")
```

### 3. Backup: Direct News Sources
If Google News doesn't work or you need deeper coverage:

**Las Vegas / Summerlin:**
- Las Vegas Review-Journal: `https://www.reviewjournal.com/local/summerlin/`
- Las Vegas Sun: `https://lasvegassun.com/news/summerlin/`
- FOX5 Vegas: Local news sections

**General approach:**
- Major city newspaper + `/local/[area-name]/`
- Local TV news station + `/tag/[area-name]/`

### 4. Parse the RSS Feed
Google News RSS contains:
- `<title>` - Article headline
- `<pubDate>` - Publication timestamp
- `<source url="">` - Original news source
- `<description>` - Preview text with source name

### 5. Extract & Clean Article Data
From the RSS feed, extract:
- **Title** - Article headline
- **Source** - News outlet (FOX5, Review-Journal, etc.)
- **Date** - Publication timestamp
- **Description** - Brief preview (if available)

Clean up:
- Remove generic/irrelevant articles (BuzzFeed quizzes, sports unless local)
- Focus on location-specific news
- Sort by recency (newest first)

### 6. Categorize & Recommend
Group articles by type:
- 🏢 Business/Development (new stores, construction)
- 🏠 Real Estate (market trends, notable sales)
- 🚨 Crime/Safety (important but don't overdo)
- 🎉 Community Events (positive, engaging)
- 🏛️ Government/Policy (regulations, changes)
- 💡 Human Interest (feel-good stories)

### 7. Suggest Newsletter Angles
For each article, suggest:
- **Why it matters** to local readers
- **Newsletter angle** (how to write about it)
- **Tone** (informative, cautionary, celebratory)

## Output Format

Keep it simple - just the essentials with clickable links:

```
**[Location] News - Last [Timeframe]:**

1. **[Title]** ([Read article](URL))
   Date: [Publication date]
   Description: [Brief description if available]

2. **[Title]** ([Read article](URL))
   Date: [Publication date]
   Description: [Brief description if available]
```

**IMPORTANT:** 
- Format URLs as markdown links: `[Read article](URL)`
- Always include: Title (with link), Date, Description
- If description not available in RSS, omit that line or say "No description"
- Keep it clean and scannable

## Tips
- **Lead with positive news** (new businesses, community achievements)
- **Balance with important concerns** (safety, policy impacts)
- **Avoid sensationalism** (especially with crime stories)
- **Focus on local impact** (how it affects your readers' daily lives)
- **Check multiple sources** for better coverage

## Google News RSS Quick Reference

**Base URL:**
`https://news.google.com/rss/search?q=[query]&hl=en-US&gl=US&ceid=US:en`

**Time filters (add to query):**
- `when:1h` = last hour
- `when:1d` = last day
- `when:7d` = last week
- `when:1m` = last month

**Location format:**
- Single word: `summerlin`
- Multi-word: `las+vegas` or `downtown+austin`
- With state: `summerlin+nevada`

**Full example:**
`q=summerlin+nevada+when:1d` = Summerlin, Nevada articles from last 24 hours

## Error Handling
- If web_fetch fails (403/404), try alternate news sources
- If no recent articles found, expand timeframe to last 7 days
- If location is too specific, broaden to parent city/region
- Remove irrelevant articles (sports from other cities, generic content, etc.)

## Examples

**Request:** "Find newsletter articles for Summerlin, Nevada last 24 hours"
**Action:** 
```
web_fetch("https://news.google.com/rss/search?q=summerlin+nevada+when:1d&hl=en-US&gl=US&ceid=US:en")
```
Parse RSS XML for articles, clean up irrelevant ones, present with newsletter angles.

**Request:** "What's happening in Downtown Austin for my newsletter?"
**Action:**
```
web_fetch("https://news.google.com/rss/search?q=downtown+austin+texas+when:7d&hl=en-US&gl=US&ceid=US:en")
```

**Request:** "Local news for Henderson NV this week"
**Action:**
```
web_fetch("https://news.google.com/rss/search?q=henderson+nevada+when:7d&hl=en-US&gl=US&ceid=US:en")
```
