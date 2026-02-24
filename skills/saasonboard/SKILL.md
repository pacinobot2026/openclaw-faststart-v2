---
name: saasonboard
description: SaaSOnboard (SOB) API for managing user access across Titanium Software products. Use when asked to add users to products, grant access to bundles, manage trial campaigns, list companies/products, or check access levels. Covers MintBird, PopLinks, Course Sprout, Letterman, Global Control, QuizForma, and other Titanium apps.
---

# SaaSOnboard (SOB) API

Master onboarding system for all Titanium Software products.

## Authentication

```
Header: Authorization: {api_key}
```

Note: NOT "Bearer", just the raw key.

## Base URL

```
https://app.saasonboard.com/api/ai
```

## Endpoints

### List Companies/Products
```
GET /companies/get
```
Returns all SaaS products you can manage.

### List Access Levels
```
GET /access-levels/get/:company_id
```

### List User Types
```
GET /user-types/get/:company_id
```

### List Bundles
```
GET /bundles/get
```

### List Trial Campaigns
```
GET /trial-campaigns/get/:company_id
```

### List Tags
```
GET /tags/get
```

### Add User
```
POST /add-user
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "type": "bundle",
  "bundle_id": 1,
  "company_id": 1,
  "access_level_id": 1,
  "user_type_id": 1,
  "tag_id": 1,
  "default_password": "password123"
}
```

### Revert User Access
```
POST /user-access/revert
```

## Company IDs (Chad's Account)

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

## PowerShell Template

```powershell
$headers = @{ "Authorization" = "YOUR_API_KEY" }

# List companies
Invoke-RestMethod -Uri "https://app.saasonboard.com/api/ai/companies/get" -Headers $headers

# List bundles
Invoke-RestMethod -Uri "https://app.saasonboard.com/api/ai/bundles/get" -Headers $headers

# Add user to bundle
$body = @{
    name = "John Doe"
    email = "john@example.com"
    type = "bundle"
    bundle_id = 1
    company_id = 81
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://app.saasonboard.com/api/ai/add-user" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

## Bundle IDs

| ID | Bundle |
|----|--------|
| 6 | Platinum Bundle |
| 7 | Silver Bundle |
| 8 | Vivek Trial |
| 9 | GC Vivek |
| 10 | Titanium Bundle |
| 11 | Ignite Bundle |
| 12 | CourseSprout Test |
| 13 | Quick Quizforma |

## Tag IDs

| ID | Tag |
|----|-----|
| 18 | + Ignite |
| 20 | + Platinum Member |
| 21 | + Silver Member |
| 22 | - Platinum / Titanium Cancelled |
| 23 | - Silver Trial Cancelled |
| 24 | + Nick's People |
| 26 | Titanium Member |
| 27 | - Ignite Downgraded |
| 28 | MintBird Launch JV |

## ⚠️ CRITICAL: Retrieving vs Resetting Passwords

**When asked to "pull" or "get" credentials:**
- ❌ DO NOT call `/add-user` - this RESETS the password!
- ✅ SOB does NOT expose existing passwords via API (security)
- ✅ Use web dashboard: https://app.saasonboard.com
- ✅ Or tell user to use "Forgot Password"

**When asked to "reset" or "create" access:**
- ✅ Use `/add-user` with `default_password` field
- ✅ This creates new users OR updates existing ones

**If you reset a password by mistake:**
- Cannot undo it - original password is lost
- Apologize and provide the new password
- User must use the new password you set

## Workflow: Add User to Product

**ALWAYS follow this protocol:**
1. **Confirm email** — Read back the email address to verify
2. **Confirm access** — State what product/level they're getting
3. **Ask before emailing** — "Want me to send them their access details?"

**Then execute:**
1. Get company_id from table above (or call `/companies/get`)
2. Get access_level_id: `GET /access-levels/get/{company_id}`
3. Get user_type_id: `GET /user-types/get/{company_id}`
4. Optionally get bundle_id: `GET /bundles/get`
5. Call `POST /add-user` with all IDs
6. If approved, send access email via AgentMail

## Password Reset (Course Sprout)

Course Sprout passwords can be reset via the add-user endpoint:

```powershell
$headers = @{ "X-API-KEY" = "YOUR_COURSESPROUT_KEY"; "Content-Type" = "application/json" }
$body = '{"first_name":"Name","email":"user@email.com","password":"newpassword"}'
Invoke-RestMethod -Uri "https://api.coursesprout.com/api/ai/add-user" -Method POST -Headers $headers -Body $body
```

If user exists (matched by email), password will be updated. Confirm success by checking `visible_password` in response.
