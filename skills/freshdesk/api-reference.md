# Freshdesk API v2 - Complete Endpoint Reference

**Base URL:** `https://{FRESHDESK_DOMAIN}/api/v2`  
**Auth:** Basic Auth (API_KEY:X)  
**Content-Type:** application/json

---

## 1. TICKETS

### 1.1 Create a Ticket
**POST** `/tickets`

**Required Fields (one of):**
- `requester_id` - User ID of requester
- `email` - Email of requester (creates contact if new)
- `phone` - Phone of requester
- `twitter_id` - Twitter handle

**Optional Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `subject` | string | Ticket subject |
| `description` | string | HTML content of ticket |
| `status` | integer | 2=Open, 3=Pending, 4=Resolved, 5=Closed |
| `priority` | integer | 1=Low, 2=Medium, 3=High, 4=Urgent |
| `source` | integer | 1=Email, 2=Portal, 3=Phone, 7=Chat, 9=Widget, 10=Outbound |
| `type` | string | Ticket type |
| `responder_id` | integer | Agent ID to assign |
| `group_id` | integer | Group ID to assign |
| `product_id` | integer | Product ID |
| `company_id` | integer | Company ID |
| `tags` | array | List of tags |
| `cc_emails` | array | CC email addresses |
| `due_by` | datetime | Due date |
| `fr_due_by` | datetime | First response due |
| `custom_fields` | object | Custom field values |
| `attachments[]` | file | File attachments (multipart/form-data) |
| `parent_id` | integer | Parent ticket ID (for child tickets) |
| `related_ticket_ids` | array | Related tracker ticket IDs |

**Example Request:**
```json
{
  "email": "customer@example.com",
  "subject": "Support needed",
  "description": "I need help with...",
  "status": 2,
  "priority": 2
}
```

**Response:** 201 Created with ticket object

---

### 1.2 View a Ticket
**GET** `/tickets/{id}`

**Query Parameters:**
| Param | Description |
|-------|-------------|
| `include` | Embed: `conversations`, `requester`, `company`, `stats`, `sla_policy` |

**Example:** `GET /tickets/123?include=requester,conversations`

---

### 1.3 List All Tickets
**GET** `/tickets`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `filter` | string | `new_and_my_open`, `watching`, `spam`, `deleted` |
| `requester_id` | integer | Filter by requester |
| `email` | string | Filter by requester email |
| `company_id` | integer | Filter by company |
| `updated_since` | datetime | Modified after this time |
| `order_by` | string | `created_at`, `due_by`, `updated_at`, `status` |
| `order_type` | string | `asc` or `desc` |
| `include` | string | `requester`, `stats`, `description` |
| `page` | integer | Page number |
| `per_page` | integer | Results per page (max 100) |

---

### 1.4 Filter Tickets (Search)
**GET** `/search/tickets?query="..."`

**Query Syntax:** Field operators in double quotes

**Operators:** `:` (equals), `>` `<` `>=` `<=` (comparison)

**Searchable Fields:**
- `agent_id`, `group_id`, `priority`, `status`, `tag`
- `type`, `due_by`, `fr_due_by`, `created_at`, `updated_at`
- `requester_id`, `company_id`, `product_id`

**Examples:**
```
query="status:2"
query="priority:4 AND status:2"
query="created_at:>'2024-01-01'"
query="tag:'urgent' OR tag:'vip'"
```

**Note:** Returns max 30 results per page, max 300 total

---

### 1.5 Update a Ticket
**PUT** `/tickets/{id}`

All fields from Create are updatable. Common updates:
- Change status/priority
- Assign to agent/group
- Add tags
- Update custom fields

**Example:**
```json
{
  "status": 4,
  "responder_id": 456,
  "priority": 1
}
```

---

### 1.6 Update Multiple Tickets (Bulk)
**PUT** `/tickets/bulk_update`

**Request Body:**
```json
{
  "ids": [1, 2, 3],
  "properties": {
    "status": 3,
    "group_id": 5
  }
}
```

---

### 1.7 Delete a Ticket
**DELETE** `/tickets/{id}`

Moves to trash. Use filter=deleted to see trashed tickets.

---

### 1.8 Delete Multiple Tickets (Bulk)
**DELETE** `/tickets/bulk_delete`

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

---

### 1.9 Restore a Ticket
**PUT** `/tickets/{id}/restore`

Restores from trash.

---

### 1.10 Ticket Watchers
**GET** `/tickets/{id}/watchers` - List watchers  
**POST** `/tickets/{id}/watchers` - Add watcher  
**DELETE** `/tickets/{id}/watchers/{user_id}` - Remove watcher

---

### 1.11 Forward a Ticket
**POST** `/tickets/{id}/forward`

