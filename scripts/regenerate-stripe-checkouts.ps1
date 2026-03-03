# Regenerate Stripe Checkout Sessions (runs every 12 hours via cron)
# Fixes the 24-hour expiration issue

$ErrorActionPreference = "Stop"

Write-Host "Regenerating Stripe checkout sessions..."

$stripeKey = "sk_org_live_0fke1Efx057MbXF6q70oM7BW4020sCaC9chsd01aZI3q97u979r8593BL5G45Xp7tf85e5Pc5m778V3BM3Cl4yd7qi51v5y13BN7Gf70n6WK5Cy5T770s6xP05F0xg0aU9Z4eCn62S61r5rifAQdWef519KD7WTguxbigao20vuarj04pdUcfZAarZ5XW98101AeXHfmo1PvgVN4k6c16g4Cgt422q07"
$headers = @{
    Authorization = "Bearer $stripeKey"
    "Stripe-Context" = "acct_1T4AreCDxYH1XF8F"
    "Stripe-Version" = "2024-12-18.acacia"
    "Content-Type" = "application/x-www-form-urlencoded"
}

$successUrl = "https://openclaw-playbook-sales-pacino-bots-projects.vercel.app/thank-you"
$cancelUrl = "https://openclaw-playbook-sales-pacino-bots-projects.vercel.app"

# Product 1: Core Playbook
Write-Host "Creating Core Playbook checkout..."
$body1 = "mode=payment&line_items[0][price_data][currency]=usd&line_items[0][price_data][unit_amount]=49700&line_items[0][price_data][product_data][name]=OpenClaw Automation Playbook&line_items[0][price_data][product_data][description]=Complete 30-day system&line_items[0][quantity]=1&success_url=$successUrl&cancel_url=$cancelUrl"
$result1 = Invoke-RestMethod -Uri "https://api.stripe.com/v1/checkout/sessions" -Method Post -Headers $headers -Body $body1
$coreUrl = $result1.url

# Product 2: Swipe File
Write-Host "Creating Swipe File checkout..."
$body2 = "mode=payment&line_items[0][price_data][currency]=usd&line_items[0][price_data][unit_amount]=9700&line_items[0][price_data][product_data][name]=Automation Swipe File&line_items[0][quantity]=1&success_url=$successUrl&cancel_url=$cancelUrl"
$result2 = Invoke-RestMethod -Uri "https://api.stripe.com/v1/checkout/sessions" -Method Post -Headers $headers -Body $body2
$swipeUrl = $result2.url

# Product 3: DWY Membership
Write-Host "Creating DWY Membership checkout..."
$body3 = "mode=subscription&line_items[0][price_data][currency]=usd&line_items[0][price_data][unit_amount]=19700&line_items[0][price_data][recurring][interval]=month&line_items[0][price_data][product_data][name]=Done-With-You Membership&line_items[0][quantity]=1&success_url=$successUrl&cancel_url=$cancelUrl"
$result3 = Invoke-RestMethod -Uri "https://api.stripe.com/v1/checkout/sessions" -Method Post -Headers $headers -Body $body3
$dwyUrl = $result3.url

# Product 4: VIP Day
Write-Host "Creating VIP Day checkout..."
$body4 = "mode=payment&line_items[0][price_data][currency]=usd&line_items[0][price_data][unit_amount]=299700&line_items[0][price_data][product_data][name]=VIP Done-For-You Day&line_items[0][quantity]=1&success_url=$successUrl&cancel_url=$cancelUrl"
$result4 = Invoke-RestMethod -Uri "https://api.stripe.com/v1/checkout/sessions" -Method Post -Headers $headers -Body $body4
$vipUrl = $result4.url

Write-Host "All checkouts created!"

# Update sales page
Write-Host "Updating sales page..."
$pagePath = "C:\Users\Administrator\.openclaw\workspace\openclaw-playbook-sales\app\page.tsx"
$content = Get-Content $pagePath -Raw

# Extract just the URL part (before the #)
$coreUrlShort = $coreUrl -replace '#.*$', ''

# Replace both CTA button URLs
$content = $content -replace 'href="https://checkout\.stripe\.com/c/pay/cs_live_[^"]*"(\s+className="inline-block bg-yellow-400[^>]*>\s*Get The Playbook)', "href=`"$coreUrlShort`"`$1"
$content = $content -replace 'href="https://checkout\.stripe\.com/c/pay/cs_live_[^"]*"(\s+className="inline-block bg-yellow-400[^>]*>\s*Yes! Give Me The Playbook)', "href=`"$coreUrlShort`"`$1"

Set-Content $pagePath -Value $content -NoNewline

# Update STRIPE-LINKS.md
Write-Host "Updating STRIPE-LINKS.md..."
$timestamp = Get-Date -Format "yyyy-MM-dd h:mm tt"
$linksContent = "# Stripe Checkout Links - OpenClaw Playbook`n`n"
$linksContent += "**Updated:** $timestamp CST`n"
$linksContent += "**Valid for:** 24 hours from creation`n`n"
$linksContent += "## Product 1: Core Playbook (`$497)`n"
$linksContent += "**Checkout:** $coreUrl`n`n"
$linksContent += "## Product 2: Automation Swipe File (`$97)`n"
$linksContent += "**Checkout:** $swipeUrl`n`n"
$linksContent += "## Product 3: Done-With-You Membership (`$197/month)`n"
$linksContent += "**Checkout:** $dwyUrl`n`n"
$linksContent += "## Product 4: VIP Done-For-You Day (`$2,997)`n"
$linksContent += "**Checkout:** $vipUrl`n`n"
$linksContent += "---`n`n"
$linksContent += "**AUTO-REGENERATED:** These links are automatically refreshed every 12 hours via cron.`n`n"
$linksContent += "**Payment Processing:** Nicely Media LLC Stripe Account`n"

Set-Content "C:\Users\Administrator\.openclaw\workspace\openclaw-playbook-sales\STRIPE-LINKS.md" -Value $linksContent

# Commit and push
Write-Host "Deploying to Vercel..."
Set-Location "C:\Users\Administrator\.openclaw\workspace\openclaw-playbook-sales"
git add -A
git commit -m "Auto-update Stripe checkout links (cron)"
git push

Write-Host "Complete! Sales page updated and deployed."
Write-Host "Core URL: $coreUrlShort"
