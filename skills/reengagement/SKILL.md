---
name: reengagement
description: Manage email re-engagement campaigns using Global Control. Import contacts from CSV/XLS, apply progressive sending pace (Mild/Normal/Aggressive) within 8-hour daily windows, auto-tag contacts in GC to trigger workflows, with full pause/resume/cancel controls and hourly limits (max 400/hour). Saves to JSON, updates Kanban board, and uses cron jobs for persistent execution. Use for re-engaging inactive contact lists.
triggers: ["re-engagement", "reengagement", "re-engage", "contact campaign", "email campaign", "reactivation"]
---

# Re-engagement Campaign Skill

Orchestrate progressive email re-engagement campaigns using Global Control tags and workflows.

## Overview

This skill manages the entire re-engagement process:
1. **Import & Clean** - Upload CSV/XLS, dedupe, validate emails
2. **Configure** - Choose GC tag, workflow, and sending pace
3. **Execute** - Progressive hourly sending with safety caps
4. **Control** - Pause, resume, cancel with full state persistence

## Prerequisites

- Global Control API access
- Pre-configured GC tag linked to a workflow
- CSV or XLS file with contact data (must include `email` column)

## State Files

Campaign state persists in:
- `campaigns/reengagement/{campaign-id}/state.json` - Current progress
- `campaigns/reengagement/{campaign-id}/contact-bank.json` - All contacts
- `campaigns/reengagement/{campaign-id}/log.json` - Batch history

## Campaign Lifecycle

### Phase 1: Setup & Import

**Ask User:**
1. "How many total contacts are we re-engaging?" (expected count for validation)
2. "What sending pace? (Mild, Normal, or Aggressive)"
   - If user asks to compare, show all three pace tables with calculations
   - If user picks one, immediately show the full schedule table

**Request File Upload:**
- "Please upload your contact file (CSV or XLS/XLSX)"

**Import & Process:**
```javascript
// Validation steps
1. Read file (CSV or XLS)
2. Check for 'email' column (case-insensitive)
3. Deduplicate by email (keep first occurrence)
4. Validate email format (regex)
5. Discard invalid rows
6. Store in contact-bank.json
```

**Save to JSON & Create Kanban Board Entry:**
```javascript
// 1. Create campaign folder and save contacts
const campaignId = generateUUID();
const folderPath = `campaigns/reengagement/${campaignId}`;
const timestamp = new Date().toISOString();

// Save contact bank
writeFile(`${folderPath}/contact-bank.json`, {
  campaignId,
  uploadedAt: timestamp,
  totalContacts: validatedContacts.length,
  contacts: validatedContacts // Array of {email, firstName, lastName, phone, ...}
});

// Save initial state
writeFile(`${folderPath}/state.json`, {
  campaignId,
  status: "ready",
  createdAt: timestamp,
  pace: pace,
  totalContacts: validatedContacts.length,
  sent: 0,
  remaining: validatedContacts.length,
  currentDay: 1,
  currentHour: 0,
  tagId: null,
  tagName: null,
  workflowName: null
});

// 2. Add to KANBAN.md for visibility
const kanbanEntry = `
### ${campaignId}
- **Type:** Re-engagement Campaign
- **Status:** 🟡 Ready (Pending GC Config)
- **Created:** ${timestamp}
- **Contacts:** ${validatedContacts.length.toLocaleString()}
- **Pace:** ${pace}
- **Folder:** ${folderPath}
- **Assignee:** (pending)
`;

appendToFile("KANBAN.md", kanbanEntry);
```

**Confirm:**
- "✅ Imported {X} contacts. {Y} duplicates removed. {Z} invalid emails discarded."
- "📁 Saved to: campaigns/reengagement/{campaignId}/"
- "📋 Added to KANBAN.md for team visibility"

### Phase 2: GC Configuration

**Ask User:**
1. "Which GC re-engagement tag should I use?"
   - Show list: GET /tags
   - Or accept tag ID if user knows it

2. "Which GC workflow should trigger when this tag is applied?"
   - User provides workflow name/ID
   - OR user says "we'll attach it" — in this case, **remind them** before START

**Workflow Handling Options:**

