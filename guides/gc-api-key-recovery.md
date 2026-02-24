# Global Control API Key Recovery

**Issue:** API returning 401 Unauthorized since 2026-02-14

**Impact:** Can't use GC API for:
- Contact management
- Tag operations
- Broadcast emails via API
- Sub-user management

## How to Regenerate

1. **Log into Global Control:**
   - URL: https://app.globalcontrol.io
   - Use credentials from `credentials/credentials-titanium.txt`

2. **Navigate to API Settings:**
   - Click Settings (gear icon)
   - Select "API Access" or "Developer Settings"

3. **Generate New Key:**
   - Click "Regenerate" or "Create New Key"
   - Copy the full key (it's long, ~64 characters)

4. **Give Key to Pacino:**
   Just paste it in chat:
   ```
   Here's the new GC API key: [your-key]
   ```

5. **I'll Update:**
   - Save to `credentials/titanium-api-keys.txt`
   - Test with health check

## Current Key Location

File: `credentials/titanium-api-keys.txt`
Line: `GlobalControl: 9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219`

## Test Command (Manual)

```powershell
$headers = @{"X-API-KEY"="YOUR_NEW_KEY"}
Invoke-WebRequest -Uri "https://api.globalcontrol.io/api/me" -Headers $headers
```

Expected: 200 OK with user data

## Why Keys Expire

GC API keys may expire due to:
- Security rotation policy
- Account changes
- Manual revocation
- Inactivity (unlikely)

## Workaround While Key is Down

I can still use:
- Browser automation (if Chad attaches tab)
- Other Titanium APIs (PopLinks, Course Sprout, Letterman, SaaSOnboard all working)

---

*Guide created: 2026-02-15*
*Issue detected: 2026-02-14 10:00 AM health check*
