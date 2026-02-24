# API Usage Tracker

## ACTUAL COSTS (Extracted from session transcript)

### 2026-01-30 + 2026-01-31 Combined
**Total Cost: $55.04**

**Token Usage:**
- Input: 10,631 tokens
- Output: 254,839 tokens
- Cache Read: 98,082,490 tokens
- Cache Write: 5,802,942 tokens
- Total messages: 1,186

**Cost Breakdown:**
- Cache operations: ~$51.18 (93% of total)
- Input/Output: ~$3.86 (7% of total)

**Why so high?**
- Prompt caching is expensive (cache writes = $3.75/1M tokens)
- Context compactions trigger cache writes
- Large context window (skills, project files) cached repeatedly

### Previous Estimates (WRONG)
- 2026-01-30: Estimated $4.00 ❌
- 2026-01-31: Estimated $0.30-$1.00 ❌

**Why estimates were wrong:**
- Session status only shows recent API call, not cumulative
- Context compactions hide historical usage
- Cache costs not visible in simple token counts

---

## Going Forward

**Daily Logging:**
- Run `calculate_costs.py` daily to track actual spend
- Update this file with real numbers
- Don't rely on session_status for cost estimates

**Cost Optimization Ideas:**
- Reduce context size (leaner SKILL.md files)
- Fewer compactions (increase compaction threshold)
- Consider using Haiku for simple tasks ($0.25/$1.25 per 1M vs Sonnet's $3/$15)
