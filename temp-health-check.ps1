# Titanium Health Check Script

$results = @()

# API Tests
Write-Host "Testing APIs..."

# 1. Global Control API
try {
    $response = Invoke-WebRequest -Uri "https://api.globalcontrol.io/api/ai/me" -Headers @{"X-API-KEY"="9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"} -UseBasicParsing -TimeoutSec 10
    $results += "GC_API:$($response.StatusCode)"
} catch {
    $results += "GC_API:ERROR"
}

# 2. MintBird/PopLinks API
try {
    $response = Invoke-WebRequest -Uri "https://api.poplinks.io/api/ai/bridge-pages" -Headers @{"Authorization"="Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW"} -UseBasicParsing -TimeoutSec 10
    $results += "PL_API:$($response.StatusCode)"
} catch {
    $results += "PL_API:ERROR"
}

# 3. Course Sprout API
try {
    $response = Invoke-WebRequest -Uri "https://api.coursesprout.com/api/ai/courses" -Headers @{"X-API-KEY"="zekucmlwwgkwploxtbabyqepdkrpefavbvutviohnaiyzrhvellylumdgraovmqx"} -UseBasicParsing -TimeoutSec 10
    $results += "CS_API:$($response.StatusCode)"
} catch {
    $results += "CS_API:ERROR"
}

# 4. Letterman API
try {
    $response = Invoke-WebRequest -Uri "https://api.letterman.io/api/ai/publications" -Headers @{"X-API-KEY"="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY1YjI4N2E0YTYwZTRmYjc4NjFmNDMiLCJrZXkiOiIyMzYwMDFhMTJiY2JiZGEyMTE5YTg3YzU3OTg4NmI5YyIsImlkIjoiNjk4MjljYjU0NjQyYzFmNTE1MThhZDU5IiwiaWF0IjoxNzcwMTY3NDc3LCJleHAiOjE4MDE3MDM0Nzd9.4FT3rraAWG4OtcTMY0k_LtV37cOLAYqmUwT_SF9S0cE"} -UseBasicParsing -TimeoutSec 10
    $results += "LM_API:$($response.StatusCode)"
} catch {
    $results += "LM_API:ERROR"
}

# 5. SaaSOnboard API
try {
    $response = Invoke-WebRequest -Uri "https://api.saasonboard.com/api/ai/companies" -Headers @{"X-API-KEY"="a8de9a070154494f483fe16975937f1d"} -UseBasicParsing -TimeoutSec 10
    $results += "SOB_API:$($response.StatusCode)"
} catch {
    $results += "SOB_API:ERROR"
}

# URL Tests
Write-Host "Testing URLs..."

$urls = @(
    "https://chadnicely.com/members",
    "https://entouragemastermind.org",
    "https://q.selfmasteryco.net/japplication",
    "https://westvalleyshoutouts.com",
    "https://chadnicely.courseportal.io/login",
    "https://selfmasteryco.mintbird.com/",
    "https://selfmasteryco.globalcontrol.io",
    "https://admin.globalcontrol.io",
    "https://app.globalcontrol.io/appointment-booking/entrourage-mastermind"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        $results += "URL:$url=$($response.StatusCode)"
    } catch {
        $results += "URL:$url=ERROR"
    }
}

# Output results
$results | ForEach-Object { Write-Host $_ }
