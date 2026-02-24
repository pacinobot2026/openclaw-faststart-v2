# Vizard AI API Skill

Complete OpenClaw skill for the Vizard AI video clipping API.

## What This Skill Does

Vizard transforms long videos into engaging short clips optimized for social media:
- **AI clip detection** - Automatically finds the best moments
- **Short video editing** - Add subtitles, B-rolls, branding to existing shorts
- **Multi-platform optimization** - TikTok, YouTube Shorts, Instagram Reels
- **Auto subtitles** - Accurate transcripts with customizable styling
- **Template branding** - Apply your brand templates
- **Viral scoring** - Clips ranked by engagement potential
- **Social media publishing** - Auto-publish to 6 platforms (TikTok, YouTube, Instagram, Facebook, Twitter, LinkedIn)
- **AI caption generation** - Platform-specific captions with custom tone/voice

## Setup

1. **Get API key** from Vizard dashboard (requires paid plan)
2. **Save it** to `credentials/vizard-api-key.txt`:
   ```
   your_api_key_here
   ```

3. **Test the connection:**
   ```powershell
   . .\skills\vizard\vizard-wrapper.ps1
   New-VizardProject -VideoUrl "https://youtu.be/example" -VideoType 2 -Language "en"
   ```

## Quick Start

### Load the Wrapper
```powershell
. .\skills\vizard\vizard-wrapper.ps1
```

### Clip a YouTube Video (Easy Mode)
```powershell
# This does everything: submit + poll + display results
New-VizardClipFromYouTube -YouTubeUrl "https://youtu.be/dQw4w9WgXcQ"
```

### Manual Workflow (More Control)
```powershell
# Step 1: Submit video
$project = New-VizardProject `
    -VideoUrl "https://youtu.be/example" `
    -VideoType 2 `
    -Language "en" `
    -MaxClipNumber 10

# Step 2: Wait for processing
$result = Wait-VizardProject -ProjectId $project.projectId

# Step 3: View clips
Show-VizardClips -Response $result

# Step 4: Download a clip
Save-VizardClip -Clip $result.videos[0] -OutputPath "my-clip.mp4"
```

### Custom Branding
```powershell
New-VizardProject `
    -VideoUrl "https://youtu.be/example" `
    -VideoType 2 `
    -Language "en" `
    -RatioOfClip 1 `
    -TemplateId 52987165 `
    -RemoveSilence `
    -EnableEmoji `
    -EnableHighlight `
    -MaxClipNumber 5 `
    -ProjectName "My Branded Content"
```

### Topic-Specific Clipping
```powershell
New-VizardProject `
    -VideoUrl "https://youtu.be/podcast" `
    -VideoType 2 `
    -Language "en" `
    -Keyword "Find where the guest talks about AI and future of work" `
    -MaxClipNumber 3
```

## Available Functions

| Function | Description |
|----------|-------------|
| `New-VizardProject` | Submit video for clipping or editing |
| `Get-VizardProject` | Check project status / retrieve clips |
| `Wait-VizardProject` | Poll until clips are ready |
| `Show-VizardClips` | Display clips in readable format |
| `Save-VizardClip` | Download clip to file |
| `New-VizardClipFromYouTube` | One-command YouTube → clips workflow |
| `Get-VizardSocialAccounts` | List connected social media accounts |
| `Publish-VizardClip` | Publish clip to social media |
| `New-VizardCaption` | Generate AI social media caption |

## Parameters Reference

### Video Types
| Value | Source |
|-------|--------|
| 1 | Direct file (requires `-Extension` param: mp4, avi, mov, 3gp) |
| 2 | YouTube |
| 3 | Google Drive |
| 4 | Vimeo |
| 5 | StreamYard |
| 6 | TikTok |
| 7 | Twitter |
| 9 | Twitch |
| 10 | Loom |
| 11 | Facebook |
| 12 | LinkedIn |

### Clip Lengths (PreferLength)
| Value | Duration | Best For |
|-------|----------|----------|
| 0 | Auto (AI decides) | General use (recommended) |
| 1 | <30 seconds | TikTok, ultra-short |
| 2 | 30-60 seconds | Instagram Reels |
| 3 | 60-90 seconds | Longer shorts |
| 4 | 90s - 3 min | Extended clips |

**Examples:**
- `@(0)` - Auto mode
- `@(1)` - Only under 30s
- `@(1, 2)` - Under 30s OR 30-60s

### Aspect Ratios (RatioOfClip)
| Value | Ratio | Best For |
|-------|-------|----------|
| 1 | 9:16 (Vertical) | TikTok, Reels, Shorts (default) |
| 2 | 1:1 (Square) | Instagram/Facebook Feed |
| 3 | 4:5 (Portrait) | Instagram optimized |
| 4 | 16:9 (Horizontal) | YouTube, Twitter, LinkedIn |

### Language Codes
`auto` (recommended), `en`, `es`, `pt`, `fr`, `de`, `ru`, `zh`, `ja`, `ko`, `it`, `nl`, `pl`, `tr`, `ar`, `hi`

See full list: https://docs.vizard.ai/docs/supported-languages

## Examples

### Download Top 3 Clips
```powershell
$result = Wait-VizardProject -ProjectId 12345

