# 🚀 Letterman Article Automation — Setup Guide

**Follow these steps to automate article creation for your newsletters.**

---

## Step 1: Get Your Letterman API Key

1. Log into **app.letterman.ai**
2. Go to **Settings** → **API**
3. Copy your API key (it's a long string starting with `eyJ...`)
4. Tell your AI:

> "Save my Letterman API key: [paste your key]"

Your AI will store it securely.

---

## Step 2: Get Your Publication IDs

Ask your AI:

> "Pull up my Letterman publications"

You'll see a list like:

| # | Name | ID |
|---|------|-----|
| 1 | My Local Newsletter | `abc123...` |
| 2 | My Food Blog | `def456...` |

**Write down the IDs** for the publications you want to automate.

---

## Step 3: Teach Your AI About Each Publication

For EACH publication, tell your AI:

> "For [Publication Name], the focus is [describe the topic]. Here's an example article: [paste a URL from your site]"

**Example:**
> "For Vegas Fork, the focus is Las Vegas restaurants and food news. Here's an example: https://vegasfork.com/a/vegan-menudo-recipe"

This helps your AI match your style.

---

## Step 4: Set Up the Weekly Article Bank

Tell your AI:

> "Every Monday at 8 AM, search for fresh news sources for my publications and save them to a content bank file."

**Customize it:**
- Change the day/time if you want
- Tell it which news sites to check (local news, niche sites, etc.)

---

## Step 5: Set Up Article Creation

Tell your AI:

> "On Monday, Wednesday, and Friday, create 1 AI-generated article as a draft for each of my publications. Use stories from the content bank."

**Your AI will ask:**
- Which publications? (give the IDs from Step 2)
- What times? (pick different times to look natural)
- AI-generated or blank?

**Recommended:** AI-generated as drafts, so you review before publishing.

---

## Step 6: (Optional) Set Up a Summary

Tell your AI:

> "Every Monday at 9 PM, send me a quick message saying how many sources went into the bank."

Simple check-in so you know the system is working.

---

## That's It! 🎉

Your AI will now:

| When | What Happens |
|------|--------------|
| Monday 8 AM | Searches for news, builds the bank |
| Mon/Wed/Fri | Creates draft articles |
| Monday 9 PM | Tells you what's ready |

**You just review the drafts and publish when ready.**

---

## Quick Commands to Know

| Say This | What Happens |
|----------|--------------|
| "Show me the article bank" | See what sources are saved |
| "Create an article for [publication] about [topic]" | Manual article creation |
| "What's scheduled?" | See your cron jobs |
| "List my Letterman publications" | See publication IDs |

---

## Troubleshooting

**"API key not working"**
→ Make sure you copied the full key (starts with `eyJ`)

**"Can't find my publication"**
→ Ask: "Pull up my Letterman publications" to see the list

**"Articles aren't being created"**
→ Ask: "What cron jobs are active?" to check the schedule

**"I want to change the schedule"**
→ Just tell your AI: "Change article creation to Tuesday and Thursday at 10 AM"

---

## Example Full Setup Conversation

```
YOU: Save my Letterman API key: eyJhbG....[your key]

AI: ✅ Saved!

YOU: Pull up my Letterman publications

AI: Here are your publications:
    1. Summerlin News (ID: abc123)
    2. Pet Rescue Weekly (ID: def456)

YOU: For Summerlin News, the focus is local community news 
     for Summerlin, Nevada. For Pet Rescue Weekly, it's dog 
     and cat adoption stories in Las Vegas.

AI: Got it! I understand both publications now.

YOU: Every Monday at 8 AM, search for news sources and build 
     a content bank. Then on Monday, Wednesday, and Friday, 
     create 1 draft article for each publication.

AI: ✅ Set up! Here's the schedule:
    - Monday 8 AM: Search for sources
    - Monday 9:30 AM: Create articles
    - Wednesday 1:45 PM: Create articles
    - Friday 11:15 AM: Create articles

YOU: Perfect!
```

---

## Remember

- ✅ Articles are created as **DRAFTS** — nothing goes live automatically
- ✅ You **review and publish** when ready
- ✅ You can change the schedule anytime
- ✅ Ask your AI if you get stuck!

---

**Questions? Just ask your AI — that's what it's there for!** 🎬
