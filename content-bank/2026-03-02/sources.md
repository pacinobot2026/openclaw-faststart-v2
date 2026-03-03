# Monday Article Bank Refresh - 2026-03-02

**Status:** ⚠️ REQUIRES WEB ACCESS

## Issue
Web search and browser tools are not currently available:
- Brave API key not configured
- Chrome extension tab not attached
- Web fetch failing on target sites

## What Needs to Be Done

### Sources to Check (2-3 weeks old articles)

#### For West Valley Shoutouts (LOCAL - Summerlin/West Valley)
- [ ] Las Vegas Review-Journal - Summerlin section
  - URL: https://www.reviewjournal.com/local/local-las-vegas/summerlin/
  - Look for: Community events, safety updates, business openings/closings, neighborhood news

- [ ] FOX5 Vegas - Local news
  - URL: https://www.fox5vegas.com/
  - Filter: Summerlin, West Valley, local community stories

#### For Save The Doggy (NICHE - Dog rescue/adoption)
- [ ] The Animal Foundation
  - URL: https://animalfoundation.com/
  - Look for: Adoption spotlights, urgent appeals, success stories, pet welfare news

- [ ] Las Vegas Review-Journal - Pets section
  - URL: https://www.reviewjournal.com/life/pets/
  - Look for: Local rescue stories, adoption events, pet-related community news

#### For Vegas Fork (NICHE - Food scene)
- [ ] Eater Vegas
  - URL: https://vegas.eater.com/
  - Look for: Restaurant openings/closings, chef profiles, food trends, recipes

- [ ] Las Vegas Review-Journal - Food section
  - URL: https://www.reviewjournal.com/life/food/
  - Look for: New restaurants, dining reviews, local food scene updates

## Format for Completed Bank

Once researched, format as:

```markdown
## West Valley Shoutouts Sources

### Article 1: [Headline]
- **URL:** [link]
- **Date:** [publish date]
- **Summary:** [2-3 sentence summary]
- **Priority:** High/Med/Low
- **Angle:** [How to localize it for Summerlin audience]

[Repeat for 5-7 articles]

## Save The Doggy Sources

[Same format - 5-7 articles]

## Vegas Fork Sources

[Same format - 5-7 articles]

## Weekly Schedule Recommendation

Monday: [Publication] - [Topic]
Tuesday: [Publication] - [Topic]
Wednesday: [Publication] - [Topic]
Thursday: [Publication] - [Topic]
Friday: [Publication] - [Topic]
```

## Next Steps

**Option 1:** Configure web tools
- Set up Brave API key: `openclaw configure --section web`
- Attach Chrome extension tab

**Option 2:** Manual research
- Chad manually visits each source
- Pastes promising article URLs
- I'll then process them into formatted bank

**Option 3:** Delegate to sub-agent
- Spawn isolated session with web access
- Have it compile the full bank
- Report back when complete
