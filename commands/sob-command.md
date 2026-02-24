# /sob Command - SaaSOnboard Credential Lookup

**Purpose:** Look up user credentials in SaaSOnboard system.

**Created:** 2026-02-20  
**Source:** Chad's instructions on 2026-02-19

---

## Workflow

When user says `/sob`:

### Step 1: Ask for Name and Email

```
What's their name?
What's their email?
```

Wait for both responses.

### Step 2: Ask What Product

```
Which product do they need access to?

Available products:
• MintBird (81)
• PopLinks (72)
• Course Sprout (97)
• Letterman (86)
• Global Control (92)
• QuizForma (73)
• Or which bundle? (Platinum, Titanium, Ignite)
```

Wait for product selection.

### Step 3: Search SOB

Use the API to search for that email in the specified product.

```powershell
$headers = @{
    "Authorization" = "SOB_API_KEY"
    "Content-Type" = "application/json"
}

# Attempt to get user info
# NOTE: SOB may not expose passwords via API
```

### Step 4: Show Results

**If user found:**
```
✅ Found in SaaSOnboard!

Name: [name]
Email: [email]
Product: [product name]
Access Level: [level if available]

⚠️ Password: Not exposed via API for security

Options:
1. Web dashboard: https://app.saasonboard.com
2. Reset password (creates new one)
3. User can use "Forgot Password" at login
```

**If user NOT found:**
```
❌ No account found for [email] in [product]

Would you like to:
1. Create new access for them?
2. Check a different product?
3. Search in a bundle instead?
```

---

## CRITICAL RULES

### ❌ DO NOT

- **DO NOT** call `/add-user` when trying to RETRIEVE credentials
- This RESETS the password and loses the original
- Only use `/add-user` when explicitly asked to CREATE or RESET

### ✅ DO

- Use web dashboard link for password retrieval
- Clearly state if password is not available via API
- Offer to CREATE if they want new access
- Confirm before resetting any existing passwords

---

## Examples

### Example 1: Lookup Existing User

**User says:** `/sob`

**Agent:**
```
What's their name?
```

**User:** `Karthik`

**Agent:**
```
What's their email?
```

**User:** `karthik@jargonhanders.com`

**Agent:**
```
Which product do they need access to?

• MintBird
• PopLinks
• Course Sprout
• Letterman
• Global Control
```

**User:** `MintBird`

**Agent:**
```
🔍 Searching SaaSOnboard for karthik@jargonhanders.com in MintBird...

[performs API search]

✅ Found in SaaSOnboard!

Name: Karthik
Email: karthik@jargonhanders.com
Product: MintBird (ID: 81)

⚠️ Password: Not exposed via API for security reasons

To retrieve password:
• Web dashboard: https://app.saasonboard.com
• Or reset it (creates new password)

Would you like me to reset their password?
```

### Example 2: User Not Found

**Agent:**
```
❌ karthik@jargonhanders.com not found in MintBird

Options:
1. Create new MintBird access?
2. Check a different product?
3. Search bundles instead?
```

---

## Implementation

This workflow should be implemented as either:
1. A dedicated skill (skills/sob-lookup/)
2. Enhanced saasonboard skill with `/sob` trigger
3. Part of SHORTCODES.md

---

## Related Files

- `skills/saasonboard/SKILL.md` - Full SOB API docs
- `skills/saasonboard/retrieve-credentials.ps1` - Script version
- `credentials/titanium-api-keys.txt` - API key storage

---

**Last Updated:** 2026-02-20 1:15 AM  
**Status:** Draft - Ready for Chad's review
