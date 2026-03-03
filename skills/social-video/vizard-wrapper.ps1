# Vizard API PowerShell Wrapper
# AI-powered video clipping automation

# Load API key
$script:VizardApiKey = if (Test-Path "credentials/vizard-api-key.txt") {
    Get-Content "credentials/vizard-api-key.txt" -Raw | ForEach-Object { $_.Trim() }
} else {
    Write-Warning "API key not found. Please create credentials/vizard-api-key.txt"
    $null
}

$script:VizardBase = "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1"

function Get-VizardHeaders {
    @{
        "VIZARDAI_API_KEY" = $script:VizardApiKey
        "Content-Type" = "application/json"
    }
}

# === PROJECT CREATION ===

function New-VizardProject {
    <#
    .SYNOPSIS
    Submit a video for AI clipping
    .PARAMETER VideoUrl
    URL of the video (YouTube, Google Drive, Vimeo, direct link, etc.)
    .PARAMETER VideoType
    Source type: 1=direct file, 2=YouTube, 3=Google Drive, 4=Vimeo, 5=StreamYard, 6=TikTok, 7=Twitter, 9=Twitch, 10=Loom, 11=Facebook, 12=LinkedIn
    .PARAMETER Language
    Language code (default: auto). Use en, es, fr, de, etc.
    .PARAMETER PreferLength
    Array of clip lengths: 0=auto, 1=<30s, 2=30-60s, 3=60-90s, 4=90s-3min
    .PARAMETER RatioOfClip
    Aspect ratio: 1=9:16 vertical (default), 2=1:1 square, 3=4:5 portrait, 4=16:9 horizontal
    .PARAMETER MaxClipNumber
    Max clips to return (1-100)
    .PARAMETER Keyword
    AI instruction for specific clips (e.g., "Find where Sam talks about AI")
    .PARAMETER ProjectName
    Custom project name
    .EXAMPLE
    New-VizardProject -VideoUrl "https://youtu.be/example" -VideoType 2 -Language "en"
    #>
    param(
        [Parameter(Mandatory)]
        [string]$VideoUrl,
        
        [Parameter(Mandatory)]
        [ValidateRange(1,12)]
        [int]$VideoType,
        
        [string]$Language = "auto",
        
        [int[]]$PreferLength = @(0),
        
        [ValidateRange(1,4)]
        [int]$RatioOfClip = 1,
        
        [int]$MaxClipNumber,
        
        [string]$Keyword,
        
        [string]$ProjectName,
        
        [int]$TemplateId,
        
        [switch]$RemoveSilence,
        
        [switch]$NoSubtitles,
        
        [switch]$EnableEmoji,
        
        [switch]$EnableHighlight,
        
        [switch]$EnableAutoBroll,
        
        [switch]$NoHeadline
    )
    
    $headers = Get-VizardHeaders
    $body = @{
        lang = $Language
        preferLength = $PreferLength
        videoUrl = $VideoUrl
        videoType = $VideoType
        ratioOfClip = $RatioOfClip
    }
    
    if ($MaxClipNumber) { $body.maxClipNumber = $MaxClipNumber }
    if ($Keyword) { $body.keyword = $Keyword }
    if ($ProjectName) { $body.projectName = $ProjectName }
    if ($TemplateId) { $body.templateId = $TemplateId }
    if ($RemoveSilence) { $body.removeSilenceSwitch = 1 }
    if ($NoSubtitles) { $body.subtitleSwitch = 0 }
    if ($EnableEmoji) { $body.emojiSwitch = 1 }
    if ($EnableHighlight) { $body.highlightSwitch = 1 }
    if ($EnableAutoBroll) { $body.autoBrollSwitch = 1 }
    if ($NoHeadline) { $body.headlineSwitch = 0 }
    
    $bodyJson = $body | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$script:VizardBase/project/create" -Method POST -Headers $headers -Body $bodyJson
        
        if ($response.code -eq 2000) {
            Write-Host "✓ Project created!" -ForegroundColor Green
            Write-Host "Project ID: $($response.projectId)" -ForegroundColor Cyan
            if ($response.shareLink) {
                Write-Host "Share Link: $($response.shareLink)" -ForegroundColor Gray
            }
            return $response
        } else {
            Write-Host "✗ Error: $($response.errMsg)" -ForegroundColor Red
            return $response
        }
    } catch {
        Write-Host "✗ API call failed: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

# === CLIP RETRIEVAL ===

function Get-VizardProject {
    <#
    .SYNOPSIS
    Retrieve clips for a project
    .PARAMETER ProjectId
    Project ID from New-VizardProject
    .EXAMPLE
    Get-VizardProject -ProjectId 17861706
    #>
    param(
        [Parameter(Mandatory)]
        [long]$ProjectId
    )
    
    $headers = Get-VizardHeaders
    
    try {
        $response = Invoke-RestMethod -Uri "$script:VizardBase/project/query/$ProjectId" -Headers $headers
        
        if ($response.code -eq 2000) {
            if ($response.videos -and $response.videos.Count -gt 0) {
                Write-Host "✓ Found $($response.videos.Count) clips!" -ForegroundColor Green
                return $response
            } else {
                Write-Host "✓ Project completed but no clips generated" -ForegroundColor Yellow
                return $response
            }
        } elseif ($response.code -eq 1000) {
            Write-Host "⏳ Still processing..." -ForegroundColor Yellow
            return $response
        } else {
            Write-Host "✗ Error code $($response.code)" -ForegroundColor Red
            return $response
        }
    } catch {
        Write-Host "✗ API call failed: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

# === POLLING ===

function Wait-VizardProject {
    <#
    .SYNOPSIS
    Poll a project until clips are ready
    .PARAMETER ProjectId
    Project ID to poll
    .PARAMETER IntervalSeconds
    Polling interval (default: 30)
    .PARAMETER MaxAttempts
    Max polling attempts (default: 40 = 20 minutes)
    .EXAMPLE
    Wait-VizardProject -ProjectId 17861706
    #>
    param(
        [Parameter(Mandatory)]
        [long]$ProjectId,
        
        [int]$IntervalSeconds = 30,
        
        [int]$MaxAttempts = 40
    )
    
    $attempt = 0
    
    Write-Host "⏳ Polling project $ProjectId every ${IntervalSeconds}s..." -ForegroundColor Cyan
    
    while ($attempt -lt $MaxAttempts) {
        $attempt++
        
        Start-Sleep -Seconds $IntervalSeconds
        
        $result = Get-VizardProject -ProjectId $ProjectId
        
        if ($result.code -eq 2000) {
            Write-Host "`n✓ Processing complete!" -ForegroundColor Green
            return $result
        } elseif ($result.code -ne 1000) {
            Write-Host "`n✗ Error occurred" -ForegroundColor Red
            return $result
        }
        
        $elapsed = $attempt * $IntervalSeconds
        Write-Host "  Attempt $attempt ($elapsed seconds elapsed)..." -ForegroundColor Gray
    }
    
    Write-Host "`n⏰ Max attempts reached" -ForegroundColor Yellow
    return $null
}

# === HELPER FUNCTIONS ===

function Show-VizardClips {
    <#
    .SYNOPSIS
    Display clips in a readable format
    .PARAMETER Response
    Response from Get-VizardProject
    .EXAMPLE
    $project = Get-VizardProject -ProjectId 123456
    Show-VizardClips -Response $project
    #>
    param(
        [Parameter(Mandatory)]
        $Response
    )
    
    if (-not $Response.videos -or $Response.videos.Count -eq 0) {
        Write-Host "No clips available" -ForegroundColor Yellow
        return
    }
    
    Write-Host "`n=== $($Response.projectName) ===" -ForegroundColor Cyan
    Write-Host "Total Clips: $($Response.videos.Count)`n" -ForegroundColor Gray
    
    $i = 0
    foreach ($clip in $Response.videos) {
        $i++
        $durationSec = [math]::Round($clip.videoMsDuration / 1000, 1)
        
        Write-Host "Clip $i" -ForegroundColor Green
        Write-Host "  Title: $($clip.title)" -ForegroundColor White
        Write-Host "  Duration: ${durationSec}s" -ForegroundColor Gray
        Write-Host "  Viral Score: $($clip.viralScore)/10" -ForegroundColor Yellow
        Write-Host "  Download: $($clip.videoUrl)" -ForegroundColor Cyan
        Write-Host ""
    }
}

function Save-VizardClip {
    <#
    .SYNOPSIS
    Download a clip to local file
    .PARAMETER Clip
    Video object from response
    .PARAMETER OutputPath
    Local file path to save (default: downloads/{title}.mp4)
    .EXAMPLE
    $project = Get-VizardProject -ProjectId 123456
    Save-VizardClip -Clip $project.videos[0] -OutputPath "my-clip.mp4"
    #>
    param(
        [Parameter(Mandatory)]
        $Clip,
        
        [string]$OutputPath
    )
    
    if (-not $OutputPath) {
        $safeTitle = $Clip.title -replace '[^\w\s-]','' -replace '\s+','-'
        $OutputPath = "downloads/$safeTitle.mp4"
    }
    
    $outputDir = Split-Path -Parent $OutputPath
    if ($outputDir -and -not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }
    
    Write-Host "Downloading: $($Clip.title)" -ForegroundColor Cyan
    Invoke-WebRequest -Uri $Clip.videoUrl -OutFile $OutputPath
    Write-Host "✓ Saved to: $OutputPath" -ForegroundColor Green
}

function New-VizardClipFromYouTube {
    <#
    .SYNOPSIS
    Quick helper: Submit YouTube video and wait for clips
    .PARAMETER YouTubeUrl
    YouTube video URL
    .PARAMETER Language
    Language code (default: auto)
    .PARAMETER MaxClips
    Max clips to generate (default: 10)
    .EXAMPLE
    New-VizardClipFromYouTube -YouTubeUrl "https://youtu.be/example" -MaxClips 5
    #>
    param(
        [Parameter(Mandatory)]
        [string]$YouTubeUrl,
        
        [string]$Language = "auto",
        
        [int]$MaxClips = 10
    )
    
    # Submit
    $project = New-VizardProject -VideoUrl $YouTubeUrl -VideoType 2 -Language $Language -MaxClipNumber $MaxClips
    
    if ($project.code -ne 2000) {
        return
    }
    
    # Wait
    $result = Wait-VizardProject -ProjectId $project.projectId
    
    if ($result -and $result.code -eq 2000) {
        Show-VizardClips -Response $result
        return $result
    }
}

# === SOCIAL MEDIA ===

function Get-VizardSocialAccounts {
    <#
    .SYNOPSIS
    Retrieve connected social media accounts
    .EXAMPLE
    Get-VizardSocialAccounts
    #>
    $headers = Get-VizardHeaders
    
    try {
        $response = Invoke-RestMethod -Uri "$script:VizardBase/project/social-accounts" -Headers $headers
        
        if ($response.accounts) {
            Write-Host "`n=== Connected Social Accounts ($($response.total) total) ===" -ForegroundColor Cyan
            
            foreach ($account in $response.accounts) {
                $statusColor = switch ($account.status) {
                    "active" { "Green" }
                    "expired" { "Red" }
                    "locked" { "Yellow" }
                    default { "Gray" }
                }
                
                Write-Host "`n$($account.platform) - @$($account.username)" -ForegroundColor White
                Write-Host "  ID: $($account.id)" -ForegroundColor Gray
                Write-Host "  Status: $($account.status)" -ForegroundColor $statusColor
                if ($account.page) {
                    Write-Host "  Page: $($account.page)" -ForegroundColor Gray
                }
            }
            
            return $response
        } else {
            Write-Host "No social accounts connected" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Failed to retrieve accounts: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

function Publish-VizardClip {
    <#
    .SYNOPSIS
    Publish a clip to social media
    .PARAMETER VideoId
    Video ID from Get-VizardProject response
    .PARAMETER SocialAccountId
    Social account ID from Get-VizardSocialAccounts
    .PARAMETER Caption
    Post caption (leave empty for AI-generated)
    .PARAMETER Title
    Video title (YouTube only)
    .PARAMETER ScheduleTime
    Unix timestamp in milliseconds for scheduled publishing
    .EXAMPLE
    Publish-VizardClip -VideoId 14015572 -SocialAccountId "12345" -Caption "Check this out!"
    #>
    param(
        [Parameter(Mandatory)]
        [long]$VideoId,
        
        [Parameter(Mandatory)]
        [string]$SocialAccountId,
        
        [string]$Caption = "",
        
        [string]$Title = "",
        
        [long]$ScheduleTime
    )
    
    $headers = Get-VizardHeaders
    $body = @{
        finalVideoId = $VideoId
        socialAccountId = $SocialAccountId
        post = $Caption
        title = $Title
    }
    
    if ($ScheduleTime) {
        $body.publishTime = $ScheduleTime
        $scheduleDate = [DateTimeOffset]::FromUnixTimeMilliseconds($ScheduleTime).LocalDateTime
        Write-Host "Scheduling for: $scheduleDate" -ForegroundColor Cyan
    } else {
        Write-Host "Publishing immediately..." -ForegroundColor Cyan
    }
    
    $bodyJson = $body | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$script:VizardBase/project/publish-video" -Method POST -Headers $headers -Body $bodyJson
        
        if ($response.code -eq 2000) {
            Write-Host "✓ Published successfully!" -ForegroundColor Green
            return $response
        } else {
            Write-Host "✗ Publish failed: $($response.errMsg)" -ForegroundColor Red
            return $response
        }
    } catch {
        Write-Host "✗ API call failed: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

function New-VizardCaption {
    <#
    .SYNOPSIS
    Generate AI social media caption
    .PARAMETER VideoId
    Video ID from Get-VizardProject
    .PARAMETER Platform
    Target platform: 1=General, 2=TikTok, 3=Instagram, 4=YouTube, 5=Facebook, 6=LinkedIn, 7=Twitter
    .PARAMETER Tone
    Caption tone: 0=Neutral, 1=Interesting, 2=Catchy, 3=Serious, 4=Question
    .PARAMETER Voice
    Voice style: 0=First person, 1=Third person
    .EXAMPLE
    New-VizardCaption -VideoId 14015572 -Platform 2 -Tone 2 -Voice 0
    #>
    param(
        [Parameter(Mandatory)]
        [long]$VideoId,
        
        [ValidateRange(1,7)]
        [int]$Platform = 1,
        
        [ValidateRange(0,4)]
        [int]$Tone = 0,
        
        [ValidateRange(0,1)]
        [int]$Voice = 0
    )
    
    $headers = Get-VizardHeaders
    $body = @{
        finalVideoId = $VideoId
        aiSocialPlatform = $Platform
        tone = $Tone
        voice = $Voice
    } | ConvertTo-Json
    
    Write-Host "Generating AI caption..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$script:VizardBase/project/ai-social" -Method POST -Headers $headers -Body $body
        
        if ($response.code -eq 2000) {
            Write-Host "`n=== Generated Caption ===" -ForegroundColor Green
            Write-Host $response.aiSocialContent -ForegroundColor White
            
            if ($response.aiSocialTitle) {
                Write-Host "`n=== YouTube Title ===" -ForegroundColor Green
                Write-Host $response.aiSocialTitle -ForegroundColor White
            }
            
            return $response
        } elseif ($response.code -eq 4002) {
            Write-Host "✗ No speech detected in video" -ForegroundColor Red
            return $response
        } else {
            Write-Host "✗ Caption generation failed: $($response.errMsg)" -ForegroundColor Red
            return $response
        }
    } catch {
        Write-Host "✗ API call failed: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

# Export functions
Export-ModuleMember -Function New-VizardProject, Get-VizardProject, Wait-VizardProject, Show-VizardClips, Save-VizardClip, New-VizardClipFromYouTube, Get-VizardSocialAccounts, Publish-VizardClip, New-VizardCaption

Write-Host "✓ Vizard API Wrapper Loaded!" -ForegroundColor Green
Write-Host "Quick start: New-VizardClipFromYouTube -YouTubeUrl 'https://youtu.be/example'" -ForegroundColor Cyan
Write-Host "Use Get-Command *Vizard* to see all functions" -ForegroundColor Gray
