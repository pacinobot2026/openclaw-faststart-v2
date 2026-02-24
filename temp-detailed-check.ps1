# Detailed API Error Check

Write-Host "=== Global Control API ==="
try {
    $response = Invoke-WebRequest -Uri "https://api.globalcontrol.io/api/ai/me" -Headers @{"X-API-KEY"="9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"} -UseBasicParsing -TimeoutSec 10
    Write-Host "STATUS: $($response.StatusCode)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "STATUS: $($_.Exception.Response.StatusCode.Value__)"
}

Write-Host "`n=== Course Sprout API ==="
try {
    $response = Invoke-WebRequest -Uri "https://api.coursesprout.com/api/ai/courses" -Headers @{"X-API-KEY"="zekucmlwwgkwploxtbabyqepdkrpefavbvutviohnaiyzrhvellylumdgraovmqx"} -UseBasicParsing -TimeoutSec 10
    Write-Host "STATUS: $($response.StatusCode)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "STATUS: $($_.Exception.Response.StatusCode.Value__)"
}

Write-Host "`n=== Letterman API ==="
try {
    $response = Invoke-WebRequest -Uri "https://api.letterman.io/api/ai/publications" -Headers @{"X-API-KEY"="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY1YjI4N2E0YTYwZTRmYjc4NjFmNDMiLCJrZXkiOiIyMzYwMDFhMTJiY2JiZGEyMTE5YTg3YzU3OTg4NmI5YyIsImlkIjoiNjk4MjljYjU0NjQyYzFmNTE1MThhZDU5IiwiaWF0IjoxNzcwMTY3NDc3LCJleHAiOjE4MDE3MDM0Nzd9.4FT3rraAWG4OtcTMY0k_LtV37cOLAYqmUwT_SF9S0cE"} -UseBasicParsing -TimeoutSec 10
    Write-Host "STATUS: $($response.StatusCode)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "STATUS: $($_.Exception.Response.StatusCode.Value__)"
}

Write-Host "`n=== SaaSOnboard API ==="
try {
    $response = Invoke-WebRequest -Uri "https://api.saasonboard.com/api/ai/companies" -Headers @{"X-API-KEY"="a8de9a070154494f483fe16975937f1d"} -UseBasicParsing -TimeoutSec 10
    Write-Host "STATUS: $($response.StatusCode)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "STATUS: $($_.Exception.Response.StatusCode.Value__)"
}
