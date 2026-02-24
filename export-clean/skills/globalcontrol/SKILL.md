---
name: globalcontrol
description: Global Control CRM API for contacts, tags, broadcasts, custom fields, and domains. Use when asked to manage GC contacts, send broadcast emails, fire tags, create/update tags, manage custom fields, or any Global Control operations. Triggers on "GC", "Global Control", "broadcast email", "fire tag", "contact management".
---

# Global Control API

## Official Documentation
**📚 Live API Docs:** https://api.globalcontrol.io/ai-api-docs

Always check the official docs above when unsure about endpoints or parameters.

### 🔧 Error Fallback Protocol
**If you get 401 or 400 errors:**
1. Visit https://api.globalcontrol.io/ai-api-docs immediately
2. Check for updated/correct endpoints
3. Try the request again with docs endpoint
4. **If still fails** → Notify @Gaurav or @Ammad

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

**API key:** *(Set via config or ask user when not provided)*

---

## Endpoints (39 total)

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

### Email Reports (2 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/email-reports/broadcast` | **Get broadcast email reports** |
| POST | `/email-reports/newsletter` | **Get newsletter email reports** |

#### Get Broadcast Email Report
```json
POST /email-reports/broadcast
{
  "domainId": "YOUR_DOMAIN_ID",
  "accountId": "YOUR_ACCOUNT_ID",
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
  "domainId": "YOUR_DOMAIN_ID",
  "accountId": "YOUR_ACCOUNT_ID",
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

---

## Common Request Bodies

### Create Contact
```json
{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"5551234567"}
```

### Create Tag
```json
{"name":"My Tag","description":"","groupId":"YOUR_GROUP_ID","isHot":false}
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
    "domainId": "YOUR_DOMAIN_ID",
    "integrationId": "YOUR_INTEGRATION_ID",
    "domain": "mg.yourdomain.com",
    "accountId": "YOUR_ACCOUNT_ID",
    "from_name": "Your Name",
    "from_email": "you@mg.yourdomain.com",
    "reply_to": "support@yourdomain.com"
  },
  "type": "test",
  "testEmail": "test@example.com",
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

## Domain Config Template
| Setting | Value |
|---------|-------|
| domainId | *(Ask user or get from /domains)* |
| integrationId | *(Ask user)* |
| accountId | *(Ask user)* |
| domain | *(Ask user)* |
| from_name | *(Ask user)* |
| from_email | *(Ask user)* |
| reply_to | *(Ask user)* |
| testEmail | *(Ask user)* |

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
    "X-API-KEY" = "YOUR_API_KEY"
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
