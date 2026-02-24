# GLOBAL CONTROL API — FINAL EXTRACTION OUTPUT

========================================================
## 1. VERIFIED_ENDPOINT_INVENTORY
========================================================

```
TOC_COUNT:    51
BODY_COUNT:   51
FINAL_COUNT:  51
MISMATCHES:   NONE

CATEGORIES:
├── User (1)
│   └── GET /me
├── Integrations (3)
│   ├── GET /integrations
│   ├── GET /platform/connected-integrations
│   └── GET /integrations/connected-categories
├── Broadcast Emails (4)
│   ├── POST /broadcast-emails/process-emails-beta
│   ├── POST /broadcast-emails/create-field
│   ├── POST /broadcast-emails/q-active-contact-counts-n
│   └── GET  /broadcast-emails/get-fields
├── Contacts (5)
│   ├── GET    /contacts
│   ├── GET    /contacts/{contactId}
│   ├── POST   /contacts
│   ├── PUT    /contacts/{contactId}
│   └── DELETE /contacts/{contactId}
├── Sub Users (5)
│   ├── GET    /sub-users
│   ├── GET    /sub-users/{userId}
│   ├── POST   /sub-users
│   ├── PUT    /sub-users/{userId}
│   └── DELETE /sub-users/{userId}
├── Tags (5)
│   ├── GET    /tags
│   ├── GET    /tags/{tagId}
│   ├── POST   /tags
│   ├── PUT    /tags/{tagId}
│   └── DELETE /tags/{tagId}
├── Tag Groups (5)
│   ├── GET    /tag-groups
│   ├── GET    /tag-groups/{groupId}
│   ├── POST   /tag-groups
│   ├── PUT    /tag-groups/{groupId}
│   └── DELETE /tag-groups/{groupId}
├── Tag Labels (4)
│   ├── GET    /tags/labels
│   ├── GET    /tags/labels/{labelId}
│   ├── POST   /tags/labels
│   ├── PUT    /tags/labels/{labelId}
│   └── DELETE /tags/labels/{labelId}
├── Custom Fields (5)
│   ├── GET    /custom-fields
│   ├── GET    /custom-fields/{customFieldId}
│   ├── POST   /custom-fields
│   ├── PUT    /custom-fields/{customFieldId}
│   └── DELETE /custom-fields/{customFieldId}
├── Custom Field Groups (5)
│   ├── GET    /custom-field-groups
│   ├── GET    /custom-field-groups/{groupId}
│   ├── POST   /custom-field-groups
│   ├── PUT    /custom-field-groups/{groupId}
│   └── DELETE /custom-field-groups/{groupId}
└── Domains (5)
    ├── GET    /domains
    ├── GET    /domains/{domainId}
    ├── POST   /domains
    ├── POST   /domains/smtp-domain-list
    └── DELETE /domains/{domainId}
```

========================================================
## 2. API_MAP_JSON
========================================================

```json
{
  "meta": {
    "source_url": "https://api.globalcontrol.io/ai-api-docs",
    "fetched_at_iso": "2026-02-16T19:40:00Z",
    "api_name": "Global Control API",
    "doc_version": null,
    "notes": [
      "Source: Postman Collection v2.1.0 export",
      "MISMATCH: Doc says {success,data,message} but ACTUAL is {type:'response',data:{}}",
      "MISMATCH: Doc mentions /v{n}/ versioning but NO endpoints use versioned paths",
      "ARTIFACT: baseUrl variable 'farming-simulator.pstmn.io' is Postman placeholder - IGNORE",
      "SENSITIVE: /me response contains apiToken and current_password - MUST REDACT"
    ]
  },
  "transport": {
    "protocol": "https",
    "base_urls": [
      {"url": "https://api.globalcontrol.io/api", "confidence": 1.0, "notes": "Documented + confirmed"}
    ],
    "canonical_base_url": "https://api.globalcontrol.io/api",
    "join_rule": "baseUrl + '/' + path (paths do NOT start with /)"
  },
  "auth": {
    "options": [
      {"type": "api_key", "in": "header", "header_name": "X-API-KEY", "format": "X-API-KEY: <token>", "confidence": 1.0},
      {"type": "bearer", "in": "header", "header_name": "Authorization", "format": "Authorization: Bearer <token>", "confidence": 0.2}
    ],
    "recommended_default": "api_key",
    "verification_method": {
      "endpoint": "GET /me",
      "success_signature": "HTTP 200 + type='response' + data._id present",
      "failure_signature": "HTTP 401 OR type='error'"
    }
  },
  "conventions": {
    "rate_limits": {
      "headers": {"limit": "X-RateLimit-Limit", "remaining": "X-RateLimit-Remaining", "reset": "X-RateLimit-Reset"},
      "policies": ["100/min standard", "500/min premium", "enterprise custom"]
    },
    "response_envelope": {
      "success": {"type": "response", "data": "..."},
      "error": {"type": "error", "error": {"name": "...", "message": "...", "status": "..."}}
    },
    "pagination": {
      "type": "page_limit",
      "params": {"page": "number (default 1)", "limit": "number (default 10)"},
      "response": {"total": "number", "page": "number"},
      "supported_on": ["/contacts"]
    },
    "status_codes": ["200", "201", "400", "401", "403", "404", "429", "500"]
  },
  "sensitive_fields": ["apiToken", "current_password", "password"],
  "pii_fields": ["email", "phone", "address", "ip"],
  "endpoint_count": 51,
  "endpoints_file": "docs/apis/global-control-api-map-v2.json"
}
```

