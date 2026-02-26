---
name: globalcontrol
description: Global Control CRM API for contacts, tags, broadcasts, custom fields, workflows, and domains. Use when asked to manage GC contacts, send broadcast emails, fire tags, create/update tags, manage custom fields, workflows, or any Global Control operations. Triggers on "GC", "Global Control", "broadcast email", "fire tag", "contact management", "workflow".
---

# Global Control API

## Official Documentation
**📚 Live API Docs:** https://api.globalcontrol.io/ai-api-docs

Always check the official docs above when unsure about endpoints or parameters.

### 🔧 Error Fallback Protocol
**If you get 401 or 400 errors:**
1. **Check API key FIRST** - Verify using correct key from `credentials/titanium-api-keys.txt`
2. **Check API docs** - Visit https://api.globalcontrol.io/ai-api-docs for updated/correct endpoints
3. **Try again** - Re-execute with correct key/endpoint
4. **Only then notify** - If both above fail → Notify @Gaurav or @Ammad

## Quick Reference

| Setting | Value |
|---------|-------|
| **Base URL** | `https://api.globalcontrol.io/api/ai` |
| **Auth** | `X-API-KEY: {token}` |
| **Response** | `{"type":"response","data":{...}}` |
| **Error** | `{"type":"error","error":{"message":"..."}}` |

## Authentication

```bash
curl -H "X-API-KEY: YOUR_TOKEN" https://api.globalcontrol.io/api/ai/tags
```

API key location: `credentials/titanium-api-keys.txt` (GC_API_KEY)

---

## Endpoints (49 total)

### User
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Get authenticated user |

### Contacts (9 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/contacts` | List all (`?page=1&limit=10`) |
| POST | `/contacts` | Create contact |
| GET | `/contacts/{contactId}` | Get contact by ID |
| PUT | `/contacts/{contactId}` | Update contact |
| DELETE | `/contacts/{contactId}` | Delete contact |
| GET | `/contacts/active-open` | Get active open contacts |
| GET | `/contacts/active-click` | Get active click contacts |
| GET | `/contacts/inactive` | Get inactive contacts |
| GET | `/contacts/passive` | Get passive contacts |
| GET | `/contacts/new` | Get new contacts |
| GET | `/contacts/dead` | Get dead contacts |
| GET | `/contacts/undeliverable` | Get undeliverable contacts |

### Tags (6 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/tags` | List all tags |
| POST | `/tags` | Create tag (needs `groupId`) |
| GET | `/tags/{tagId}` | Get tag by ID |
| PUT | `/tags/{tagId}` | Update tag |
| DELETE | `/tags/{tagId}` | Delete tag |
| POST | `/tags/fire-tag/{tagId}` | Fire single tag to contact |
| POST | `/tags/fire-tags` | Fire multiple tags |

### Tag Groups (2 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/tag-groups` | List all tag groups |
| POST | `/tag-groups` | Create tag group |
| GET | `/tag-groups/{groupId}` | Get tag group |
| PUT | `/tag-groups/{groupId}` | Update tag group |
| DELETE | `/tag-groups/{groupId}` | Delete tag group |

### Tag Labels (2 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/tags-labels` | List all labels |
| POST | `/tags-labels` | Create label |
| GET | `/tags-labels/{labelId}` | Get label |
| PUT | `/tags-labels/{labelId}` | Update label |
| DELETE | `/tags-labels/{labelId}` | Delete label |

### Custom Fields (2 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/custom-fields` | List all custom fields |
| POST | `/custom-fields` | Create custom field |
| GET | `/custom-fields/{customFieldId}` | Get custom field |
| PUT | `/custom-fields/{customFieldId}` | Update custom field |
| DELETE | `/custom-fields/{customFieldId}` | Delete custom field |

### Custom Field Groups (2 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/custom-field-groups` | List all groups |
| POST | `/custom-field-groups` | Create group |
| GET | `/custom-field-groups/{groupId}` | Get group |
| PUT | `/custom-field-groups/{groupId}` | Update group |
| DELETE | `/custom-field-groups/{groupId}` | Delete group |

### Workflow Groups (5 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/workflow-groups` | List all workflow groups |
| GET | `/workflow-groups/{groupId}` | Get a workflow group |
| POST | `/workflow-groups` | Create workflow group |
| PUT | `/workflow-groups/{groupId}` | Update workflow group |
| DELETE | `/workflow-groups/{groupId}` | Delete workflow group |

#### Create Workflow Group Body
```json
{"name": "new workflow group"}
```

