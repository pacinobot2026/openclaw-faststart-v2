# Get word-level timestamps using Whisper API

$apiKey = "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"
$audioFile = "faststart-chad-voice.mp3"
$outputFile = "faststart-timestamps.json"

Write-Host "Getting word-level timestamps from Whisper..." -ForegroundColor Cyan

# Create form data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"audio.mp3`"",
    "Content-Type: audio/mpeg$LF",
    [System.IO.File]::ReadAllBytes((Resolve-Path $audioFile)),
    "$LF--$boundary",
    "Content-Disposition: form-data; name=`"model`"$LF",
    "whisper-1",
    "$LF--$boundary",
    "Content-Disposition: form-data; name=`"response_format`"$LF",
    "verbose_json",
    "$LF--$boundary",
    "Content-Disposition: form-data; name=`"timestamp_granularities[]`"$LF",
    "word",
    "$LF--$boundary--$LF"
) -join $LF

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

try {
    $response = Invoke-RestMethod `
        -Uri "https://api.openai.com/v1/audio/transcriptions" `
        -Method Post `
        -Headers $headers `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($bodyLines))
    
    $response | ConvertTo-Json -Depth 10 | Out-File $outputFile
    
    Write-Host "✅ Timestamps saved: $outputFile" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}
