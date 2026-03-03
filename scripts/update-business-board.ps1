# UPDATE BUSINESS BOARD
# Generates update instructions for Business Board based on current business status

param(
    [Parameter(Mandatory=$false)]
    [string]$businessName
)

Write-Host "📋 BUSINESS BOARD UPDATE GENERATOR" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Read the manifest
if (-not (Test-Path "BUSINESS-MANIFEST.md")) {
    Write-Host "❌ BUSINESS-MANIFEST.md not found!" -ForegroundColor Red
    Write-Host "Run this from workspace root." -ForegroundColor Yellow
    exit
}

$manifest = Get-Content "BUSINESS-MANIFEST.md" -Raw

# Business data
$businesses = @{
    "ReviewRush" = @{
        URL = "https://reviewrush-pacino-bots-projects.vercel.app"
        Stage = "Stage 4 Complete"
        Tasks = @{
            Marketing = @(
                @{text="VSL script"; done=$true}
                @{text="VSL audio"; done=$true}
                @{text="VSL video"; done=$true}
                @{text="Sales page copy"; done=$true}
                @{text="21 organic posts"; done=$true}
                @{text="20 paid ads"; done=$true}
                @{text="7-email sequence"; done=$true}
            )
            Delivery = @(
                @{text="Product assets"; done=$true}
                @{text="Stripe setup"; done=$true}
                @{text="Vercel deploy"; done=$true}
            )
        }
        Resources = @(
            @{label="Sales Page"; value="https://reviewrush-pacino-bots-projects.vercel.app"}
            @{label="VSL Video"; value="https://files.catbox.moe/gitmqs.mp4"}
            @{label="GitHub"; value="https://github.com/pacinobot2026/reviewrush"}
            @{label="Traffic Assets"; value="reviewrush/traffic/"}
        )
    }
    "AI Client Attraction Suite" = @{
        URL = "https://ai-client-attraction-suite.vercel.app"
        Stage = "Stage 4 Complete"
        Tasks = @{
            Marketing = @(
                @{text="VSL script"; done=$true}
                @{text="VSL audio"; done=$true}
                @{text="VSL video"; done=$true}
                @{text="Sales page copy"; done=$true}
                @{text="13 organic posts"; done=$true}
                @{text="10 paid ads"; done=$true}
                @{text="12 email sequence"; done=$true}
            )
            Delivery = @(
                @{text="Sales page deployed"; done=$true}
            )
        }
        Resources = @(
            @{label="Sales Page"; value="https://ai-client-attraction-suite.vercel.app"}
            @{label="VSL Video"; value="https://files.catbox.moe/24koc0.mp4"}
            @{label="Traffic Assets"; value="ai-client-attraction-suite/traffic-assets/"}
        )
    }
    "LocalSponsor Pro" = @{
        URL = "https://localsponsor-pro-site.vercel.app"
        Stage = "Stage 3 Partial"
        Tasks = @{
            Marketing = @(
                @{text="Sales page copy"; done=$true}
                @{text="VSL"; done=$false}
                @{text="Traffic assets"; done=$false}
            )
            Delivery = @(
                @{text="Sales page deployed"; done=$true}
                @{text="Stripe products"; done=$false}
            )
        }
        Resources = @(
            @{label="Sales Page"; value="https://localsponsor-pro-site.vercel.app"}
        )
    }
    "OpenClaw FastStart" = @{
        URL = "https://openclaw-faststart.vercel.app"
        Stage = "Stage 3 Complete"
        Tasks = @{
            Marketing = @(
                @{text="Sales page copy"; done=$true}
                @{text="Workshop content"; done=$false}
                @{text="Traffic assets"; done=$false}
            )
            Delivery = @(
                @{text="Sales page deployed"; done=$true}
                @{text="Stripe setup"; done=$true}
                @{text="Workshop content"; done=$false}
                @{text="Email delivery"; done=$false}
            )
        }
        Resources = @(
            @{label="Sales Page"; value="https://openclaw-faststart.vercel.app"}
            @{label="Stripe"; value="$17 checkout working"}
        )
    }
}

# If specific business requested
if ($businessName) {
    if (-not $businesses.ContainsKey($businessName)) {
        Write-Host "❌ Business not found: $businessName" -ForegroundColor Red
        Write-Host "`nAvailable businesses:" -ForegroundColor Yellow
        $businesses.Keys | ForEach-Object { Write-Host "  - $_" }
        exit
    }
    
    $business = $businesses[$businessName]
    
    Write-Host "📦 $businessName" -ForegroundColor Green
    Write-Host "URL: $($business.URL)" -ForegroundColor White
    Write-Host "Stage: $($business.Stage)`n" -ForegroundColor White
    
    Write-Host "🔧 BOARD UPDATE INSTRUCTIONS:`n" -ForegroundColor Yellow
    
    Write-Host "1. Go to: https://vizard-clips-app.vercel.app/businesses`n"
    
    Write-Host "2. Add business: $businessName`n"
    
    Write-Host "3. Add tasks:" -ForegroundColor Cyan
    foreach ($column in $business.Tasks.Keys) {
        Write-Host "   $column Column:" -ForegroundColor White
        foreach ($task in $business.Tasks[$column]) {
            $status = if ($task.done) { "✅" } else { "⬜" }
            Write-Host "     $status $($task.text)"
        }
    }
    
    Write-Host "`n4. Add resources:" -ForegroundColor Cyan
    foreach ($resource in $business.Resources) {
        Write-Host "     $($resource.label): $($resource.value)" -ForegroundColor White
    }
    
    Write-Host "`n✅ Copy and paste this info into the board" -ForegroundColor Green
    
} else {
    # Show all businesses
    Write-Host "All businesses needing board updates:`n" -ForegroundColor Yellow
    
    $count = 1
    foreach ($name in $businesses.Keys) {
        $biz = $businesses[$name]
        Write-Host "$count. $name" -ForegroundColor Green
        Write-Host "   URL: $($biz.URL)" -ForegroundColor White
        Write-Host "   Stage: $($biz.Stage)`n" -ForegroundColor White
        $count++
    }
    
    Write-Host "Run with business name for detailed instructions:" -ForegroundColor Cyan
    Write-Host 'Example: .\update-business-board.ps1 -businessName "ReviewRush"' -ForegroundColor White
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📌 Board URL: https://vizard-clips-app.vercel.app/businesses" -ForegroundColor Yellow
