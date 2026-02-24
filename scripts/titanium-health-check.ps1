# Titanium Platform Health Check
# Tests all APIs and critical URLs

$results = @()

# API Tests
Write-Host "`n🔍 Testing APIs..." -ForegroundColor Cyan

# 1. Global Control API
try {
    $r = Invoke-WebRequest -Uri 'https://api.globalcontrol.io/api/ai/me' `
        -Headers @{'X-API-KEY' = '9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219'} `
        -UseBasicParsing -ErrorAction Stop -TimeoutSec 10
    $results += "✅ Global Control API: ONLINE ($($r.StatusCode))"
} catch {
    $results += "❌ Global Control API: OFFLINE ($($_.Exception.Message))"
}

# 2. MintBird/PopLinks API
try {
    $r = Invoke-WebRequest -Uri 'https://api.poplinks.io/api/ai/bridge-pages' `
        -Headers @{'Authorization' = 'Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW'} `
        -UseBasicParsing -ErrorAction Stop -TimeoutSec 10
    $results += "✅ MintBird/PopLinks API: ONLINE ($($r.StatusCode))"
} catch {
    $results += "❌ MintBird/PopLinks API: OFFLINE ($($_.Exception.Message))"
}

# 3. Course Sprout API
try {
    $r = Invoke-WebRequest -Uri 'https://api.coursesprout.com/api/ai/courses' `
        -Headers @{'api-key' = 'zekucmlwwgkwploxtbabyqepdkrpefavbvutviohnaiyzrhvellylumdgraovmqx'} `
        -UseBasicParsing -ErrorAction Stop -TimeoutSec 10
    $results += "✅ Course Sprout API: ONLINE ($($r.StatusCode))"
} catch {
    $results += "⚠️ Course Sprout API: WARNING ($($_.Exception.Message))"
}

# 4. Letterman API
try {
    $r = Invoke-WebRequest -Uri 'https://api.letterman.ai/api/ai/newsletters-storage' `
        -Headers @{'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY1YjI4N2E0YTYwZTRmYjc4NjFmNDMiLCJrZXkiOiIyMzYwMDFhMTJiY2JiZGEyMTE5YTg3YzU3OTg4NmI5YyIsImlkIjoiNjk4MjljYjU0NjQyYzFmNTE1MThhZDU5IiwiaWF0IjoxNzcwMTY3NDc3LCJleHAiOjE4MDE3MDM0Nzd9.4FT3rraAWG4OtcTMY0k_LtV37cOLAYqmUwT_SF9S0cE'} `
        -UseBasicParsing -ErrorAction Stop -TimeoutSec 10
    $results += "✅ Letterman API: ONLINE ($($r.StatusCode))"
} catch {
    $results += "❌ Letterman API: OFFLINE ($($_.Exception.Message))"
}

# 5. SaaSOnboard API
try {
    $r = Invoke-WebRequest -Uri 'https://api.saasonboard.com/api/ai/companies' `
        -Headers @{'X-API-KEY' = 'a8de9a070154494f483fe16975937f1d'} `
        -UseBasicParsing -ErrorAction Stop -TimeoutSec 10
    $results += "✅ SaaSOnboard API: ONLINE ($($r.StatusCode))"
} catch {
    $results += "⚠️ SaaSOnboard API: WARNING ($($_.Exception.Message))"
}

# URL Tests
Write-Host "`n🌐 Testing URLs..." -ForegroundColor Cyan

$urls = @(
    'https://chadnicely.com/members',
    'https://entouragemastermind.org',
    'https://q.selfmasteryco.net/japplication',
    'https://westvalleyshoutouts.com',
    'https://chadnicely.courseportal.io/login',
    'https://selfmasteryco.mintbird.com/',
    'https://selfmasteryco.globalcontrol.io',
    'https://admin.globalcontrol.io',
    'https://app.globalcontrol.io/appointment-booking/entrourage-mastermind'
)

foreach ($url in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -ErrorAction Stop -TimeoutSec 10
        $results += "✅ $url : ONLINE ($($r.StatusCode))"
    } catch {
        $status = if ($_.Exception.Response) { $_.Exception.Response.StatusCode } else { "UNREACHABLE" }
        $results += "❌ $url : OFFLINE ($status)"
    }
}

# Output results
Write-Host "`n📊 RESULTS:" -ForegroundColor Yellow
$results | ForEach-Object { Write-Host $_ }

# Count issues
$issues = ($results | Where-Object { $_ -match '❌|⚠️' }).Count
$total = $results.Count

Write-Host "`n🎯 SUMMARY: $issues issues out of $total checks" -ForegroundColor $(if ($issues -eq 0) { 'Green' } else { 'Yellow' })
