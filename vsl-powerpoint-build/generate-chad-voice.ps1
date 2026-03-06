# Generate FastStart VSL audio with Chad's voice using openclaw sag

$scriptFile = "vsl-faststart-script.txt"
$outputAudio = "faststart-chad-voice.mp3"

Write-Host "🎤 Generating VSL with Chad's voice..." -ForegroundColor Cyan
Write-Host ""

# Generate audio from full script
openclaw sag --input ..\$scriptFile --output $outputAudio --voice chad

Write-Host ""
Write-Host "✅ Audio generated: $outputAudio" -ForegroundColor Green