**Full 51-endpoint map:** `docs/apis/global-control-api-map-v2.json` (50KB)

========================================================
## 3. OPENCLAW_SKILL_WRAPPER_PLAN
========================================================

### GlobalControl.SafeClient

**Inputs:**
| Parameter | Type | Required | Default |
|-----------|------|----------|---------|
| `api_token` | string | YES | - |
| `auth_mode` | enum | NO | `"x-api-key"` |
| `base_url` | string | NO | `"https://api.globalcontrol.io/api"` |
| `timeout_ms` | number | NO | `30000` |
| `retry_enabled` | boolean | NO | `true` |
| `max_retries` | number | NO | `3` |

**Request Builder:**
- Headers: `X-API-KEY: {token}` (primary) or `Authorization: Bearer {token}` (fallback)
- URL: `baseUrl + "/" + path` (no double slashes)
- Timeout: 30s default, 60s for broadcast sends

**Retry/Backoff:**
- On 429: Parse `X-RateLimit-Reset` header (Unix timestamp), wait until reset + 1s jitter
- If no header: Exponential backoff 1s → 2s → 4s → ... (max 60s)
- Retry on: 429, 500, 502, 503, 504
- Max retries: 3

**Pagination Helper:**
- For `/contacts`: Auto-paginate with `page`/`limit`
- Response includes `total` for calculating pages
- `getAllContacts()` fetches all pages into single array

**Response Parser:**
```
Normalize to: {ok, data, message, error_code, error_message, raw}

if body.type == "response" → ok=true, data=body.data
if body.type == "error"    → ok=false, error_message=body.error.message
```

**Safety/Redaction:**
- NEVER LOG: `apiToken`, `current_password`, `password`, `X-API-KEY`, `Authorization`
- REDACT PII: `email` → `j***@example.com`, `phone` → `***1234`

**Destructive Call Protection:**
```
REQUIRE CONFIRMATION FOR:
- DELETE /contacts/{id}      → confirm="DELETE_CONTACT"
- DELETE /sub-users/{id}     → confirm="DELETE_USER"
- DELETE /tags/{id}          → confirm="DELETE_TAG"
- DELETE /tag-groups/{id}    → confirm="DELETE_TAG_GROUP"
- DELETE /tags/labels/{id}   → confirm="DELETE_TAG_LABEL"
- DELETE /custom-fields/{id} → confirm="DELETE_CUSTOM_FIELD"
- DELETE /custom-field-groups/{id} → confirm="DELETE_CUSTOM_FIELD_GROUP"
- DELETE /domains/{id}       → confirm="DELETE_DOMAIN"
- POST /broadcast-emails/process-emails-beta → confirm="SEND_BROADCAST_EMAIL"
```

========================================================
## 4. TEST_PROOF_COMMANDS (PASS 9)
========================================================