**Option A: User provides workflow name**
```
User: "Q1 Re-engagement Flow"
Agent: "Confirm: Tag 'test' is linked to workflow 'Q1 Re-engagement Flow' in GC? (yes/no)"
```

**Option B: User will attach workflow themselves**
```
User: "workflow will be attached by us"
Agent: "Got it. I'll remind you to link the tag before we start."

// Before START, show reminder:
"⚠️ REMINDER: Make sure tag 'test' is linked to your workflow in GC before starting!"
```

**Verify Tag Exists:**
```javascript
// Confirm tag exists
GET /tags/{tagId}
// Note: Cannot verify workflow link via API — user must confirm manually
```

### Phase 3: Summary & Approval

**Calculate Schedule (8-Hour Daily Window):**

```javascript
const MAX_DAILY_HOURS = 8;
const WARMUP = 50;

const PACE_RATES = {
  mild: { start: 50, increment: 50 },      // Day 2: 50/hr, Day 3: 100/hr, etc.
  normal: { start: 100, increment: 100 },  // Day 2: 100/hr, Day 3: 200/hr, etc.
  aggressive: { start: 200, increment: 200 } // Day 2: 200/hr, Day 3: 400/hr, etc.
};

function calculateSchedule(totalContacts, pace) {
  const config = PACE_RATES[pace];
  let remaining = totalContacts - WARMUP;
  let day = 2;
  let rate = config.start;
  let schedule = [{ day: 1, perHour: null, hours: 0, contacts: Math.min(WARMUP, totalContacts), running: Math.min(WARMUP, totalContacts) }];
  let runningTotal = Math.min(WARMUP, totalContacts);
  
  while (remaining > 0) {
    const dailyContacts = rate * MAX_DAILY_HOURS;
    const today = Math.min(dailyContacts, remaining);
    const hoursNeeded = Math.ceil(today / rate);
    
    runningTotal += today;
    schedule.push({ day, perHour: rate, hours: hoursNeeded, contacts: today, running: runningTotal });
    
    remaining -= today;
    day++;
    rate = Math.min(rate + config.increment, 400); // Cap at 400/hr
  }
  
  return schedule;
}
```

**Show Campaign Summary:**
```
═══════════════════════════════════════════
📊 RE-ENGAGEMENT CAMPAIGN SUMMARY
═══════════════════════════════════════════

📁 Contact Bank:     {totalContacts} contacts
🏷️  GC Tag:          {tagName}
⚙️  Workflow:        {workflowName}
🚀 Pace:             {pace}

📅 SCHEDULE (8-Hour Daily Window):
───────────────────────────────────────────
| Day | Per Hour | Hours | Contacts | Running Total |
|-----|----------|-------|----------|---------------|
| 1   | (warmup) | —     | 50       | 50            |
| 2   | 100      | 8     | 800      | 850           |
| 3   | 200      | 8     | 1,600    | 2,450         |
| ... | ...      | ...   | ...      | ...           |

📊 TOTAL DURATION:   ~{totalDays} days
⚠️  DAILY LIMIT:     8 hours max
⚠️  MAX HOURLY:      400 contacts/hour

═══════════════════════════════════════════
```

**Explain What START Does:**
```
If user asks "what happens if I type START?":

🚀 EXECUTION PHASE

Immediately:
• Send Day 1 warmup (50 contacts) to GC
• Fire the tag on each contact
• Create cron jobs for all remaining batches
• Update KANBAN.md status to 🟢 Running

Cron Jobs Created:
• One job per hour for each day
• Each job sends the hourly batch
• Completion notification scheduled for final day

You'll Get Notified:
• ✅ End of each day with progress update
• 🎉 When campaign fully completes
• ⚠️ If any errors occur

Control Commands (during execution):
• pause  → Stop scheduling new batches
• resume → Continue from where it left off  
• cancel → Stop permanently
• status → Show current progress
```

**Require Explicit Confirmation:**
- "Type START to begin the campaign, or CANCEL to abort."

### Phase 4: Sending Logic (Cron-Based)

The campaign runs via **scheduled cron jobs** rather than a continuous process. This allows:
- Persistent execution across days
- Pause/resume without losing state
- Notifications at key milestones

**Cron Job Setup on START:**

