# Newsletter Hour Weekly Workflow

**MEMORIZED: This is the standard process. Do it automatically.**

## Trigger
Chad gives topics for the week (voice memo or text)

## Process (Do ALL at once)

### Step 1: Update Zoom Webinar Agenda
**Webinar ID:** 88390841602
**API:** Zoom Server-to-Server OAuth

```powershell
$body = @{
    agenda = @"
This Week on Newsletter Hour:

🚀 [Topic 1]

📧 [Topic 2]

✨ [Topic 3]

🔍 [Topic 4]

Join us Monday at 10am PST / 1pm EST!
"@
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.zoom.us/v2/webinars/88390841602" -Method PATCH -Headers $headers -Body $body
```

**Why this works:** The agenda automatically flows into ALL 4 email templates:
- ✅ Confirmation Email (sent on registration)
- ✅ Reminder Email (sent before call)
- ✅ Attendee Follow-up Email (sent after call to attendees)
- ✅ Absentee Follow-up Email (sent after call to no-shows)

### Step 2: Draft GC Broadcast Email
**Format:**
```
Subject: Going LIVE Today - Local Newsletter Hour

Quick reminder - we're going LIVE today for the Local Newsletter Hour.

Click here to get registered for the call
https://chadnicely.com/newsletterhour

When: 10am PST / 1pm EST

What we're covering:

🚀 [Topic 1] - [brief description]

📧 [Topic 2] - [brief description]

✨ [Topic 3] - [brief description]

🔍 [Topic 4] - [brief description]

This is going to be a packed call. Don't miss it.

Click here to get registered for the call
https://chadnicely.com/newsletterhour

See you there!
```

**Rules:**
- Link at TOP after opening
- Link at BOTTOM before sign-off
- Emoji bullets, NOT numbered lists
- Keep descriptions punchy

### Step 3: Read Draft as Audio
Use TTS to send voice memo of the email draft to Chad.

### Step 4: Send Test Email
**Endpoint:** `POST https://api.globalcontrol.io/api/broadcast-emails/process-emails-beta`

**Test Config:**
```json
{
    "type": "test",
    "testEmail": "cnicely32@gmail.com",
    "subject": "Going LIVE Today - Local Newsletter Hour",
    "message": "<p>HTML email content</p>",
    ...
}
```

### Step 5: Wait for Approval → Send Live
Change `"type": "test"` to `"type": "live"` and remove `testEmail` field.

## Key IDs

**Zoom:**
- Newsletter Hour Webinar: `88390841602`
- Titanium Tech Call: `84103913926`

**GC Tags:**
- Newsletter Hour: `686d7742597629a956b34f54`
- Newsletter Hour Open: `686d7b93597629a956b44185`

**GC Domain (mg.chadnicely.com):**
- domainId: `6688551acfe6ae024a58f9f6`
- integrationId: `628e75aa84279536ff4eb41a`
- accountId: `668854e8cfe6ae024a58ef72`

## Schedule
- **Call:** Every Monday 10am PST / 1pm EST
- **Registration Link:** https://chadnicely.com/newsletterhour

## Replay Process (After Call)
1. Get replay # from PopLinks API (Newsletter Hour category 1945, highest # + 1)
2. Create bridge page for replay
3. Update Attendee/Absentee emails with replay link (or they use agenda link)

---
*Last updated: 2025-07-17*
