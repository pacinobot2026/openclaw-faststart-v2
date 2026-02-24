# Universal API Ingest Prompt: Global Control API

**Tailored for:** https://app.globalcontrol.io/ai-api-docs

---

## API CHARACTERISTICS (Pre-Analyzed)

Before you begin, note these Global Control-specific patterns:

- **Auth:** `X-API-KEY` header (NOT Bearer token)
- **Base URL:** `https://api.globalcontrol.io/api/ai`
- **Response Envelope:** `{ "type": "response", "data": {...} }`
- **11 Endpoint Groups:** User, Integrations, Broadcast Email, Contacts, Sub Users, Tags, Custom Fields, Tags Labels, Custom Field Groups, Domains, Tag Groups
- **Expected Endpoint Count:** ~50 endpoints
- **Special Actions:** "Fire a Tag" and "Fire Multiple Tags" are POST actions that trigger workflows
- **CRUD Pattern:** Most groups follow Get One / Get All / Create / Update / Delete

---

## PASS 0 — Page Access + Full Load

1. Open `https://app.globalcontrol.io/ai-api-docs` in browser
2. Wait for full JS render (page shows sidebar navigation + main content)
3. **CRITICAL:** The sidebar lists ALL endpoint groups. Expand each group by clicking if collapsed.
4. Scroll the entire page top-to-bottom to trigger any lazy-loaded content
5. Capture the full HTML or take comprehensive snapshots of each section

**Verification:** Sidebar should show these 11 groups:
- User (1 endpoint)
- Integrations (3 endpoints)
- Broadcast Email (4 endpoints)
- Contacts (5 endpoints)
- Sub Users (5 endpoints)
- Tags (7 endpoints)
- Custom Fields (5 endpoints)
- Tags Labels (5 endpoints)
- Custom Field Groups (5 endpoints)
- Domains (5 endpoints)
- Tag Groups (5 endpoints)

---

## PASS 1 — Extract Ground Truth (Verbatim)

Record EXACTLY as shown in docs:

### Authentication
```
Header: X-API-KEY
Value: {{apiToken}}
```

### Base URL
```
https://api.globalcontrol.io/api/ai
```

