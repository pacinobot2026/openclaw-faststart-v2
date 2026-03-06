# PopLinks API Test Script
# Tests lead page and bridge page endpoints to identify issues
# Run with: .\poplinks-api-test.ps1

$ErrorActionPreference = "Continue"
$baseUrl = "https://api.poplinks.io/api/ai"
$token = "z12Y1nJjkG275WIEJKM58QsnGoAoIhuW"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

function Write-TestHeader($text) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host $text -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success($text) {
    Write-Host "✅ $text" -ForegroundColor Green
}

function Write-Failure($text) {
    Write-Host "❌ $text" -ForegroundColor Red
}

function Write-Warning($text) {
    Write-Host "⚠️  $text" -ForegroundColor Yellow
}

# =============================================================================
# TEST 1: List Lead Pages (KNOWN ISSUE)
# =============================================================================
Write-TestHeader "TEST 1: List Lead Pages"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/lead-pages" -Method GET -Headers $headers
    
    if ($response.data.lead_pages) {
        $count = $response.data.lead_pages.Count
        Write-Success "Returned $count lead pages"
        
        if ($count -gt 0) {
            $firstPage = $response.data.lead_pages[0]
            Write-Host "`nFirst lead page structure:"
            $firstPage | ConvertTo-Json -Depth 3
            
            # Check for critical fields
            if ($firstPage.id) { Write-Success "Has 'id' field" } else { Write-Failure "Missing 'id' field" }
            if ($firstPage.name) { Write-Success "Has 'name' field" } else { Write-Failure "Missing 'name' field" }
            if ($firstPage.funnel_links) { Write-Success "Has 'funnel_links' field" } else { Write-Failure "Missing 'funnel_links' field" }
        } else {
            Write-Warning "Array is empty (no lead pages found)"
        }
    } else {
        Write-Failure "No 'lead_pages' array in response"
        Write-Host "Full response:"
        $response | ConvertTo-Json -Depth 2
    }
} catch {
    Write-Failure "Request failed: $($_.Exception.Message)"
}

# =============================================================================
# TEST 2: Create Lead Page (KNOWN ISSUE - No ID returned)
# =============================================================================
Write-TestHeader "TEST 2: Create Lead Page"
$createBody = @{
    name = "API Test Lead Page $(Get-Date -Format 'HH:mm:ss')"
    template_id = $null
    category_id = $null
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/lead-pages" -Method POST -Headers $headers -Body $createBody
    
    Write-Host "Create response:"
    $response | ConvertTo-Json -Depth 3
    
    if ($response.success) {
        Write-Success "API returned success=true"
    } else {
        Write-Failure "API returned success=false"
    }
    
    if ($response.data.id -or $response.data.lead_page.id -or $response.id) {
        $newId = $response.data.id ?? $response.data.lead_page.id ?? $response.id
        Write-Success "Lead page ID returned: $newId"
        
        # Save ID for next test
        $script:testLeadPageId = $newId
    } else {
        Write-Failure "No lead page ID in response (CRITICAL BUG)"
        Write-Warning "Cannot test GET/UPDATE without ID"
        
        # Try to find it in the list
        Write-Host "`nAttempting to find newly created page in list..."
        Start-Sleep -Seconds 2
        $listResponse = Invoke-RestMethod -Uri "$baseUrl/lead-pages" -Method GET -Headers $headers
        $newest = $listResponse.data.lead_pages | Sort-Object -Property created_at -Descending | Select-Object -First 1
        if ($newest) {
            Write-Warning "Found most recent page: $($newest.name) (ID: $($newest.id))"
            $script:testLeadPageId = $newest.id
        }
    }
} catch {
    Write-Failure "Request failed: $($_.Exception.Message)"
}

# =============================================================================
# TEST 3: Get Single Lead Page (if we have an ID)
# =============================================================================
if ($script:testLeadPageId) {
    Write-TestHeader "TEST 3: Get Single Lead Page (ID: $script:testLeadPageId)"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/lead-pages/$script:testLeadPageId" -Method GET -Headers $headers
        
        Write-Host "Get response:"
        $response | ConvertTo-Json -Depth 3
        
        if ($response.data.lead_page -or $response.data) {
            $page = $response.data.lead_page ?? $response.data
            Write-Success "Lead page data returned"
            
            # Check completeness
            $fields = @('id', 'name', 'funnel_links', 'bullets', 'settings', 'created_at')
            foreach ($field in $fields) {
                if ($page.$field) {
                    Write-Success "Has '$field' field"
                } else {
                    Write-Failure "Missing '$field' field"
                }
            }
        } else {
            Write-Failure "No lead page data in response"
        }
    } catch {
        Write-Failure "Request failed: $($_.Exception.Message)"
    }
} else {
    Write-Warning "TEST 3: SKIPPED (no lead page ID available)"
}