```javascript
// 1. Send Day 1 warmup immediately
const warmupBatch = getNextBatch(50);
for (const contact of warmupBatch) {
  POST /contacts
  POST /tags/fire-tag/{tagId}
}
updateState({ sent: 50, remaining: total - 50, currentDay: 2 });

// 2. Schedule hourly cron jobs for Day 2+
const schedule = calculateSchedule(totalContacts, pace);

for (const dayPlan of schedule.filter(d => d.day >= 2)) {
  // Schedule a cron job for each hour of each day
  for (let hour = 1; hour <= dayPlan.hours; hour++) {
    const cronTime = calculateCronTime(dayPlan.day, hour); // e.g., "0 9 * * *" for 9am
    
    cron.add({
      name: `reengagement-${campaignId}-day${dayPlan.day}-hour${hour}`,
      schedule: { kind: "cron", expr: cronTime },
      payload: {
        kind: "agentTurn",
        message: `Send re-engagement batch for ${campaignId}, Day ${dayPlan.day}, Hour ${hour}. Rate: ${dayPlan.perHour}/hr`,
        timeoutSeconds: 300
      },
      sessionTarget: "isolated"
    });
  }
}

// 3. Schedule completion notification
cron.add({
  name: `reengagement-${campaignId}-complete`,
  schedule: { kind: "at", atMs: estimatedCompletionTime },
  payload: {
    kind: "systemEvent",
    text: `🎉 Re-engagement campaign ${campaignId} COMPLETE! ${totalContacts} contacts processed over ${totalDays} days.`
  },
  sessionTarget: "main"
});
```

**Hourly Batch Execution:**

```javascript
// Each cron job executes this:
function sendHourlyBatch(campaignId, day, hour, rate) {
  const state = readState(campaignId);
  
  if (state.status === 'paused' || state.status === 'cancelled') {
    return; // Skip this batch
  }
  
  const batch = getNextBatch(Math.min(rate, state.remaining));
  
  for (const contact of batch) {
    POST /contacts
    POST /tags/fire-tag/{tagId}
  }
  
  // Update state
  state.sent += batch.length;
  state.remaining -= batch.length;
  state.currentHour = hour;
  saveState(state);
  
  // Update KANBAN.md
  updateKanban(campaignId, {
    sent: state.sent,
    remaining: state.remaining,
    currentDay: day,
    currentHour: hour
  });
  
  // Log batch
  logBatch({ campaignId, day, hour, count: batch.length, rate });
  
  // If day complete, notify user
  if (hour === getHoursForDay(day)) {
    notifyUser(`✅ Day ${day} complete: ${state.sent} total sent. ${state.remaining} remaining.`);
  }
}
```

**Progressive Hourly Pacing (8-Hour Daily Window):**

```javascript
// CONSTANTS
const MAX_PER_HOUR = 400;
const MAX_DAILY_HOURS = 8;
const WARMUP_COUNT = 50;  // Day 1: sent at once

// PACE PROGRESSION (starting Day 2)
const PACE_RATES = {
  mild: { start: 50, increment: 50 },       // +50/hour each day
  normal: { start: 100, increment: 100 },   // +100/hour each day
  aggressive: { start: 200, increment: 200 } // Start higher, +200 daily
};

function calculateSchedule(totalContacts, pace) {
  const config = PACE_RATES[pace];
  let schedule = [{ day: 1, perHour: null, hours: 0, total: Math.min(WARMUP_COUNT, totalContacts) }];
  
  let remaining = totalContacts - WARMUP_COUNT;
  let day = 2;
  let rate = config.start;
  
  while (remaining > 0) {
    // Cap at max hourly rate
    rate = Math.min(rate, MAX_PER_HOUR);
    
    // Calculate daily send (max 8 hours)
    const maxDaily = rate * MAX_DAILY_HOURS;
    const todayTotal = Math.min(maxDaily, remaining);
    const hoursNeeded = Math.ceil(todayTotal / rate);
    
    schedule.push({ day, perHour: rate, hours: hoursNeeded, total: todayTotal });
    
    remaining -= todayTotal;
    day++;
    
    // Increase rate for next day
    rate = rate + config.increment;
  }
  
  return schedule;
}
```

