# Google News RSS Tips & Tricks

## Basic URL Structure
```
https://news.google.com/rss/search?q=QUERY&hl=en-US&gl=US&ceid=US:en
```

## Time Filters
Add `when:[time]` to your query:
- `when:1h` - Last hour
- `when:1d` - Last 24 hours  
- `when:7d` - Last 7 days
- `when:1m` - Last 30 days

**Example:** `q=summerlin+nevada+when:1d`

## Location Formatting
- Single word: `summerlin`
- Multiple words: Use `+` between words: `las+vegas`
- City + State: `summerlin+nevada`
- Neighborhood: `downtown+austin`

## Query Operators
- `AND`: Use `+` or space: `summerlin+real+estate`
- `OR`: Use `|`: `summerlin|henderson`
- `Exact phrase`: Use quotes in URL encoding: `%22summerlin%22`
- `Exclude`: Use `-`: `summerlin+-crime` (less crime stories)

## Examples

**Last 24 hours in Summerlin:**
```
https://news.google.com/rss/search?q=summerlin+nevada+when:1d&hl=en-US&gl=US&ceid=US:en
```

**Business news in Austin this week:**
```
https://news.google.com/rss/search?q=austin+texas+business+when:7d&hl=en-US&gl=US&ceid=US:en
```

**Real estate in Henderson, exclude crime:**
```
https://news.google.com/rss/search?q=henderson+nevada+real+estate+-crime+when:7d&hl=en-US&gl=US&ceid=US:en
```

## Parsing the RSS
Each `<item>` contains:
- `<title>` - Full headline
- `<pubDate>` - When published (GMT format)
- `<source url="">` - Original news outlet
- `<description>` - HTML with link to article

## Pro Tips
1. **Broader is better** - Start with just city name, then filter
2. **Check multiple timeframes** - Try `1d`, `7d` if not enough results
3. **Exclude noise** - Use `-sports -national` for local-only
4. **Source matters** - Local TV/papers > national aggregators
5. **Parse carefully** - Some articles aren't relevant (like BuzzFeed quizzes mentioning the city)
