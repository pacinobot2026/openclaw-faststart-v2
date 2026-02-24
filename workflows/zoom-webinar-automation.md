# Zoom Webinar Automation Workflow

**Purpose:** Create and manage Zoom webinars via API

**Prerequisites:** 
- Webinar scopes enabled (see `guides/zoom-webinar-scopes.md`)
- Zoom account with Webinar license

---

## Authentication

**Type:** Server-to-Server OAuth

**Credentials:** `credentials/credentials-zoom.txt`
```
Account ID: vuLwogpVQO2GiDaFjsmXXA
Client ID: u48Es8IAQ5q6nEKSlPk_wA
Client Secret: XdatFq14aTZM1p19KatKxRFx47EHke8G
```

**Get Access Token:**
```powershell
$clientId = "u48Es8IAQ5q6nEKSlPk_wA"
$clientSecret = "XdatFq14aTZM1p19KatKxRFx47EHke8G"
$accountId = "vuLwogpVQO2GiDaFjsmXXA"
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${clientId}:${clientSecret}"))
$tokenResponse = Invoke-RestMethod -Uri "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=$accountId" -Method POST -Headers @{Authorization="Basic $auth"}
$token = $tokenResponse.access_token
```

Token expires in 1 hour. Always fetch fresh.

---

## API Endpoints

### Base URL
```
https://api.zoom.us/v2
```

### Webinar Operations

| Action | Method | Endpoint |
|--------|--------|----------|
| List webinars | GET | `/users/me/webinars` |
| Create webinar | POST | `/users/me/webinars` |
| Get webinar | GET | `/webinars/{webinarId}` |
| Update webinar | PATCH | `/webinars/{webinarId}` |
| Delete webinar | DELETE | `/webinars/{webinarId}` |
| Get registrants | GET | `/webinars/{webinarId}/registrants` |
| Add registrant | POST | `/webinars/{webinarId}/registrants` |
| Update registrant status | PUT | `/webinars/{webinarId}/registrants/status` |

---

## Create Webinar

**Request Body:**
```json
{
  "topic": "Webinar Title",
  "type": 5,
  "start_time": "2026-02-18T10:00:00",
  "duration": 60,
  "timezone": "America/Los_Angeles",
  "agenda": "Optional description",
  "settings": {
    "approval_type": 0,
    "registration_type": 1,
    "auto_recording": "cloud",
    "host_video": true,
    "panelists_video": true,
    "practice_session": false,
    "hd_video": true,
    "question_answer": true,
    "allow_multiple_devices": false,
    "contact_email": "chad@chadnicely.com",
    "contact_name": "Chad Nicely"
  }
}
```

**Type Values:**
- `5` = Webinar (scheduled)
- `6` = Recurring webinar with no fixed time
- `9` = Recurring webinar with fixed time

**Approval Types:**
- `0` = Automatically approve
- `1` = Manually approve
- `2` = No registration required

**PowerShell Example:**
```powershell
$body = @{
    topic = "How to Finally Run Your Entire Business With AI"
    type = 5
    start_time = "2026-02-18T10:00:00"
    duration = 60
    timezone = "America/Los_Angeles"
    settings = @{
        approval_type = 0
        registration_type = 1
        auto_recording = "cloud"
    }
} | ConvertTo-Json -Depth 3

$result = Invoke-RestMethod -Uri "https://api.zoom.us/v2/users/me/webinars" `
    -Method POST `
    -Headers @{Authorization="Bearer $token"; "Content-Type"="application/json"} `
    -Body $body

# Returns webinar ID and join URLs
$result.id            # Webinar ID
$result.join_url      # Attendee join URL
$result.registration_url  # Registration URL
```

---

## Add Registrant

**Request Body:**
```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**PowerShell Example:**
```powershell
$webinarId = "123456789"
$registrant = @{
    email = "john@example.com"
    first_name = "John"
    last_name = "Doe"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "https://api.zoom.us/v2/webinars/$webinarId/registrants" `
    -Method POST `
    -Headers @{Authorization="Bearer $token"; "Content-Type"="application/json"} `
    -Body $registrant

# Returns
$result.registrant_id
$result.join_url      # Unique join URL for this registrant
```

---

## Bulk Add Registrants

Loop through a list:
```powershell
$webinarId = "123456789"
$registrants = @(
    @{email="user1@example.com"; first_name="User"; last_name="One"},
    @{email="user2@example.com"; first_name="User"; last_name="Two"}
)

foreach ($reg in $registrants) {
    $body = $reg | ConvertTo-Json
    try {
        $result = Invoke-RestMethod -Uri "https://api.zoom.us/v2/webinars/$webinarId/registrants" `
            -Method POST `
            -Headers @{Authorization="Bearer $token"; "Content-Type"="application/json"} `
            -Body $body
        Write-Host "✓ Added: $($reg.email)"
    } catch {
        Write-Host "✗ Failed: $($reg.email) - $($_.Exception.Message)"
    }
    Start-Sleep -Milliseconds 100  # Rate limiting
}
```

---

## Get Registrants List

```powershell
$webinarId = "123456789"
$registrants = Invoke-RestMethod -Uri "https://api.zoom.us/v2/webinars/$webinarId/registrants" `
    -Headers @{Authorization="Bearer $token"}

$registrants.registrants | ForEach-Object {
    Write-Host "$($_.email) - $($_.first_name) $($_.last_name) - Status: $($_.status)"
}
```

---

## Common Webinar Configs

### Standard Training Webinar
```json
{
  "type": 5,
  "duration": 60,
  "settings": {
    "approval_type": 0,
    "auto_recording": "cloud",
    "practice_session": true,
    "question_answer": true
  }
}
```

### Open Registration (No Approval)
```json
{
  "type": 5,
  "settings": {
    "approval_type": 0,
    "registration_type": 1
  }
}
```

### Recurring Weekly
```json
{
  "type": 9,
  "recurrence": {
    "type": 2,
    "repeat_interval": 1,
    "weekly_days": "2",
    "end_times": 12
  }
}
```
Weekly days: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat

---

## Chad's Common Webinars

### Newsletter Hour (Monday 10 AM PT)
- **Recurring:** Weekly
- **Duration:** 120 min
- **Recording:** Cloud
- **Type:** Training/teaching

### One-off Trainings
- **Type:** Single scheduled
- **Duration:** 60 min
- **Registration:** Auto-approve
- **Recording:** Cloud

---

## Troubleshooting

### "does not contain scopes"
Run through `guides/zoom-webinar-scopes.md`

### "User does not have webinar feature"
Zoom account needs Webinar add-on ($40-79/month depending on attendee count)

### Rate limits
- 100 requests/second for most endpoints
- Add small delays for bulk operations

---

*Created: 2026-02-16*