```json
{
  "body": "Forwarding this ticket...",
  "to_emails": ["external@example.com"]
}
```

---

### 1.12 Merge Tickets
**PUT** `/tickets/{id}/merge`

```json
{
  "ticket_ids": [2, 3, 4]
}
```

---

### 1.13 Ticket Summary
**GET** `/tickets/{id}/summary`

Returns AI-generated summary (if enabled).

---

### 1.14 Archive Tickets
**GET** `/archive/tickets` - List archived  
**GET** `/archive/tickets/{id}` - View archived ticket

---

## 2. CONVERSATIONS

### 2.1 List Conversations
**GET** `/tickets/{id}/conversations`

Returns all conversations (replies, notes, forwards) for a ticket.

---

### 2.2 Reply to Ticket
**POST** `/tickets/{id}/reply`

**Required:** `body` (HTML content)

**Optional:**
| Field | Type | Description |
|-------|------|-------------|
| `from_email` | string | Reply-from email |
| `user_id` | integer | Agent ID |
| `cc_emails` | array | CC addresses |
| `bcc_emails` | array | BCC addresses |
| `attachments[]` | file | Attachments |

---

### 2.3 Add Note to Ticket
**POST** `/tickets/{id}/notes`

```json
{
  "body": "Internal note content",
  "private": true,
  "incoming": false,
  "user_id": 123,
  "notify_emails": ["team@example.com"]
}
```

---

### 2.4 Update Conversation
**PUT** `/conversations/{id}`

Can update `body` of notes/replies.

---

### 2.5 Delete Conversation
**DELETE** `/conversations/{id}`

---

### 2.6 Reply to Forward
**POST** `/tickets/{id}/reply_to_forward/{conversation_id}`

---

## 3. CONTACTS

### 3.1 Create Contact
**POST** `/contacts`

**Required:** `email` OR `phone` OR `mobile` OR `twitter_id`

**Optional Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Full name |
| `email` | string | Primary email |
| `phone` | string | Work phone |
| `mobile` | string | Mobile phone |
| `twitter_id` | string | Twitter handle |
| `company_id` | integer | Associated company |
| `view_all_tickets` | boolean | Can view all company tickets |
| `other_emails` | array | Additional emails |
| `other_companies` | array | Associated companies with view permissions |
| `address` | string | Address |
| `job_title` | string | Job title |
| `time_zone` | string | Timezone |
| `language` | string | Language code |
| `tags` | array | Tags |
| `custom_fields` | object | Custom fields |

---

### 3.2 View Contact
**GET** `/contacts/{id}`

---

### 3.3 List All Contacts
**GET** `/contacts`

**Query Parameters:**
| Param | Description |
|-------|-------------|
| `email` | Filter by email |
| `mobile` | Filter by mobile |
| `phone` | Filter by phone |
| `company_id` | Filter by company |
| `state` | `verified`, `unverified`, `blocked`, `deleted` |
| `_updated_since` | Modified after timestamp |

---

### 3.4 Filter Contacts (Search)
**GET** `/search/contacts?query="..."`

**Searchable:** `email`, `name`, `phone`, `mobile`, `company_id`, `created_at`, `updated_at`

---

### 3.5 Update Contact
**PUT** `/contacts/{id}`

---

### 3.6 Delete Contact (Soft)
**DELETE** `/contacts/{id}`

---

### 3.7 Permanently Delete Contact
**DELETE** `/contacts/{id}/hard_delete?force=true`

---

### 3.8 Restore Contact
**PUT** `/contacts/{id}/restore`

---

### 3.9 Merge Contacts
**PUT** `/contacts/{id}/merge`

```json
{
  "secondary_contact_ids": [2, 3]
}
```

---

### 3.10 Make Agent
**PUT** `/contacts/{id}/make_agent`

Converts contact to agent.

---

### 3.11 Send Invite
**PUT** `/contacts/{id}/send_invite`

Sends portal activation email.

---

## 4. COMPANIES

### 4.1 Create Company
**POST** `/companies`

**Required:** `name`

**Optional:**
| Field | Type | Description |
|-------|------|-------------|
| `domains` | array | Email domains |
| `description` | string | About |
| `note` | string | Notes |
| `health_score` | string | Account health |
| `account_tier` | string | Tier level |
| `renewal_date` | date | Renewal date |
| `industry` | string | Industry |
| `custom_fields` | object | Custom fields |

---

### 4.2 View Company
**GET** `/companies/{id}`

---

### 4.3 List All Companies
**GET** `/companies`

---

### 4.4 Filter Companies (Search)
**GET** `/search/companies?query="..."`

---

### 4.5 Update Company
**PUT** `/companies/{id}`

---

### 4.6 Delete Company
**DELETE** `/companies/{id}`

---