| Pace | Day 1 | Day 2 | Day 3 | Day 4 | Day 5+ | Max Daily | Total Time* |
|------|-------|-------|-------|-------|--------|-----------|-------------|
| **Mild** | 50 | 50/hr (400/day) | 100/hr (800/day) | 150/hr (1,200/day) | 200/hr (1,600/day) | 1,600 | ~14 days |
| **Normal** | 50 | 100/hr (800/day) | 200/hr (1,600/day) | 300/hr (2,400/day) | 400/hr (3,200/day) | 3,200 | ~8 days |
| **Aggressive** | 50 | **200/hr (1,600/day)** | **400/hr (3,200/day)** | 400/hr (3,200/day) | 400/hr (3,200/day) | **3,200** | ~7 days |

*Based on 16,000 contacts. Normal and Aggressive converge at 400/hr cap, so difference is only 1-2 days.

**Execution Loop (Hourly with Progressive Rates):**
```javascript
const MAX_PER_HOUR = 400;
const WARMUP = 50;

// Pre-calculate schedule
const schedule = calculateSchedule(state.totalContacts, state.pace);

while (state.remaining > 0 && state.status !== 'cancelled') {
  if (state.status === 'paused') {
    wait(60 seconds);
    continue;
  }
  
  // Day 1: Warmup (50 at once)
  if (state.currentDay === 1) {
    const batch = getNextBatch(Math.min(WARMUP, state.remaining));
    
    for (const contact of batch) {
      POST /contacts
      POST /tags/fire-tag/{tagId}
    }
    
    state.sent += batch.length;
    state.remaining -= batch.length;
    state.currentDay = 2;
    state.currentHour = 0;
    
    logBatch({ day: 1, count: batch.length, note: "Warmup - sent at once" });
    notifyUser(`✅ Day 1 warmup: ${batch.length} sent. Day 2 starts tomorrow.`);
    
    waitUntilNextDay();
    continue;
  }
  
  // Day 2+: Hourly batches with progressive rate
  const dayPlan = schedule.find(s => s.day === state.currentDay);
  const hourlyRate = Math.min(dayPlan.perHour, MAX_PER_HOUR);
  const batchSize = Math.min(hourlyRate, state.remaining);
  
  if (batchSize <= 0) break;
  
  const batch = getNextBatch(batchSize);
  
  for (const contact of batch) {
    POST /contacts
    POST /tags/fire-tag/{tagId}
  }
  
  state.sent += batch.length;
  state.remaining -= batch.length;
  state.currentHour++;
  
  logBatch({ 
    day: state.currentDay, 
    hour: state.currentHour, 
    count: batch.length,
    rate: hourlyRate 
  });
  
  // Check if day is complete
  if (state.currentHour >= dayPlan.hours || state.remaining <= 0) {
    notifyUser(`✅ Day ${state.currentDay} complete: ${dayPlan.total} sent. Remaining: ${state.remaining}`);
    state.currentDay++;
    state.currentHour = 0;
    if (state.remaining > 0) waitUntilNextDay();
  } else {
    // Wait for next hour
    wait(60 minutes);
  }
}
```

## API Endpoints Used

| Action | Endpoint | Method |
|--------|----------|--------|
| List tags | /tags | GET |
| Create contact | /contacts | POST |
| Fire tag | /tags/fire-tag/{tagId} | POST |
| Get contact | /contacts/{id} | GET |

## User Commands

During campaign execution, user can type:

| Command | Action |
|---------|--------|
| `pause` | Stop scheduling new batches, keep state |
| `resume` | Continue from next unsent contact |
| `cancel` | Stop campaign, archive state |
| `status` | Show current progress |
| `log` | Show recent batch history |

## Kanban Board Updates

Update KANBAN.md as campaign progresses:

```javascript
// Status mapping
const STATUS_EMOJI = {
  ready: "🟡",
  running: "🟢",
  paused: "⏸️",
  cancelled: "❌",
  completed: "✅"
};

function updateKanban(campaignId, updates) {
  // Read KANBAN.md, find entry by campaignId, update fields
  // Fields to track:
  // - Status (emoji + text)
  // - Sent / Remaining
  // - Current Day
  // - Last Updated
  // - Assignee (who is managing this campaign)
}
```