1..3 | ForEach-Object {
    $clip = $result.videos[$_ - 1]
    Save-VizardClip -Clip $clip -OutputPath "downloads/clip$_.mp4"
}
```

### Check Multiple Projects
```powershell
$projectIds = @(12345, 12346, 12347)

$projectIds | ForEach-Object {
    Write-Host "`nProject $_:" -ForegroundColor Cyan
    Get-VizardProject -ProjectId $_
}
```

### Vertical Shorts for TikTok
```powershell
New-VizardProject `
    -VideoUrl "https://youtu.be/example" `
    -VideoType 2 `
    -Language "en" `
    -PreferLength @(1, 2) `
    -RatioOfClip 1 `
    -RemoveSilence `
    -EnableEmoji `
    -MaxClipNumber 10 `
    -ProjectName "TikTok Batch"
```

### Horizontal Clips for YouTube
```powershell
New-VizardProject `
    -VideoUrl "https://youtu.be/example" `
    -VideoType 2 `
    -Language "en" `
    -RatioOfClip 4 `
    -MaxClipNumber 5 `
    -ProjectName "YouTube Clips"
```

## Processing Times

| Video Length | Estimated Time |
|--------------|---------------|
| <10 minutes | 2-5 minutes |
| 10-30 minutes | 5-15 minutes |
| 30-60 minutes | 15-30 minutes |
| 4K videos | Significantly longer |

**Example:** 30-minute talking-head video → ~20 clips in ~10 minutes

## Important Notes

- **Paid plans only** - API requires paid subscription
- **Polling recommended** - 30 second intervals
- **Download link expiry** - Video URLs expire after 7 days (re-query for fresh links)
- **Template matching** - Template ratio must match aspect ratio parameter
- **Clip ranking** - Results sorted by viral score (highest first)
- **Remove silence carefully** - Can make videos choppy if overused

## Error Handling

All functions will throw PowerShell errors on failure. Use try/catch:

```powershell
try {
    $project = New-VizardProject -VideoUrl "bad-url" -VideoType 2 -Language "en"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

Common error codes:
- 4001: Invalid API key
- 4003: Rate limit exceeded
- 4006: Illegal parameter
- 4008: Can't download video
- 4009: Invalid video URL

## Documentation

- **Full API Reference:** `SKILL.md`
- **Official Docs:** https://docs.vizard.ai/docs

## Supported Video Platforms

✅ YouTube  
✅ Google Drive  
✅ Vimeo  
✅ StreamYard  
✅ TikTok  
✅ Twitter  
✅ Twitch  
✅ Loom  
✅ Facebook  
✅ LinkedIn  
✅ Direct video files (mp4, mov, avi, 3gp)

## Constraints

- **Max video length:** 600 minutes (10 hours)
- **Max file size:** 10 GB
- **Max resolution:** 4K (output matches source)
- **Min video length:** 1 minute
- **Download expiry:** 7 days

## Built

- **Created:** 2026-02-20
- **By:** OpenClaw
- **API Version:** v1
- **Endpoints:** 6 (create clipping + create editing + query + social accounts + publish + AI caption)
- **Pages Ingested:** 13 documentation pages
- **Extraction:** Complete - all parameters, schemas, errors, examples, workflows
- **API Map:** See `VIZARD-API-MAP.md` for complete structured reference
