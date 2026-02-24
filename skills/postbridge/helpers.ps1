# Post Bridge API - PowerShell Helper Functions
# Quick functions for common operations

# Load API key from credentials
function Get-PostBridgeApiKey {
    $keyFile = "$env:USERPROFILE\.openclaw\workspace\credentials\postbridge-api-key.txt"
    if (Test-Path $keyFile) {
        $content = Get-Content $keyFile -Raw
        if ($content -match "API Key:\s*(.+)") {
            return $matches[1].Trim()
        }
    }
    throw "API key not found. Create credentials/postbridge-api-key.txt with format: 'API Key: YOUR_KEY'"
}

# Get social accounts
function Get-PostBridgeAccounts {
    param(
        [string[]]$Platforms,
        [string]$ApiKey = (Get-PostBridgeApiKey)
    )
    
    $uri = "https://api.post-bridge.com/v1/social-accounts"
    if ($Platforms) {
        $platformParams = ($Platforms | ForEach-Object { "platform=$_" }) -join "&"
        $uri += "?$platformParams"
    }
    
    $headers = @{ "Authorization" = "Bearer $ApiKey" }
    $response = Invoke-RestMethod -Uri $uri -Headers $headers
    return $response.data
}

# Upload media file
function New-PostBridgeMedia {
    param(
        [Parameter(Mandatory)]
        [string]$FilePath,
        [string]$ApiKey = (Get-PostBridgeApiKey)
    )
    
    if (-not (Test-Path $FilePath)) {
        throw "File not found: $FilePath"
    }
    
    $file = Get-Item $FilePath
    $extension = $file.Extension.ToLower()
    
    # Determine MIME type
    $mimeType = switch ($extension) {
        ".jpg"  { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".png"  { "image/png" }
        ".mp4"  { "video/mp4" }
        ".mov"  { "video/quicktime" }
        default { throw "Unsupported file type: $extension" }
    }
    
    $headers = @{
        "Authorization" = "Bearer $ApiKey"
        "Content-Type" = "application/json"
    }
    
    # Step 1: Get upload URL
    $body = @{
        mime_type = $mimeType
        size_bytes = $file.Length
        name = $file.Name
    } | ConvertTo-Json
    
    $uploadInfo = Invoke-RestMethod -Uri "https://api.post-bridge.com/v1/media/create-upload-url" -Method Post -Headers $headers -Body $body
    
    Write-Host "Got upload URL for media ID: $($uploadInfo.media_id)"
    
    # Step 2: Upload file
    $uploadHeaders = @{ "Content-Type" = $mimeType }
    Invoke-RestMethod -Uri $uploadInfo.upload_url -Method Put -InFile $FilePath -Headers $uploadHeaders
    
    Write-Host "Upload complete!"
    
    return $uploadInfo.media_id
}

# Create post
function New-PostBridgePost {
    param(
        [Parameter(Mandatory)]
        [string]$Caption,
        [Parameter(Mandatory)]
        [int[]]$AccountIds,
        [string[]]$MediaIds,
        [datetime]$ScheduledAt,
        [hashtable]$PlatformConfigurations,
        [string]$ApiKey = (Get-PostBridgeApiKey)
    )
    
    $headers = @{
        "Authorization" = "Bearer $ApiKey"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        caption = $Caption
        social_accounts = $AccountIds
    }
    
    if ($MediaIds) {
        $body.media = $MediaIds
    }
    
    if ($ScheduledAt) {
        $body.scheduled_at = $ScheduledAt.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    }
    
    if ($PlatformConfigurations) {
        $body.platform_configurations = $PlatformConfigurations
    }
    
    $bodyJson = $body | ConvertTo-Json -Depth 5
    
    $post = Invoke-RestMethod -Uri "https://api.post-bridge.com/v1/posts" -Method Post -Headers $headers -Body $bodyJson
    
    Write-Host "Post created! ID: $($post.id), Status: $($post.status)"
    
    return $post
}

# Get post results
function Get-PostBridgeResults {
    param(
        [Parameter(Mandatory)]
        [string]$PostId,
        [string]$ApiKey = (Get-PostBridgeApiKey)
    )
    
    $headers = @{ "Authorization" = "Bearer $ApiKey" }
    $response = Invoke-RestMethod -Uri "https://api.post-bridge.com/v1/post-results?post_id=$PostId" -Headers $headers
    
    foreach ($result in $response.data) {
        $status = if ($result.success) { "✅ Success" } else { "❌ Failed" }
        Write-Host "$($result.platform_data.username): $status"
        
        if ($result.platform_data.url) {
            Write-Host "  URL: $($result.platform_data.url)"
        }
        if (-not $result.success -and $result.error) {
            Write-Host "  Error: $($result.error)" -ForegroundColor Red
        }
    }
    
    return $response.data
}

# Complete workflow: Upload media + create post
function Publish-ToAllPlatforms {
    param(
        [Parameter(Mandatory)]
        [string]$Caption,
        [string]$MediaPath,
        [string[]]$Platforms = @("facebook", "instagram", "twitter"),
        [datetime]$ScheduledAt,
        [string]$ApiKey = (Get-PostBridgeApiKey)
    )
    
    Write-Host "🚀 Publishing to platforms: $($Platforms -join ', ')" -ForegroundColor Cyan
    
    # Get accounts
    Write-Host "`n1. Getting social accounts..."
    $accounts = Get-PostBridgeAccounts -Platforms $Platforms -ApiKey $ApiKey
    $accountIds = $accounts | ForEach-Object { $_.id }
    
    Write-Host "Found $($accounts.Count) accounts:"
    $accounts | ForEach-Object { Write-Host "  - $($_.platform): $($_.username)" }
    
    # Upload media if provided
    $mediaId = $null
    if ($MediaPath) {
        Write-Host "`n2. Uploading media..."
        $mediaId = New-PostBridgeMedia -FilePath $MediaPath -ApiKey $ApiKey
    }
    
    # Create post
    Write-Host "`n3. Creating post..."
    $postParams = @{
        Caption = $Caption
        AccountIds = $accountIds
        ApiKey = $ApiKey
    }
    
    if ($mediaId) {
        $postParams.MediaIds = @($mediaId)
    }
    
    if ($ScheduledAt) {
        $postParams.ScheduledAt = $ScheduledAt
    }
    
    $post = New-PostBridgePost @postParams
    
    # Check results
    Write-Host "`n4. Checking results..."
    Start-Sleep -Seconds 3
    $results = Get-PostBridgeResults -PostId $post.id -ApiKey $ApiKey
    
    Write-Host "`n✅ Done! Post ID: $($post.id)" -ForegroundColor Green
    
    return @{
        Post = $post
        Results = $results
    }
}

# Example usage:
<#
# Get accounts
$accounts = Get-PostBridgeAccounts -Platforms @("facebook", "instagram")

# Upload image
$mediaId = New-PostBridgeMedia -FilePath "photo.jpg"

# Create immediate post
$post = New-PostBridgePost -Caption "Hello world!" -AccountIds @(123, 456) -MediaIds @($mediaId)

# Create scheduled post
$scheduledPost = New-PostBridgePost -Caption "Tomorrow's post" -AccountIds @(123) -ScheduledAt (Get-Date).AddDays(1)

# Complete workflow
Publish-ToAllPlatforms -Caption "Check this out!" -MediaPath "photo.jpg" -Platforms @("instagram", "twitter")

# With schedule
Publish-ToAllPlatforms -Caption "Coming tomorrow!" -MediaPath "photo.jpg" -ScheduledAt (Get-Date).AddHours(24)
#>
