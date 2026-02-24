# Freshdesk API PowerShell Examples
# ===================================
# Replace {DOMAIN} with your Freshdesk subdomain
# Replace {API_KEY} with your API key

# ====================
# SETUP - Run this first
# ====================

$FreshdeskDomain = "yourcompany"  # e.g., "acme" for acme.freshdesk.com
$ApiKey = "YOUR_API_KEY"

# Build auth header (Basic auth with API key)
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${ApiKey}:X"))
$headers = @{
    "Authorization" = "Basic $base64Auth"
    "Content-Type" = "application/json"
}
$baseUrl = "https://${FreshdeskDomain}.freshdesk.com/api/v2"

# ====================
# TICKETS
# ====================

# List all open tickets
Invoke-RestMethod -Uri "$baseUrl/tickets?filter=new_and_my_open" -Method GET -Headers $headers

# Get a specific ticket
$ticketId = 1
Invoke-RestMethod -Uri "$baseUrl/tickets/$ticketId" -Method GET -Headers $headers

# Get ticket with requester and conversations embedded
Invoke-RestMethod -Uri "$baseUrl/tickets/$ticketId`?include=requester,conversations" -Method GET -Headers $headers

# Create a new ticket
$newTicket = @{
    email = "customer@example.com"
    subject = "Need help with product"
    description = "<p>I'm having an issue with...</p>"
    status = 2  # Open
    priority = 2  # Medium
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/tickets" -Method POST -Headers $headers -Body $newTicket

# Update a ticket (change status to resolved)
$updateTicket = @{
    status = 4  # Resolved
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/tickets/$ticketId" -Method PUT -Headers $headers -Body $updateTicket

# Search/filter tickets
$query = [System.Web.HttpUtility]::UrlEncode('"status:2 AND priority:4"')
Invoke-RestMethod -Uri "$baseUrl/search/tickets?query=$query" -Method GET -Headers $headers

# Count open tickets by status
$openTickets = Invoke-RestMethod -Uri "$baseUrl/tickets?filter=new_and_my_open&per_page=1" -Method GET -Headers $headers
# Note: Check the 'total' header for count

# ====================
# CONVERSATIONS
# ====================

# List all conversations for a ticket
Invoke-RestMethod -Uri "$baseUrl/tickets/$ticketId/conversations" -Method GET -Headers $headers

# Reply to a ticket
$reply = @{
    body = "<p>Thank you for contacting us. We'll look into this.</p>"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/tickets/$ticketId/reply" -Method POST -Headers $headers -Body $reply

# Add a private note
$note = @{
    body = "<p>Internal note: Customer is a VIP</p>"
    private = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/tickets/$ticketId/notes" -Method POST -Headers $headers -Body $note

# ====================
# CONTACTS
# ====================

# List all contacts
Invoke-RestMethod -Uri "$baseUrl/contacts" -Method GET -Headers $headers

# Get a specific contact
$contactId = 1
Invoke-RestMethod -Uri "$baseUrl/contacts/$contactId" -Method GET -Headers $headers

# Search contacts by email
$email = "customer@example.com"
Invoke-RestMethod -Uri "$baseUrl/contacts?email=$email" -Method GET -Headers $headers

# Create a new contact
$newContact = @{
    name = "John Doe"
    email = "john.doe@example.com"
    phone = "+1234567890"
    job_title = "CEO"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/contacts" -Method POST -Headers $headers -Body $newContact

# Update a contact
$updateContact = @{
    job_title = "CTO"
    custom_fields = @{
        vip_level = "Gold"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/contacts/$contactId" -Method PUT -Headers $headers -Body $updateContact

# ====================
# AGENTS
# ====================

# Get current agent (me)
Invoke-RestMethod -Uri "$baseUrl/agents/me" -Method GET -Headers $headers

# List all agents
Invoke-RestMethod -Uri "$baseUrl/agents" -Method GET -Headers $headers

# ====================
# COMPANIES
# ====================

# List all companies
Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET -Headers $headers

# Create a company
$newCompany = @{
    name = "Acme Corp"
    domains = @("acme.com", "acme.io")
    description = "Enterprise customer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/companies" -Method POST -Headers $headers -Body $newCompany

# ====================
# GROUPS
# ====================

# List all groups
Invoke-RestMethod -Uri "$baseUrl/groups" -Method GET -Headers $headers

# ====================
# PRODUCTS
# ====================

# List all products
Invoke-RestMethod -Uri "$baseUrl/products" -Method GET -Headers $headers

# ====================
# CANNED RESPONSES
# ====================

# List all canned responses
Invoke-RestMethod -Uri "$baseUrl/canned_responses" -Method GET -Headers $headers

# ====================
# SOLUTIONS (Knowledge Base)
# ====================

# List all solution categories
Invoke-RestMethod -Uri "$baseUrl/solutions/categories" -Method GET -Headers $headers

# Search knowledge base
$searchTerm = [System.Web.HttpUtility]::UrlEncode("password reset")
Invoke-RestMethod -Uri "$baseUrl/search/solutions?term=$searchTerm" -Method GET -Headers $headers

# ====================
# TIME ENTRIES
# ====================

# List time entries for a ticket
Invoke-RestMethod -Uri "$baseUrl/tickets/$ticketId/time_entries" -Method GET -Headers $headers

# Create a time entry
$timeEntry = @{
    agent_id = 1
    time_spent = "01:30"  # 1 hour 30 minutes
    billable = $true
    note = "Troubleshooting issue"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/tickets/$ticketId/time_entries" -Method POST -Headers $headers -Body $timeEntry

# ====================
# BULK OPERATIONS
# ====================

# Bulk update tickets
$bulkUpdate = @{
    ids = @(1, 2, 3)
    properties = @{
        status = 4  # Resolved
        group_id = 5
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/tickets/bulk_update" -Method PUT -Headers $headers -Body $bulkUpdate

# ====================
# HELPER FUNCTIONS
# ====================

function Get-FreshdeskOpenTicketCount {
    param(
        [string]$Domain,
        [string]$ApiKey
    )
    
    $base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${ApiKey}:X"))
    $headers = @{
        "Authorization" = "Basic $base64Auth"
        "Content-Type" = "application/json"
    }
    
    # Filter for open tickets (status 2) and count
    $response = Invoke-WebRequest -Uri "https://${Domain}.freshdesk.com/api/v2/search/tickets?query=%22status:2%22" -Method GET -Headers $headers
    $data = $response.Content | ConvertFrom-Json
    
    return @{
        count = $data.total
        tickets = $data.results
    }
}

function Get-FreshdeskTicketsByPriority {
    param(
        [string]$Domain,
        [string]$ApiKey,
        [int]$Priority = 4  # Default to Urgent
    )
    
    $base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${ApiKey}:X"))
    $headers = @{
        "Authorization" = "Basic $base64Auth"
        "Content-Type" = "application/json"
    }
    
    $query = [System.Web.HttpUtility]::UrlEncode("`"priority:$Priority AND status:2`"")
    $response = Invoke-RestMethod -Uri "https://${Domain}.freshdesk.com/api/v2/search/tickets?query=$query" -Method GET -Headers $headers
    
    return $response
}

# ====================
# RATE LIMIT HANDLING
# ====================

function Invoke-FreshdeskApiWithRetry {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [hashtable]$Headers,
        [string]$Body = $null,
        [int]$MaxRetries = 3
    )
    
    $retryCount = 0
    while ($retryCount -lt $MaxRetries) {
        try {
            $params = @{
                Uri = $Uri
                Method = $Method
                Headers = $Headers
            }
            if ($Body) {
                $params.Body = $Body
            }
            
            $response = Invoke-WebRequest @params
            
            # Log rate limit info
            Write-Host "Rate Limit: $($response.Headers['X-RateLimit-Remaining'])/$($response.Headers['X-RateLimit-Total'])"
            
            return $response.Content | ConvertFrom-Json
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                $retryAfter = $_.Exception.Response.Headers["Retry-After"]
                if (-not $retryAfter) { $retryAfter = 60 }
                Write-Host "Rate limited. Waiting $retryAfter seconds..."
                Start-Sleep -Seconds ([int]$retryAfter + 1)
                $retryCount++
            }
            else {
                throw
            }
        }
    }
    
    throw "Max retries exceeded"
}
