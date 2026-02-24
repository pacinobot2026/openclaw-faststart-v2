# Global Control API Skill

Use this skill when interacting with Global Control CRM - managing contacts, tags, users, custom fields, and integrations.

## Authentication

**Base URL:** `https://api.globalcontrol.io/api`
**Auth Header:** `X-API-KEY: {token}`
**Token Location:** `credentials/titanium-api-keys.txt` → GlobalControl

## Quick Reference

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | Get all contacts |
| GET | `/contacts/{contactId}` | Get a contact |
| POST | `/contacts` | Create a contact |
| PUT | `/contacts/{contactId}` | Update a contact |
| DELETE | `/contacts/{contactId}` | Delete a contact |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tags` | Get all tags |
| GET | `/tags/{tagId}` | Get a tag |
| POST | `/tags` | Create a tag |
| PUT | `/tags/{tagId}` | Update a tag |
| DELETE | `/tags/{tagId}` | Delete a tag |

### Tag Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tag-groups` | Get all tag groups |
| GET | `/tag-groups/{groupId}` | Get a tag group |
| POST | `/tag-groups` | Create a tag group |
| PUT | `/tag-groups/{groupId}` | Update a tag group |
| DELETE | `/tag-groups/{groupId}` | Delete a tag group |

### Tag Labels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tags/labels` | Get all labels |
| GET | `/tags/labels/{labelId}` | Get a label |
| POST | `/tags/labels` | Create a label |
| PUT | `/tags/labels/{labelId}` | Update a label |
| DELETE | `/tags/labels/{labelId}` | Delete a label |

### Custom Fields
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/custom-fields` | Get all custom fields |
| GET | `/custom-fields/{customFieldId}` | Get a custom field |
| POST | `/custom-fields` | Create a custom field |
| PUT | `/custom-fields/{customFieldId}` | Update a custom field |
| DELETE | `/custom-fields/{customFieldId}` | Delete a custom field |

### Custom Field Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/custom-field-groups` | Get all groups |
| GET | `/custom-field-groups/{groupId}` | Get a group |
| POST | `/custom-field-groups` | Create a group |
| PUT | `/custom-field-groups/{groupId}` | Update a group |
| DELETE | `/custom-field-groups/{groupId}` | Delete a group |

### Users (Sub-Users)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sub-users` | Get all users |
| GET | `/sub-users/{userId}` | Get a user |
| POST | `/sub-users` | Create a user |
| PUT | `/sub-users/{userId}` | Update a user |
| DELETE | `/sub-users/{userId}` | Delete a user |

### Domains
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/domains` | Get all domains |
| GET | `/domains/{domainId}` | Get a domain |
| POST | `/domains` | Create a domain |
| DELETE | `/domains/{domainId}` | Delete a domain |
| POST | `/domains/smtp-domain-list` | Get integration domains |

### Integrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/integrations` | Get all integrations |
| GET | `/platform/connected-integrations` | Get connected integrations |
| GET | `/integrations/connected-categories` | Get connected categories |

### Broadcast Emails
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/broadcast-emails/process-emails-beta` | Send email |
| POST | `/broadcast-emails/create-field` | Create a field |
| POST | `/broadcast-emails/q-active-contact-counts-n` | Get activity levels |
| GET | `/broadcast-emails/get-fields` | Get fields |

### User Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get authenticated user info |

## Common Patterns

### PowerShell Request Template
```powershell
$headers = @{ 
    "X-API-KEY" = "YOUR_API_KEY"
    "Content-Type" = "application/json" 
}
$body = '{"key": "value"}'
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/ENDPOINT" -Headers $headers -Method POST -Body $body
```

### Create a Tag
```powershell
$body = '{"name": "Tag Name", "groupId": "GROUP_ID"}'
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/tags" -Headers $headers -Method POST -Body $body
```

### Create a Contact
```powershell
$body = '{"email": "user@example.com", "firstName": "John", "lastName": "Doe"}'
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/contacts" -Headers $headers -Method POST -Body $body
```

### Add Tag to Contact
```powershell
# Update contact with tagIds array
$body = '{"tagIds": ["TAG_ID_1", "TAG_ID_2"]}'
Invoke-RestMethod -Uri "https://api.globalcontrol.io/api/contacts/CONTACT_ID" -Headers $headers -Method PUT -Body $body
```

## Response Format

### Success
```json
{
  "type": "response",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Rate Limits
- Standard: 100 requests/minute
- Premium: 500 requests/minute

## Full API Documentation
See: `docs/apis/Global Control API.json.json`
