$apiKey = "sk_86798b0bdcc222bd06e4c12452b88191c3b3bb20752b6569"
$voiceId = "PeMXWXe7DDCb8HldBr2s"  # Chad's voice
$outputFile = "faststart-chad-voice.mp3"

# Read the script
$scriptText = [string](Get-Content "..\vsl-faststart-script.txt" -Raw)

Write-Host "Generating audio with Chad's voice..." -ForegroundColor Cyan
Write-Host "Voice ID: $voiceId" -ForegroundColor Yellow
Write-Host "Text length: $($scriptText.Length) characters" -ForegroundColor Yellow
Write-Host ""

$headers = @{
    "xi-api-key" = $apiKey
    "Content-Type" = "application/json"
}

$body = @{
    text = $scriptText
    model_id = "eleven_multilingual_v2"
    voice_settings = @{
        stability = 0.5
        similarity_boost = 0.75
        style = 0.0
        use_speaker_boost = $true
    }
} | ConvertTo-Json

try {
    Write-Host "Calling ElevenLabs API..." -ForegroundColor Yellow
    
    $response = Invoke-WebRequest `
        -Uri "https://api.elevenlabs.io/v1/text-to-speech/$voiceId" `
        -Method Post `
        -Headers $headers `
        -Body $body `
        -OutFile $outputFile
    
    Write-Host "✅ Audio generated: $outputFile" -ForegroundColor Green
    
    $fileSize = (Get-Item $outputFile).Length
    Write-Host "File size: $([math]::Round($fileSize/1MB, 2)) MB" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    exit 1
}