**Update triggers:**
- Status changes (ready → running → paused → completed)
- End of each day (update sent count)
- On pause/resume/cancel
- On completion

**Kanban Entry Format:**
```markdown
### {campaignId}
- **Type:** Re-engagement Campaign
- **Status:** {emoji} {status}
- **Created:** {timestamp}
- **Contacts:** {total}
- **Progress:** {sent}/{total} ({percent}%)
- **Current Day:** {day} of {totalDays}
- **Pace:** {pace}
- **GC Tag:** {tagName}
- **Assignee:** {user}
- **Last Updated:** {timestamp}
- **Folder:** campaigns/reengagement/{campaignId}/
```

## Safety Rules

1. **NEVER exceed 400 contacts/hour** - hard cap regardless of pace (8-hour daily window)
2. **ALWAYS verify tag exists** before starting
3. **ALWAYS get explicit "START" confirmation** before sending
4. **NEVER restart from beginning** on resume - continue from last position
5. **ALWAYS validate emails** before importing to GC
6. **NEVER apply tags without user confirming** tag-workflow link (or reminding them to attach it)

## Error Handling

| Error | Response |
|-------|----------|
| GC API failure | Retry 3x, then pause and notify user |
| Rate limit (429) | Wait 60s, retry |
| Invalid email in batch | Skip invalid, log warning, continue |
| Tag not found | Stop, ask user to verify tag ID |
| Workflow not linked | Pause, ask user to confirm in GC UI |

## State Schema

```json
{
  "campaignId": "uuid",
  "status": "ready|running|paused|cancelled|completed",
  "createdAt": "2026-02-17T10:00:00Z",
  "pace": "mild|normal|aggressive",
  "dailyLimit": 2000,
  "tagId": "gc-tag-id",
  "tagName": "Re-engagement Q1",
  "workflowName": "Q1 Re-engagement Flow",
  "totalContacts": 10000,
  "sent": 2050,
  "remaining": 7950,
  "currentDay": 2,
  "lastBatchAt": "2026-02-17T14:00:00Z"
}
```

## File Format Requirements

**CSV/XLS must include:**
- `email` (required) - Contact email address
- `firstName` (optional)
- `lastName` (optional)
- `phone` (optional)
- Any other custom fields supported by GC

**Example CSV:**
```csv
email,firstName,lastName,phone
john@example.com,John,Doe,555-1234
jane@example.com,Jane,Smith,555-5678
```

## Example Conversation Flow

**User:** "Start a re-engagement campaign"

**Agent:** "How many total contacts are we re-engaging?"

**User:** "16,000"

**Agent:** "What sending pace? (Mild, Normal, or Aggressive)"

**User:** "What would aggressive be?" *[User asks to compare]*

**Agent:** *[Shows all three pace tables with calculations]*

**User:** "Normal"

**Agent:** *[Shows full schedule table with Day/Per Hour/Hours/Contacts/Running Total]*
"Look good? If yes, upload your contact file (CSV or XLS/XLSX)."

*[User uploads file]*

**Agent:** "✅ Imported 16,000 contacts. 0 duplicates removed.
📁 Saved to: campaigns/reengagement/camp-20250217-001/
📋 Added to KANBAN.md for team visibility"

**Agent:** "Which GC re-engagement tag should I use?"

**User:** "test"

**Agent:** "Which GC workflow should trigger when this tag is applied?"

**User:** "workflow will be attached by us"

**Agent:** "Got it. I'll remind you before we start.

⚠️ REMINDER: You'll need to manually link the 'test' tag to your desired workflow in Global Control before we start."

**Agent:** *[Shows FINAL CAMPAIGN SUMMARY with table]*
"Type START to begin the campaign, or CANCEL to abort."

**User:** "what will you be doing next"

**Agent:** *[Explains execution phase, cron jobs, notifications]*

**User:** "START"

**Agent:** "🚀 Campaign started! Day 1: 50 warmup contacts sent. Cron jobs scheduled for Days 2-8. You'll get notified at each milestone."  

---

*Last updated: 2026-02-17 (refactored with 8-hour window, JSON storage, Kanban integration, cron-based execution)*
