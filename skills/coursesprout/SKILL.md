---
name: coursesprout
description: Course Sprout API for managing course access, memberships, users, lessons, gamification, and AI retrieval. Use when asked to add users to courses, grant course access, manage memberships/pods, create lessons, set up gamification goals, or retrieve badges/topics.
---

# Course Sprout AI API

Course platform and community management for Titanium Software.

**API Version:** v1.0.0
**Last Updated:** 2026-02-12
**Total Endpoints:** 17

---

## 🔐 Authentication

**Header:** `X-API-KEY: {api_key}`

Required for ALL endpoints. Get key from `credentials/titanium-api-keys.txt`

---

## 🌐 Base URL

```
https://api.coursesprout.com/api/ai
```

---

## ❌ Error Responses

All endpoints return consistent error format:

| Status | Response |
|--------|----------|
| 401 (Missing Key) | `{"status": false, "message": "API Key is required"}` |
| 401 (Invalid Key) | `{"status": false, "message": "Unauthorized. Invalid API Key"}` |
| 404 (Not Found) | `{"status": false, "message": "Data not found."}` |
| 422 (Validation) | `{"status": false, "message": "Validation errors occurred.", "errors": {...}}` |
| 403 (Forbidden) | `{"status": false, "message": "...does not belong to you."}` |

---

## 📚 COURSES ENDPOINTS (4)

### 1. GET /get-course

**Purpose:** Retrieve all courses owned by authenticated user.

**Parameters:** None

**Response:**
```json
{
  "status": true,
  "message": "Data found.",
  "data": [
    { "id": 1, "title": "My Course Title" },
    { "id": 2, "title": "Another Course" }
  ]
}
```

---

### 2. GET /get-course-by-pod/:membership_id

**Purpose:** Retrieve all courses associated with a specific membership (pod).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `membership_id` | integer | Yes | The Membership (Pod) ID |

**Response:**
```json
{
  "status": true,
  "message": "Data found.",
  "data": [
    { "id": 1, "title": "Course in Pod" }
  ]
}
```

---

### 3. GET /get-course-pricing-option/:course_id

**Purpose:** Retrieve all pricing options for a specific course.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `course_id` | integer | Yes | The Course ID |

**Response Fields:**
- `id` - Pricing option ID
- `course_id` - Associated course ID
- `name` - Pricing option name
- `user_id` - Owner user ID
- `is_full_access` - Whether full access (0/1)
- `default_password` - Default password for this option
- `created_at`, `updated_at` - Timestamps

