# Create FastStart Blueprint product in Stripe

$apiKey = "sk_org_live_0fke1Efx057MbXF6q70oM7BW4020sCaC9chsd01aZI3q97u979r8593BL5G45Xp7tf85e5Pc5m778V3BM3Cl4yd7qi51v5y13BN7Gf70n6WK5Cy5T770s6xP05F0xg0aU9Z4eCn62S61r5rifAQdWef519KD7WTguxbigao20vuarj04pdUcfZAarZ5XW98101AeXHfmo1PvgVN4k6c16g4Cgt422q07"
$accountId = "acct_1T4AreCDxYH1XF8F"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Stripe-Version" = "2024-06-20"
    "Stripe-Context" = $accountId
    "Content-Type" = "application/x-www-form-urlencoded"
}

Write-Host "Creating FastStart Blueprint product..." -ForegroundColor Cyan

# Step 1: Create Product
$productBody = "name=The FastStart Blueprint&description=Launch your first micro-business in 37 minutes. The exact 6-phase system used to go from idea to first sale."

try {
    $product = Invoke-RestMethod -Uri "https://api.stripe.com/v1/products" `
        -Method Post `
        -Headers $headers `
        -Body $productBody

    $productId = $product.id
    Write-Host "Product created: $productId" -ForegroundColor Green
    
    # Step 2: Create Price
    $priceBody = "unit_amount=1700&currency=usd&product=$productId"
    
    $price = Invoke-RestMethod -Uri "https://api.stripe.com/v1/prices" `
        -Method Post `
        -Headers $headers `
        -Body $priceBody
    
    $priceId = $price.id
    Write-Host "Price created: $priceId ($17.00 USD)" -ForegroundColor Green
    
    # Step 3: Create Payment Link
    $linkBody = "line_items[0][price]=$priceId&line_items[0][quantity]=1&after_completion[type]=hosted_confirmation&after_completion[hosted_confirmation][custom_message]=Success! Check your email for The FastStart Blueprint."
    
    $link = Invoke-RestMethod -Uri "https://api.stripe.com/v1/payment_links" `
        -Method Post `
        -Headers $headers `
        -Body $linkBody
    
    $paymentUrl = $link.url
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Payment Link: $paymentUrl" -ForegroundColor Cyan
    Write-Host ""
    
    # Save result
    @{
        product_id = $productId
        price_id = $priceId
        payment_url = $paymentUrl
        amount = "$17.00"
        created = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    } | ConvertTo-Json | Out-File "faststart-stripe-result.json"
    
    Write-Host "Details saved to faststart-stripe-result.json" -ForegroundColor Gray
    
    return $paymentUrl
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response -ForegroundColor Red
    exit 1
}
