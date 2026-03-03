---
name: globalcontrol
description: Global Control CRM API for contacts, tags, broadcasts, custom fields, workflows, and domains. Use when asked to manage GC contacts, send broadcast emails, fire tags, create/update tags, manage custom fields, workflows, or any Global Control operations. Triggers on "GC", "Global Control", "broadcast email", "fire tag", "contact management", "workflow".
---

# Global Control API

## Official Documentation
**📚 Live API Docs:** https://api.globalcontrol.io/ai-api-docs

Always check the official docs above when unsure about endpoints or parameters.

---

## Authentication

**Method:** API Key in header
**Header:** `X-API-KEY: {your_token}`
**Credential Location:** `credentials/titanium-api-keys.txt` → `GlobalControl` key

```bash
# Example cURL
curl -H "X-API-KEY: 9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219" \
  https://api.globalcontrol.io/api/ai/tags
```

```powershell
# Example PowerShell
$headers = @{
    "X-API-KEY" = "9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/tags" -Headers $headers
```

---

## Base URL & Response Format

| Setting | Value |
|---------|-------|
| **Base URL** | `https://api.globalcontrol.io/api/ai` |
| **Auth Header** | `X-API-KEY: {token}` |
| **Content-Type** | `application/json` |

### Response Format

**Success:**
```json
{
  "type": "response",
  "data": { ... }
}
```

**Error:**
```json
{
  "type": "error",
  "error": {
    "name": "ErrorMessage",
    "message": "Something Went Wrong",
    "time": "2026-02-18T20:56:24.539Z",
    "status": 400,
    "code": "",
    "details": "",
    "description": "Something Went Wrong"
  }
}
```

---

## Complete Endpoint Reference

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get authenticated user info |

---

### Contacts (13 endpoints)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/contacts` | List all contacts | `?page=1&limit=10` |
| POST | `/contacts` | Create contact | - |
| GET | `/contacts/{contactId}` | Get contact by ID | - |
| GET | `/contacts/{contactId}/details` | Get detailed contact info | - |
| PUT | `/contacts/{contactId}` | Update contact | - |
| DELETE | `/contacts/{contactId}` | Delete contact | - |
| GET | `/contacts/active-open` | Get active open contacts | - |
| GET | `/contacts/active-click` | Get active click contacts | - |
| GET | `/contacts/inactive` | Get inactive contacts | - |
| GET | `/contacts/passive` | Get passive contacts | - |
| GET | `/contacts/new` | Get new contacts | - |
| GET | `/contacts/dead` | Get dead contacts | - |
| GET | `/contacts/undeliverable` | Get undeliverable contacts | - |

#### Create Contact Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "[[email protected]](/cdn-cgi/l/email-protection)",
  "phone": "5551234567"
}
```

#### Contact Response Example
```json
{
  "type": "response",
  "data": {
    "_id": "contact_id_placeholder",
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "email": "[[email protected]](/cdn-cgi/l/email-protection)",
    "phone": "",
    "tags": ["tag_id_1", "tag_id_2"],
    "workflows": ["workflow_id_placeholder"],
    "customFields": [
      {
        "customFieldId": "custom_field_id_placeholder",
        "value": "https://example.com/link",
        "_id": "custom_field_entry_id_placeholder"
      }
    ],
    "active": true,
    "active_open": true,
    "active_click": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-06-01T00:00:00.000Z"
  }
}
```

#### Get Contact Details
**Endpoint:** `GET /contacts/{contactId}/details`

Get detailed contact information including full activity history, applied tags, active workflows, and custom field values.

**Response:**
```json
{
  "type": "response",
  "data": {
    "_id": "contact_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "tags": [
      {
        "_id": "tag_id",
        "name": "VIP Customer",
        "appliedAt": "2026-01-15T10:30:00.000Z"
      }
    ],
    "workflows": [
      {
        "_id": "workflow_id",
        "name": "Welcome Series",
        "status": "active",
        "currentFlow": "Email 2"
      }
    ],
    "customFields": [
      {
        "customFieldId": "field_id",
        "name": "Company",
        "value": "Acme Corp"
      }
    ],
    "activity": {
      "lastEmailSent": "2026-03-01T14:22:00.000Z",
      "lastEmailOpened": "2026-03-01T14:25:00.000Z",
      "lastEmailClicked": "2026-03-01T14:27:00.000Z",
      "totalEmailsSent": 45,
      "totalEmailsOpened": 38,
      "totalEmailsClicked": 12
    }
  }
}
```

**Example:**
```powershell
$contactId = "contact_id_here"
Invoke-RestMethod -Uri "$base/contacts/$contactId/details" -Headers $headers
```

---

### Tags (8 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tags` | List all tags |
| POST | `/tags` | Create tag |
| GET | `/tags/{tagId}` | Get tag by ID |
| GET | `/tags/with-contact-status` | Get tags with contact applied status |
| PUT | `/tags/{tagId}` | Update tag |
| DELETE | `/tags/{tagId}` | Delete tag |
| POST | `/tags/fire-tag/{tagId}` | Fire single tag to contact |
| POST | `/tags/fire-tags` | Fire multiple tags |

