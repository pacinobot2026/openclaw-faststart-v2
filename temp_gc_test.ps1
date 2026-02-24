$headers = @{
    "X-API-KEY" = "9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"
}

# Try contacts with activity filter for clickers
$response = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/contacts?page=1&limit=1&activity=active_click" -Method GET -Headers $headers
$response.data | ConvertTo-Json -Depth 3
