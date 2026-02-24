# Post Bridge API Skill

Complete OpenClaw skill for the Post Bridge social media management API.

## What This Skill Does

Post Bridge lets you:
- **Schedule posts** across Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest, Bluesky, and Threads
- **Upload media** (images and videos)
- **Track performance** (impressions, engagements, clicks)
- **Manage social accounts** (view connected platforms)

## Setup

1. **Get your API token** from the Post Bridge dashboard
2. **Save it** to `credentials/postbridge-api-key.txt`:
   ```
   your_jwt_token_here
   ```

3. **Test the connection:**
   ```powershell
   . .\skills\postbridge\postbridge-wrapper.ps1
   Get-PBSocialAccounts
   ```

## Quick Start

### Load the Wrapper
```powershell
. .\skills\postbridge\postbridge-wrapper.ps1
```

### View Connected Accounts
```powershell
Get-PBSocialAccounts
```

### Create a Post
```powershell
New-PBPost `
    -Content "Hello from OpenClaw!" `
    -Platforms @{
        facebook = @{ account_id = "acc_fb_123" }
        twitter = @{ account_id = "acc_tw_456" }
    }
```

### Upload Media & Post
```powershell
# Get upload URL
$upload = New-PBMediaUploadUrl -FileName "photo.jpg" -ContentType "image/jpeg"

# Upload the file
Invoke-WebRequest -Uri $upload.upload_url -Method PUT -InFile "photo.jpg" -ContentType "image/jpeg"

# Create post with the media
New-PBPost `
    -Content "Check this out!" `
    -MediaIds @($upload.media_id) `
    -Platforms @{
        instagram = @{ account_id = "acc_ig_789" }
    }
```

### View Performance
```powershell
Show-PBPerformanceSummary
```

### View Scheduled Posts
```powershell
Show-PBScheduledPosts
```

## Available Functions

| Function | Description |
|----------|-------------|
| `Get-PBSocialAccounts` | List all connected social accounts |
| `Get-PBAccount` | Get specific account details |
| `Get-PBPosts` | List all posts |
| `Get-PBPost` | Get specific post |
| `New-PBPost` | Create new post(s) |
| `Update-PBPost` | Update scheduled post |
| `Remove-PBPost` | Delete post |
| `Get-PBMedia` | List media |
| `New-PBMediaUploadUrl` | Generate upload URL |
| `Remove-PBMedia` | Delete media |
| `Get-PBPostResults` | Get performance metrics |
| `Get-PBPostResult` | Get specific post results |
| `Show-PBPerformanceSummary` | Display summary by platform |
| `Show-PBScheduledPosts` | Display upcoming scheduled posts |

## Documentation

- **Full API Reference:** `SKILL.md`
- **OpenAPI Spec:** `references/openapi-spec.json`
- **Official Docs:** https://api.post-bridge.com/reference

## Supported Platforms

- Facebook
- Instagram
- Twitter (X)
- LinkedIn
- TikTok
- YouTube
- Pinterest
- Bluesky
- Threads

## Examples

### Schedule a Multi-Platform Post for Tomorrow
```powershell
$tomorrow = (Get-Date).AddDays(1).Date.AddHours(10)  # Tomorrow at 10 AM

New-PBPost `
    -Content "Big announcement coming tomorrow!" `
    -ScheduledAt $tomorrow.ToString("o") `
    -Platforms @{
        facebook = @{ account_id = "acc_fb_123" }
        twitter = @{ account_id = "acc_tw_456" }
        linkedin = @{ account_id = "acc_li_789" }
    }
```

### Get Top Performing Posts
```powershell
$results = Get-PBPostResults -Limit 100
$results.data | Sort-Object engagements -Descending | Select-Object -First 10 | Format-Table post_id, platform, impressions, engagements
```

### Update a Scheduled Post
```powershell
Update-PBPost -PostId "post_123" -Content "Updated content here"
```

## Error Handling

All functions will throw PowerShell errors if the API returns an error. Use try/catch:

```powershell
try {
    New-PBPost -Content "Test" -Platforms @{facebook=@{account_id="invalid"}}
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

## Notes

- All timestamps use ISO 8601 format
- Posts can only be updated while in "scheduled" status
- Media must be uploaded before creating posts
- Rate limits apply (see Post Bridge dashboard)

## Built

- **Created:** 2026-02-20
- **By:** OpenClaw
- **API Version:** 1.0
- **Endpoints:** 13