#### Create Tag Body
```json
{
  "name": "My Tag",
  "description": "Tag description",
  "groupId": "660fa6a95401181f60587691",
  "isHot": false
}
```

#### Fire Single Tag Body
```json
{
  "contactId": "contact_id_here"
}
```

**⚡ Auto-Create Contact (2026-03-02 Verified):**

Fire tag endpoints can **automatically create contacts** if they don't exist! Use:
```json
{
  "email": "new@example.com",
  "firstName": "John"
}
```

This will:
1. ✅ Create the contact automatically
2. ✅ Apply the tag immediately
3. ✅ No need to call `/contacts` first!

**Example:**
```powershell
$body = @{
  email = "new@example.com"
  firstName = "John"
} | ConvertTo-Json
Invoke-RestMethod -Uri "$base/tags/fire-tag/TAG_ID" -Method Post `
  -Headers $headers -Body $body
```

#### Fire Multiple Tags Body
```json
{
  "contactId": "contact_id_here",
  "tagIds": ["tag_id_1", "tag_id_2", "tag_id_3"]
}
```

#### Get Tags with Contact Status
**Endpoint:** `GET /tags/with-contact-status?contactId={contactId}`

Returns all tags with a status indicator showing whether the specified contact has each tag applied.

**Query Parameters:**
- `contactId` (required) - The contact ID to check tag status for

**Response:**
```json
{
  "type": "response",
  "data": [
    {
      "_id": "tag_id_1",
      "name": "VIP Customer",
      "hasTag": true
    },
    {
      "_id": "tag_id_2",
      "name": "Newsletter Subscriber",
      "hasTag": false
    }
  ]
}
```

**Example:**
```powershell
$headers = @{ "X-API-KEY" = "YOUR_KEY" }
$contactId = "contact_id_here"
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/tags/with-contact-status?contactId=$contactId" -Headers $headers
```

---

### Tag Groups (5 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tag-groups` | List all tag groups |
| POST | `/tag-groups` | Create tag group |
| GET | `/tag-groups/{groupId}` | Get tag group |
| PUT | `/tag-groups/{groupId}` | Update tag group |
| DELETE | `/tag-groups/{groupId}` | Delete tag group |

#### Create Tag Group Body
```json
{
  "name": "My Tag Group"
}
```

---

### Tag Labels (5 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tags-labels` | List all labels |
| POST | `/tags-labels` | Create label |
| GET | `/tags-labels/{labelId}` | Get label |
| PUT | `/tags-labels/{labelId}` | Update label |
| DELETE | `/tags-labels/{labelId}` | Delete label |

#### Create Tag Label Body
```json
{
  "name": "Priority",
  "color": "#FF5733"
}
```

---

### Custom Fields (5 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/custom-fields` | List all custom fields |
| POST | `/custom-fields` | Create custom field |
| GET | `/custom-fields/{customFieldId}` | Get custom field |
| PUT | `/custom-fields/{customFieldId}` | Update custom field |
| DELETE | `/custom-fields/{customFieldId}` | Delete custom field |