### Response Format
```json
{
  "type": "response",
  "data": { ... }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Rate Limits
- Standard: 100 requests/minute
- Premium: 500 requests/minute
- Enterprise: Custom

### HTTP Status Codes
- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 429 Too Many Requests
- 500 Internal Server Error

---

## PASS 2 — Endpoint Inventory (Complete List)

Build this exact table. If you find MORE or FEWER endpoints, recount.

| # | Group | Method | Path | Endpoint Name |
|---|-------|--------|------|---------------|
| 1 | User | GET | /me | Get Authenticated User |
| 2 | Integrations | GET | /integrations | Get all Integrations |
| 3 | Integrations | GET | /platform/connected-integrations | Get Connected Integrations |
| 4 | Integrations | GET | /integrations/connected-categories | Get Connected Categories |
| 5 | Broadcast Email | POST | /broadcast-emails/process-emails-beta | Send Email |
| 6 | Broadcast Email | POST | /broadcast-emails/create-field | Create a Field |
| 7 | Broadcast Email | POST | /broadcast-emails/q-active-contact-counts-n | Get Activity Levels |
| 8 | Broadcast Email | GET | /broadcast-emails/get-fields | Get Fields |
| 9 | Contacts | GET | /contacts/{contactId} | Get a Contact |
| 10 | Contacts | GET | /contacts | Get all Contacts |
| 11 | Contacts | POST | /contacts | Create a Contact |
| 12 | Contacts | PUT | /contacts/{contactId} | Update a Contact |
| 13 | Contacts | DELETE | /contacts/{contactId} | Delete a Contact |
| 14 | Sub Users | GET | /sub-users/{userId} | Get a User |
| 15 | Sub Users | GET | /sub-users | Get all Users |
| 16 | Sub Users | POST | /sub-users | Create a User |
| 17 | Sub Users | PUT | /sub-users/{userId} | Update a User |
| 18 | Sub Users | DELETE | /sub-users/{userId} | Delete a User |
| 19 | Tags | GET | /tags/{tagId} | Get a Tag |
| 20 | Tags | GET | /tags | Get all Tags |
| 21 | Tags | POST | /tags | Create a Tag |
| 22 | Tags | POST | /tags/fire | Fire a Tag |
| 23 | Tags | POST | /tags/fire-multiple | Fire Multiple Tags |
| 24 | Tags | PUT | /tags/{tagId} | Update a Tag |
| 25 | Tags | DELETE | /tags/{tagId} | Delete a Tag |
| 26 | Custom Fields | GET | /custom-fields/{customFieldId} | Get a Field |
| 27 | Custom Fields | GET | /custom-fields | Get all Fields |
| 28 | Custom Fields | POST | /custom-fields | Create a Field |
| 29 | Custom Fields | PUT | /custom-fields/{customFieldId} | Update a Field |
| 30 | Custom Fields | DELETE | /custom-fields/{customFieldId} | Delete a Field |
| 31 | Tags Labels | GET | /tags/labels/{labelId} | Get a Label |
| 32 | Tags Labels | GET | /tags/labels | Get Labels |
| 33 | Tags Labels | POST | /tags/labels | Create a Label |
| 34 | Tags Labels | PUT | /tags/labels/{labelId} | Update a Label |
| 35 | Tags Labels | DELETE | /tags/labels/{labelId} | Delete a Label |
| 36 | Custom Field Groups | GET | /custom-field-groups/{groupId} | Get a Group |
| 37 | Custom Field Groups | GET | /custom-field-groups | Get Groups |
| 38 | Custom Field Groups | POST | /custom-field-groups | Create a Group |
| 39 | Custom Field Groups | PUT | /custom-field-groups/{groupId} | Update a Group |
| 40 | Custom Field Groups | DELETE | /custom-field-groups/{groupId} | Delete a Group |
| 41 | Domains | GET | /domains/{domainId} | Get a Domain |
| 42 | Domains | GET | /domains | Get all Domains |
| 43 | Domains | POST | /domains/smtp-domain-list | Get Integration Domains |
| 44 | Domains | POST | /domains | Create a Domain |
| 45 | Domains | DELETE | /domains/{domainId} | Delete a Domain |
| 46 | Tag Groups | GET | /tag-groups/{groupId} | Get a group |
| 47 | Tag Groups | GET | /tag-groups | Get all groups |
| 48 | Tag Groups | POST | /tag-groups | Create a Group |
| 49 | Tag Groups | PUT | /tag-groups/{groupId} | Update a Group |
| 50 | Tag Groups | DELETE | /tag-groups/{groupId} | Delete a Group |

**VERIFICATION CHECKPOINT:** You must find exactly 50 endpoints. If your count differs, re-scan.

---

## PASS 3 — Deep Schema Capture

For EACH endpoint, extract this template:

```
### [Group] - [Endpoint Name]
**Method:** GET/POST/PUT/DELETE
**Path:** /exact/path/{param}
**Purpose:** One sentence description

**Path Params:**
- {paramName}: description (required)

**Query Params:**
- paramName: description | required/optional | default: value

**Request Body:**
```json
{
  "field": "type | required/optional | constraints"
}
```

**Example Response:**
```json
{ actual example from docs }
```

**Notes/Edge Cases:**
- Any warnings or special behavior
```

### HIGH-PRIORITY ENDPOINTS TO CAPTURE IN DETAIL:

1. **Broadcast Email - Send Email** (complex payload with recipients, smtpConfig, scheduling)
2. **Tags - Fire a Tag** (triggers workflows - needs contactId + tagId)
3. **Tags - Fire Multiple Tags** (batch trigger - array of tagIds)
4. **Contacts - Create/Update** (likely has custom fields integration)

---

## PASS 4 — Verification (Mandatory)

1. **Count Check:** Total endpoints = 50
2. **Group Check:** All 11 groups captured
3. **Auth Check:** `X-API-KEY` header confirmed
4. **Base URL Check:** `https://api.globalcontrol.io/api/ai` confirmed
5. **Response Envelope Check:** `{ "type": "response", "data": ... }` confirmed

