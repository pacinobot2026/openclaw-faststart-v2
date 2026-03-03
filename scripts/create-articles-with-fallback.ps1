# Create Articles with Fallback System
# Purpose: Always create articles on Monday, even without web access
# Uses: Content bank sources (preferred) OR evergreen templates (fallback)

param(
    [switch]$DryRun,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# Load credentials
$credPath = "$PSScriptRoot/../credentials/titanium-api-keys.txt"
$lettermanKey = (Get-Content $credPath | Select-String "^Letterman:").ToString().Split(":")[1].Trim()

$headers = @{
    "Authorization" = "Bearer $lettermanKey"
    "Content-Type" = "application/json"
}

$baseUrl = "https://api.letterman.ai/api/ai"

# Publication IDs
$publications = @{
    "WestValley" = @{
        ID = "677895a2584a3ce5878fcf5b"
        Name = "West Valley Shoutouts"
        Type = "LOCAL"
        TemplateFile = "content-bank/templates/west-valley-shoutouts.md"
    }
    "SaveTheDoggy" = @{
        ID = "68a78eba3ce3e647df7fefaa"
        Name = "Save The Doggy"
        Type = "NICHE"
        TemplateFile = "content-bank/templates/save-the-doggy.md"
    }
    "VegasFork" = @{
        ID = "68a790aa3ce3e647df7ff272"
        Name = "Vegas Fork"
        Type = "NICHE"
        TemplateFile = "content-bank/templates/vegas-fork.md"
    }
}

# Check for content bank sources
$today = Get-Date -Format "yyyy-MM-dd"
$sourcesFile = "content-bank/$today/sources.md"
$hasSources = Test-Path $sourcesFile

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "📝 MONDAY ARTICLE CREATION - FALLBACK SYSTEM" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

if ($hasSources) {
    Write-Host "✅ Content bank sources found at: $sourcesFile" -ForegroundColor Green
    Write-Host "⚠️  Manual article creation recommended using real sources" -ForegroundColor Yellow
    Write-Host "    (This script uses FALLBACK templates only)" -ForegroundColor Yellow
    
    if (-not $Force) {
        Write-Host ""
        Write-Host "Use -Force to create template-based articles anyway" -ForegroundColor Gray
        exit 0
    }
} else {
    Write-Host "❌ No content bank sources found" -ForegroundColor Yellow
    Write-Host "🔄 FALLBACK MODE: Using evergreen templates" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Creating 3 articles - 1 per publication..." -ForegroundColor White
Write-Host ""

$results = @()

# Function to pick random template
function Get-RandomTemplate {
    param($TemplateFile)
    
    $content = Get-Content $TemplateFile -Raw
    $templates = $content -split "## Template \d+:"
    $templates = $templates | Where-Object { $_.Trim().Length -gt 100 }
    
    return $templates | Get-Random
}

# Function to create article from template
function Create-ArticleFromTemplate {
    param($PubID, $PubName, $TemplateFile, $Type)
    
    Write-Host "📄 Creating article for $PubName..." -ForegroundColor Cyan
    
    # Get random template
    $template = Get-RandomTemplate -TemplateFile $TemplateFile
    
    # Extract hook - matches **Hook:** "text"
    $hookLines = $template -split "`n" | Where-Object { $_ -match '\*\*Hook:\*\*' }
    if ($hookLines) {
        $hookLine = $hookLines[0]
        if ($hookLine -match '"([^"]+)"') {
            $parts = $hookLine -split '"'
            $hook = $parts[1]
        } else {
            Write-Host "   ❌ Could not parse template hook" -ForegroundColor Red
            return $null
        }
    } else {
        Write-Host "   ❌ Could not find Hook line in template" -ForegroundColor Red
        return $null
    }
    
    if (-not $hook) {
    if (-not $hookMatch.Success) {
        Write-Host "   ❌ Could not parse template hook" -ForegroundColor Red
        return $null
    }
    
    $hook = $hookMatch.Groups[1].Value
    
    # Generate article via Letterman AI
    $body = @{
        publicationId = $PubID
        contentFrom = "CONTENT"
        content = "Write a $Type article about: $hook`n`nMake it engaging, informative, and optimized for local SEO. Use specific details about the topic. Write in a friendly, conversational tone. Include 5-7 paragraphs."
        aiModel = "OPEN_AI"
        keepOriginal = $true
    } | ConvertTo-Json
    
    if ($DryRun) {
        Write-Host "   [DRY RUN] Would create article: $hook" -ForegroundColor Gray
        return @{ Hook = $hook; Status = "DRY_RUN" }
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/newsletters/create-article" `
            -Method Post -Headers $headers -Body $body
        
        if ($response.status -eq "success") {
            Write-Host "   ✅ CREATED (DRAFT): $hook" -ForegroundColor Green
            Write-Host "      Article ID: $($response.data.newsletter._id)" -ForegroundColor Gray
            return @{
                Hook = $hook
                ArticleID = $response.data.newsletter._id
                Status = "SUCCESS"
            }
        } else {
            Write-Host "   ❌ FAILED: $($response.message)" -ForegroundColor Red
            return @{ Hook = $hook; Status = "FAILED"; Error = $response.message }
        }
    } catch {
        Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Hook = $hook; Status = "ERROR"; Error = $_.Exception.Message }
    }
}

# Create articles for each publication
foreach ($key in $publications.Keys) {
    $pub = $publications[$key]
    
    $result = Create-ArticleFromTemplate `
        -PubID $pub.ID `
        -PubName $pub.Name `
        -TemplateFile $pub.TemplateFile `
        -Type $pub.Type
    
    if ($result) {
        $results += [PSCustomObject]@{
            Publication = $pub.Name
            Hook = $result.Hook
            ArticleID = $result.ArticleID
            Status = $result.Status
        }
    }
    
    Write-Host ""
    Start-Sleep -Seconds 2
}

# Summary
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$results | Format-Table -AutoSize

$successCount = ($results | Where-Object { $_.Status -eq "SUCCESS" }).Count
Write-Host "✅ Created: $successCount articles" -ForegroundColor Green
Write-Host "⚠️  Status: ALL DRAFTS (awaiting Chad's review)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Review articles in Letterman dashboard" -ForegroundColor Gray
Write-Host "2. Edit headlines, content, images as needed" -ForegroundColor Gray
Write-Host "3. Change state from DRAFT → APPROVED → PUBLISHED" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Fallback system ensured articles were created!" -ForegroundColor Cyan