**Response:**
```json
{
  "status": true,
  "message": "Data found.",
  "data": [
    {
      "id": 1,
      "course_id": 1,
      "name": "Basic Plan",
      "user_id": 1,
      "is_full_access": 0,
      "default_password": null,
      "created_at": "2025-01-01T00:00:00.000000Z",
      "updated_at": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

---

### 4. POST /create-course ⭐ NEW

**Purpose:** Create a new course. Auto-creates first lesson, first chapter, and default pricing option.

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | **Yes** | Course title (max 255 chars) |
| `description` | string | No | Course description |
| `main_color` | string | No | Primary branding color (hex code) |

**Request:**
```json
{
  "title": "AI Test Course",
  "description": "Created via AI API"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Course created successfully.",
  "data": {
    "id": 5,
    "title": "AI Test Course",
    "description": "Created via AI API"
  }
}
```

---

## 🏠 MEMBERSHIPS (PODS) ENDPOINTS (3)

### 5. GET /get-pods

**Purpose:** Retrieve all memberships (pods) owned by authenticated user.

**Parameters:** None

**Response:**
```json
{
  "status": true,
  "message": "Data found.",
  "data": [
    { "id": 1, "name": "My Pod" },
    { "id": 2, "name": "Another Pod" }
  ]
}
```

---

### 6. GET /get-pod-pricing-option/:course_id

**Purpose:** Retrieve all pricing options for a specific membership (pod).

**⚠️ IMPORTANT:** The route parameter is named `course_id` but it actually accepts a **membership/pod ID**!

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `course_id` | integer | Yes | The Membership (Pod) ID (NOT course!) |

**Response Fields:**
- `id` - Pricing option ID
- `membership_id` - Associated membership ID
- `name` - Pricing option name
- `user_id` - Owner user ID
- `is_full_access` - Whether full membership access (0/1)
- `default_password` - Default password for this option
- `created_at`, `updated_at` - Timestamps

**Response:**
```json
{
  "status": true,
  "message": "Data found.",
  "data": [
    {
      "id": 1,
      "membership_id": 1,
      "name": "Premium Pod Access",
      "user_id": 1,
      "is_full_access": 1,
      "default_password": null,
      "created_at": "2025-01-01T00:00:00.000000Z",
      "updated_at": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

---

### 7. POST /create-pod ⭐ NEW

**Purpose:** Create a new membership (pod). Auto-creates default pricing option.

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | **Yes** | Pod name (max 255 chars) |
| `sub_domain` | string | **Yes** | Unique sub-domain for the pod |
| `title` | string | No | Pod title |
| `description` | string | No | Pod description |
| `main_color` | string | No | Primary branding color (hex code) |

**Request:**
```json
{
  "name": "AI Test Pod",
  "sub_domain": "ai-test-pod",
  "title": "Test Pod Title",
  "description": "Pod created via AI API"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Pod created successfully.",
  "data": {
    "id": 5,
    "user_id": 1,
    "name": "AI Test Pod",
    "sub_domain": "ai-test-pod",
    "title": "Test Pod Title",
    "description": "Pod created via AI API"
  }
}
```

---

## 👥 MEMBERS ENDPOINTS (4)

### 8. GET /get-members

**Purpose:** Retrieve paginated list of members with advanced filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by first name, last name, full name, or email |
| `type` | string | No | `all` | Filter: `all`, `course`, or `membership` |
| `course_id` | integer | No | - | Filter by course ID (only when `type=course`) |
| `pod_id` | integer | No | - | Filter by pod ID (only when `type=membership`) |
| `pricing_option_id` | integer | No | - | Filter by pricing option ID |
| `per_page` | integer | No | `10` | Results per page |

**Filtering Logic:**
- `type=all` - Returns all members (default)
- `type=course` - Returns members with course access
- `type=membership` - Returns members with pod access
- `course_id` requires `type=course`
- `pod_id` requires `type=membership`
- `pricing_option_id` works with either type

**Response Fields (Laravel Pagination):**
- `id` - User account ID
- `user_id` - User ID
- `first_name`, `last_name`, `phone`
- `user.email` - Member's email
- `user.courses[]` - Array of courses
- `user.memberships[]` - Array of memberships
- `user.pricingOptions[]` - Assigned pricing options
- `user.extraCourses[]` - Additional courses via membership
- Pagination: `current_page`, `total`, `per_page`, `last_page`

**Example Use Cases:**
```
GET /get-members                                    # All members
GET /get-members?search=john                        # Search
GET /get-members?type=course                        # Course members only
GET /get-members?type=course&course_id=5            # Specific course
GET /get-members?type=membership                    # Pod members only
GET /get-members?type=membership&pod_id=3           # Specific pod
GET /get-members?type=course&pricing_option_id=12   # By pricing option
GET /get-members?search=jane&type=membership&pod_id=3  # Combined
```

**Response:**
```json
{
  "status": true,
  "message": "Data fetched.",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 10,
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1234567890",
        "user": {
          "email": "john.doe@example.com",
          "courses": [{"id": 1, "title": "My Course"}],
          "memberships": [],
          "pricingOptions": []
        }
      }
    ],
    "total": 15,
    "per_page": 10,
    "last_page": 2
  }
}
```

---

### 9. POST /send-email

**Purpose:** Send access emails to a member by email address.

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string (email) | Yes | Email address of the member |

**Security Checks:**
1. API Key validation
2. Email format validation
3. User existence check
4. Ownership check (parent_user_id)
5. Pricing options exist
6. Email configuration exists

**Business Logic:**
- Finds user by email
- Verifies ownership
- Retrieves pricing options
- Fetches email configs
- Dispatches email jobs

**Request:**
```json
{ "email": "john.doe@example.com" }
```

**Success Response:**
```json
{ "status": true, "message": "Email sent successfully." }
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 422 | `"The email field is required."` |
| 404 | `"User not found."` |
| 403 | `"User account not found or does not belong to you."` |
| 404 | `"No pricing options found for this user."` |
| 404 | `"No email configuration found for this user."` |

---

### 10. POST /send-reminder-email

**Purpose:** Send reminder emails to inactive members for a pricing option. Only sends to users who have NOT logged in yet (login_count = 0 or null).

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pricing_option_id` | integer | Yes | ID of the pricing option |

**Security Checks:**
1. API Key validation
2. Pricing option ownership check
3. Parent user ID validation
4. Reminder email configuration exists

**Business Logic:**
- Finds users with pricing option who belong to authenticated user
- Filters to ONLY inactive users (haven't logged in)
- Excludes archived users
- Sends in chunks of 500 for performance
- Updates `last_reminder_date` timestamp
- Increments `total_reminder` count

**Target Recipients (ALL must be true):**
- Has the specified pricing option
- Belongs to authenticated user
- `login_count` = 0 or NULL
- `is_archived` = 0

**Request:**
```json
{ "pricing_option_id": 12 }
```

**Success Response:**
```json
{
  "status": true,
  "message": "Reminder email sent to 15 inactive user(s).",
  "count": 15
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 422 | `"The pricing option id field is required."` |
| 403 | `"Pricing option not found or does not belong to you."` |
| 404 | `"Reminder email setup not found for this pricing option."` |
| 404 | `"No inactive users found for this pricing option."` |

---

### 11. POST /add-user

**Purpose:** Create new user or update existing and grant access to courses/memberships.

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `first_name` | string | **Yes** | User's first name (max 255 chars) |
| `email` | string (email) | **Yes** | User's email address |
| `last_name` | string | No | User's last name |
| `phone` | string | No | User's phone number |
| `password` | string | No | Password. Default: pricing option's default or `pass5511` |
| `course_id` | integer | No | Course ID to grant access (must belong to you) |
| `membership_id` | integer | No | Pod ID to grant access (must belong to you) |
| `pricing_option_id` | integer | No | Pricing option ID (must belong to you) |
| `is_membership_full_access` | boolean | No | Grant full membership access. Default: `false` |
| `extra_course_ids` | array | No | Additional course IDs within membership |

**Business Logic:**
1. Creates user if email doesn't exist; updates if exists
2. Assigns `member` role to new users
3. Creates/updates `UserAccount` record
4. Syncs courses, memberships, pricing options
5. Sends access email if configured
6. Logs access revocations for audit

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "securepassword123",
  "course_id": 1,
  "membership_id": 1,
  "pricing_option_id": 1,
  "is_membership_full_access": false,
  "extra_course_ids": [2, 3]
}
```

**Success Response (Create):**
```json
{
  "status": true,
  "message": "Member created successfully.",
  "user": {
    "id": 10,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": null,
    "api_key": "random64charstring...",
    "courses": [{"id": 1, "title": "My Course"}],
    "memberships": [],
    "extra_courses": []
  }
}
```

**Success Response (Update):**
```json
{
  "status": true,
  "message": "Member updated successfully.",
  "user": { ... }
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 422 | Validation errors (first_name required, email format) |
| 200 | `"Course not found."` (status: false) |
| 200 | `"Membership not found."` (status: false) |

---

## 📖 CHAPTERS & LESSONS ENDPOINTS (2)

### 12. GET /get-chapters ⭐ NEW

**Purpose:** Retrieve all chapters for a specific course.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `course_id` | integer | **Yes** | The Course ID |

**Request:**
```
GET /get-chapters?course_id=361
```

**Response:**
```json
{
  "status": true,
  "message": "Course chapters fetched successfully.",
  "data": [
    {
      "id": 991,
      "drag_index": 0,
      "course_id": 361,
      "user_id": 4,
      "name": "Chapter #1",
      "description": null,
      "image": null,
      "video_id": null,
      "is_active": 1,
      "created_at": "2026-02-13T03:49:21.000000Z",
      "updated_at": "2026-02-13T03:49:21.000000Z"
    }
  ]
}
```

**Response Fields:**
- `id` — Chapter ID (use for `course_chapter_id` when creating lessons)
- `drag_index` — Order position
- `course_id` — Parent course ID
- `name` — Chapter title
- `description` — Chapter description
- `is_active` — Whether chapter is visible (1=yes)

---

### 13. POST /create-lesson

**Purpose:** Create a new lesson. Supports auto-creating or linking video from library.

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | **Yes** | Lesson title |
| `course_id` | integer | **Yes** | Associated course ID |
| `course_chapter_id` | integer | No | Associated chapter ID |
| `short_description` | string | No | Short summary (e.g., "In this lesson, you'll...") |
| `long_description` | string | No | Full lesson content (**NO EMOJIS - causes 422!**) |
| `type` | string | No | Lesson type (default: `video`) |
| `video_name` | string | No | Name for the video in library |
| `video_url` | string | No | **FULL Vimeo URL** (e.g., `https://vimeo.com/1164455239`) |
| `video_tags` | array | No | Tags for organizing videos by course (e.g., `["compete-up"]`) |

**⚠️ IMPORTANT NOTES:**
- `video_url` must be the **FULL URL** (not just video ID)
- `long_description` **cannot contain emojis** - API returns 422
- `video_tags` help organize videos in the library by course
- If video already exists in library (same URL), it reuses it (tags won't update)
- **No update endpoint** - each create makes a new lesson, delete duplicates manually

**Request:**
```json
{
  "name": "Tour of the Dashboard",
  "course_id": 361,
  "short_description": "In this lesson, you'll learn to navigate the dashboard like a pro.",
  "long_description": "<p>Welcome to the dashboard walkthrough...</p>",
  "video_name": "Dashboard Tour",
  "video_url": "https://vimeo.com/1164455239",
  "video_tags": ["compete-up"]
}
```

**Response:**
```json
{
  "status": true,
  "message": "Lesson created successfully.",
  "data": {
    "id": 15,
    "name": "Tour of the Dashboard",
    "course_id": 361
  }
}
```

---

## 🎮 GAMIFICATION ENDPOINTS (1) ⭐ NEW

### 14. POST /create-goal

**Purpose:** Create a new gamification goal for a lesson.

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | **Yes** | Goal title |
| `course_id` | integer | **Yes** | Associated course ID |
| `lesson_id` | integer | **Yes** | Associated lesson ID |
| `type` | string | **Yes** | Goal type: `points`, `badge`, or `none` |
| `description` | string | No | Goal description (HTML supported: h3, p, ul/li, strong, hr) |
| `points` | integer | No | Points awarded (if type=points) |
| `badge_id` | integer | No | Badge ID to award (if type=badge) |
| `is_add_to_comment` | integer | No | Enable comments (1=yes, 0=no) |
| `is_user_input_field` | integer | No | Enable user input field (1=yes, 0=no) |

**⚠️ CHAD'S DEFAULT SETTINGS (always use these):**
```json
{
  "type": "points",
  "points": 10,
  "is_add_to_comment": 1,
  "is_user_input_field": 1
}
```

**Goal Block Framework:**
1. **"Here's the deal"** — Reinforce the big breakthrough they just learned
2. **"Your one thing"** — ONE simple action (couple of ideas max)
3. **"Drop a comment below"** — Engagement prompt
4. **Reinforcement questions** — Must MATCH what they learned (not generic!)

**Request:**
```json
{
  "name": "Dashboard Navigator",
  "course_id": 361,
  "lesson_id": 6077,
  "type": "points",
  "points": 10,
  "description": "<h3>Here's the deal:</h3><p>You just learned the dashboard layout...</p><h3>Your one thing:</h3><p>Open your dashboard and find the stats tab.</p><hr><p><strong>Drop a comment below!</strong> What's ONE thing you noticed?</p>",
  "is_add_to_comment": 1,
  "is_user_input_field": 1
}
```

**Response:**
```json
{
  "status": true,
  "message": "Goal created successfully.",
  "data": {
    "id": 702,
    "name": "Dashboard Navigator",
    "type": "points",
    "points": 10
  }
}
```

---

## 🤖 AI RETRIEVAL ENDPOINTS (3) ⭐ NEW

### 15. GET /get-badges

**Purpose:** Retrieve all badges owned by authenticated user.

**Parameters:** None

**Response:**
```json
{
  "status": true,
  "message": "Data found.",
  "data": [
    {
      "id": 1,
      "name": "First Steps",
      "description": "Completed first lesson",
      "image_url": "https://..."
    }
  ]
}
```

---

### 16. GET /get-goals

**Purpose:** Retrieve all gamification goals owned by authenticated user.

**Parameters:** None

**Response:**
```json
{
  "status": true,
  "message": "Data found.",
  "data": [
    {
      "id": 1,
      "name": "Complete Module 1",
      "type": "points",
      "points": 50,
      "course_id": 1,
      "lesson_id": 5
    }
  ]
}
```

---

### 17. GET /get-community-topics

**Purpose:** Retrieve all community topics owned by authenticated user.

**Parameters:** None

**Response:**
```json
{
  "status": true,
  "message": "Data found.",
  "data": [
    {
      "id": 1,
      "title": "Welcome Thread",
      "description": "Introduce yourself here",
      "membership_id": 3
    }
  ]
}
```

---

## ⚠️ USER ACCESS WORKFLOW (MANDATORY)

**ALWAYS follow this protocol when granting access:**

1. **Confirm the email** — Read it back to verify spelling
2. **Confirm the access** — State what product/level they're getting
3. **Ask before sending** — "Want me to send them their access details?"

**NEVER auto-send access emails. Always confirm all three steps first.**

---

## 📊 Chad's Resource IDs

### Pod IDs
| ID | Name |
|----|------|
| 3 | Entourage Mastermind |
| 4 | Power Plays Member |
| 57 | Local Newsletter Hustle |
| 67 | OfferMint |
| 95 | BlackBox Test |
| 98 | Chad Nicely's Vault |

### Course IDs (Key Ones)
| ID | Title |
|----|-------|
| 4 | Round Table |
| 6 | Titanium Tech Call |
| 7 | Entourage Strategy Call |
| 8 | PowerPlay Trainings |
| 140 | Local Newsletter Hustle |
| 171 | Newsletter Hour |
| 196 | OfferMint |
| 340 | OpenClaw Shadow Intensive |

---

## 🧪 PowerShell Test Examples

```powershell
# Setup
$headers = @{ "X-API-KEY" = "YOUR_API_KEY" }
$base = "https://api.coursesprout.com/api/ai"

# TEST 1: List all courses
Invoke-RestMethod -Uri "$base/get-course" -Headers $headers

# TEST 2: List all pods
Invoke-RestMethod -Uri "$base/get-pods" -Headers $headers

# TEST 3: Get courses in Entourage pod (ID 3)
Invoke-RestMethod -Uri "$base/get-course-by-pod/3" -Headers $headers

# TEST 4: Get pricing options for LNH course (ID 140)
Invoke-RestMethod -Uri "$base/get-course-pricing-option/140" -Headers $headers

# TEST 5: Search members by email
Invoke-RestMethod -Uri "$base/get-members?search=test@example.com" -Headers $headers

# TEST 6: Get all badges (NEW)
Invoke-RestMethod -Uri "$base/get-badges" -Headers $headers

# TEST 7: Get all goals (NEW)
Invoke-RestMethod -Uri "$base/get-goals" -Headers $headers

# TEST 8: Get community topics (NEW)
Invoke-RestMethod -Uri "$base/get-community-topics" -Headers $headers

# TEST 9: Get chapters for a course (NEW)
Invoke-RestMethod -Uri "$base/get-chapters?course_id=361" -Headers $headers
```

---

## 🔄 Common Workflows

### Add User to Course
```powershell
$body = @{
    first_name = "John"
    email = "john@example.com"
    course_id = 140  # Local Newsletter Hustle
} | ConvertTo-Json

Invoke-RestMethod -Uri "$base/add-user" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Add User to Pod with Full Access
```powershell
$body = @{
    first_name = "Jane"
    email = "jane@example.com"
    membership_id = 3  # Entourage
    is_membership_full_access = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "$base/add-user" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Create a New Course (NEW)
```powershell
$body = @{
    title = "My New Course"
    description = "Course created via API"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$base/create-course" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Create a New Pod (NEW)
```powershell
$body = @{
    name = "My New Pod"
    sub_domain = "my-new-pod"
    title = "Welcome to My Pod"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$base/create-pod" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Create a Lesson (NEW)
```powershell
$body = @{
    name = "Getting Started"
    course_id = 1
    short_description = "Introduction to the course"
    video_url = "abc123xyz"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$base/create-lesson" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Create a Goal (NEW)
```powershell
$body = @{
    name = "Complete Intro"
    course_id = 1
    lesson_id = 1
    type = "points"
    points = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "$base/create-goal" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Reset User Password
```powershell
$body = @{
    first_name = "John"  # Required even for update
    email = "john@example.com"
    password = "newpassword123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$base/add-user" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Send Access Email
```powershell
$body = @{ email = "john@example.com" } | ConvertTo-Json
Invoke-RestMethod -Uri "$base/send-email" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

### Send Reminder to Inactive Users
```powershell
$body = @{ pricing_option_id = 12 } | ConvertTo-Json
Invoke-RestMethod -Uri "$base/send-reminder-email" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

---

## ✅ ENDPOINT VERIFICATION

**Total endpoints documented:** 17

### Courses (4)
- [x] GET /get-course
- [x] GET /get-course-by-pod/:membership_id
- [x] GET /get-course-pricing-option/:course_id
- [x] POST /create-course ⭐

### Memberships (3)
- [x] GET /get-pods
- [x] GET /get-pod-pricing-option/:course_id
- [x] POST /create-pod ⭐

### Members (4)
- [x] GET /get-members
- [x] POST /send-email
- [x] POST /send-reminder-email
- [x] POST /add-user

### Chapters & Lessons (2)
- [x] GET /get-chapters ⭐⭐ NEW
- [x] POST /create-lesson ⭐

### Gamification (1)
- [x] POST /create-goal ⭐

### AI Retrieval (3)
- [x] GET /get-badges ⭐
- [x] GET /get-goals ⭐
- [x] GET /get-community-topics ⭐

**⭐ = New endpoint discovered | ⭐⭐ = Just added**

---

## 📝 API Map (JSON Reference)

```json
{
  "api_name": "Course Sprout AI API",
  "version": "1.0.0",
  "base_url": "https://api.coursesprout.com/api/ai",
  "auth": {
    "type": "api_key",
    "header_name": "X-API-KEY",
    "format": "raw string"
  },
  "endpoint_groups": [
    {"name": "Courses", "count": 4},
    {"name": "Memberships", "count": 3},
    {"name": "Members", "count": 4},
    {"name": "Lessons", "count": 1},
    {"name": "Gamification", "count": 1},
    {"name": "AI Retrieval", "count": 3}
  ],
  "total_endpoint_count": 17,
  "endpoints": [
    {"id": "courses_list", "method": "GET", "path": "/get-course", "auth": true, "risk": "read_only"},
    {"id": "courses_by_pod", "method": "GET", "path": "/get-course-by-pod/:membership_id", "auth": true, "risk": "read_only"},
    {"id": "courses_pricing", "method": "GET", "path": "/get-course-pricing-option/:course_id", "auth": true, "risk": "read_only"},
    {"id": "courses_create", "method": "POST", "path": "/create-course", "auth": true, "risk": "write"},
    {"id": "pods_list", "method": "GET", "path": "/get-pods", "auth": true, "risk": "read_only"},
    {"id": "pods_pricing", "method": "GET", "path": "/get-pod-pricing-option/:course_id", "auth": true, "risk": "read_only"},
    {"id": "pods_create", "method": "POST", "path": "/create-pod", "auth": true, "risk": "write"},
    {"id": "members_list", "method": "GET", "path": "/get-members", "auth": true, "risk": "read_only"},
    {"id": "members_send_email", "method": "POST", "path": "/send-email", "auth": true, "risk": "write"},
    {"id": "members_send_reminder", "method": "POST", "path": "/send-reminder-email", "auth": true, "risk": "write"},
    {"id": "members_add", "method": "POST", "path": "/add-user", "auth": true, "risk": "write"},
    {"id": "chapters_list", "method": "GET", "path": "/get-chapters", "auth": true, "risk": "read_only"},
    {"id": "lessons_create", "method": "POST", "path": "/create-lesson", "auth": true, "risk": "write"},
    {"id": "goals_create", "method": "POST", "path": "/create-goal", "auth": true, "risk": "write"},
    {"id": "badges_list", "method": "GET", "path": "/get-badges", "auth": true, "risk": "read_only"},
    {"id": "goals_list", "method": "GET", "path": "/get-goals", "auth": true, "risk": "read_only"},
    {"id": "community_topics_list", "method": "GET", "path": "/get-community-topics", "auth": true, "risk": "read_only"}
  ],
  "schemas": {
    "Course": {"id": "integer", "title": "string"},
    "Membership": {"id": "integer", "name": "string", "sub_domain": "string"},
    "PricingOption": {"id": "integer", "name": "string", "is_full_access": "boolean", "default_password": "string|null"},
    "Member": {"id": "integer", "user_id": "integer", "first_name": "string", "last_name": "string", "email": "string"},
    "Lesson": {"id": "integer", "name": "string", "course_id": "integer", "type": "string"},
    "Goal": {"id": "integer", "name": "string", "type": "string", "points": "integer|null", "badge_id": "integer|null"},
    "Badge": {"id": "integer", "name": "string", "description": "string", "image_url": "string"},
    "CommunityTopic": {"id": "integer", "title": "string", "description": "string", "membership_id": "integer"}
  },
  "pagination": {
    "style": "Laravel",
    "default_per_page": 10,
    "fields": ["current_page", "data", "total", "per_page", "last_page"]
  },
  "error_codes": {
    "401": "Unauthorized (missing or invalid API key)",
    "403": "Forbidden (resource doesn't belong to user)",
    "404": "Not found",
    "422": "Validation error"
  }
}
```

---

## 🛡️ Skill Wrapper Behavior

### Read-Only Safe Endpoints
- GET /get-course
- GET /get-course-by-pod/:membership_id
- GET /get-course-pricing-option/:course_id
- GET /get-pods
- GET /get-pod-pricing-option/:course_id
- GET /get-members
- GET /get-chapters ⭐ NEW
- GET /get-badges
- GET /get-goals
- GET /get-community-topics

### Write/Risky Endpoints (require confirmation)
- POST /create-course - Creates new course with auto-generated chapter/lesson
- POST /create-pod - Creates new pod with auto-generated pricing option
- POST /add-user - Creates/updates user, may send email
- POST /send-email - Sends access emails
- POST /send-reminder-email - Sends bulk reminder emails
- POST /create-lesson - Creates lesson in course
- POST /create-goal - Creates gamification goal

### Required Validations Before Write
1. Confirm required fields present
2. Validate email format for user operations
3. Confirm resource IDs exist and belong to user
4. For bulk operations (send-reminder-email), confirm count before sending

---

---

## ⚠️ API LIMITATIONS (Discovered 2026-02-12)

**Cannot do via API:**
- ❌ Upload images (course image, logo, tab icon, badge images)
- ❌ Update existing lessons (create new, delete old manually)
- ❌ Update video tags on existing videos
- ❌ Get lesson details by ID
- ✅ GET /get-chapters?course_id=X — **NOW AVAILABLE!**

**Manual UI required for:**
- Course image (196×160)
- Course logo (600×150)
- Tab icon/favicon (600×150)
- Badge images
- Deleting duplicate lessons
- Reordering lessons/chapters

**Workarounds:**
- Save generated images to `assets/[course-name]/` folder
- Document what needs manual upload
- Create lessons in correct order (no reorder API)

---

## 🔄 FULL COURSE BUILDOUT WORKFLOW

**Vimeo Folder → Course Sprout Course:**

1. **Create course** via `POST /create-course`
2. **Get Vimeo folder videos** via Vimeo API
3. **Pull transcripts** via `/videos/{id}/texttracks` → parse VTT
4. **Generate descriptions** from actual transcript content
5. **Create lessons** via `POST /create-lesson` with:
   - Full Vimeo URL
   - Video name for library
   - Video tag for course organization
   - Short + long descriptions (NO EMOJIS)
6. **Create goal blocks** via `POST /create-goal` with Chad's defaults
7. **Document manual uploads needed** (images)

**Key insight:** Videos must be PUBLIC on Vimeo (not "Hide from Vimeo") or API returns 404.

---

*Skill updated: 2026-02-12 11:13 PM | Endpoints: 17 | Source: https://api.coursesprout.com/ai-api-docs*
