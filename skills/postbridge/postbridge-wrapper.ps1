# Post Bridge API PowerShell Wrapper
# Quick helper functions for common Post Bridge operations

# Load API token
$script:PostBridgeToken = if (Test-Path "credentials/postbridge-api-key.txt") {
    Get-Content "credentials/postbridge-api-key.txt" -Raw | ForEach-Object { $_.Trim() }
} else {
    Write-Warning "API token not found. Please create credentials/postbridge-api-key.txt"
    $null
}

$script:PostBridgeBase = "https://api.post-bridge.com/v1"

function Get-PostBridgeHeaders {
    @{
        "Authorization" = "Bearer $script:PostBridgeToken"
        "Content-Type" = "application/json"
    }
}

# === SOCIAL ACCOUNTS ===

function Get-PBSocialAccounts {
    <#
    .SYNOPSIS
    Get all connected social accounts
    .EXAMPLE
    Get-PBSocialAccounts
    #>
    $headers = Get-PostBridgeHeaders
    Invoke-RestMethod -Uri "$script:PostBridgeBase/social-accounts?limit=100" -Headers $headers
}

function Get-PBAccount {
    <#
    .SYNOPSIS
    Get specific social account by ID
    .PARAMETER AccountId
    Social account ID
    .EXAMPLE
    Get-PBAccount -AccountId "acc_fb_123"
    #>
    param([Parameter(Mandatory)]$AccountId)
    $headers = Get-PostBridgeHeaders
    Invoke-RestMethod -Uri "$script:PostBridgeBase/social-accounts/$AccountId" -Headers $headers
}

# === POSTS ===

function Get-PBPosts {
    <#
    .SYNOPSIS
    Get all posts with optional filters
    .PARAMETER Limit
    Number of posts to return (default: 50)
    .PARAMETER Offset
    Number of posts to skip (default: 0)
    .EXAMPLE
    Get-PBPosts -Limit 100
    #>
    param(
        [int]$Limit = 50,
        [int]$Offset = 0
    )
    $headers = Get-PostBridgeHeaders
    Invoke-RestMethod -Uri "$script:PostBridgeBase/posts?limit=$Limit&offset=$Offset" -Headers $headers
}

function Get-PBPost {
    <#
    .SYNOPSIS
    Get specific post by ID
    .PARAMETER PostId
    Post ID
    .EXAMPLE
    Get-PBPost -PostId "post_123"
    #>
    param([Parameter(Mandatory)]$PostId)
    $headers = Get-PostBridgeHeaders
    Invoke-RestMethod -Uri "$script:PostBridgeBase/posts/$PostId" -Headers $headers
}

function New-PBPost {
    <#
    .SYNOPSIS
    Create a new social media post
    .PARAMETER Content
    Post content/text
    .PARAMETER ScheduledAt
    ISO 8601 timestamp for when to publish (default: 1 hour from now)
    .PARAMETER Platforms
    Hashtable of platform configurations { platform_name = @{ account_id = "..." } }
    .PARAMETER MediaIds
    Array of media IDs to attach
    .EXAMPLE
    New-PBPost -Content "Hello world!" -Platforms @{facebook=@{account_id="acc_fb_123"}; twitter=@{account_id="acc_tw_456"}}
    #>
    param(
        [Parameter(Mandatory)]
        [string]$Content,
        
        [string]$ScheduledAt = ((Get-Date).AddHours(1).ToString("o")),
        
        [Parameter(Mandatory)]
        [hashtable]$Platforms,
        
        [string[]]$MediaIds = @()
    )
    
    $headers = Get-PostBridgeHeaders
    $body = @{
        posts = @(
            @{
                content = $Content
                scheduled_at = $ScheduledAt
                platforms = $Platforms
                media_ids = $MediaIds
            }
        )
    } | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$script:PostBridgeBase/posts" -Method POST -Headers $headers -Body $body
}

function Update-PBPost {
    <#
    .SYNOPSIS
    Update an existing post (scheduled posts only)
    .PARAMETER PostId
    Post ID to update
    .PARAMETER Content
    New content
    .PARAMETER ScheduledAt
    New scheduled time
    .PARAMETER MediaIds
    New media IDs
    .EXAMPLE
    Update-PBPost -PostId "post_123" -Content "Updated content"
    #>
    param(
        [Parameter(Mandatory)]$PostId,
        [string]$Content,
        [string]$ScheduledAt,
        [string[]]$MediaIds
    )
    
    $headers = Get-PostBridgeHeaders
    $body = @{}
    if ($Content) { $body.content = $Content }
    if ($ScheduledAt) { $body.scheduled_at = $ScheduledAt }
    if ($MediaIds) { $body.media_ids = $MediaIds }
    
    $bodyJson = $body | ConvertTo-Json
    Invoke-RestMethod -Uri "$script:PostBridgeBase/posts/$PostId" -Method PATCH -Headers $headers -Body $bodyJson
}

function Remove-PBPost {
    <#
    .SYNOPSIS
    Delete a post
    .PARAMETER PostId
    Post ID to delete
    .EXAMPLE
    Remove-PBPost -PostId "post_123"
    #>
    param([Parameter(Mandatory)]$PostId)
    $headers = Get-PostBridgeHeaders
    Invoke-RestMethod -Uri "$script:PostBridgeBase/posts/$PostId" -Method DELETE -Headers $headers
}

# === MEDIA ===

