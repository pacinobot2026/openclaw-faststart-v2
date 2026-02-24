<#
.SYNOPSIS
    Creates a Course Sprout lesson from a Vimeo video with full workflow.

.DESCRIPTION
    Implements the complete Course Sprout replay workflow:
    1. Fetches video info from Vimeo
    2. Downloads and parses transcript
    3. Creates lesson in Course Sprout
    4. Outputs info for manual description/goal creation

.PARAMETER VideoUrl
    Full Vimeo URL (e.g., https://vimeo.com/1164484748)

.PARAMETER CourseId
    Course Sprout course ID

.PARAMETER ChapterId
    Course Sprout chapter ID

.PARAMETER LessonName
    Optional custom lesson name (defaults to video title)

.EXAMPLE
    .\create-replay-lesson.ps1 -VideoUrl "https://vimeo.com/1164484748" -CourseId 340 -ChapterId 958

.NOTES
    Requires credentials in credentials/titanium-api-keys.txt
    This creates the LESSON only. Descriptions and goal blocks need to be added
    separately using the transcript content.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$VideoUrl,
    
    [Parameter(Mandatory=$true)]
    [int]$CourseId,
    
    [Parameter(Mandatory=$true)]
    [int]$ChapterId,
    
    [Parameter(Mandatory=$false)]
    [string]$LessonName
)

# Extract video ID from URL
$VideoId = ($VideoUrl -split '/')[-1] -replace '\?.*$', ''
Write-Host "Video ID: $VideoId" -ForegroundColor Cyan

# Load credentials
$credFile = Join-Path $PSScriptRoot "..\credentials\titanium-api-keys.txt"
$credContent = Get-Content $credFile

$vimeoToken = ($credContent | Where-Object { $_ -match "^Vimeo_PersonalToken:" }) -replace "Vimeo_PersonalToken:\s*", ""
$csToken = ($credContent | Where-Object { $_ -match "^CourseSprout:" }) -replace "CourseSprout:\s*", ""

if (-not $vimeoToken -or -not $csToken) {
    Write-Error "Missing required tokens in credentials file"
    exit 1
}

$vimeoHeaders = @{ "Authorization" = "Bearer $vimeoToken" }
$csHeaders = @{ "X-API-KEY" = $csToken; "Content-Type" = "application/json" }

# Step 1: Get video info
Write-Host "`n[1/4] Fetching video info..." -ForegroundColor Yellow
$videoInfo = Invoke-RestMethod -Uri "https://api.vimeo.com/videos/$VideoId" -Headers $vimeoHeaders
Write-Host "  Title: $($videoInfo.name)" -ForegroundColor Green
Write-Host "  Duration: $([math]::Round($videoInfo.duration / 60, 1)) minutes" -ForegroundColor Gray

if (-not $LessonName) {
    $LessonName = $videoInfo.name
}

# Step 2: Get transcript
Write-Host "`n[2/4] Fetching transcript..." -ForegroundColor Yellow
$tracks = Invoke-RestMethod -Uri "https://api.vimeo.com/videos/$VideoId/texttracks" -Headers $vimeoHeaders

if ($tracks.total -eq 0) {
    Write-Warning "No transcript available - lesson will be created without description generation"
    $transcript = $null
} else {
    $track = $tracks.data | Where-Object { $_.language -match "en" } | Select-Object -First 1
    if (-not $track) { $track = $tracks.data[0] }
    
    $vttContent = Invoke-RestMethod -Uri $track.link
    
    # Parse VTT to clean text
    $lines = $vttContent -split "`n"
    $cleanLines = @()
    $lastLine = ""
    
    foreach ($line in $lines) {
        if ($line -match "^WEBVTT" -or $line -match "^\d+$" -or 
            $line -match "^\d{2}:\d{2}:\d{2}\.\d{3}" -or $line -match "^$") {
            continue
        }
        $cleanLine = $line.Trim()
        if ($cleanLine -and $cleanLine -ne $lastLine) {
            $cleanLines += $cleanLine
            $lastLine = $cleanLine
        }
    }
    
    $transcript = ($cleanLines -join " ") -replace "\s+", " "
    Write-Host "  Transcript: $($transcript.Length) characters" -ForegroundColor Green
    
    # Save transcript for reference
    $transcriptsDir = Join-Path $PSScriptRoot "..\transcripts"
    if (-not (Test-Path $transcriptsDir)) {
        New-Item -ItemType Directory -Path $transcriptsDir -Force | Out-Null
    }
    $transcriptPath = Join-Path $transcriptsDir "vimeo-$VideoId.txt"
    $transcript | Out-File -FilePath $transcriptPath -Encoding UTF8
    Write-Host "  Saved to: $transcriptPath" -ForegroundColor Gray
}

# Step 3: Create lesson
Write-Host "`n[3/4] Creating lesson in Course Sprout..." -ForegroundColor Yellow

$body = @{
    name = $LessonName
    course_id = $CourseId
    course_chapter_id = $ChapterId
    video_name = $LessonName
    video_url = "https://vimeo.com/$VideoId"
    video_tags = @("replay")
} | ConvertTo-Json

try {
    $lesson = Invoke-RestMethod -Uri "https://api.coursesprout.com/api/ai/create-lesson" `
        -Method POST -Headers $csHeaders -Body $body
    
    if ($lesson.status) {
        Write-Host "  Lesson created: ID $($lesson.data.id)" -ForegroundColor Green
    } else {
        Write-Error "  Failed: $($lesson.message)"
        exit 1
    }
} catch {
    Write-Error "  API Error: $_"
    exit 1
}

# Step 4: Output summary
Write-Host "`n[4/4] Summary" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$output = [PSCustomObject]@{
    LessonId = $lesson.data.id
    LessonName = $LessonName
    CourseId = $CourseId
    ChapterId = $ChapterId
    VideoId = $VideoId
    VideoUrl = "https://vimeo.com/$VideoId"
    TranscriptPath = if ($transcript) { $transcriptPath } else { "N/A" }
    TranscriptChars = if ($transcript) { $transcript.Length } else { 0 }
}

$output | Format-List

Write-Host "`n⚠️  NEXT STEPS (Manual):" -ForegroundColor Yellow
Write-Host "  1. Read transcript and create SHORT description" -ForegroundColor White
Write-Host "  2. Read transcript and create LONG description (NO EMOJIS!)" -ForegroundColor White
Write-Host "  3. Create GOAL BLOCK with:" -ForegroundColor White
Write-Host "     - 'Here's the deal' - reinforce the breakthrough" -ForegroundColor Gray
Write-Host "     - 'Your one thing' - ONE simple action" -ForegroundColor Gray
Write-Host "     - 'Drop a comment below' - engagement prompt" -ForegroundColor Gray
Write-Host "`n  Lesson ID for goal block: $($lesson.data.id)" -ForegroundColor Cyan

# Output first 500 chars of transcript for quick reference
if ($transcript -and $transcript.Length -gt 0) {
    Write-Host "`n📝 Transcript Preview (first 500 chars):" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ($transcript.Substring(0, [Math]::Min(500, $transcript.Length))) -ForegroundColor Gray
    Write-Host "..." -ForegroundColor DarkGray
}

return $output
