# /teamcall - Team Management Workflow

## Command
`/teamcall`

## What It Does
Extracts assignments and action items from the latest team Zoom call transcript, updates the kanban board and team management dashboard.

## Workflow Steps

### 1. Trigger
- User types `/teamcall` in Telegram after a team meeting

### 2. Fetch Transcript
```powershell
# Get Zoom recording from specific meeting ID
$meetingId = "82250425529"
# Download transcript via Zoom API
# Save to: transcripts/zoom/team-YYYY-MM-DD.vtt
```

### 3. Parse Assignments
Look for patterns like:
- "Gaurav, can you..."
- "Kafi will handle..."
- "Pranay is working on..."
- "@username do X"
- "Let's have [person] work on..."

Extract:
- **Task:** What needs to be done
- **Assignee:** Who's responsible
- **Context:** Why/how (from surrounding conversation)
- **Timestamp:** When it was mentioned in the call

### 4. Update Files

#### TEAM-KANBAN.md
```markdown
## 📋 Backlog
- [ ] [Task description] - @AssigneeName (from call YYYY-MM-DD)
```

#### TEAM.md
Update workload counts:
```markdown
### [Name]
- **Current Tasks:** X in progress
```

### 5. Update Dashboard
Push changes to team-kanban-app repo:
- Update `teamData.json` with new assignments
- Increment active task counts
- Add tasks to board

### 6. Deploy
```bash
cd team-kanban-app
git add .
git commit -m "Update from team call YYYY-MM-DD"
git push
npx vercel --prod
```

### 7. Notify
Post summary in Telegram:
```
✅ Processed team call from [date]

**New assignments:**
- @Gaurav: [Task 1]
- @Kafi: [Task 2]

**Board updated:** chadnicely.com/teamboard
```

---

## Assignment Recognition Examples

### Example 1: Direct Assignment
> "Gaurav, can you look into the API timeout issue?"

**Extracted:**
- Task: Look into API timeout issue
- Assignee: Gaurav
- Status: backlog

### Example 2: Self-Assignment
> "I'll handle the frontend updates this week" (spoken by Kafi)

**Extracted:**
- Task: Handle frontend updates
- Assignee: Kafi (speaker)
- Status: in-progress (if they said "I'll")

### Example 3: Team Decision
> "Let's have Pranay and Adarsha pair on the database migration"

**Extracted:**
- Task: Database migration
- Assignee: Pranay, Adarsha (both)
- Status: backlog

---

## Transcript Format

Zoom transcripts look like:
```
1
00:02:35.120 --> 00:02:38.450
Chad Nicely: Okay, Gaurav can you handle the
API integration?

2
00:02:38.650 --> 00:02:40.120
Gaurav: Sure, I'll get that done this week.
```

Parse for:
- Speaker name before ":"
- Look for task verbs (handle, work on, fix, build, etc.)
- Confirmation phrases (sure, yes, I'll, I can)

---

## Edge Cases

### Multiple Assignments
> "Gaurav and Kafi, work together on the mobile app"

**Handle:** Create one task, assign to both

### Vague Assignments
> "Someone needs to check the logs"

**Handle:** Add to backlog unassigned, flag for clarification

### Status Updates (not new tasks)
> "I finished the email integration yesterday"

**Handle:** Move existing task to Done, don't create new

---

## Files Modified
- `TEAM-KANBAN.md` - Add tasks to appropriate column
- `TEAM.md` - Update workload counts
- `team-kanban-app/app/teamData.json` - Data for dashboard
- `transcripts/zoom/team-YYYY-MM-DD.vtt` - Saved transcript

---

## Future Enhancements
- Auto-detect meeting end (no manual trigger)
- AI summary of key decisions
- Automatic time estimates for tasks
- Workload balancing suggestions
- Slack/Discord integration
- Calendar integration for deadlines