**Statement to include:**
> "Verified: [X] endpoints captured across [Y] groups. Auth: X-API-KEY header. Base URL: https://api.globalcontrol.io/api/ai. Endpoint count confirmed via double-scan."

---

## PASS 5 — Build OpenClaw Skill Wrapper

### Skill Metadata
```yaml
name: globalcontrol
description: Global Control Center API for CRM, tags, contacts, broadcasts, and custom fields
base_url: https://api.globalcontrol.io/api/ai
auth:
  type: api_key
  header: X-API-KEY
  key_source: credentials/titanium-api-keys.txt (GC_API_KEY)
```

### Safety Rules
1. **READ actions** (GET): Execute freely
2. **WRITE actions** (POST for create): Require confirmation
3. **UPDATE actions** (PUT): Require confirmation + show diff
4. **DELETE actions**: NEVER execute without explicit "delete" command
5. **Fire Tag actions**: Require confirmation (triggers workflows)
6. **Broadcast Email - Send**: ALWAYS test mode first, require explicit "send live"

### Dry Run Mode
All write/update/delete/fire actions support `dry_run: true`:
- Prints: Method, URL, Headers (redacted), Payload
- Does NOT send the request
- Returns: "DRY RUN - Request not sent"

### Action Naming Convention
```
{group}_{action}
Examples:
- user_get_me
- contacts_list
- contacts_get
- contacts_create
- contacts_update
- contacts_delete
- tags_list
- tags_fire
- tags_fire_multiple
- broadcast_send_email
- broadcast_get_fields
```

---

## PASS 6 — Test Proof Commands

Generate these 5 tests:

### Test 1: Get Authenticated User (READ)
```
Action: user_get_me
Method: GET
Path: /me
Headers: X-API-KEY: [REDACTED]
Expected: { "type": "response", "data": { "_id": "...", "email": "...", "fullName": "..." } }
```

### Test 2: List All Tags (READ)
```
Action: tags_list
Method: GET
Path: /tags
Headers: X-API-KEY: [REDACTED]
Expected: { "type": "response", "data": [ { "_id": "...", "name": "...", "groupId": "..." }, ... ] }
```

### Test 3: List All Contacts (READ)
```
Action: contacts_list
Method: GET
Path: /contacts
Headers: X-API-KEY: [REDACTED]
Expected: { "type": "response", "data": [ { "_id": "...", "email": "...", "firstName": "...", "lastName": "..." }, ... ] }
```

### Test 4: Create Tag (WRITE - DRY RUN)
```
Action: tags_create
Mode: dry_run
Method: POST
Path: /tags
Headers: X-API-KEY: [REDACTED]
Payload: { "name": "Test Tag", "groupId": "...", "isHot": false }
Expected: DRY RUN - Request not sent. Would create tag "Test Tag".
```

### Test 5: Fire a Tag (WRITE - DRY RUN)
```
Action: tags_fire
Mode: dry_run
Method: POST
Path: /tags/fire
Headers: X-API-KEY: [REDACTED]
Payload: { "contactId": "...", "tagId": "..." }
Expected: DRY RUN - Request not sent. Would fire tag "..." for contact "...".
```

---

## OUTPUT CHECKLIST

Before completing, confirm you have:

- [ ] Verified endpoint count: 50 (double-scanned)
- [ ] All 11 groups captured
- [ ] Auth header exact: `X-API-KEY`
- [ ] Base URL exact: `https://api.globalcontrol.io/api/ai`
- [ ] Response envelope documented
- [ ] All CRUD endpoints for each group
- [ ] Special endpoints (Fire Tag, Broadcast Email) detailed
- [ ] Safety rules defined
- [ ] Dry run mode specified
- [ ] 5 test commands generated

---

*Prompt generated for Global Control API v1.0.0*
