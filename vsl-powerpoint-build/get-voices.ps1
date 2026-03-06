$apiKey = "sk_86798b0bdcc222bd06e4c12452b88191c3b3bb20752b6569"

$headers = @{
    "xi-api-key" = $apiKey
}

Write-Host "Fetching voices..." -ForegroundColor Cyan

$voices = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/voices" -Headers $headers

Write-Host "`nAvailable voices:" -ForegroundColor Green
$voices.voices | ForEach-Object {
    Write-Host "$($_.name) - $($_.voice_id)" -ForegroundColor Yellow
}