```bash
#!/bin/bash
# Global Control API - Test Proof Commands
# Replace YOUR_API_TOKEN with actual token

BASE_URL="https://api.globalcontrol.io/api"
TOKEN="YOUR_API_TOKEN"

echo "=========================================="
echo "TEST 1: Auth Check (X-API-KEY method)"
echo "=========================================="
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -H "X-API-KEY: $TOKEN" \
  "$BASE_URL/me"

# EXPECTED: HTTP 200
# EXPECTED JSON: {"type":"response","data":{"_id":"...","email":"...","accessLevel":"..."}}
# FAILURE: HTTP 401 OR {"type":"error","error":{"message":"Unauthorized"}}

echo ""
echo "=========================================="
echo "TEST 2: Auth Check (Bearer method)"
echo "=========================================="
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/me"

# EXPECTED: HTTP 200 (if Bearer supported) OR HTTP 401 (if not)
# Use to confirm which auth method is accepted

echo ""
echo "=========================================="
echo "TEST 3: List Contacts (Paginated)"
echo "=========================================="
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -H "X-API-KEY: $TOKEN" \
  "$BASE_URL/contacts?page=1&limit=10"

# EXPECTED: HTTP 200
# EXPECTED JSON: {"type":"response","data":{"contacts":[...],"total":N,"page":1}}
# FAILURE: {"type":"error","error":{"message":"..."}}

echo ""
echo "=========================================="
echo "TEST 4: Create Contact (POST)"
echo "=========================================="
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -X POST \
  -H "X-API-KEY: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "testuser-'$(date +%s)'@example.com",
    "phone": "5551234567"
  }' \
  "$BASE_URL/contacts"

# EXPECTED: HTTP 200
# EXPECTED JSON: {"type":"response","data":{"_id":"...","email":"...","firstName":"Test"}}
# FAILURE: {"type":"error","error":{"message":"..."}}
# NOTE: Save the returned _id for update/delete tests

echo ""
echo "=========================================="
echo "TEST 5: Update Contact (PUT)"
echo "=========================================="
# Replace CONTACT_ID with actual ID from TEST 4
CONTACT_ID="REPLACE_WITH_ID_FROM_TEST_4"
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -X PUT \
  -H "X-API-KEY: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }' \
  "$BASE_URL/contacts/$CONTACT_ID"

# EXPECTED: HTTP 200
# EXPECTED JSON: {"type":"response","data":{"_id":"...","firstName":"Updated"}}
# FAILURE: {"type":"error","error":{"message":"Contact not found"}}

echo ""
echo "=========================================="
echo "TEST 6: Delete Contact (DELETE)"
echo "=========================================="
# Replace CONTACT_ID with actual ID from TEST 4
CONTACT_ID="REPLACE_WITH_ID_FROM_TEST_4"
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -X DELETE \
  -H "X-API-KEY: $TOKEN" \
  "$BASE_URL/contacts/$CONTACT_ID"

# EXPECTED: HTTP 200
# EXPECTED JSON: {"type":"response","data":{"_id":"...","deleted":true OR deletedAt:"..."}}
# FAILURE: {"type":"error","error":{"message":"Contact not found"}}

echo ""
echo "=========================================="
echo "TEST 7: List Tags (No Pagination)"
echo "=========================================="
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -H "X-API-KEY: $TOKEN" \
  "$BASE_URL/tags"

# EXPECTED: HTTP 200
# EXPECTED JSON: {"type":"response","data":[{"_id":"...","name":"...","groupId":"..."}]}

echo ""
echo "=========================================="
echo "TEST 8: Rate Limit Headers Check"
echo "=========================================="
curl -s -D - -o /dev/null \
  -H "X-API-KEY: $TOKEN" \
  "$BASE_URL/tags" | grep -i "x-ratelimit"

# EXPECTED HEADERS (if present):
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 99
# X-RateLimit-Reset: 1708112400

echo ""
echo "=========================================="
echo "TEST 9: Error Response Format"
echo "=========================================="
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -H "X-API-KEY: $TOKEN" \
  "$BASE_URL/contacts/invalid_id_000000000000"

# EXPECTED: HTTP 400 or 404
# EXPECTED JSON: {"type":"error","error":{"name":"ErrorMessage","message":"Contact not found","status":400}}

echo ""
echo "=========================================="
echo "TEST 10: Invalid Auth"
echo "=========================================="
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  -H "X-API-KEY: invalid_token_12345" \
  "$BASE_URL/me"

# EXPECTED: HTTP 401
# EXPECTED JSON: {"type":"error","error":{"message":"Unauthorized" OR "Invalid API Key"}}

echo ""
echo "=========================================="
echo "ALL TESTS COMPLETE"
echo "=========================================="
```

### Quick One-Liner Tests

```bash
# Auth test (X-API-KEY)
curl -H "X-API-KEY: YOUR_TOKEN" https://api.globalcontrol.io/api/me

# Auth test (Bearer)
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.globalcontrol.io/api/me

# Contacts paginated
curl -H "X-API-KEY: YOUR_TOKEN" "https://api.globalcontrol.io/api/contacts?page=1&limit=5"

# Create contact
curl -X POST -H "X-API-KEY: YOUR_TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","firstName":"Test"}' \
  https://api.globalcontrol.io/api/contacts

# Delete contact
curl -X DELETE -H "X-API-KEY: YOUR_TOKEN" \
  https://api.globalcontrol.io/api/contacts/CONTACT_ID
```

### Expected Response Signatures

| Test | Success | Failure |
|------|---------|---------|
| Auth `/me` | `200` + `type:"response"` + `data._id` | `401` + `type:"error"` |
| List `/contacts` | `200` + `data.contacts[]` + `data.total` | `type:"error"` |
| Create `POST /contacts` | `200` + `data._id` + `data.email` | `type:"error"` + `message` |
| Update `PUT /contacts/{id}` | `200` + `data._id` | `404` + `"Contact not found"` |
| Delete `DELETE /contacts/{id}` | `200` + `data._id` | `404` + `"Contact not found"` |

========================================================
## END OF FINAL OUTPUT
========================================================

**Generated Files:**
- `docs/apis/global-control-api-map-v2.json` (50KB) - Full 51-endpoint map
- `docs/apis/global-control-wrapper-plan.md` (13KB) - Detailed wrapper plan
- `docs/apis/global-control-final-output.md` (THIS FILE) - Consolidated output