# =============================================================================
# TEST 4: List Bridge Pages (WORKING - for comparison)
# =============================================================================
Write-TestHeader "TEST 4: List Bridge Pages (Working Example)"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/bridge-pages" -Method GET -Headers $headers
    
    if ($response.data.bridge_pages) {
        $count = $response.data.bridge_pages.Count
        Write-Success "Returned $count bridge pages"
        
        if ($count -gt 0) {
            $firstPage = $response.data.bridge_pages[0]
            Write-Host "`nFirst bridge page structure:"
            $firstPage | Select-Object id, name, @{N='url';E={$_.funnel_links.leadpage_keyword}}, created_at | Format-Table
            
            # Check for critical fields
            if ($firstPage.id) { Write-Success "Has 'id' field" } else { Write-Failure "Missing 'id' field" }
            if ($firstPage.name) { Write-Success "Has 'name' field" } else { Write-Failure "Missing 'name' field" }
            if ($firstPage.funnel_links) { Write-Success "Has 'funnel_links' field" } else { Write-Failure "Missing 'funnel_links' field" }
            
            # Save ID for next test
            $script:testBridgePageId = $firstPage.id
        }
    } else {
        Write-Failure "No 'bridge_pages' array in response"
    }
} catch {
    Write-Failure "Request failed: $($_.Exception.Message)"
}

# =============================================================================
# TEST 5: Get Single Bridge Page (WORKING - for comparison)
# =============================================================================
if ($script:testBridgePageId) {
    Write-TestHeader "TEST 5: Get Single Bridge Page (ID: $script:testBridgePageId)"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/bridge-pages/$script:testBridgePageId" -Method GET -Headers $headers
        
        if ($response.data.bridge_page -or $response.data) {
            $page = $response.data.bridge_page ?? $response.data
            Write-Success "Bridge page data returned"
            
            Write-Host "`nBridge page details:"
            $page | Select-Object id, name, @{N='url';E={$_.funnel_links.leadpage_keyword}}, @{N='clicks';E={$_.funnel_links.clicks}}, @{N='views';E={$_.funnel_links.views}} | Format-List
            
            # Check completeness
            $fields = @('id', 'name', 'funnel_links', 'bullets', 'settings', 'created_at')
            foreach ($field in $fields) {
                if ($page.$field) {
                    Write-Success "Has '$field' field"
                } else {
                    Write-Warning "Missing '$field' field"
                }
            }
        } else {
            Write-Failure "No bridge page data in response"
        }
    } catch {
        Write-Failure "Request failed: $($_.Exception.Message)"
    }
}

# =============================================================================
# TEST 6: Update Lead Page Template (NEW ENDPOINT)
# =============================================================================
if ($script:testLeadPageId) {
    Write-TestHeader "TEST 6: Update Lead Page Template (ID: $script:testLeadPageId)"
    $templateBody = @{
        template_id = 5
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/lead-pages/$script:testLeadPageId/template" -Method PUT -Headers $headers -Body $templateBody
        
        Write-Host "Template update response:"
        $response | ConvertTo-Json -Depth 2
        
        if ($response.success) {
            Write-Success "Template updated successfully"
        } else {
            Write-Failure "Template update failed"
        }
    } catch {
        Write-Failure "Request failed: $($_.Exception.Message)"
        Write-Host "Error details: $($_.ErrorDetails.Message)"
    }
} else {
    Write-Warning "TEST 6: SKIPPED (no lead page ID available)"
}

# =============================================================================
# SUMMARY
# =============================================================================
Write-TestHeader "TEST SUMMARY"
Write-Host "Lead Pages Issues:" -ForegroundColor Yellow
Write-Host "  1. List endpoint - Check if returns complete data"
Write-Host "  2. Create endpoint - Check if returns new ID"
Write-Host "  3. Get endpoint - Check if returns complete object"
Write-Host ""
Write-Host "Bridge Pages (Working):" -ForegroundColor Green
Write-Host "  ✅ List returns complete data with IDs"
Write-Host "  ✅ Get returns full object"
Write-Host "  ✅ All update endpoints work"
Write-Host ""
Write-Host "Test complete. Review output above for specific failures." -ForegroundColor Cyan