#### Create Custom Field Body
```json
{
  "name": "Company",
  "slug": "company",
  "fieldType": "text",
  "defaultValue": "",
  "type": "contact"
}
```

**Field Types:** `text`, `number`, `date`, `dropdown`, `checkbox`

---

### Custom Field Groups (5 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/custom-field-groups` | List all groups |
| POST | `/custom-field-groups` | Create group |
| GET | `/custom-field-groups/{groupId}` | Get group |
| PUT | `/custom-field-groups/{groupId}` | Update group |
| DELETE | `/custom-field-groups/{groupId}` | Delete group |

#### Create Custom Field Group Body
```json
{
  "name": "Business Information"
}
```

---

### Workflow Groups (5 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflow-groups` | List all workflow groups |
| POST | `/workflow-groups` | Create workflow group |
| GET | `/workflow-groups/{groupId}` | Get a workflow group |
| PUT | `/workflow-groups/{groupId}` | Update workflow group |
| DELETE | `/workflow-groups/{groupId}` | Delete workflow group |

#### Create Workflow Group Body
```json
{
  "name": "New Workflow Group"
}
```

#### Update Workflow Group Body
```json
{
  "name": "Updated Group Name"
}
```

---

### Workflows (9 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflows` | List all workflows |
| POST | `/workflows` | Create workflow |
| GET | `/workflows/{workflowId}` | Get a workflow |
| PUT | `/workflows/{workflowId}` | Update workflow |
| DELETE | `/workflows/{workflowId}` | Delete workflow |
| PUT | `/workflows/{workflowId}/{flowId}` | Update a specific flow |
| DELETE | `/workflows/{workflowId}/{flowId}` | Delete a specific flow |
| POST | `/workflows/release/{workflowId}/{flowId}` | Release a flow |
| POST | `/workflows/{workflowId}/delete-contact` | Delete contact from workflow |

#### Create Workflow Body (Container Only)
```json
{
  "name": "My Workflow",
  "workflowGroupId": "group_id_here"
}
```

**Best Practice:** Create empty workflow first, then add flows with PUT.

#### ⚠️ CRITICAL: PUT Workflows APPENDS Flows (2026-02-27 Tested & Confirmed)

**The PUT `/workflows/{workflowId}` endpoint APPENDS flows instead of replacing them!**

This means if you send a flows array to an existing workflow, it will ADD those flows to the existing ones.

**✅ CORRECT Safe Pattern (Recommended):**

```powershell
# Step 1: Create empty workflow
POST /workflows {"name": "...", "workflowGroupId": "..."}

# Step 2: Get current workflow (even if empty)
$workflow = GET /workflows/{id}

# Step 3: Build flows array (existing + new)
$existingFlows = $workflow.data.flows
$newFlow = @{ type="SEND_EMAIL", index=$existingFlows.Count, ... }
$allFlows = $existingFlows + $newFlow

# Step 4: PUT with complete array
PUT /workflows/{id} with { flows: $allFlows, ... }
```