#### Update Workflow Group Body
```json
{"name": "updated group name"}
```

### Workflows (5 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/workflows` | List all workflows |
| GET | `/workflows/{workflowId}` | Get a workflow |
| POST | `/workflows` | Create workflow |
| PUT | `/workflows/{workflowId}` | Update workflow |
| DELETE | `/workflows/{workflowId}` | Delete workflow |

#### Create Workflow Body
```json
{
  "name": "My Workflow",
  "workflowGroupId": "group_id_here",
  "emails": 0,
  "delayBetweenEmails": "",
  "subject": "",
  "from_name": "",
  "from_email_prefix": "",
  "from_email": "",
  "reply_to": "",
  "smtpConfig": {
    "domain": "",
    "integrationId": "",
    "accountId": ""
  },
  "domainId": ""
}
```

**Note:** 
- `delayBetweenEmails` format: "Xd" (days), "Xh" (hours), or "Xm" (minutes)
- `smtpConfig` contains domain information for email sending
- `domainId` is the domain identifier from `/domains` endpoint

#### Update Workflow Body
```json
{
  "name": "Updated Workflow Name",
  "workflowGroupId": "group_id_here"
}
```

### 🔥 WORKFLOW FLOW CREATION (CONFIRMED WORKING 2026-02-26)

**You CAN create full workflows with email sequences via API!**

#### Two-Step Process:
1. **POST /workflows** - Create workflow container
2. **PUT /workflows/{id}** - Add flows (emails, timers, etc.)

#### Full Workflow Creation Example:
```json
PUT /workflows/{workflowId}
{
  "name": "My Email Sequence",
  "domainId": "6688551acfe6ae024a58f9f6",
  "smtpConfig": {
    "domain": "mg.chadnicely.com",
    "integrationId": "628e75aa84279536ff4eb41a",
    "accountId": "668854e8cfe6ae024a58ef72"
  },
  "flows": [
    {
      "type": "SEND_EMAIL",
      "status": true,
      "index": 0,
      "label": "Email 1 - Welcome",
      "data": {
        "preview": "Welcome to the program!",
        "from_name": "Chad Nicely",
        "from_email": "chad",
        "reply_to": "support@nicelysupport.com",
        "subject": "Welcome! Here's what's next...",
        "body": "<p>Hey there!</p><p>Welcome to the program.</p><p>Chad</p>"
      }
    },
    {
      "type": "TIMER",
      "status": true,
      "index": 1,
      "label": "Wait 1 Day",
      "data": {
        "waitFor": "1",
        "timeIn": "days"
      }
    },
    {
      "type": "SEND_EMAIL",
      "status": true,
      "index": 2,
      "label": "Email 2 - Follow Up",
      "data": {
        "preview": "Quick follow up",
        "from_name": "Chad Nicely",
        "from_email": "chad",
        "reply_to": "support@nicelysupport.com",
        "subject": "Quick follow up...",
        "body": "<p>Hey!</p><p>Just checking in.</p><p>Chad</p>"
      }
    }
  ]
}
```

#### Flow Types:

| Type | Purpose | Data Fields |
|------|---------|-------------|
| `SEND_EMAIL` | Send email | `subject`, `body`, `from_name`, `from_email`, `reply_to`, `preview` |
| `TIMER` | Wait period | `waitFor` (number), `timeIn` ("minutes", "hours", "days") |
| `ADD_TAG` | Fire tag | `tagGroupId`, `tagId` |
| `MOVE_WORKFLOW` | Move contact | `workflowGroupId`, `workflowId` |
| `SPLIT_WORKFLOW` | A/B split | `splits` array with paths |

#### Timer Data Examples:
```json
{"waitFor": "10", "timeIn": "minutes"}
{"waitFor": "1", "timeIn": "hours"}
{"waitFor": "1", "timeIn": "days"}
```

#### Key Rules:
- Flows array in PUT **replaces** existing flows
- Use `index` to order flows (0, 1, 2...)
- Set `status: true` for active flows
- Each flow gets its own `_id` after creation

#### Chad's Default SMTP Config:
```json
{
  "domainId": "6688551acfe6ae024a58f9f6",
  "smtpConfig": {
    "domain": "mg.chadnicely.com",
    "integrationId": "628e75aa84279536ff4eb41a",
    "accountId": "668854e8cfe6ae024a58ef72"
  }
}
```

