# Onboarding Process Build - COMPLETE DOCUMENTATION

## What This Is
**Shadow Program Workshop** onboarding system for 40-80 non-technical customers.
- Pre-configured VPS with OpenClaw installed
- Guided onboarding via BOOTSTRAP.md
- Goal: Get them set up through CONVERSATION, not CLI commands
- Agent talks to customer, gathers info, executes backend silently

---

## The Problem We're Solving

Chad's customers are NON-TECHNICAL. They can't:
- Run CLI commands
- Edit config files
- Understand JSON
- Debug errors

They CAN:
- Chat with an AI assistant
- Follow simple prompts
- Paste API keys when asked
- Answer questions about preferences

So the agent needs to:
1. Ask friendly questions
2. Collect the info
3. Execute ALL the technical stuff silently in the background
4. Confirm success in plain language

---

## The Journey (How We Built This)

### Phase 1: Initial BOOTSTRAP.md
- Started with user-facing script only
- Had "Notes" like "(In a real setup, I'd do X)"
- Problem: Notes were VAGUE - said WHAT but not HOW

### Phase 2: Simulation Testing
We ran through the flow as if onboarding a new customer.

**Mistakes discovered:**
1. ❌ Using "Say:", "Ask:", "Confirm:" labels - should speak naturally
2. ❌ Double quotes around dialogue
3. ❌ Saying "Waiting for input..." instead of friendly prompts
4. ❌ Skipping Step 5 pairing code (it has TWO parts!)
5. ❌ Rushing Steps 9 & 10 - need to ask about preferences, not just time
6. ❌ Answering for the user instead of WAITING

**How to do it right:**
1. ✅ Follow BOOTSTRAP.md exactly
2. ✅ Speak like a friendly front desk assistant
3. ✅ Wait for user response at each step
4. ✅ Use friendly language: "Go ahead and enter your API key!"
5. ✅ Complete ALL parts of each step before moving on

### Phase 3: Backend Implementation (2026-02-04)
Chad pushed for ACTUAL implementation details, not vague notes.

**Key realization:** The BOOTSTRAP.md had the INTENT but not the IMPLEMENTATION. A fresh agent on a new VPS:
- Has ZERO context
- Doesn't know our conversations
- Only has BOOTSTRAP.md to work with
- Needs EXPLICIT instructions to execute

**What we added:**
For each step, documented BOTH:
1. **User View** - What agent says, what to ask, how to confirm
2. **Backend** - Exact tool calls, exact commands, exact file contents

### Phase 4: Step 7 Deep Dive
Step 7 (Memory Install) became especially important because:
- It sets up the memory system
- It adds the JOURNALING PROTOCOL to AGENTS.md
- This teaches new agent HOW to journal from day one
- Prevents them from making the same mistakes I made (not saving work)

**What Step 7 does:**
1. Config patch for memoryFlush, memorySearch, session-memory
2. Create memory/ folder
3. Create MEMORY.md template
4. Add Real-Time Journaling Protocol to AGENTS.md

---

## The Process We Use

For each step, document:

### 👤 USER VIEW
- What agent says (exact text)
- What to ask
- How to confirm
- Keep it simple, friendly, non-technical

### ⚙️ BACKEND
- Exact tool calls (gateway config.patch, exec, write, edit)
- Exact JSON/content to use
- What files to create/update
- Runs SILENTLY after user provides input

### ✅ RESULT
- What's now configured
- What the agent can now do

---

## The 10 Steps (Summary)

| Step | What User Sees | What Backend Does |
|------|---------------|-------------------|
| 1 | Enter Claude API key | gateway config.patch → models |
| 2 | Enter name + profile | Write to USER.md |
| 3 | Enter Whisper key | gateway config.patch → skills |
| 4 | Confirm browser install | exec: openclaw browser extension install |
| 5 | Telegram token + pairing code | config.patch + pairing approve |
| 6 | Enter agent email | Store email address |
| 7 | Confirm memory install | config.patch + MEMORY.md + journaling protocol in AGENTS.md |
| 8 | Enter Titanium API keys | credentials/titanium_software.txt + AGENTS.md update |
| 9 | Morning greeting prefs + time | USER.md + cron job |
| 10 | Evening greeting prefs + time | USER.md + cron job |

---

## Key Learnings

### Tone
"Simple, friendly, like a front desk assistant. Keep it moving!"

### Format for API Keys (Step 8)
Users provide: `SoftwareName: api_key`
Example: `Letterman: abc123apikey`
If they don't specify which software, ASK.

### Telegram Has TWO Parts (Step 5)
1. First: Bot token
2. Second: Pairing code (user sends message to bot, gets code, shares it)
DON'T skip the pairing code!

### Greetings Need Preferences (Steps 9-10)
Don't just ask for TIME. Ask what they WANT:
- Priorities? Calendar? Quotes? Tasks completed? Tomorrow's plan?
THEN ask for time.

### Memory Step is Critical (Step 7)
This is where we install the journaling protocol. New agent learns:
- BEFORE task: Write plan + steps
- DURING: Update status
- AFTER: Mark COMPLETE or FAILED
Prevents them from making my mistakes.

---

## ⚠️ OPEN QUESTIONS (Must Resolve Before Launch)

### 1. boot-md Hook Behavior
- Config has `boot-md` hook enabled
- UNKNOWN: Does it make agent FOLLOW BOOTSTRAP.md, or just load it into context?
- Need to test/research

### 2. Will Fresh Agent Execute Instructions?
- Backend instructions are DESCRIPTIVE ("Use gateway tool with...")
- Not IMPERATIVE ("EXECUTE: gateway config.patch...")
- Fresh agent might read as documentation, not commands
- May need to make more explicit

### 3. What's Pre-Configured on Customer VPS?
- Is OpenClaw already installed?
- Is boot-md hook already enabled?
- What config exists before onboarding starts?
- Need to clarify with Chad

---

## Files

- **BOOTSTRAP.md** - The actual onboarding script (workspace root)
- **memory/onboardingprocessbuild.md** - This file (full documentation)
- **memory/2026-02-04.md** - Daily journal with today's work

---

## Next Steps

1. Research how boot-md hook works (check OpenClaw docs)
2. Test BOOTSTRAP.md on actual fresh system
3. Make instructions more explicit if agent doesn't execute them
4. Clarify pre-configuration with Chad
5. Possibly add "EXECUTE:" prefix to backend instructions

---

## Why This Matters

40-80 non-technical customers will use this. If it doesn't work:
- They get stuck
- They need support
- Chad has to fix things manually
- Bad experience

If it DOES work:
- Seamless setup
- Happy customers
- Agent ready to help from day one
- Chad's vision of AI assistants for everyone becomes real

---

*Last updated: 2026-02-04*
*Status: Backend implementations complete, needs testing on fresh system*