## 5. AGENTS

### 5.1 Create Agent
**POST** `/agents`

**Required:** `email`

**Optional:**
| Field | Type | Description |
|-------|------|-------------|
| `ticket_scope` | integer | 1=Global, 2=Group, 3=Restricted |
| `occasional` | boolean | Occasional agent |
| `signature` | string | Email signature |
| `skill_ids` | array | Skill IDs |
| `group_ids` | array | Group IDs |
| `role_ids` | array | Role IDs |
| `name` | string | Name |
| `phone` | string | Phone |
| `mobile` | string | Mobile |
| `job_title` | string | Job title |
| `language` | string | Language |
| `time_zone` | string | Timezone |

---

### 5.2 View Agent
**GET** `/agents/{id}`

---

### 5.3 View Current Agent
**GET** `/agents/me`

Returns authenticated agent's details.

---

### 5.4 List All Agents
**GET** `/agents`

**Query Parameters:**
| Param | Description |
|-------|-------------|
| `email` | Filter by email |
| `mobile` | Filter by mobile |
| `phone` | Filter by phone |
| `state` | `fulltime`, `occasional` |

---

### 5.5 Update Agent
**PUT** `/agents/{id}`

---

### 5.6 Delete Agent
**DELETE** `/agents/{id}`

---

## 6. GROUPS

### 6.1 Create Group
**POST** `/groups`

```json
{
  "name": "Support Team",
  "description": "First line support",
  "escalate_to": null,
  "unassigned_for": "30m",
  "agent_ids": [1, 2, 3],
  "auto_ticket_assign": false
}
```

---

### 6.2 View Group
**GET** `/groups/{id}`

---

### 6.3 List All Groups
**GET** `/groups`

---

### 6.4 Update Group
**PUT** `/groups/{id}`

---

### 6.5 Delete Group
**DELETE** `/groups/{id}`

---

## 7. ROLES

### 7.1 List All Roles
**GET** `/roles`

---

### 7.2 View Role
**GET** `/roles/{id}`

---

## 8. PRODUCTS

### 8.1 Create Product
**POST** `/products`

```json
{
  "name": "Product Name",
  "description": "Product description"
}
```

---

### 8.2 View Product
**GET** `/products/{id}`

---

### 8.3 List All Products
**GET** `/products`

---

### 8.4 Update Product
**PUT** `/products/{id}`

---

### 8.5 Delete Product
**DELETE** `/products/{id}`

---

## 9. CANNED RESPONSES

### 9.1 Create Canned Response
**POST** `/canned_responses`

```json
{
  "title": "Response Title",
  "content": "<p>Response content</p>",
  "folder_id": 1
}
```

---

### 9.2 View Canned Response
**GET** `/canned_responses/{id}`

---

### 9.3 List All Canned Responses
**GET** `/canned_responses`

---

### 9.4 Update Canned Response
**PUT** `/canned_responses/{id}`

---

### 9.5 Delete Canned Response
**DELETE** `/canned_responses/{id}`

---

### 9.6 Canned Response Folders
**GET** `/canned_response_folders` - List folders  
**POST** `/canned_response_folders` - Create folder  
**GET** `/canned_response_folders/{id}` - View folder  
**PUT** `/canned_response_folders/{id}` - Update folder  
**DELETE** `/canned_response_folders/{id}` - Delete folder

---

## 10. SOLUTIONS (Knowledge Base)

### Solution Categories
**GET** `/solutions/categories` - List all  
**POST** `/solutions/categories` - Create  
**GET** `/solutions/categories/{id}` - View  
**PUT** `/solutions/categories/{id}` - Update  
**DELETE** `/solutions/categories/{id}` - Delete

### Solution Folders
**GET** `/solutions/categories/{category_id}/folders` - List  
**POST** `/solutions/categories/{category_id}/folders` - Create  
**GET** `/solutions/folders/{id}` - View  
**PUT** `/solutions/folders/{id}` - Update  
**DELETE** `/solutions/folders/{id}` - Delete

### Solution Articles
**GET** `/solutions/folders/{folder_id}/articles` - List  
**POST** `/solutions/folders/{folder_id}/articles` - Create  
**GET** `/solutions/articles/{id}` - View  
**PUT** `/solutions/articles/{id}` - Update  
**DELETE** `/solutions/articles/{id}` - Delete  
**GET** `/search/solutions?term=...` - Search articles

---

## 11. TIME ENTRIES

**GET** `/tickets/{id}/time_entries` - List for ticket  
**POST** `/tickets/{id}/time_entries` - Create  
**GET** `/time_entries/{id}` - View  
**PUT** `/time_entries/{id}` - Update  
**DELETE** `/time_entries/{id}` - Delete  
**GET** `/time_entries` - List all (with filters)