function Get-PBMedia {
    <#
    .SYNOPSIS
    Get all media with optional filters
    .PARAMETER Limit
    Number of items to return
    .PARAMETER Type
    Filter by type: "image" or "video"
    .EXAMPLE
    Get-PBMedia -Type "image" -Limit 50
    #>
    param(
        [int]$Limit = 50,
        [int]$Offset = 0,
        [ValidateSet("image","video")]
        [string]$Type
    )
    
    $headers = Get-PostBridgeHeaders
    $query = "limit=$Limit&offset=$Offset"
    if ($Type) { $query += "&type=$Type" }
    
    Invoke-RestMethod -Uri "$script:PostBridgeBase/media?$query" -Headers $headers
}

function New-PBMediaUploadUrl {
    <#
    .SYNOPSIS
    Generate upload URL for new media
    .PARAMETER FileName
    File name
    .PARAMETER ContentType
    MIME type (e.g., "image/jpeg", "video/mp4")
    .EXAMPLE
    $upload = New-PBMediaUploadUrl -FileName "photo.jpg" -ContentType "image/jpeg"
    Invoke-WebRequest -Uri $upload.upload_url -Method PUT -InFile "photo.jpg" -ContentType "image/jpeg"
    #>
    param(
        [Parameter(Mandatory)]$FileName,
        [Parameter(Mandatory)]$ContentType
    )
    
    $headers = Get-PostBridgeHeaders
    $body = @{
        filename = $FileName
        content_type = $ContentType
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$script:PostBridgeBase/media/create-upload-url" -Method POST -Headers $headers -Body $body
}

function Remove-PBMedia {
    <#
    .SYNOPSIS
    Delete a media item
    .PARAMETER MediaId
    Media ID to delete
    .EXAMPLE
    Remove-PBMedia -MediaId "media_123"
    #>
    param([Parameter(Mandatory)]$MediaId)
    $headers = Get-PostBridgeHeaders
    Invoke-RestMethod -Uri "$script:PostBridgeBase/media/$MediaId" -Method DELETE -Headers $headers
}

# === POST RESULTS ===

function Get-PBPostResults {
    <#
    .SYNOPSIS
    Get performance metrics for all posts
    .PARAMETER Limit
    Number of results to return
    .EXAMPLE
    Get-PBPostResults -Limit 100
    #>
    param(
        [int]$Limit = 50,
        [int]$Offset = 0
    )
    
    $headers = Get-PostBridgeHeaders
    Invoke-RestMethod -Uri "$script:PostBridgeBase/post-results?limit=$Limit&offset=$Offset" -Headers $headers
}

function Get-PBPostResult {
    <#
    .SYNOPSIS
    Get performance metrics for a specific post
    .PARAMETER PostId
    Post ID
    .EXAMPLE
    Get-PBPostResult -PostId "post_123"
    #>
    param([Parameter(Mandatory)]$PostId)
    $headers = Get-PostBridgeHeaders
    Invoke-RestMethod -Uri "$script:PostBridgeBase/post-results/$PostId" -Headers $headers
}

# === HELPER FUNCTIONS ===

function Show-PBPerformanceSummary {
    <#
    .SYNOPSIS
    Display performance summary grouped by platform
    .EXAMPLE
    Show-PBPerformanceSummary
    #>
    $results = Get-PBPostResults -Limit 1000
    
    $results.data | Group-Object platform | ForEach-Object {
        $impressions = ($_.Group.impressions | Measure-Object -Sum).Sum
        $engagements = ($_.Group.engagements | Measure-Object -Sum).Sum
        $rate = if ($impressions -gt 0) { [math]::Round(($engagements / $impressions) * 100, 2) } else { 0 }
        
        [PSCustomObject]@{
            Platform = $_.Name
            Posts = $_.Count
            Impressions = $impressions
            Engagements = $engagements
            EngagementRate = "$rate%"
        }
    } | Format-Table -AutoSize
}

function Show-PBScheduledPosts {
    <#
    .SYNOPSIS
    Display all scheduled posts
    .EXAMPLE
    Show-PBScheduledPosts
    #>
    $posts = Get-PBPosts -Limit 1000
    $scheduled = $posts.data | Where-Object { $_.status -eq "scheduled" } | Sort-Object scheduled_at
    
    $scheduled | Select-Object `
        @{N="ID";E={$_.id}}, `
        @{N="Scheduled";E={$_.scheduled_at}}, `
        @{N="Content";E={$_.content.Substring(0, [Math]::Min(50, $_.content.Length)) + "..."}}, `
        @{N="Platforms";E={($_.platforms.PSObject.Properties.Name -join ", ")}} `
    | Format-Table -Wrap
}

# Export functions
Export-ModuleMember -Function Get-PBSocialAccounts, Get-PBAccount, Get-PBPosts, Get-PBPost, New-PBPost, Update-PBPost, Remove-PBPost, Get-PBMedia, New-PBMediaUploadUrl, Remove-PBMedia, Get-PBPostResults, Get-PBPostResult, Show-PBPerformanceSummary, Show-PBScheduledPosts

Write-Host "✓ Post Bridge API Wrapper Loaded!" -ForegroundColor Green
Write-Host "Available commands: Get-PBSocialAccounts, New-PBPost, Get-PBPostResults, Show-PBPerformanceSummary, Show-PBScheduledPosts" -ForegroundColor Cyan
Write-Host "Use Get-Command *PB* to see all functions" -ForegroundColor Gray
