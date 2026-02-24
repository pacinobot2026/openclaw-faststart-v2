---
name: base44
description: Base44 Monitoring API for workspace analytics, user management, and app monitoring. Use when asked to check Base44 analytics, list users, get app stats, or monitor workspace activity.
---

# Base44 Monitoring API

Base44 provides analytics and monitoring for no-code app workspaces.

## Authentication

**API Key Location:** `credentials/base44-api-key.txt`

**Header Format:**
```
api_key: <your-api-key>
```

**Base URL:** `https://app.base44.com/api/v1/monitoring`

All endpoints require `api_key` header except `/health`.

## Workspace ID

Most endpoints require a `workspace_id` path parameter. Get this from the Base44 dashboard or analytics data.

## Endpoints

### 1. Health Check
**Purpose:** Verify API is operational (no auth required)

```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "monitoring-api",
  "version": "1.0.0"
}
```

---

### 2. Get Workspace Analytics
**Purpose:** Get overview of workspace activity, users, apps

```bash
GET /analytics/{workspace_id}
Header: api_key: <your-key>
```

**Response Fields:**
- `summary`: Total apps, avg apps per user, registered users, active users (30d), published apps
- `user_distribution`: User activity breakdown
- `app_distribution`: App status breakdown
- `seats`: Seat usage
- `credits`: Credit usage

**Example:**
```json
{
  "summary": {
    "total_applications": 127,
    "avg_apps_per_user": 3.2,
    "total_registered_users": 42,
    "active_users_last_30d": 38,
    "published_apps": 89
  }
}
```

---

### 3. List Users
**Purpose:** Get all users in workspace (paginated)

```bash
GET /users/{workspace_id}?limit=100&offset=0
Header: api_key: <your-key>
```

**Query Params:**
- `limit` (optional, default: 100) - Max users to return
- `offset` (optional, default: 0) - Pagination offset

**Response:**
```json
{
  "users": [
    {
      "user_id": "...",
      "email": "user@example.com",
      "seat_type": "standard",
      "created_at": "2026-01-15T10:00:00Z",
      "app_count": 5
    }
  ],
  "total": 42,
  "limit": 100,
  "offset": 0
}
```

---

### 4. Get User Details
**Purpose:** Get specific user info including their apps

```bash
GET /users/{workspace_id}/{user_id}
Header: api_key: <your-key>
```

**Response:**
```json
{
  "user_id": "...",
  "email": "user@example.com",
  "seat_type": "standard",
  "created_at": "2026-01-15T10:00:00Z",
  "last_active": "2026-02-23T10:00:00Z",
  "apps": [...]
}
```

**Returns 404** if user not found.

---

### 5. List User Apps
**Purpose:** Get all apps owned by a specific user

```bash
GET /users/{workspace_id}/{user_id}/apps
Header: api_key: <your-key>
```

**Response:**
```json
{
  "apps": [
    {
      "app_id": "...",
      "app_name": "My First App",
      "status": "published",
      "created_at": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 5
}
```

Returns **empty array** if user has no apps.

---

### 6. Get App Analytics
**Purpose:** Get analytics for a specific app (with optional date range)

```bash
GET /apps/{workspace_id}/{app_id}/analytics?start_date=2026-01-01&end_date=2026-01-31
Header: api_key: <your-key>
```

**Query Params:**
- `start_date` (optional, format: YYYY-MM-DD)
- `end_date` (optional, format: YYYY-MM-DD)

**Response:**
```json
{
  "app_id": "...",
  "metrics": {
    "total_views": 1523,
    "unique_users": 234,
    "avg_session_duration": 187.5
  }
}
```

**Returns 404** if app not found.
**Returns 422** if date format invalid.

---

## Common Workflows

### Get workspace overview
1. Call `/analytics/{workspace_id}` for high-level summary
2. Drill down with `/users/{workspace_id}` for user list
3. Check specific users with `/users/{workspace_id}/{user_id}`

### Monitor app performance
1. Get user's apps: `/users/{workspace_id}/{user_id}/apps`
2. For each app, get analytics: `/apps/{workspace_id}/{app_id}/analytics`
3. Compare metrics across date ranges

### User activity audit
1. List all users with pagination
2. Check `last_active` timestamp in user details
3. Cross-reference with workspace analytics `active_users_last_30d`

---

## Error Handling

**422 Validation Error** - Check path params and query param formats
**404 Not Found** - User/app doesn't exist or wrong workspace
**401 Unauthorized** - Missing or invalid `api_key` header

---

## PowerShell Helper

```powershell
$apiKey = Get-Content "credentials/base44-api-key.txt" -Raw
$headers = @{ "api_key" = $apiKey.Trim() }
$base = "https://app.base44.com/api/v1/monitoring"

# Get analytics
Invoke-RestMethod -Uri "$base/analytics/{workspace_id}" -Headers $headers

# List users
Invoke-RestMethod -Uri "$base/users/{workspace_id}?limit=50" -Headers $headers
```

---

## Notes

- All endpoints are **GET** (read-only operations)
- Default pagination limit is 100
- Health check endpoint needs no auth (useful for uptime monitoring)
- Cross-reference: Get `app_id` from `listUserApps`, use in `getAppAnalytics`
