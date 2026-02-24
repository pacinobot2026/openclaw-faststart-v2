$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY1YjI4N2E0YTYwZTRmYjc4NjFmNDMiLCJrZXkiOiIyMzYwMDFhMTJiY2JiZGEyMTE5YTg3YzU3OTg4NmI5YyIsImlkIjoiNjk4MjljYjU0NjQyYzFmNTE1MThhZDU5IiwiaWF0IjoxNzcwMTY3NDc3LCJleHAiOjE4MDE3MDM0Nzd9.4FT3rraAWG4OtcTMY0k_LtV37cOLAYqmUwT_SF9S0cE"
    "Content-Type" = "application/json"
}

$baseUrl = "https://api.letterman.ai/api/ai/newsletters"

# Article 1: West Valley Shoutouts - Lunar New Year
$body1 = @{
    storageId = "677895a2584a3ce5878fcf5b"
    type = "ARTICLE"
    articleOptions = @{
        contentFrom = "CONTENT"
        content = "Lunar New Year Parade in Downtown Summerlin celebrating Asian heritage with cultural performances, traditional food vendors, dragon dances, and family-friendly activities. The event honors Southern Nevada's growing Asian community."
        wordsCount = 350
        keywords = "Summerlin,Lunar New Year,Asian heritage,parade,Las Vegas events"
        aiModel = "OPEN_AI"
        keepOriginal = $false
    }
} | ConvertTo-Json -Depth 10

try {
    $response1 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $body1
    Write-Host "SUCCESS Article 1: $($response1.data._id)"
    $response1 | ConvertTo-Json -Depth 10 | Out-File -FilePath "article1-response.json"
} catch {
    Write-Host "Error 1: $($_.Exception.Message)"
}

# Article 2: Save The Doggy - Dog Adoption
$body2 = @{
    storageId = "68a78eba3ce3e647df7fefaa"
    type = "ARTICLE"
    articleOptions = @{
        contentFrom = "CONTENT"
        content = "Local animal shelter in Las Vegas is hosting a special weekend adoption event featuring rescue dogs looking for forever homes. The event includes meet-and-greets, reduced adoption fees, and expert advice on pet care."
        wordsCount = 350
        keywords = "dog adoption,Las Vegas,animal rescue,pet adoption,rescue dogs"
        aiModel = "OPEN_AI"
        keepOriginal = $false
    }
} | ConvertTo-Json -Depth 10

try {
    $response2 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $body2
    Write-Host "SUCCESS Article 2: $($response2.data._id)"
    $response2 | ConvertTo-Json -Depth 10 | Out-File -FilePath "article2-response.json"
} catch {
    Write-Host "Error 2: $($_.Exception.Message)"
}

# Article 3: Vegas Fork - Farm to Table Restaurant
$body3 = @{
    storageId = "68a790aa3ce3e647df7ff272"
    type = "ARTICLE"
    articleOptions = @{
        contentFrom = "CONTENT"
        content = "New farm-to-table restaurant opens in Las Vegas featuring locally sourced ingredients from Nevada farms. The menu changes seasonally and showcases fresh produce, grass-fed meats, and artisanal products from regional suppliers."
        wordsCount = 350
        keywords = "Las Vegas restaurant,farm to table,local food,Nevada cuisine,new restaurant"
        aiModel = "OPEN_AI"
        keepOriginal = $false
    }
} | ConvertTo-Json -Depth 10

try {
    $response3 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $body3
    Write-Host "SUCCESS Article 3: $($response3.data._id)"
    $response3 | ConvertTo-Json -Depth 10 | Out-File -FilePath "article3-response.json"
} catch {
    Write-Host "Error 3: $($_.Exception.Message)"
}