---

## 12. SURVEYS & SATISFACTION RATINGS

### Surveys
**GET** `/surveys` - List all  
**GET** `/surveys/{id}` - View

### Satisfaction Ratings
**GET** `/tickets/{id}/satisfaction_ratings` - For ticket  
**GET** `/surveys/{id}/satisfaction_ratings` - For survey

---

## 13. DISCUSSIONS (Forums)

### Categories
**GET** `/discussions/categories`  
**POST** `/discussions/categories`  
**GET** `/discussions/categories/{id}`  
**PUT** `/discussions/categories/{id}`  
**DELETE** `/discussions/categories/{id}`

### Forums
**GET** `/discussions/categories/{id}/forums`  
**POST** `/discussions/categories/{id}/forums`  
**GET** `/discussions/forums/{id}`  
**PUT** `/discussions/forums/{id}`  
**DELETE** `/discussions/forums/{id}`

### Topics
**GET** `/discussions/forums/{id}/topics`  
**POST** `/discussions/forums/{id}/topics`  
**GET** `/discussions/topics/{id}`  
**PUT** `/discussions/topics/{id}`  
**DELETE** `/discussions/topics/{id}`

### Comments
**GET** `/discussions/topics/{id}/comments`  
**POST** `/discussions/topics/{id}/comments`  
**PUT** `/discussions/comments/{id}`  
**DELETE** `/discussions/comments/{id}`

---

## 14. TICKET FIELDS

**GET** `/ticket_fields` - List all  
**GET** `/ticket_fields/{id}` - View  
**POST** `/ticket_fields` - Create custom field  
**PUT** `/ticket_fields/{id}` - Update  
**DELETE** `/ticket_fields/{id}` - Delete

---

## 15. CONTACT FIELDS

**GET** `/contact_fields` - List all

---

## 16. COMPANY FIELDS

**GET** `/company_fields` - List all

---

## 17. EMAIL CONFIGS

**GET** `/email_configs` - List all  
**GET** `/email_configs/{id}` - View

---

## 18. EMAIL MAILBOXES

**GET** `/email_mailboxes` - List all  
**POST** `/email_mailboxes` - Create  
**GET** `/email_mailboxes/{id}` - View  
**PUT** `/email_mailboxes/{id}` - Update  
**DELETE** `/email_mailboxes/{id}` - Delete

---

## 19. BUSINESS HOURS

**GET** `/business_hours` - List all  
**GET** `/business_hours/{id}` - View

---

## 20. SLA POLICIES

**GET** `/sla_policies` - List all  
**POST** `/sla_policies` - Create  
**GET** `/sla_policies/{id}` - View  
**PUT** `/sla_policies/{id}` - Update

---

## 21. SCENARIO AUTOMATIONS

**GET** `/scenario_automations` - List all  
**GET** `/scenario_automations/{id}` - View

---

## 22. AUTOMATIONS

### Ticket Creation Rules
**GET** `/automations/ticket_creation` - List all

### Time Triggers
**GET** `/automations/time_triggers` - List all

### Observer Rules
**GET** `/automations/observer_rules` - List all

---

## 23. ACCOUNT

**GET** `/account` - View account details

---

## 24. SETTINGS

**GET** `/settings/helpdesk` - View helpdesk settings

---

## 25. SKILLS

**GET** `/skills` - List all  
**GET** `/skills/{id}` - View

---

## 26. AVAILABILITY

**GET** `/agents/{id}/availability` - Get agent availability  
**PUT** `/agents/{id}/availability` - Update availability

---

## 27. JOBS (Background)

**GET** `/jobs/{id}` - Check job status

Used for tracking async bulk operations.

---

## 28. THREADS

**GET** `/tickets/{id}/threads` - List threads  
**POST** `/tickets/{id}/threads` - Create thread

---

## 29. CUSTOM OBJECTS

**GET** `/custom_objects/schemas` - List schemas  
**GET** `/custom_objects/schemas/{name}/records` - List records  
**POST** `/custom_objects/schemas/{name}/records` - Create record  
**GET** `/custom_objects/schemas/{name}/records/{id}` - View record  
**PUT** `/custom_objects/schemas/{name}/records/{id}` - Update record  
**DELETE** `/custom_objects/schemas/{name}/records/{id}` - Delete record

---

## 30. OUTBOUND MESSAGES

**POST** `/tickets/outbound_email` - Create outbound email ticket

---

## Embedding (Include Parameter)

Add `?include=` to embed related resources:

| Endpoint | Available Includes |
|----------|-------------------|
| `/tickets/{id}` | `conversations`, `requester`, `company`, `stats`, `sla_policy` |
| `/tickets` | `requester`, `stats`, `description` |
| `/contacts/{id}` | `company` |