**This pattern:**
- ✅ Works with the append behavior (doesn't fight it)
- ✅ Preserves existing flows
- ✅ Never deletes anything (safe, no data loss)
- ✅ Always get current state first

**🚫 NEVER delete flows without explicit user confirmation** - deletions cannot be restored!

#### Update Workflow (Add Email Sequence)
**This is the COMPLETE workflow structure with flows:**

```json
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

### Workflow Flow Types

| Type | Purpose | Data Fields |
|------|---------|-------------|
| `SEND_EMAIL` | Send email | `subject`, `body`, `from_name`, `from_email`, `reply_to`, `preview` |
| `TIMER` | Wait period | `waitFor` (number), `timeIn` ("minutes", "hours", "days") |
| `ADD_TAG` | Fire tag | `tagGroupId`, `tagId` |
| `MOVE_WORKFLOW` | Move contact | `workflowGroupId`, `workflowId` |
| `SPLIT_WORKFLOW` | A/B split | `splits` array with paths |

#### Timer Examples
```json
{"waitFor": "10", "timeIn": "minutes"}
{"waitFor": "1", "timeIn": "hours"}
{"waitFor": "1", "timeIn": "days"}
```

### 🔥 WORKFLOW FLOW CREATION (SAFE PATTERN - 2026-02-27)

**Always use this safe pattern:**
1. **POST /workflows** - Create empty workflow container (name + groupId only)
2. **GET /workflows/{id}** - Always get current state first
3. **Build array** - Existing flows + new flows
4. **PUT /workflows/{id}** - Update with complete flows array

**⚠️ CRITICAL:** PUT appends flows! Always GET current workflow first, combine existing + new flows, then PUT.

**Key Rules:**
- Flows array in PUT **replaces** existing flows
- Use `index` to order flows (0, 1, 2...)
- Set `status: true` for active flows
- Each flow gets its own `_id` after creation

#### ⚠️ CRITICAL: PowerShell Encoding Fix
**Always send JSON as UTF8 bytes:**
```powershell
$json = Get-Content "file.json" -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$headers = @{
    "X-API-KEY" = "9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/workflows/{id}" `
  -Method Put -Headers $headers -Body $bytes
```

**What fails:** `ConvertTo-Json` from hashtable, string body without encoding.  
**What works:** Raw JSON file → UTF8 bytes, or inline JSON string for short payloads.

#### Chad's Default SMTP Config
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

---

### 📋 Complete Working Example (2026-02-27 Tested - SAFE PATTERN)

**Create a new workflow with email sequence:**

```powershell
$headers = @{
    "X-API-KEY" = "9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"
    "Content-Type" = "application/json"
}

# Step 1: Create empty workflow container
$createBody = @{
    name = "My New Workflow"
    workflowGroupId = "your_group_id_here"
} | ConvertTo-Json

$workflow = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/workflows" `
  -Method Post -Headers $headers -Body $createBody

$workflowId = $workflow.data._id

# Step 2: Get current workflow (even though empty)
$current = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/workflows/$workflowId" `
  -Headers $headers

# Step 3: Build flows array (existing + new)
$existingFlows = $current.data.flows  # Empty array on first run
$newFlows = @(
    @{
        type = "SEND_EMAIL"
        status = $true
        index = 0
        label = "Welcome Email"
        data = @{
            preview = "Welcome!"
            from_name = "Chad Nicely"
            from_email = "chad"
            reply_to = "support@nicelysupport.com"
            subject = "Welcome to the workflow"
            body = "<p>Hey! Welcome.</p>"
        }
    }
)

# Step 4: PUT with complete workflow (existing flows + new flows)
$workflowData = @{
    name = "My New Workflow"
    domainId = "6688551acfe6ae024a58f9f6"
    smtpConfig = @{
        domain = "mg.chadnicely.com"
        integrationId = "628e75aa84279536ff4eb41a"
        accountId = "668854e8cfe6ae024a58ef72"
    }
    flows = $existingFlows + $newFlows
} | ConvertTo-Json -Depth 10

# Save and send as UTF8 bytes
$workflowData | Out-File -Encoding UTF8 "workflow.json"
$json = Get-Content "workflow.json" -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)

$result = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/workflows/$workflowId" `
  -Method Put -Headers $headers -Body $bytes
```

**To add another flow later (safe method - GET first):**

```powershell
# Always GET current state first
$workflow = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/workflows/$workflowId" `
  -Headers $headers

# Get existing flows
$existingFlows = $workflow.data.flows

# Add new flow
$newFlow = @{
    type = "SEND_EMAIL"
    status = $true
    index = $existingFlows.Count  # Next index
    label = "Second Email"
    data = @{
        preview = "Follow up"
        from_name = "Chad Nicely"
        from_email = "chad"
        reply_to = "support@nicelysupport.com"
        subject = "Follow up email"
        body = "<p>Hey! This is email 2.</p>"
    }
}

# Combine existing + new
$allFlows = $existingFlows + $newFlow

# PUT with complete workflow
$workflowData = @{
    name = $workflow.data.name
    domainId = $workflow.data.domainId
    smtpConfig = $workflow.data.smtpConfig
    flows = $allFlows
} | ConvertTo-Json -Depth 10

# Save and send as UTF8 bytes (same as above)
$workflowData | Out-File -Encoding UTF8 "workflow-update.json"
$json = Get-Content "workflow-update.json" -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)

