# BULK IMPORT - Tag contacts from CSV (create if needed)
# Usage: ./bulk-import.ps1 -csvPath "file.csv" -tagName "Your Tag Name"

param(
    [Parameter(Mandatory=$true)]
    [string]$csvPath,
    
    [Parameter(Mandatory=$true)]
    [string]$tagName
)

$headers = @{
    "X-API-KEY" = "9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"
    "Content-Type" = "application/json"
}

Write-Host "🔥 BULK IMPORT - Starting...`n" -ForegroundColor Cyan
Write-Host "CSV: $csvPath"
Write-Host "Tag: $tagName`n"

# Step 1: Find the tag
Write-Host "Step 1: Finding tag in GC..." -ForegroundColor Yellow
$tags = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/tags" -Headers $headers -Method Get
$targetTag = $tags.data | Where-Object { $_.name -eq $tagName }

if (-not $targetTag) {
    Write-Host "❌ Tag not found: $tagName" -ForegroundColor Red
    Write-Host "`nAvailable tags:" -ForegroundColor Yellow
    $tags.data | Select-Object -First 20 name | Format-Table
    exit
}

Write-Host "✅ Tag found: $($targetTag.name) (ID: $($targetTag._id))`n" -ForegroundColor Green
$tagId = $targetTag._id

# Step 2: Read CSV
Write-Host "Step 2: Reading CSV..." -ForegroundColor Yellow
$contacts = Import-Csv $csvPath
Write-Host "✅ Found $($contacts.Count) contacts in CSV`n" -ForegroundColor Green

# Step 3: Process each contact
Write-Host "Step 3: Processing contacts...`n" -ForegroundColor Yellow

$results = @{
    Total = 0
    Updated = 0
    Created = 0
    Failed = 0
    Details = @()
}

foreach ($contact in $contacts) {
    $email = $contact.email
    $firstName = $contact.firstName
    $lastName = $contact.lastName
    
    Write-Host "Processing: $email..." -NoNewline
    
    # Search for contact in GC
    $found = $false
    $gcContact = $null
    
    for ($page = 1; $page -le 10; $page++) {
        $uri = "https://api.globalcontrol.io/api/ai/contacts?page=$page`&limit=100"
        $response = Invoke-RestMethod -Uri $uri -Headers $headers
        $gcContact = $response.data.contacts | Where-Object { $_.email -eq $email }
        
        if ($gcContact) {
            $found = $true
            break
        }
        
        if ($response.data.contacts.Count -lt 100) { break }
    }
    
    if ($found) {
        # Contact exists - fire tag
        Write-Host " EXISTS" -ForegroundColor Cyan -NoNewline
        
        $body = @{ contactId = $gcContact._id } | ConvertTo-Json
        
        try {
            $result = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/tags/fire-tag/$tagId" `
                -Method Post -Headers $headers -Body $body
            
            if ($result.type -eq "response") {
                Write-Host " → ✅ TAGGED" -ForegroundColor Green
                $results.Updated++
                $results.Total++
                $results.Details += [PSCustomObject]@{
                    Email = $email
                    Name = "$firstName $lastName"
                    Action = "Updated"
                    Status = "✅ Tagged"
                }
            } else {
                Write-Host " → ❌ FAILED" -ForegroundColor Red
                $results.Failed++
                $results.Details += [PSCustomObject]@{
                    Email = $email
                    Name = "$firstName $lastName"
                    Action = "Update"
                    Status = "❌ Tag fire failed"
                }
            }
        } catch {
            Write-Host " → ❌ ERROR" -ForegroundColor Red
            $results.Failed++
            $results.Details += [PSCustomObject]@{
                Email = $email
                Name = "$firstName $lastName"
                Action = "Update"
                Status = "❌ Error: $($_.Exception.Message)"
            }
        }
    } else {
        # Contact doesn't exist - create and tag
        Write-Host " NEW" -ForegroundColor Yellow -NoNewline
        
        $createBody = @{
            firstName = $firstName
            lastName = $lastName
            email = $email
            phone = ""
        } | ConvertTo-Json
        
        try {
            $createResult = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/contacts" `
                -Method Post -Headers $headers -Body $createBody
            
            if ($createResult.type -eq "response" -and $createResult.data._id) {
                $newContactId = $createResult.data._id
                Write-Host " → CREATED" -ForegroundColor Green -NoNewline
                
                # Fire tag on new contact
                $tagBody = @{ contactId = $newContactId } | ConvertTo-Json
                $tagResult = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/tags/fire-tag/$tagId" `
                    -Method Post -Headers $headers -Body $tagBody
                
                if ($tagResult.type -eq "response") {
                    Write-Host " → ✅ TAGGED" -ForegroundColor Green
                    $results.Created++
                    $results.Total++
                    $results.Details += [PSCustomObject]@{
                        Email = $email
                        Name = "$firstName $lastName"
                        Action = "Created"
                        Status = "✅ Created & Tagged"
                    }
                } else {
                    Write-Host " → ⚠️ NOT TAGGED" -ForegroundColor Yellow
                    $results.Created++
                    $results.Failed++
                    $results.Details += [PSCustomObject]@{
                        Email = $email
                        Name = "$firstName $lastName"
                        Action = "Created"
                        Status = "⚠️ Created but tag failed"
                    }
                }
            } else {
                Write-Host " → ❌ CREATE FAILED" -ForegroundColor Red
                $results.Failed++
                $results.Details += [PSCustomObject]@{
                    Email = $email
                    Name = "$firstName $lastName"
                    Action = "Create"
                    Status = "❌ Contact creation failed"
                }
            }
        } catch {
            Write-Host " → ❌ ERROR" -ForegroundColor Red
            $results.Failed++
            $results.Details += [PSCustomObject]@{
                Email = $email
                Name = "$firstName $lastName"
                Action = "Create"
                Status = "❌ Error: $($_.Exception.Message)"
            }
        }
    }
}

# Step 4: Report
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📊 BULK IMPORT REPORT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Tag Applied: $tagName`n" -ForegroundColor White

Write-Host "Total Contacts Tagged: $($results.Total)" -ForegroundColor Green
Write-Host "  ├─ Updated: $($results.Updated)" -ForegroundColor Cyan
Write-Host "  └─ New Contacts Created: $($results.Created)`n" -ForegroundColor Yellow

if ($results.Failed -gt 0) {
    Write-Host "Failed: $($results.Failed)`n" -ForegroundColor Red
}

Write-Host "Detailed Results:" -ForegroundColor White
$results.Details | Format-Table -AutoSize

# Save report
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$reportPath = "bulk-import-report-$timestamp.csv"
$results.Details | Export-Csv $reportPath -NoTypeInformation
Write-Host "`n💾 Report saved: $reportPath" -ForegroundColor Green
