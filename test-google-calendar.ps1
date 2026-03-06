# Test Google Calendar API Connection
# Uses service account credentials to authenticate and list calendars

$ErrorActionPreference = "Stop"

# Load credentials
$credsPath = "credentials/google-calendar-service-account.json"
if (!(Test-Path $credsPath)) {
    Write-Host "❌ Credentials file not found!" -ForegroundColor Red
    exit 1
}

$creds = Get-Content $credsPath -Raw | ConvertFrom-Json
Write-Host "✅ Credentials loaded" -ForegroundColor Green
Write-Host "   Service Account: $($creds.client_email)" -ForegroundColor Cyan

# Generate JWT token for OAuth
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

# Base64 encode
$headerBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($header)) -replace '\+','-' -replace '/','_' -replace '='
$claimBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($claim)) -replace '\+','-' -replace '/','_' -replace '='

$jwtPayload = "$headerBase64.$claimBase64"

# Sign with private key
$privateKeyPem = $creds.private_key
$rsa = [System.Security.Cryptography.RSA]::Create()

# Parse PEM key
$keyText = $privateKeyPem -replace "-----BEGIN PRIVATE KEY-----" -replace "-----END PRIVATE KEY-----" -replace "`n" -replace "`r" -replace " "
$keyBytes = [Convert]::FromBase64String($keyText)
$rsa.ImportPkcs8PrivateKey($keyBytes, [ref]$null)

# Create signature
$dataToSign = [System.Text.Encoding]::UTF8.GetBytes($jwtPayload)
$signature = $rsa.SignData($dataToSign, [System.Security.Cryptography.HashAlgorithmName]::SHA256, [System.Security.Cryptography.RSASignaturePadding]::Pkcs1)
$signatureBase64 = [Convert]::ToBase64String($signature) -replace '\+','-' -replace '/','_' -replace '='

$jwt = "$jwtPayload.$signatureBase64"

Write-Host "✅ JWT token generated" -ForegroundColor Green

# Exchange JWT for access token
try {
    $tokenResponse = Invoke-RestMethod -Uri "https://oauth2.googleapis.com/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body @{
        grant_type = "urn:ietf:params:oauth:grant-type:jwt-bearer"
        assertion = $jwt
    }
    
    $accessToken = $tokenResponse.access_token
    Write-Host "✅ Access token obtained" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get access token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test API - List Calendars
try {
    $headers = @{
        Authorization = "Bearer $accessToken"
    }
    
    $calendars = Invoke-RestMethod -Uri "https://www.googleapis.com/calendar/v3/users/me/calendarList" -Headers $headers
    
    Write-Host "`n✅ Successfully connected to Google Calendar API!" -ForegroundColor Green
    Write-Host "`nAccessible Calendars:" -ForegroundColor Cyan
    foreach ($cal in $calendars.items) {
        Write-Host "  📅 $($cal.summary)" -ForegroundColor White
        Write-Host "     ID: $($cal.id)" -ForegroundColor Gray
        Write-Host "     Access: $($cal.accessRole)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Save primary calendar ID for future use
    $primaryCal = $calendars.items | Where-Object { $_.primary -eq $true }
    if ($primaryCal) {
        Write-Host "✅ Primary Calendar: $($primaryCal.summary)" -ForegroundColor Green
        Write-Host "   ID: $($primaryCal.id)" -ForegroundColor Cyan
        
        # Save to file for easy access
        @{
            calendar_id = $primaryCal.id
            calendar_name = $primaryCal.summary
        } | ConvertTo-Json | Set-Content "credentials/google-calendar-id.json"
    }
    
} catch {
    Write-Host "❌ Failed to access calendar: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure you shared the calendar with: $($creds.client_email)" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🎉 Setup complete! Calendar API is ready to use." -ForegroundColor Green