$result = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/workflows/$workflowId" `
  -Method Put -Headers $headers -Body $bytes
```

**⚠️ IMPORTANT:** Never delete flows without explicit user confirmation - deletions cannot be restored!

---

### Flow Management Endpoints

These endpoints allow you to manage individual flows within a workflow without replacing the entire flows array.

#### Update a Specific Flow
**Endpoint:** `PUT /workflows/{workflowId}/{flowId}`

Update an individual flow within a workflow.

**Body Example:**
```json
{
  "type": "SEND_EMAIL",
  "status": true,
  "label": "Email 1 - Updated",
  "data": {
    "subject": "Updated Subject",
    "body": "<p>Updated content</p>",
    "from_name": "Chad Nicely",
    "from_email": "chad",
    "reply_to": "support@nicelysupport.com",
    "preview": "Updated preview"
  }
}
```

#### Delete a Specific Flow
**Endpoint:** `DELETE /workflows/{workflowId}/{flowId}`

**⚠️ DANGER:** Deletions cannot be restored! Always confirm with user before deleting.

Remove a single flow from a workflow. No body required.

```bash
DELETE /workflows/{workflowId}/{flowId}
```

#### Release a Flow
**Endpoint:** `POST /workflows/release/{workflowId}/{flowId}`

Release frozen contacts in a specific flow. No body required.

**Use case:** When contacts are frozen in a flow due to errors or manual freeze, this endpoint releases them to continue through the workflow.

```bash
POST /workflows/release/{workflowId}/{flowId}
```

#### Delete Contact from Workflow
**Endpoint:** `POST /workflows/{workflowId}/delete-contact`

Remove a specific contact from a workflow.

**Body:**
```json
{
  "contactId": "contact_id_here"
}
```

---

### Sub Users (5 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sub-users` | List all users |
| POST | `/sub-users` | Create user |
| GET | `/sub-users/{userId}` | Get user |
| PUT | `/sub-users/{userId}` | Update user |
| DELETE | `/sub-users/{userId}` | Delete user |

---

### Domains (6 endpoints)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/domains` | List all domains | `?domain=searchterm` |
| POST | `/domains` | Create domain | - |
| GET | `/domains/{domainId}` | Get domain | - |
| DELETE | `/domains/{domainId}` | Delete domain | - |
| POST | `/domains/smtp-domain-list` | Get SMTP integration domains | - |
| POST | `/domains/mailgun-domain-list` | Get Mailgun integration domains | - |

#### Search Domains Example
```bash
GET /domains?domain=chadnicely.com
```

#### Get Mailgun Domain List
**Endpoint:** `POST /domains/mailgun-domain-list`

Get domains specifically from Mailgun integration.

**Response:**
```json
{
  "type": "response",
  "data": [
    {
      "_id": "domain_id",
      "domain": "mg.example.com",
      "status": "verified"
    }
  ]
}
```

---

### Integrations (3 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/integrations` | List all integrations |
| GET | `/integrations/connected` | Get connected integrations |
| GET | `/integrations/connected-categories` | Get connected categories |

---

### Broadcast Emails (9 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/broadcast-emails/get-fields` | Get broadcast fields |
| POST | `/broadcast-emails/create-field` | Create broadcast field |
| POST | `/broadcast-emails/active-contacts-count` | Get active contacts count |
| POST | `/broadcast-emails/inactive-contacts-count` | Get inactive contacts count |
| POST | `/broadcast-emails/new-contacts-count` | Get new contacts count |
| POST | `/broadcast-emails/passive-contacts-count` | Get passive contacts count |
| POST | `/broadcast-emails/dead-contacts-count` | Get dead contacts count |
| POST | `/broadcast-emails/send-email` | **Send broadcast email** |
| POST | `/broadcast-emails/email-report` | Get broadcast email statistics |

