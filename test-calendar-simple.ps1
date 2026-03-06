# Simple Google Calendar API Test
$ErrorActionPreference = "Stop"

# Install Google Calendar module if needed
if (!(Get-Module -ListAvailable -Name "GoogleCalendar")) {
    Write-Host "Installing Google Calendar PowerShell module..."
    Install-Module -Name PSGoogleCalendar -Force -Scope CurrentUser
}

# Load credentials
$credsPath = "credentials/google-calendar-service-account.json"
$creds = Get-Content $credsPath -Raw | ConvertFrom-Json

Write-Host "Service Account: $($creds.client_email)"
Write-Host "Testing connection..."

# Generate JWT and get access token
$now = [Math]::Floor([decimal](Get-Date -UFormat %s))
$exp = $now + 3600

$header = @{
    alg = "RS256"
    typ = "JWT"
} | ConvertTo-Json -Compress

$claim = @{
    iss = $creds.client_email
    scope = "https://www.googleapis.com/auth/calendar"
    aud = "https://oauth2.googleapis.com/token"
    exp = $exp
    iat = $now
} | ConvertTo-Json -Compress

$headerBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($header)) -replace '\+','-' -replace '/','_' -replace '='
$claimBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($claim)) -replace '\+','-' -replace '/','_' -replace '='
$jwtPayload = "$headerBase64.$claimBase64"

# Sign with RSA
$privateKeyPem = $creds.private_key
$rsa = [System.Security.Cryptography.RSA]::Create()
$keyText = $privateKeyPem -replace "-----BEGIN PRIVATE KEY-----" -replace "-----END PRIVATE KEY-----" -replace "`n" -replace "`r" -replace " "
$keyBytes = [Convert]::FromBase64String($keyText)
$rsa.ImportPkcs8PrivateKey($keyBytes, [ref]$null)

$dataToSign = [System.Text.Encoding]::UTF8.GetBytes($jwtPayload)
$signature = $rsa.SignData($dataToSign, [System.Security.Cryptography.HashAlgorithmName]::SHA256, [System.Security.Cryptography.RSASignaturePadding]::Pkcs1)
$signatureBase64 = [Convert]::ToBase64String($signature) -replace '\+','-' -replace '/','_' -replace '='
$jwt = "$jwtPayload.$signatureBase64"

# Get access token
$tokenResponse = Invoke-RestMethod -Uri "https://oauth2.googleapis.com/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body @{
    grant_type = "urn:ietf:params:oauth:grant-type:jwt-bearer"
    assertion = $jwt
}

$accessToken = $tokenResponse.access_token
Write-Host "Access token obtained"

# Test API
$headers = @{ Authorization = "Bearer $accessToken" }
$calendars = Invoke-RestMethod -Uri "https://www.googleapis.com/calendar/v3/users/me/calendarList" -Headers $headers

Write-Host "`nSUCCESS! Connected to Google Calendar API"
Write-Host "`nAccessible Calendars:"
foreach ($cal in $calendars.items) {
    Write-Host "  - $($cal.summary) (ID: $($cal.id))"
    Write-Host "    Access: $($cal.accessRole)"
}

# Save primary calendar ID
$primaryCal = $calendars.items | Where-Object { $_.primary -eq $true } | Select-Object -First 1
if ($primaryCal) {
    @{
        calendar_id = $primaryCal.id
        calendar_name = $primaryCal.summary
        access_role = $primaryCal.accessRole
    } | ConvertTo-Json | Set-Content "credentials/google-calendar-id.json"
    Write-Host "`nPrimary calendar saved: $($primaryCal.summary)"
}
