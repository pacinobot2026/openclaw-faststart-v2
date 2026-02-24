# GoHighLevel API – Master Reference (OpenClaw)

Platform: GoHighLevel  
Auth: OAuth 2.0 / Bearer Tokens  
Base URL: https://services.leadconnectorhq.com

---

## PURPOSE
This document is the single source of truth for OpenClaw when interacting with GoHighLevel.
OpenClaw MUST reference this file before making any API calls.

---

## AUTHENTICATION

### OAuth 2.0
- Authorization URL: https://marketplace.gohighlevel.com/oauth/chooselocation
- Token URL: https://services.leadconnectorhq.com/oauth/token

### Required Headers
Authorization: Bearer {access_token}  
Content-Type: application/json

---

## CORE OBJECTS
- Contacts
- Opportunities
- Pipelines
- Calendars
- Conversations
- Messages (SMS / Email)
- Users
- Locations
- Webhooks

---

## CONTACTS

### Get Contacts
GET /contacts/

Query Params:
- locationId
- limit
- offset

### Create Contact
POST /contacts/

Required Fields:
- firstName
- lastName
- email OR phone
- locationId

---

## OPPORTUNITIES / PIPELINES

### Get Pipelines
GET /opportunities/pipelines

### Create Opportunity
POST /opportunities/

---

## CONVERSATIONS & MESSAGING

### Send SMS
POST /conversations/messages

### Send Email
POST /conversations/messages

---

## CALENDARS

### Get Calendars
GET /calendars/

---

## WEBHOOKS

### Supported Events
- contact.created
- contact.updated
- opportunity.created
- message.received

### Webhook Payload (Example)
{
  "type": "contact.created",
  "locationId": "xxxx",
  "contact": {}
}

---

## RATE LIMITS
- Subject to account limits
- Retry with exponential backoff

---

## KNOWN GOTCHAS
- Most endpoints REQUIRE locationId
- Some endpoints are agency-only
- Legacy endpoints still exist

---

## SOURCES
- GoHighLevel Marketplace Docs
- GoHighLevel Stoplight API Docs

---

END OF FILE
