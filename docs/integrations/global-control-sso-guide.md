# Global Control — SSO Integration Guide

> **Audience:** Partner platform development teams
> **Purpose:** Enable seamless single sign-on from Global Control into your platform

---

## Overview

Global Control is a software suite hub. Users manage their connected platforms directly from their GC dashboard. When a user clicks the **Access** button on your platform card inside GC, they are automatically redirected to your platform — already logged in — without ever entering a second password.

This document explains the full flow and what your team needs to implement to support it.

---

## How It Works — The Full Flow

```
1. User is logged into Global Control at app.globalcontrol.io
2. User navigates to the Apps page
3. User clicks "Access" on your platform card
4. GC opens a new tab:
      → https://your-platform.com/auth/sso?token=GC_ACCESS_TOKEN
5. Your platform receives the token, verifies it with GC
6. GC confirms the user identity and returns user data
7. Your platform creates a local session and logs the user in
8. User lands on your dashboard — fully authenticated
```

---

## Testing the Apps Menu

The Apps feature is currently under active development. To access it:

1. Log in at **`https://app.globalcontrol.io`**
2. Add `?dev=true` to the URL:
   ```
   https://app.globalcontrol.io?dev=true
   ```
3. The **Apps** menu item will appear in the left sidebar, between **Dashboard** and **Contacts**
4. Click Apps — your platform card will appear if it has been enabled by the GC team
5. Click **Access** to trigger the SSO redirect to your platform

> **Note:** The `?dev=true` flag only needs to be set once per browser session. It is persisted in localStorage.

---

## What GC Sends to Your Platform

When the user clicks Access, GC opens a new browser tab pointing to:

```
https://your-platform-url.com/auth/sso?token=GC_ACCESS_TOKEN
```

| Part | Description |
|------|-------------|
| `your-platform-url.com` | Your platform's registered domain in GC |
| `/auth/sso` | The route your platform must implement |
| `?token=` | The GC access token identifying the user |

Your platform **must have a route at `/auth/sso`** ready to receive this request.

---

## GC API — SSO Verification Endpoint

Once your platform receives the token, you verify it against the GC production API.

### Endpoint

```
POST http://api.globalcontrol.io/api/auth/sso/verify
```

### Headers

| Header | Value | Notes |
|--------|-------|-------|
| `Content-Type` | `application/json` | Required |
| `Origin` | `https://your-platform-url.com` | **Critical** — GC uses this to identify which platform is making the request. Must match your registered platform URL exactly. |

### Request Body

```json
{
  "token": "GC_ACCESS_TOKEN"
}
```

### Success Response — `200 OK`

```json
{
  "data": {
    "accessToken": "verified_gc_token",
    "updateAccessToken": false,
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "firstName": "...",
      "lastName": "...",
      ...
    }
  }
}
```

### Error Response

```json
{
  "error": {
    "message": "Failed to verify SSO token"
  }
}
```

---

## Implementation

### Recommended: Server-Side (Preferred)

Implementing this on the backend keeps the GC token off the browser and is the most secure approach.

**Flow:**

```
[Your Frontend — /auth/sso page]
  1. Read ?token from URL query params
  2. Show a loading state
  3. POST { token } to YOUR OWN BACKEND endpoint (e.g. POST /auth/sso)
          ↓
[Your Backend — POST /auth/sso]
  4. Receive token from your frontend
  5. Call GC:
       POST http://api.globalcontrol.io/api/auth/sso/verify
       Headers: { Origin: "https://your-platform-url.com", Content-Type: "application/json" }
       Body: { "token": "<token>" }
  6. If GC returns an error → respond 401 to your frontend
  7. If GC returns success:
       - Use the returned user data (email / _id) to find or create a local user record
       - Create your own session / JWT as you normally do on login
       - Return { token: YOUR_SESSION_TOKEN, user: ... } to your frontend
          ↓
[Your Frontend]
  8. Store your session token (same as a normal login)
  9. Redirect user to /dashboard
```

**What to build:**

| Layer | What to add |
|-------|-------------|
| Frontend | New page/route at `/auth/sso` — reads `?token`, POSTs to your backend, handles response |
| Backend | New route `POST /auth/sso` — calls GC, creates local session, returns to frontend |

---

### Alternative: Frontend-Side (Fallback Only)

If a server-side implementation is not possible, your frontend can call the GC API directly from the browser.

> **Security note:** This approach exposes the GC token in the browser. Use server-side if at all possible.

**Flow:**

```
[Your Frontend — /auth/sso page]
  1. Read ?token from URL query params
  2. POST directly to GC:
       POST http://api.globalcontrol.io/api/auth/sso/verify
       Headers: { Origin: "https://your-platform-url.com" }
       Body: { "token": "<token>" }
  3. On success: store the returned accessToken
  4. Redirect to /dashboard
```

> CORS must allow your frontend origin. Contact the GC team to confirm this is configured for your platform.

---

## Summary Checklist

- [ ] Add route `/auth/sso` on your frontend
- [ ] On load, read `?token` from URL
- [ ] Pass token to your backend (recommended) or call GC directly (fallback)
- [ ] Your backend calls `POST http://api.globalcontrol.io/api/auth/sso/verify` with correct `Origin` header
- [ ] Handle user login using the returned user data
- [ ] Redirect user to dashboard on success, to `/login` on failure
- [ ] Test using `https://app.globalcontrol.io?dev=true`

---

## Contact

If your platform URL is not yet registered in Global Control, or you need help with CORS or platform configuration, reach out to the GC team.
