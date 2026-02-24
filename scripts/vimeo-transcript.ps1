<#
.SYNOPSIS
    Downloads and parses transcripts from Vimeo videos.

.DESCRIPTION
    This script fetches auto-generated captions from Vimeo videos using the API,
    downloads the VTT file, and parses it into clean text.

.PARAMETER VideoId
    The Vimeo video ID (just the number, e.g., 1164484748)

.PARAMETER OutputPath
    Optional path to save the transcript. Defaults to transcripts/vimeo-{VideoId}.txt

.PARAMETER Raw
    If specified, saves the raw VTT file instead of parsed text

.EXAMPLE
    .\vimeo-transcript.ps1 -VideoId 1164484748
    
.EXAMPLE
    .\vimeo-transcript.ps1 -VideoId 1164484748 -OutputPath "my-transcript.txt"

.NOTES
    Requires Vimeo Personal Token in credentials/titanium-api-keys.txt
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$VideoId,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputPath,
    
    [Parameter(Mandatory=$false)]
    [switch]$Raw
)

# Get Vimeo token from credentials file
$credFile = Join-Path $PSScriptRoot "..\credentials\titanium-api-keys.txt"
if (-not (Test-Path $credFile)) {
    Write-Error "Credentials file not found: $credFile"
    exit 1
}

$token = (Get-Content $credFile | Where-Object { $_ -match "^Vimeo_PersonalToken:" }) -replace "Vimeo_PersonalToken:\s*", ""
if (-not $token) {
    Write-Error "Vimeo_PersonalToken not found in credentials file"
    exit 1
}

$headers = @{ "Authorization" = "Bearer $token" }

# Get video info
Write-Host "Fetching video info for $VideoId..." -ForegroundColor Cyan
try {
    $videoInfo = Invoke-RestMethod -Uri "https://api.vimeo.com/videos/$VideoId" -Headers $headers
    Write-Host "Video: $($videoInfo.name)" -ForegroundColor Green
    Write-Host "Duration: $([math]::Round($videoInfo.duration / 60, 1)) minutes" -ForegroundColor Gray
} catch {
    Write-Error "Failed to fetch video info: $_"
    exit 1
}

# Get text tracks
Write-Host "Fetching transcripts..." -ForegroundColor Cyan
try {
    $tracks = Invoke-RestMethod -Uri "https://api.vimeo.com/videos/$VideoId/texttracks" -Headers $headers
} catch {
    Write-Error "Failed to fetch text tracks: $_"
    exit 1
}

if ($tracks.total -eq 0) {
    Write-Warning "No transcripts available for this video"
    exit 0
}

# Find the best track (prefer English auto-generated)
$track = $tracks.data | Where-Object { $_.language -match "en" } | Select-Object -First 1
if (-not $track) {
    $track = $tracks.data | Select-Object -First 1
}

Write-Host "Found transcript: $($track.display_language)" -ForegroundColor Green

# Download VTT file
Write-Host "Downloading VTT..." -ForegroundColor Cyan
$vttContent = Invoke-RestMethod -Uri $track.link

# Determine output path
if (-not $OutputPath) {
    $transcriptsDir = Join-Path $PSScriptRoot "..\transcripts"
    if (-not (Test-Path $transcriptsDir)) {
        New-Item -ItemType Directory -Path $transcriptsDir -Force | Out-Null
    }
    $extension = if ($Raw) { ".vtt" } else { ".txt" }
    $OutputPath = Join-Path $transcriptsDir "vimeo-$VideoId$extension"
}

if ($Raw) {
    # Save raw VTT
    $vttContent | Out-File -FilePath $OutputPath -Encoding UTF8
    Write-Host "Saved raw VTT to: $OutputPath" -ForegroundColor Green
} else {
    # Parse VTT to clean text
    $lines = $vttContent -split "`n"
    $cleanLines = @()
    $lastLine = ""
    
    foreach ($line in $lines) {
        # Skip WEBVTT header, timestamps, and cue numbers
        if ($line -match "^WEBVTT" -or 
            $line -match "^\d+$" -or 
            $line -match "^\d{2}:\d{2}:\d{2}\.\d{3}" -or
            $line -match "^$") {
            continue
        }
        
        # Clean the line
        $cleanLine = $line.Trim()
        
        # Skip duplicates (VTT often has overlapping captions)
        if ($cleanLine -and $cleanLine -ne $lastLine) {
            $cleanLines += $cleanLine
            $lastLine = $cleanLine
        }
    }
    
    # Join and format
    $transcript = $cleanLines -join " "
    
    # Clean up multiple spaces
    $transcript = $transcript -replace "\s+", " "
    
    # Add paragraph breaks roughly every 500 chars at sentence boundaries
    $sentences = $transcript -split "(?<=[.!?])\s+"
    $paragraphs = @()
    $currentPara = ""
    
    foreach ($sentence in $sentences) {
        $currentPara += "$sentence "
        if ($currentPara.Length -gt 500) {
            $paragraphs += $currentPara.Trim()
            $currentPara = ""
        }
    }
    if ($currentPara) {
        $paragraphs += $currentPara.Trim()
    }
    
    $formattedTranscript = $paragraphs -join "`n`n"
    
    # Save
    $formattedTranscript | Out-File -FilePath $OutputPath -Encoding UTF8
    
    Write-Host "Saved transcript to: $OutputPath" -ForegroundColor Green
    Write-Host "Character count: $($formattedTranscript.Length)" -ForegroundColor Gray
}

# Return info for piping
[PSCustomObject]@{
    VideoId = $VideoId
    VideoName = $videoInfo.name
    Duration = $videoInfo.duration
    TranscriptPath = $OutputPath
    CharCount = if (-not $Raw) { $formattedTranscript.Length } else { $vttContent.Length }
}
