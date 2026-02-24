# 🤖 Letterman Article Automation with OpenClaw

## What This Does

Your AI assistant automatically:
1. **Finds news stories** relevant to your newsletters
2. **Creates articles** using Letterman's AI
3. **Saves them as drafts** for you to review and publish

You stay in control — nothing goes live without your approval.

---

## The Weekly Flow

```
┌─────────────────────────────────────────────────────┐
│  MONDAY 8 AM     →  Search for fresh news sources   │
│  MON/WED/FRI     →  Create draft articles           │
│  MONDAY 9 PM     →  Quick summary of what's ready   │
└─────────────────────────────────────────────────────┘
```

---

## Step 1: Teach Your AI About Your Publications

Before automating, your AI needs to understand each newsletter:

| What to Share | Why It Matters |
|---------------|----------------|
| Publication name & ID | So the AI knows WHERE to create articles |
| Topic focus | So it finds RELEVANT stories |
| Example articles | So it matches your STYLE |

**Example:**
- "West Valley Shoutouts" = Local Summerlin news
- "Save The Doggy" = Dog rescue & adoption stories
- "Vegas Fork" = Las Vegas restaurant & food scene

---

## Step 2: Set Up the Article Bank

Every week, your AI searches trusted news sources and saves them to a "bank" — a simple list of stories ready to become articles.

**Good sources to check:**
- Local news sites (Review-Journal, FOX5, etc.)
- Niche sites (Eater for food, Animal Foundation for pets)
- Community pages and event calendars

**The bank includes:**
- Source URL
- Quick summary
- Which publication it fits
- Priority (breaking news vs. evergreen)

---

## Step 3: Create Articles on Autopilot

On scheduled days, your AI:

1. Picks a story from the bank
2. Sends it to Letterman's AI to write the article
3. Saves it as a **DRAFT**

**Two ways to create articles:**

| Method | What Happens | Token Cost |
|--------|--------------|------------|
| **AI-Generated** | Letterman's AI writes the content | Uses your OpenAI tokens |
| **Blank** | AI creates empty article, YOU write content | No AI tokens |

---

## Step 4: Review and Publish

All articles stay in DRAFT until you:
- Review the content
- Make any edits
- Click publish

**Your AI will NEVER auto-publish.** You're always in control.

---

## Setting Up the Cron Jobs

Tell your AI to create scheduled tasks like this:

**For the article bank (Monday mornings):**
> "Every Monday at 8 AM, search for news sources for my newsletters and save them to a content bank."

**For article creation (multiple days):**
> "On Monday, Wednesday, and Friday, create 1 draft article for each of my publications using stories from the bank."

**For the summary (Monday evening):**
> "Monday at 9 PM, tell me how many sources went into the bank."

---

## Quick Setup Checklist

- [ ] Get your Letterman API key (Settings → API)
- [ ] Save it to your credentials file
- [ ] Tell your AI about each publication (name, ID, focus, style)
- [ ] Set up Monday morning bank search
- [ ] Set up article creation days (Mon/Wed/Fri or your preference)
- [ ] Optional: Set up evening summary

---

## Example Conversation with Your AI

**You:** "I want to automate articles for my newsletter Vegas Fork. It's about Las Vegas restaurants and food. Here's an example article: [URL]. Search for sources every Monday and create 1 article on Monday, Wednesday, and Friday."

**AI:** "Got it! I'll search Eater Vegas and local food news every Monday, then create draft articles 3x per week. Want me to set that up now?"

**You:** "Yes, do it."

**AI:** ✅ Done!

---

## Tips

1. **Start simple** — 1 article per day is plenty to start
2. **Review the bank** — Make sure the AI is finding relevant stories
3. **Check the drafts** — The AI writes well, but you know your audience best
4. **Vary the times** — Articles posted at different times look more natural

---

## Need Help?

Your AI assistant can:
- Show you the current article bank
- Create articles on demand
- Adjust the schedule anytime
- Explain what's in the queue

Just ask! 🎬
