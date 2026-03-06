# Upload video to Vimeo
param(
    [string]$VideoPath = "FastStart_VSL_FINAL.mp4",
    [string]$Title = "FastStart Blueprint VSL",
    [string]$Description = "The complete VSL for The FastStart Blueprint"
)

$token = (Get-Content "..\credentials\vimeo-access-token.txt" -Raw).Trim()
$videoSize = (Get-Item $VideoPath).Length

Write-Host "Uploading: $VideoPath"
Write-Host "Size: $([math]::Round($videoSize/1MB, 2)) MB"
Write-Host "Title: $Title"
Write-Host ""

# Step 1: Create upload ticket
Write-Host "Creating upload ticket..."

$createBody = @{
    upload = @{
        approach = "tus"
        size = $videoSize
    }
    name = $Title
    description = $Description
    privacy = @{
        view = "anybody"
        embed = "public"
    }
} | ConvertTo-Json -Depth 5

$headers = @{
    "Authorization" = "bearer $token"
    "Content-Type" = "application/json"
    "Accept" = "application/vnd.vimeo.*+json;version=3.4"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.vimeo.com/users/41953625/videos" `
        -Method Post `
        -Headers $headers `
        -Body $createBody

    $videoUri = $response.uri
    $uploadLink = $response.upload.upload_link
    $videoId = $videoUri -replace '/videos/', ''
    $videoUrl = "https://vimeo.com/$videoId"

    Write-Host "Video created: $videoUrl"
    Write-Host ""
    
    # Step 2: Upload file via tus
    Write-Host "Uploading video file..."
    
    $uploadHeaders = @{
        "Tus-Resumable" = "1.0.0"
        "Upload-Offset" = "0"
        "Content-Type" = "application/offset+octet-stream"
        "Authorization" = "bearer $token"
    }
    
    $videoBytes = [System.IO.File]::ReadAllBytes($VideoPath)
    
    Invoke-RestMethod -Uri $uploadLink `
        -Method Patch `
        -Headers $uploadHeaders `
        -Body $videoBytes | Out-Null
    
    Write-Host "Upload complete!"
    Write-Host ""
    Write-Host "SUCCESS!"
    Write-Host "Vimeo URL: $videoUrl"
    Write-Host "Video ID: $videoId"
    Write-Host ""
    
    # Save to file for reference
    @{
        url = $videoUrl
        id = $videoId
        title = $Title
        uploaded = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    } | ConvertTo-Json | Out-File "vimeo-upload-result.json"
    
    Write-Host "Details saved to vimeo-upload-result.json"
    
    return $videoUrl
    
} catch {
    Write-Host ""
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
    }
    exit 1
}
