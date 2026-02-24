---
name: vimeo-transcript
description: Download transcripts from Vimeo videos and create engaging recaps. Use when asked to get a transcript, subtitles, captions, summary, or recap from a Vimeo video.
---

# Vimeo Transcript & Recap Skill

## API Authentication

**IMPORTANT:** Personal access tokens from the Vimeo developer portal often fail. Use OAuth client credentials flow instead.

### Get a Working Token (Client Credentials Flow)

```powershell
$clientId = "6b63507fbfb7e24ec56c09ce1d60a64081672e17"
$clientSecret = "S5dURNGLqiNAcxiCB8zsJw9h/NTDb1G0r1gPS8cvJiC4xy5EmN6MF/E4fRmjggR/IIVETuNNPRHziOd30giVemw8QmQrjCx3LcITCHDIslv/g33yFzDKOB8EoosXXXuY"

$pair = "${clientId}:${clientSecret}"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [Convert]::ToBase64String($bytes)

$headers = @{
    "Authorization" = "Basic $base64"
    "Content-Type" = "application/json"
    "Accept" = "application/vnd.vimeo.*+json;version=3.4"
}

$body = @{
    grant_type = "client_credentials"
    scope = "public private video_files"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://api.vimeo.com/oauth/authorize/client" -Method POST -Headers $headers -Body $body
$token = $response.access_token
Write-Host "Token: $token"
Write-Host "Scopes: $($response.scope)"
```

**Current Working Token:** `48dd2370b90379a61e96226977d0dc0d`
**Scopes:** public private video_files
**Credentials file:** `credentials/credentials-vimeo.txt`

### Standard Headers for API Calls

```powershell
$token = "48dd2370b90379a61e96226977d0dc0d"
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.vimeo.*+json;version=3.4"
}
```

---

## Part 1: Search Videos

**Note:** Client credentials tokens don't have user context, so use `/users/{user_id}/videos` NOT `/me/videos`

```powershell
# Chad's user ID: 41953625
$response = Invoke-RestMethod -Uri "https://api.vimeo.com/users/41953625/videos?query=Local%20Newsletter%20Hour&sort=date&direction=desc&per_page=10" -Method GET -Headers $headers

$response.data | ForEach-Object {
    Write-Host "$($_.created_time.Substring(0,10)) | $($_.name)"
    Write-Host "   URL: $($_.link)"
}
```

### Common Searches
- Newsletter Hour: `query=Local%20Newsletter%20Hour`
- Tech Call: `query=Titanium%20Tech`
- Any recent: Just omit query param, sort by date

---

## Part 2: Get Transcript

```powershell
$videoId = "1161210235"  # Just the number from vimeo.com/1161210235

# Get text tracks
$tracks = Invoke-RestMethod -Uri "https://api.vimeo.com/videos/$videoId/texttracks" -Method GET -Headers $headers

# Download VTT
$vttUrl = $tracks.data[0].link
$transcript = Invoke-WebRequest -Uri $vttUrl -UseBasicParsing
$transcript.Content | Out-File "transcript.vtt" -Encoding UTF8
```

**VTT URLs expire quickly!** Download immediately after getting the link.

---

## Part 3: Parse Transcript for Notes

```powershell
$content = Get-Content "transcript.vtt" -Raw

# Remove timestamps and headers, get just text
$lines = $content -split "`n" | Where-Object { 
    $_ -notmatch "^\d{2}:\d{2}" -and 
    $_ -notmatch "^WEBVTT" -and 
    $_ -notmatch "^\s*$"
}

# Get section by approximate time
# Line numbers roughly correlate to timestamp positions
$sample = $lines | Select-Object -Skip 100 -First 50
$sample -join " "
```

---

## Part 4: Create Meeting Notes

### Chad's Preferred Format

```
<Call Name> — <Month Day>

✅ Brief description of what happened in this segment. 00:00:00 - 00:05:00

✅ Another topic covered with timestamp range at end. 00:05:00 - 00:12:00
```

**Rules:**
- Start each bullet with ✅
- One concise sentence per bullet
- Timestamp range at END (HH:MM:SS - HH:MM:SS format)
- Cover the ENTIRE video length
- Personal/casual tone, not formal
- "Executive clear" — no rambling

### Vimeo Timestamp Links (Optional)

If you want clickable timestamps:
```
https://vimeo.com/{VIDEO_ID}#t=5m30s
```

Format: `#t=XmYs` (minutes and seconds)

---

## Complete Workflow Example

```powershell
# 1. Get token (if needed)
# ... client credentials flow above ...

# 2. Search for latest Newsletter Hour
$token = "48dd2370b90379a61e96226977d0dc0d"
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.vimeo.*+json;version=3.4"
}

$videos = Invoke-RestMethod -Uri "https://api.vimeo.com/users/41953625/videos?query=Local%20Newsletter%20Hour&sort=date&direction=desc&per_page=1" -Method GET -Headers $headers
$video = $videos.data[0]
$videoId = $video.link -replace 'https://vimeo.com/', ''

Write-Host "Latest: $($video.name)"
Write-Host "URL: $($video.link)"
Write-Host "ID: $videoId"

# 3. Get transcript
$tracks = Invoke-RestMethod -Uri "https://api.vimeo.com/videos/$videoId/texttracks" -Method GET -Headers $headers
$vttUrl = $tracks.data[0].link

# 4. Download
$transcript = Invoke-WebRequest -Uri $vttUrl -UseBasicParsing
$transcript.Content | Out-File "transcripts/vimeo/latest-newsletter-hour.vtt"

# 5. Analyze and create notes...
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "invalid authenticated access token" | Portal tokens often fail | Use client credentials flow |
| "You must provide a valid authenticated access token" | Wrong endpoint for token type | Use `/users/{id}/videos` not `/me/videos` |
| No text tracks | Video still processing or no captions | Wait or check video settings |
| VTT URL 403 | URL expired | Get fresh URL from texttracks endpoint |

---

## Key IDs

- **Chad's User ID:** 41953625
- **Client ID:** 6b63507fbfb7e24ec56c09ce1d60a64081672e17
- **App:** Global Control (developer.vimeo.com/apps/486017)