#### Send Broadcast Email (TEST Mode)
```json
{
  "recipients": [{
    "tagId": null,
    "source": "TAG",
    "sendingSchedule": "TEST",
    "excludeTags": [],
    "active": {
      "activityLevel": false,
      "sentToAll": true,
      "partialCount": 0,
      "count": 1
    }
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

#### Send Broadcast Email (LIVE to Tag)
```json
{
  "recipients": [{
    "tagId": "YOUR_TAG_ID",
    "source": "TAG",
    "sendingSchedule": "IMMEDIATELY",
    "excludeTags": [],
    "active": {
      "activityLevel": false,
      "sentToAll": true,
      "partialCount": 0,
      "count": 0
    }
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
  "subject": "Your Subject",
  "message": "<p>Your HTML message</p>",
  "previewMessage": "Preview text"
}
```

**⚠️ WARNING: NEVER send live broadcast without explicit "send it" command from user.**

#### Get Broadcast Email Report
**Endpoint:** `POST /broadcast-emails/email-report`

Get statistics for broadcast email campaigns.

**Body:**
```json
{
  "domainId": "6688551acfe6ae024a58f9f6",
  "accountId": "668854e8cfe6ae024a58ef72",
  "dateFrom": "2026-03-01",
  "dateTo": "2026-03-02"
}
```

**Response:**
```json
{
  "type": "response",
  "data": [{
    "_id": "broadcast_id",
    "trackingId": "uuid",
    "subject": "Campaign Subject",
    "counts": {
      "total": 100,
      "sent": 100,
      "delivered": 98,
      "opened": 45,
      "clicked": 15,
      "bounced": 2,
      "failed": 0,
      "unsubscribed": 1
    }
  }]
}
```

**Example:**
```powershell
$body = @{
  domainId = "6688551acfe6ae024a58f9f6"
  accountId = "668854e8cfe6ae024a58ef72"
  dateFrom = "2026-03-01"
  dateTo = "2026-03-02"
} | ConvertTo-Json
Invoke-RestMethod -Uri "$base/broadcast-emails/email-report" -Method Post `
  -Headers $headers -Body $body
```

---

### Email Reports (3 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/email-reports/broadcast` | Get broadcast email reports |
| POST | `/email-reports/newsletter` | Get newsletter email reports |
| POST | `/email-reports/workflow` | Get workflow email reports |

#### Get Broadcast Email Report
```json
{
  "domainId": "6688551acfe6ae024a58f9f6",
  "accountId": "668854e8cfe6ae024a58ef72",
  "dateFrom": "2026-02-17",
  "dateTo": "2026-02-17"
}
```

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
{
  "domainId": "6688551acfe6ae024a58f9f6",
  "accountId": "668854e8cfe6ae024a58ef72",
  "dateFrom": "2025-06-07",
  "dateTo": "2025-06-07"
}
```

#### Get Workflow Email Report
```json
{
  "domain": "mg.chadnicely.com",
  "domainId": "6688551acfe6ae024a58f9f6",
  "accountId": "668854e8cfe6ae024a58ef72",
  "workflowId": "699657f7412b96a8bc5ac256",
  "dateFrom": "2026-02-17",
  "dateTo": "2026-02-17"
}
```

**Response includes flow-level stats:**
```json
{
  "type": "response",
  "data": [{
    "_id": "69828585bffa7b122204363c",
    "name": "openclaw shadow welcome",
    "trackingId": "585a0f5b-ebca-42b3-8e71-26968cd32a0a",
    "flows": [
      {
        "_id": "698285effa7b122220437096",
        "type": "SEND_EMAIL",
        "label": "Email 1",
        "data": {
          "subject": "Welcome to OpenClaw Shadow",
          "from_name": "Chad Nicely",
          "preview": "Get started with Chapter 1..."
        },
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

## Chad's Default Config

| Setting | Value |
|---------|-------|
| **API Key** | `9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219` |
| **Domain ID** | `6688551acfe6ae024a58f9f6` |
| **Integration ID** | `628e75aa84279536ff4eb41a` |
| **Account ID** | `668854e8cfe6ae024a58ef72` |
| **Domain** | `mg.chadnicely.com` |
| **From Email** | `chad@mg.chadnicely.com` |
| **Reply To** | `support@nicelysupport.com` |
| **Test Email** | `cnicely32@gmail.com` |

---

## Safety Rules

| Action | Safety Level | Rule |
|--------|-------------|------|
| GET requests | ✅ SAFE | Execute freely |
| POST create | ⚠️ CAUTION | Confirm before executing |
| PUT update | ⚠️ CAUTION | Show current state first |
| DELETE | 🔴 DANGEROUS | NEVER without explicit command |
| Broadcast (live) | 🔴 DANGEROUS | Test first, require "send it" |
| **Workflow flows** | 🔴 DANGEROUS | NEVER delete flows without confirmation - cannot be restored! |

---

## Rate Limits

- **Standard:** 100 req/min
- **Premium:** 500 req/min
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

On 429 error: Wait until `X-RateLimit-Reset` (Unix timestamp) + 1 second.

---

## Error Handling

### 401 Unauthorized
- Verify API key in `credentials/titanium-api-keys.txt`
- Check `X-API-KEY` header is set correctly

### 400 Bad Request
- Check request body format
- Verify required fields are present
- Check API docs for correct endpoint

### 404 Not Found
- Verify endpoint path
- Check if resource ID exists

### 422 Unprocessable Entity
- Check data validation (email format, required fields)
- Review field types and constraints

---

## PowerShell Examples

### List Tags
```powershell
$headers = @{
    "X-API-KEY" = "9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"
    "Content-Type" = "application/json"
}
$base = "https://api.globalcontrol.io/api/ai"

$response = Invoke-RestMethod -Uri "$base/tags" -Headers $headers
$response.data
```

### Create Contact
```powershell
$body = @{
    firstName = "John"
    lastName = "Doe"
    email = "[[email protected]](/cdn-cgi/l/email-protection)"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$base/contacts" -Method Post `
  -Headers $headers -Body $body
$response.data
```

### Fire Tag to Contact
```powershell
$tagId = "your_tag_id"
$body = @{
    contactId = "contact_id_here"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$base/tags/fire-tag/$tagId" -Method Post `
  -Headers $headers -Body $body
```

### Create Workflow with Emails (UTF8 Method)
```powershell
# Save workflow JSON to file
$workflowJson = @{
    name = "My Email Sequence"
    domainId = "6688551acfe6ae024a58f9f6"
    smtpConfig = @{
        domain = "mg.chadnicely.com"
        integrationId = "628e75aa84279536ff4eb41a"
        accountId = "668854e8cfe6ae024a58ef72"
    }
    flows = @(
        @{
            type = "SEND_EMAIL"
            status = $true
            index = 0
            label = "Email 1"
            data = @{
                subject = "Welcome!"
                body = "<p>Welcome to the program!</p>"
                from_name = "Chad Nicely"
                from_email = "chad"
                reply_to = "support@nicelysupport.com"
                preview = "Welcome message"
            }
        }
    )
} | ConvertTo-Json -Depth 10

# Save to file
$workflowJson | Out-File -Encoding UTF8 "workflow.json"

# Send as UTF8 bytes
$json = Get-Content "workflow.json" -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)

Invoke-RestMethod -Uri "$base/workflows/{workflowId}" -Method Put `
  -Headers $headers -Body $bytes
```

---

## 🔧 Error Fallback Protocol

**If you get 401 or 400 errors:**
1. **Check API key FIRST** - Verify using correct key from `credentials/titanium-api-keys.txt`
2. **Check API docs** - Visit https://api.globalcontrol.io/ai-api-docs for updated/correct endpoints
3. **Try again** - Re-execute with correct key/endpoint
4. **Only then notify** - If both above fail → Notify @Gaurav or @Ammad

---

## Complete Endpoint Count: 82 Total

- User: 1
- Contacts: 13
- Tags: 8
- Tag Groups: 5
- Tag Labels: 5
- Custom Fields: 5
- Custom Field Groups: 5
- Workflow Groups: 5
- Workflows: 9 (includes 4 flow management endpoints)
- Sub Users: 5
- Domains: 6
- Integrations: 3
- Broadcast Emails: 9
- Email Reports: 3

**All endpoints fully documented and verified (2026-03-02)**
