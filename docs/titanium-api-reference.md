# Titanium Software API Reference

*Last updated: 2026-02-11*

Complete API documentation for all Titanium Software platforms.

---

## Quick Reference

| Platform | Base URL | Auth Header |
|----------|----------|-------------|
| SaaSOnboard | `https://app.saasonboard.com/api/ai` | `Authorization: {key}` |
| Course Sprout | `https://api.coursesprout.com/api/ai` | `X-API-KEY: {key}` |
| Global Control | `https://api.globalcontrol.io/api` | `X-API-KEY: {key}` |
| MintBird/PopLinks | `https://api.poplinks.io/api/ai` | `Authorization: Bearer {key}` |
| Letterman | `https://api.letterman.io/api/ai` | `Authorization: Bearer {key}` |

**Note:** Auth headers vary by platform! Check carefully.

---

## SaaSOnboard (SOB)

Master onboarding system for ALL Titanium products.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/companies/get` | List all products |
| GET | `/access-levels/get/:company_id` | Access levels for product |
| GET | `/user-types/get/:company_id` | User types for product |
| GET | `/bundles/get` | List all bundles |
| GET | `/trial-campaigns/get/:company_id` | Trial campaigns |
| GET | `/tags/get` | List all tags |
| POST | `/add-user` | Add/update user access |
| POST | `/user-access/revert` | Revert user access |

### Company IDs

| ID | Product |
|----|---------|
| 18 | EasyLinks |
| 72 | PopLinks |
| 73 | QuizForma |
| 75 | Revolverr |
| 81 | Mintbird |
| 86 | Letterman |
| 92 | Global Control |
| 93 | PowerPlay |
| 94 | AIBot Studio |
| 97 | Course Sprout |
| 99 | IG LaunchPad |
| 104 | Share Birdy |
| 105 | [Videos Only] - OfferMint |

### Bundle IDs

| ID | Bundle |
|----|--------|
| 6 | Platinum Bundle |
| 7 | Silver Bundle |
| 10 | Titanium Bundle |
| 11 | Ignite Bundle |

### Add User Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "type": "company",
  "company_id": 97,
  "access_level_id": 209,
  "user_type_id": 257
}
```

For bundles, use `"type": "bundle"` and include `bundle_id`.

---

## Course Sprout

Course platform and community management.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/get-pods` | List all pods/memberships |
| GET | `/get-course` | List all courses |
| GET | `/get-course-by-pod/:membership_id` | Courses in a pod |
| POST | `/add-user` | Add/update user, grant access |

### Pod IDs

| ID | Name |
|----|------|
| 3 | Entourage Mastermind |
| 4 | Power Plays Member |
| 57 | Local Newsletter Hustle |
| 67 | OfferMint |
| 95 | BlackBox Test |
| 98 | Chad Nicely's Vault |

### Course IDs (Key)

| ID | Title |
|----|-------|
| 4 | Round Table |
| 6 | Titanium Tech Call |
| 7 | Entourage Strategy Call |
| 140 | Local Newsletter Hustle |
| 171 | Newsletter Hour |
| 196 | OfferMint |
| 340 | OpenClaw Shadow Intensive |

### Add User Request

```json
{
  "first_name": "John",
  "email": "john@example.com",
  "course_id": 140,
  "membership_id": 67,
  "password": "pass5511"
}
```

**Password Reset:** Call add-user with email + new password. Existing user will be updated.

---

## Global Control (GC)

Central CRM hub for contacts, tags, and workflows.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Authenticated user |
| GET | `/contacts` | List contacts |
| GET | `/contacts?search={term}` | Search contacts |
| GET | `/contacts/{id}` | Get contact |
| POST | `/contacts` | Create contact |
| PUT | `/contacts/{id}` | Update contact |
| DELETE | `/contacts/{id}` | Delete contact |
| GET | `/tags` | List tags |
| POST | `/broadcast-emails/process-emails-beta` | Send broadcast |

### Search Contacts

```powershell
$headers = @{ "X-API-KEY" = "YOUR_KEY" }
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/contacts?search=John" -Headers $headers
```

### Send Broadcast Email

```json
{
  "recipients": [{
    "tagId": "TAG_ID",
    "source": "TAG",
    "sendingSchedule": "IMMEDIATELY"
  }],
  "smtpConfig": {
    "domainId": "DOMAIN_ID",
    "integrationId": "INTEGRATION_ID",
    "domain": "mg.chadnicely.com",
    "from_name": "Chad Nicely",
    "from_email": "chad@mg.chadnicely.com",
    "reply_to": "support@nicelysupport.com"
  },
  "type": "test",
  "testEmail": "test@example.com",
  "subject": "Subject",
  "message": "<p>HTML content</p>"
}
```

---

## MintBird / PopLinks (Same API!)

Sales pages, funnels, link tracking, bridge pages.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bridge-pages` | List bridge pages |
| GET | `/bridge-pages/:id` | Get bridge page |
| POST | `/bridge-pages` | Create bridge page |
| POST | `/bridge-pages/:id/clone` | Clone bridge page |
| PUT | `/bridge-pages/:id/url` | Update URL |
| GET | `/lead-pages` | List lead pages |
| GET | `/categories?type=2` | Get categories |
| GET | `/domains` | Personal domains |

### Ad Stats Endpoints

Base: `https://api.poplinks.io/api/ai/ad-stats`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/campaigns` | List campaigns |
| GET | `/campaigns/:id` | Get campaign |
| GET | `/campaigns/:id/insights` | Campaign stats |

**Date filters:** `?date_range=yesterday` or `today`, `week`, `month`, `year`

---

## Letterman

Newsletter software.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/publications` | List publications |
| POST | `/publications` | Create publication |
| GET | `/articles` | List articles |
| POST | `/articles` | Create article |
| POST | `/articles/generate` | AI-generate article |

---

## User Access Workflow

**ALWAYS follow this protocol when granting access:**

1. **Confirm email** — Read it back to verify
2. **Confirm access** — State what product/level they're getting  
3. **Ask before emailing** — "Want me to send them their access details?"

Never auto-send access emails.

---

## Sending Access Emails

Use AgentMail (`nicelycollabs@agentmail.to`) to send credentials:

```
Subject: Your {Product} Access

Hi {Name},

You now have access to {Product}!

Website: {login_url}
Email: {user_email}
Password: pass5511

If you have questions, reply to this email.

Best,
Chad's Team
```

---

## PowerShell Quick Templates

### SaaSOnboard - Add User
```powershell
$headers = @{ "Authorization" = "SOB_KEY" }
$body = @{ name="John"; email="john@example.com"; type="company"; company_id=97; access_level_id=209; user_type_id=257 } | ConvertTo-Json
Invoke-RestMethod -Uri "https://app.saasonboard.com/api/ai/add-user" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Course Sprout - Add User
```powershell
$headers = @{ "X-API-KEY" = "CS_KEY"; "Content-Type" = "application/json" }
$body = '{"first_name":"John","email":"john@example.com","course_id":140}'
Invoke-RestMethod -Uri "https://api.coursesprout.com/api/ai/add-user" -Method POST -Headers $headers -Body $body
```

### Global Control - Search Contact
```powershell
$headers = @{ "X-API-KEY" = "GC_KEY" }
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/contacts?search=Conny" -Headers $headers
```

---

*This document is maintained by Pacino. Last verified: 2026-02-11*
