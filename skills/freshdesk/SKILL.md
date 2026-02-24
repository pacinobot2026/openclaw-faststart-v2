# Freshdesk API Skill

**Version:** 1.0.0  
**API Version:** v2  
**Docs:** https://developers.freshdesk.com/api/

## Overview

This skill provides comprehensive access to the Freshdesk API v2 for customer support operations including tickets, contacts, agents, companies, conversations, and more.

## Configuration Required

Before using this skill, ensure these credentials are available:

| Config Key | Description | Example |
|------------|-------------|---------|
| `FRESHDESK_DOMAIN` | Your Freshdesk subdomain | `yourcompany.freshdesk.com` |
| `FRESHDESK_API_KEY` | API key from Profile Settings | `abcdefgh12345678` |

**Finding Your API Key:**
1. Log into your Freshdesk portal
2. Click profile picture → Profile Settings
3. API key is below the change password section

## Authentication

All requests use **Basic Authentication**:
- Username: Your API key
- Password: `X` (literal character, any dummy value works)

```bash
curl -u "YOUR_API_KEY:X" -H "Content-Type: application/json" \
  https://yourcompany.freshdesk.com/api/v2/tickets
```

## Rate Limits

| Plan | Requests/minute |
|------|-----------------|
| Trial | 50 |
| Growth | 200 |
| Pro | 400 |
| Enterprise | 700 |

**Rate Limit Headers:**
- `X-RateLimit-Total` - Total allowed per minute
- `X-RateLimit-Remaining` - Remaining in current window
- `X-RateLimit-Used-CurrentRequest` - Consumed by this request
- `Retry-After` - Seconds to wait (only on 429)

## Pagination

Most list endpoints support:
- `page` - Page number (starts at 1)
- `per_page` - Results per page (max 100, default 30)

Example: `/api/v2/tickets?page=2&per_page=50`

## Quick Reference - Common Operations

### Tickets

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List all tickets | GET | `/api/v2/tickets` |
| View a ticket | GET | `/api/v2/tickets/{id}` |
| Create a ticket | POST | `/api/v2/tickets` |
| Update a ticket | PUT | `/api/v2/tickets/{id}` |
| Delete a ticket | DELETE | `/api/v2/tickets/{id}` |
| Restore a ticket | PUT | `/api/v2/tickets/{id}/restore` |
| Filter tickets | GET | `/api/v2/search/tickets?query="..."` |

### Contacts

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List all contacts | GET | `/api/v2/contacts` |
| View a contact | GET | `/api/v2/contacts/{id}` |
| Create a contact | POST | `/api/v2/contacts` |
| Update a contact | PUT | `/api/v2/contacts/{id}` |
| Delete a contact | DELETE | `/api/v2/contacts/{id}` |
| Filter contacts | GET | `/api/v2/search/contacts?query="..."` |

### Conversations

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List conversations | GET | `/api/v2/tickets/{id}/conversations` |
| Reply to ticket | POST | `/api/v2/tickets/{id}/reply` |
| Add note | POST | `/api/v2/tickets/{id}/notes` |
| Update conversation | PUT | `/api/v2/conversations/{id}` |
| Delete conversation | DELETE | `/api/v2/conversations/{id}` |

### Agents

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List all agents | GET | `/api/v2/agents` |
| View an agent | GET | `/api/v2/agents/{id}` |
| View current agent | GET | `/api/v2/agents/me` |
| Create agent | POST | `/api/v2/agents` |
| Update agent | PUT | `/api/v2/agents/{id}` |
| Delete agent | DELETE | `/api/v2/agents/{id}` |

### Companies

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List all companies | GET | `/api/v2/companies` |
| View a company | GET | `/api/v2/companies/{id}` |
| Create a company | POST | `/api/v2/companies` |
| Update a company | PUT | `/api/v2/companies/{id}` |
| Delete a company | DELETE | `/api/v2/companies/{id}` |
| Filter companies | GET | `/api/v2/search/companies?query="..."` |

### Groups

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List all groups | GET | `/api/v2/groups` |
| View a group | GET | `/api/v2/groups/{id}` |
| Create a group | POST | `/api/v2/groups` |
| Update a group | PUT | `/api/v2/groups/{id}` |
| Delete a group | DELETE | `/api/v2/groups/{id}` |

## Ticket Fields & Values

### Status Values
| Value | Status |
|-------|--------|
| 2 | Open |
| 3 | Pending |
| 4 | Resolved |
| 5 | Closed |

### Priority Values
| Value | Priority |
|-------|----------|
| 1 | Low |
| 2 | Medium |
| 3 | High |
| 4 | Urgent |

### Source Values
| Value | Source |
|-------|--------|
| 1 | Email |
| 2 | Portal |
| 3 | Phone |
| 7 | Chat |
| 9 | Feedback Widget |
| 10 | Outbound Email |

## Error Handling

| Code | Meaning |
|------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Authentication Failure |
| 403 | Access Denied |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 409 | Conflict (duplicate) |
| 429 | Rate Limit Exceeded |
| 500 | Server Error |

**Error Response Format:**
```json
{
  "description": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Mandatory attribute missing",
      "code": "missing_field"
    }
  ]
}
```

## Usage Examples

See `api-reference.md` for complete endpoint documentation.
See `examples.ps1` for PowerShell examples.

## Safety Rules

1. **Never log raw API keys** - Always redact in outputs
2. **Confirm before DELETE** - All delete operations require explicit confirmation
3. **dry_run mode** - Use to preview requests without executing
4. **Rate limit awareness** - Check remaining calls before bulk operations
