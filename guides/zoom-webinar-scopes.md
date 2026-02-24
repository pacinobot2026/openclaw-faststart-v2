# Zoom Webinar API Scopes Guide

**Problem:** API returns "Invalid access token, does not contain scopes: [webinar:write:webinar, webinar:write:webinar:admin]"

**Solution:** Add the required scopes to your Server-to-Server OAuth app in Zoom Marketplace.

---

## Step-by-Step Instructions

### 1. Go to Zoom App Marketplace

Open: https://marketplace.zoom.us/

Sign in with: `chad@chadnicely.com`

### 2. Navigate to Your App

1. Click **Develop** (top right) → **Build App**
2. Or go directly to: https://marketplace.zoom.us/user/build
3. Find your **Server-to-Server OAuth** app
4. Click **Manage** or the app name

### 3. Add Webinar Scopes

1. Click **Scopes** in the left sidebar
2. Click **+ Add Scopes**
3. Search for "webinar" in the search box
4. Check these scopes:

| Scope | Description |
|-------|-------------|
| `webinar:write:webinar` | Create and update webinars |
| `webinar:write:webinar:admin` | Admin-level webinar management |
| `webinar:read:webinar` | Read webinar details (optional but useful) |
| `webinar:read:list_webinars` | List all webinars (optional) |

5. Click **Done** to add selected scopes

### 4. Save & Activate

1. Scroll down and click **Save**
2. If prompted, click **Continue** to confirm
3. App should show "Activated" status

### 5. Test the API

After saving, test with this PowerShell command:

```powershell
# Get fresh token
$clientId = "u48Es8IAQ5q6nEKSlPk_wA"
$clientSecret = "XdatFq14aTZM1p19KatKxRFx47EHke8G"
$accountId = "vuLwogpVQO2GiDaFjsmXXA"
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${clientId}:${clientSecret}"))
$tokenResponse = Invoke-RestMethod -Uri "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=$accountId" -Method POST -Headers @{Authorization="Basic $auth"}
$token = $tokenResponse.access_token

# List webinars (tests read scope)
Invoke-RestMethod -Uri "https://api.zoom.us/v2/users/me/webinars" -Headers @{Authorization="Bearer $token"}
```

If you see a list of webinars (or empty array), scopes are working!

---

## What Pacino Can Do Once Enabled

With the webinar scopes, I can:

✅ **Create webinars** - Set topic, date/time, duration, settings
✅ **Add registrants** - Bulk import from lists or individual
✅ **Update webinars** - Change details, reschedule
✅ **Get registrant lists** - Export who's signed up
✅ **Delete webinars** - Clean up old ones

---

## Common Issues

### "User does not have webinar feature"
Your Zoom account needs a Webinar add-on license. This is separate from the API scopes.

### Scopes still not working after save
1. Try creating a NEW Server-to-Server app with scopes from the start
2. Or wait 5-10 minutes for propagation
3. Generate a fresh access token (tokens include scopes at creation time)

### Need Meeting scopes too?
Similar process - search for "meeting" and add:
- `meeting:write:meeting`
- `meeting:write:meeting:admin`

---

## Quick Reference

**Marketplace URL:** https://marketplace.zoom.us/user/build

**Required Scopes for Webinars:**
- `webinar:write:webinar`
- `webinar:write:webinar:admin`

**Credentials Location:** `credentials/credentials-zoom.txt`

---

*Created: 2026-02-16 | For: Chad's Zoom webinar automation*