### Sub Users (2 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/sub-users` | List all users |
| POST | `/sub-users` | Create user |
| GET | `/sub-users/{userId}` | Get user |
| PUT | `/sub-users/{userId}` | Update user |
| DELETE | `/sub-users/{userId}` | Delete user |

### Domains (3 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/domains` | List all domains (use `?domain=searchterm` to search) |
| POST | `/domains` | Create domain |
| GET | `/domains/{domainId}` | Get domain |
| DELETE | `/domains/{domainId}` | Delete domain |
| POST | `/domains/smtp-domain-list` | Get SMTP integration domains |

#### Search Domains
Add `?domain=searchterm` query parameter to search for specific domains:
```
GET /domains?domain=chadnicely.com
```

### Integrations (3 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/integrations` | List all integrations |
| GET | `/integrations/connected` | Get connected integrations |
| GET | `/integrations/connected-categories` | Get connected categories |

### Broadcast Emails (8 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/broadcast-emails/get-fields` | Get broadcast fields |
| POST | `/broadcast-emails/create-field` | Create broadcast field |
| POST | `/broadcast-emails/active-contacts-count` | Get active contacts count |
| POST | `/broadcast-emails/inactive-contacts-count` | Get inactive contacts count |
| POST | `/broadcast-emails/new-contacts-count` | Get new contacts count |
| POST | `/broadcast-emails/passive-contacts-count` | Get passive contacts count |
| POST | `/broadcast-emails/dead-contacts-count` | Get dead contacts count |
| POST | `/broadcast-emails/send-email` | **Send broadcast email** |

### Email Reports (3 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/email-reports/broadcast` | **Get broadcast email reports** |
| POST | `/email-reports/newsletter` | **Get newsletter email reports** |
| POST | `/email-reports/workflow` | **Get workflow email reports** |

#### Get Broadcast Email Report
```json
POST /email-reports/broadcast
{
  "domainId": "6688551acfe6ae024a58f9f6",
  "accountId": "668854e8cfe6ae024a58ef72",
  "dateFrom": "2026-02-17",
  "dateTo": "2026-02-17"
}
```

**Parameters:**
- `domainId` (required) - Domain ID from /domains
- `accountId` (required) - Account ID 
- `dateFrom` (optional) - Start date (YYYY-MM-DD)
- `dateTo` (optional) - End date (YYYY-MM-DD)

**Response:**
```json
{
  "type": "response",
  "data": [{
    "_id": "campaign_001",
    "trackingId": "uuid-1234",
    "subject": "Campaign Subject",
    "counts": {
      "total": 65,
      "sent": 65,
      "delivered": 64,
      "opened": 30,
      "clicked": 12,
      "bounced": 0,
      "failed": 0,
      "unsubscribed": 1,
      "conv": 40
    }
  }]
}
```

#### Get Newsletter Email Report
```json
POST /email-reports/newsletter
{
  "domainId": "6688551acfe6ae024a58f9f6",
  "accountId": "668854e8cfe6ae024a58ef72",
  "dateFrom": "2025-06-07",
  "dateTo": "2025-06-07"
}
```

**Parameters:**
- `domainId` (required) - Domain ID from /domains
- `accountId` (required) - Account ID 
- `dateFrom` (optional) - Start date (YYYY-MM-DD)
- `dateTo` (optional) - End date (YYYY-MM-DD)

**Response:**
```json
{
  "type": "response",
  "data": [{
    "_id": "...",
    "trackingId": "...",
    "subject": "Newsletter Subject",
    "counts": {
      "total": 668,
      "sent": 668,
      "delivered": 654,
      "opened": 272,
      "clicked": 18,
      "bounced": 3,
      "failed": 14,
      "unsubscribed": 2,
      "conv": 6.62
    }
  }]
}
```

#### Get Workflow Email Report
```json
POST /email-reports/workflow
{
  "domain": "mg.chadnicely.com",
  "domainId": "6688551acfe6ae024a58f9f6",
  "accountId": "668854e8cfe6ae024a58ef72",
  "workflowId": "699657f7412b96a8bc5ac256",
  "dateFrom": "2026-02-17",
  "dateTo": "2026-02-17"
}
```

**Parameters:**
- `domain` (required) - Domain name (e.g., mg.chadnicely.com)
- `domainId` (required) - Domain ID from /domains
- `accountId` (required) - Account ID
- `workflowId` (required) - Workflow ID from /workflows
- `dateFrom` (optional) - Start date (YYYY-MM-DD)
- `dateTo` (optional) - End date (YYYY-MM-DD)

