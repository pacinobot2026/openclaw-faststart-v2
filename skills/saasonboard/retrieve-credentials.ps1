# SaaSOnboard - Retrieve User Credentials
# Retrieves existing user passwords without resetting them

param(
    [Parameter(Mandatory=$true)]
    [string]$Email,
    
    [Parameter(Mandatory=$false)]
    [int]$CompanyId = 81,  # Default to MintBird
    
    [Parameter(Mandatory=$false)]
    [string]$ApiKey = $env:SOB_API_KEY
)

if (-not $ApiKey) {
    $ApiKey = Get-Content "$PSScriptRoot\..\..\credentials\titanium-api-keys.txt" | 
        Select-String "SaaSOnboard:" | 
        ForEach-Object { $_.Line.Split(":")[1].Trim() }
}

$headers = @{
    "Authorization" = $ApiKey
    "Content-Type" = "application/json"
}

Write-Host "`n🔍 Retrieving credentials for: $Email" -ForegroundColor Cyan
Write-Host "   Product ID: $CompanyId`n" -ForegroundColor Gray

# Strategy 1: Try to get user details without modification
try {
    Write-Host "Attempting user lookup..." -ForegroundColor Yellow
    
    $searchBody = @{
        email = $Email
        company_id = $CompanyId
    } | ConvertTo-Json
    
    # Try a read-only endpoint first
    $endpoints = @(
        @{path="get-user"; method="POST"},
        @{path="user/details"; method="POST"},
        @{path="user-info"; method="POST"}
    )
    
    foreach ($ep in $endpoints) {
        try {
            $result = Invoke-RestMethod -Uri "https://app.saasonboard.com/api/ai/$($ep.path)" `
                -Method $ep.method -Headers $headers -Body $searchBody
            
            if ($result -and $result.password) {
                Write-Host "✅ Credentials retrieved!" -ForegroundColor Green
                Write-Host "`nEmail: $Email" -ForegroundColor White
                Write-Host "Password: $($result.password)" -ForegroundColor White
                Write-Host "Product: Company ID $CompanyId`n" -ForegroundColor Gray
                return
            }
        } catch {
            # Continue to next
        }
    }
    
    Write-Host "⚠️  Read-only endpoints not available" -ForegroundColor Yellow
    Write-Host "Note: SOB may not expose passwords via API for security" -ForegroundColor Gray
    Write-Host "`nAlternative: Use the web dashboard at https://app.saasonboard.com`n" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# IMPORTANT: Do NOT call add-user here - that would reset the password!
Write-Host "⚠️  Unable to retrieve password via API" -ForegroundColor Yellow
Write-Host "SOB does not expose existing passwords for security reasons.`n" -ForegroundColor Gray

Write-Host "Options:" -ForegroundColor Cyan
Write-Host "  1. Use web dashboard: https://app.saasonboard.com" -ForegroundColor White
Write-Host "  2. Reset password via add-user (but this changes it)" -ForegroundColor White
Write-Host "  3. User can use 'Forgot Password' feature`n" -ForegroundColor White
