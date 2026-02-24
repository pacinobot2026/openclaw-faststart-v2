# Re-engagement Campaign Implementation Helpers

# Constants
$SCRIPT:MAX_PER_HOUR = 400
$SCRIPT:WARMUP_COUNT = 50

# Pace configurations
$SCRIPT:PACE_CONFIG = @{
    mild = @{ start = 50; increment = 50 }       # +50/hour daily
    normal = @{ start = 100; increment = 100 }   # +100/hour daily  
    aggressive = @{ start = 200; increment = 200 } # Start high, +200 daily
}

function Get-HourlyRate {
    param([string]$Pace, [int]$Day)
    
    if ($Day -eq 1) { return $null }  # Day 1 is warmup (not hourly)
    
    $config = $SCRIPT:PACE_CONFIG[$Pace]
    $dayIndex = $Day - 2  # Day 2 = index 0
    
    $rate = if ($config.multiplier) {
        $config.start * [Math]::Pow($config.multiplier, $dayIndex)
    } else {
        $config.start + ($config.increment * $dayIndex)
    }
    
    return [Math]::Min([int]$rate, $SCRIPT:MAX_PER_HOUR)
}

function Get-CampaignSchedule {
    param([int]$TotalContacts, [string]$Pace)
    
    $schedule = @()
    $remaining = $TotalContacts
    
    # Day 1: Warmup (50 at once)
    $warmup = [Math]::Min($SCRIPT:WARMUP_COUNT, $remaining)
    $schedule += [PSCustomObject]@{
        Day = 1
        PerHour = $null
        Hours = 0
        Total = $warmup
        Note = "Warmup - sent at once"
    }
    $remaining -= $warmup
    
    # Day 2+: Hourly pacing
    $day = 2
    while ($remaining -gt 0 -and $day -le 100) {
        $rate = Get-HourlyRate -Pace $Pace -Day $day
        $hours = [Math]::Ceiling($remaining / $rate)
        $todayTotal = [Math]::Min($rate * $hours, $remaining)
        
        $schedule += [PSCustomObject]@{
            Day = $day
            PerHour = $rate
            Hours = $hours
            Total = $todayTotal
        }
        
        $remaining -= $todayTotal
        $day++
    }
    
    return $schedule
}

function Get-TotalDays {
    param([int]$TotalContacts, [string]$Pace)
    
    $schedule = Get-CampaignSchedule -TotalContacts $TotalContacts -Pace $Pace
    return $schedule.Count
}

function Import-ContactBank {
    param([string]$FilePath, [string]$CampaignId)
    
    $contacts = @()
    $stats = @{ imported = 0; duplicates = 0; invalid = 0 }
    
    # Read CSV
    $csv = Import-Csv $FilePath
    $emailCol = ($csv[0].PSObject.Properties.Name | Where-Object { $_ -match 'email' })[0]
    
    $seen = @{}
    $emailRegex = '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    
    foreach ($row in $csv) {
        $email = $row.$emailCol.ToLower().Trim()
        
        if ($seen.ContainsKey($email)) { $stats.duplicates++; continue }
        if ($email -notmatch $emailRegex) { $stats.invalid++; continue }
        
        $seen[$email] = $true
        $contacts += @{
            email = $email
            firstName = $row.firstName -or ""
            lastName = $row.lastName -or ""
            processed = $false
        }
        $stats.imported++
    }
    
    # Save
    $dir = "campaigns/reengagement/$CampaignId"
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    $contacts | ConvertTo-Json -Depth 3 | Out-File "$dir/contact-bank.json"
    
    return @{ stats = $stats; contacts = $contacts }
}

function Send-Batch {
    param([string]$CampaignId, [int]$Count, [string]$TagId, [string]$GcApiKey)
    
    $dir = "campaigns/reengagement/$CampaignId"
    $contacts = Get-Content "$dir/contact-bank.json" | ConvertFrom-Json
    $batch = $contacts | Where-Object { -not $_.processed } | Select-Object -First $Count
    
    $headers = @{
        'X-API-KEY' = $GcApiKey
        'Content-Type' = 'application/json'
    }
    
    $sent = 0
    foreach ($c in $batch) {
        try {
            $body = @{ email = $c.email; firstName = $c.firstName; lastName = $c.lastName } | ConvertTo-Json
            $resp = Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/contacts" -Method POST -Headers $headers -Body $body
            Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ai/tags/fire-tag/$TagId" -Method POST -Headers $headers -Body (@{ contactId = $resp.data._id } | ConvertTo-Json) | Out-Null
            $c.processed = $true
            $sent++
        } catch {
            Write-Warning "Failed: $($c.email) - $($_.Exception.Message)"
        }
    }
    
    $contacts | ConvertTo-Json -Depth 3 | Out-File "$dir/contact-bank.json"
    return $sent
}