**Response:**
```json
{
  "type": "response",
  "data": [{
    "_id": "69828585bffa7b12220436325c",
    "name": "openclaw shadow welcome",
    "createdAt": "2026-02-03T23:33:19.805Z",
    "trackingId": "585a0f5b-ebca-42b3-8e71-26968cd32a0a",
    "flows": [
      {
        "_id": "698285effa7b122220437096",
        "data": {
          "name": "",
          "preview": "Get started with Chapter 1...",
          "from_name": "Chad Nicely",
          "from_email": "chad",
          "reply_to": "support@nicelysupport.com",
          "subject": "Welcome to OpenClaw Shadow",
          "body": "..."
        },
        "type": "SEND_EMAIL",
        "label": "Email 1",
        "counts": {
          "total": 150,
          "sent": 150,
          "delivered": 148,
          "opened": 95,
          "clicked": 42,
          "unsubscribed": 1,
          "bounced": 2,
          "failed": 0
        }
      }
    ]
  }]
}
```

---

## Common Request Bodies

### Create Contact
```json
{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"5551234567"}
```

### Create Tag
```json
{"name":"My Tag","description":"","groupId":"660fa6a95401181f60587691","isHot":false}
```

### Create Tag Label
```json
{"name":"Priority","color":"#FF5733"}
```

### Create Custom Field
```json
{"name":"Company","slug":"company","fieldType":"text","defaultValue":"","type":"contact"}
```

---

## Broadcast Email (CRITICAL)

**Endpoint:** `POST /broadcast-emails/send-email`

### Send to Test Email
```json
{
  "recipients": [{
    "tagId": null,
    "source": "TAG",
    "sendingSchedule": "TEST",
    "excludeTags": [],
    "active": {"activityLevel":false,"sentToAll":true,"partialCount":0,"count":1}
  }],
  "smtpConfig": {
    "domainId": "6688551acfe6ae024a58f9f6",
    "integrationId": "628e75aa84279536ff4eb41a",
    "domain": "mg.chadnicely.com",
    "accountId": "668854e8cfe6ae024a58ef72",
    "from_name": "Chad Nicely",
    "from_email": "chad@mg.chadnicely.com",
    "reply_to": "support@nicelysupport.com"
  },
  "type": "test",
  "testEmail": "cnicely32@gmail.com",
  "subject": "Subject Line",
  "message": "<p>HTML body</p>",
  "previewMessage": "Preview text"
}
```

### Send to Tag (LIVE)
```json
{
  "recipients": [{
    "tagId": "YOUR_TAG_ID",
    "source": "TAG",
    "sendingSchedule": "IMMEDIATELY",
    "excludeTags": [],
    "active": {"activityLevel":false,"sentToAll":true,"partialCount":0,"count":0}
  }],
  "smtpConfig": {...},
  "subject": "...",
  "message": "..."
}
```

**WARNING: NEVER send live without explicit "send it" command from user.**

---

## Chad's Domain Config
| Setting | Value |
|---------|-------|
| domainId | `6688551acfe6ae024a58f9f6` |
| integrationId | `628e75aa84279536ff4eb41a` |
| accountId | `668854e8cfe6ae024a58ef72` |
| domain | `mg.chadnicely.com` |
| from_email | `chad@mg.chadnicely.com` |
| reply_to | `support@nicelysupport.com` |
| testEmail | `cnicely32@gmail.com` |

---

## Safety Rules

| Action | Rule |
|--------|------|
| GET | SAFE - execute freely |
| POST create | CAUTION - confirm before executing |
| PUT update | CAUTION - show current state first |
| DELETE | DANGEROUS - NEVER without explicit command |
| Broadcast (live) | DANGEROUS - test first, require "send it" |

---

## PowerShell Template

```powershell
$headers = @{
    "X-API-KEY" = "YOUR_GC_API_KEY"
    "Content-Type" = "application/json"
}
$base = "https://api.globalcontrol.io/api/ai"

# List tags
(Invoke-RestMethod -Uri "$base/tags" -Headers $headers).data

# List contacts (page 1)
(Invoke-RestMethod -Uri "$base/contacts?page=1&limit=10" -Headers $headers).data.contacts
```

---

## Rate Limits

- Standard: 100 req/min
- Premium: 500 req/min
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

On 429: Wait until `X-RateLimit-Reset` (Unix timestamp) + 1 second.

---

## Full API Map

See `api_map.json` for complete endpoint details with request/response schemas.

See `references/wrapper-plan.md` for implementation patterns.
