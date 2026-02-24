---
name: postbridge
description: Post Bridge API for managing social media posts across multiple platforms. Schedule posts, upload media, track results, and manage connected social accounts (Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Bluesky, Threads, Pinterest). Use when asked to create social posts, schedule content, upload images/videos, check post performance, or manage social accounts.
---

# Post Bridge API

Social media posting and scheduling platform with multi-platform support.

**API Version:** 1.0  
**Last Updated:** 2026-02-20  
**Total Endpoints:** 13

---

## 🔐 Authentication

**Type:** Bearer Token (JWT)

**Header Format:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

All endpoints require authentication. Get your API token from the Post Bridge dashboard.

**API Key Location:** `credentials/postbridge-api-key.txt`

---

## 🌐 Base URL

```
https://api.post-bridge.com
```

All endpoints are versioned under `/v1/`.

---

## 📚 ENDPOINTS BY CATEGORY

### 📸 Media Management (4 endpoints)

#### 1. GET /v1/media

**Purpose:** Get paginated list of media (images, videos) with optional filters.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `offset` | number | No | 0 | Number of items to skip |
| `limit` | number | No | 10 | Number of items to return |
| `post_id` | array | No | - | Filter by post IDs (multiple = OR logic) |
| `type` | array | No | - | Filter by type: `image` or `video` (multiple = OR) |

**Example Request:**
```bash
curl -X GET "https://api.post-bridge.com/v1/media?limit=20&type=image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "media_123",
      "type": "image",
      "url": "https://...",
      "post_id": "post_456",
      "created_at": "2026-02-20T12:00:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "offset": 0,
    "limit": 20
  }
}
```

---

#### 2. GET /v1/media/{id}

**Purpose:** Get details for a specific media item by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Media ID |

**Example Request:**
```bash
curl -X GET "https://api.post-bridge.com/v1/media/media_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 3. POST /v1/media/create-upload-url

**Purpose:** Generate a pre-signed upload URL for uploading media to Post Bridge storage.

**Request Body:**
```json
{
  "filename": "my-image.jpg",
  "content_type": "image/jpeg"
}
```

**Response:**
```json
{
  "upload_url": "https://storage.post-bridge.com/upload?token=...",
  "media_id": "media_789",
  "expires_at": "2026-02-20T13:00:00Z"
}
```

**Usage Flow:**
1. Call this endpoint to get upload URL
2. PUT your file to the returned `upload_url`
3. Use `media_id` when creating posts

**Example:**
```bash
# Step 1: Get upload URL
curl -X POST "https://api.post-bridge.com/v1/media/create-upload-url" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filename":"photo.jpg","content_type":"image/jpeg"}'

# Step 2: Upload file (use returned upload_url)
curl -X PUT "UPLOAD_URL_FROM_STEP_1" \
  --upload-file photo.jpg \
  -H "Content-Type: image/jpeg"
```

---

#### 4. DELETE /v1/media/{id}

**Purpose:** Delete a media item.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Media ID to delete |

**Response:**
```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

---

### 📝 Posts Management (5 endpoints)

#### 5. GET /v1/posts

**Purpose:** Get paginated list of all posts with optional filters.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `offset` | number | No | 0 | Number of items to skip |
| `limit` | number | No | 10 | Number of items to return |

**Example Request:**
```bash
curl -X GET "https://api.post-bridge.com/v1/posts?limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "post_123",
      "content": "Check out our new product!",
      "scheduled_at": "2026-02-21T10:00:00Z",
      "status": "scheduled",
      "platforms": ["facebook", "twitter"],
      "media_ids": ["media_456"]
    }
  ],
  "meta": {
    "total": 200,
    "offset": 0,
    "limit": 50
  }
}
```

---

#### 6. POST /v1/posts

**Purpose:** Create one or more new posts (supports batch creation).

**Request Body:**
```json
{
  "posts": [
    {
      "content": "Your post content here",
      "scheduled_at": "2026-02-21T10:00:00Z",
      "platforms": {
        "facebook": {
          "account_id": "fb_acc_123",
          "content": "Optional platform-specific content override"
        },
        "twitter": {
          "account_id": "tw_acc_456"
        }
      },
      "media_ids": ["media_789"]
    }
  ]
}
```

**Supported Platforms:**
- `facebook`
- `instagram`
- `twitter`
- `linkedin`
- `tiktok`
- `youtube`
- `pinterest`
- `bluesky`
- `threads`

**Response:**
```json
{
  "created": [
    {
      "id": "post_new_123",
      "status": "scheduled",
      "scheduled_at": "2026-02-21T10:00:00Z"
    }
  ],
  "invalid": []
}
```

---

#### 7. GET /v1/posts/{id}

**Purpose:** Get details for a specific post by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Post ID |

**Example Request:**
```bash
curl -X GET "https://api.post-bridge.com/v1/posts/post_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 8. PATCH /v1/posts/{id}

**Purpose:** Update an existing post (only works for scheduled posts, not published).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Post ID to update |

**Request Body:**
```json
{
  "content": "Updated post content",
  "scheduled_at": "2026-02-22T15:00:00Z",
  "media_ids": ["media_new_123"]
}
```

**Example Request:**
```bash
curl -X PATCH "https://api.post-bridge.com/v1/posts/post_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated content"}'
```

---

#### 9. DELETE /v1/posts/{id}

**Purpose:** Delete a post (cancels if scheduled, removes if draft).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Post ID to delete |

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 📊 Post Results (2 endpoints)

#### 10. GET /v1/post-results

**Purpose:** Get performance metrics for all posts (engagement, reach, clicks).

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `offset` | number | No | 0 | Number of items to skip |
| `limit` | number | No | 10 | Number of items to return |

**Example Request:**
```bash
curl -X GET "https://api.post-bridge.com/v1/post-results" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "post_id": "post_123",
      "platform": "facebook",
      "impressions": 5420,
      "engagements": 312,
      "clicks": 87,
      "shares": 15,
      "comments": 23,
      "likes": 274
    }
  ],
  "meta": {
    "total": 50,
    "offset": 0,
    "limit": 10
  }
}
```

---

#### 11. GET /v1/post-results/{id}

**Purpose:** Get performance metrics for a specific post.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Post ID |

**Example Request:**
```bash
curl -X GET "https://api.post-bridge.com/v1/post-results/post_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 🔗 Social Accounts (2 endpoints)

#### 12. GET /v1/social-accounts

**Purpose:** Get list of all connected social media accounts.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `offset` | number | No | 0 | Number of items to skip |
| `limit` | number | No | 10 | Number of items to return |

**Example Request:**
```bash
curl -X GET "https://api.post-bridge.com/v1/social-accounts" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "acc_fb_123",
      "platform": "facebook",
      "username": "mypage",
      "display_name": "My Facebook Page",
      "status": "connected",
      "connected_at": "2026-01-15T10:00:00Z"
    },
    {
      "id": "acc_tw_456",
      "platform": "twitter",
      "username": "@myhandle",
      "display_name": "My Twitter",
      "status": "connected",
      "connected_at": "2026-01-20T14:30:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "offset": 0,
    "limit": 10
  }
}
```

---

#### 13. GET /v1/social-accounts/{id}

**Purpose:** Get details for a specific connected social account.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Social account ID |

**Example Request:**
```bash
curl -X GET "https://api.post-bridge.com/v1/social-accounts/acc_fb_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📦 Common Schemas

### MediaDto
```json
{
  "id": "string",
  "type": "image" | "video",
  "url": "string",
  "post_id": "string",
  "created_at": "ISO 8601 timestamp"
}
```

### PostDto
```json
{
  "id": "string",
  "content": "string",
  "scheduled_at": "ISO 8601 timestamp",
  "published_at": "ISO 8601 timestamp | null",
  "status": "draft" | "scheduled" | "published" | "failed",
  "platforms": {
    "platform_name": {
      "account_id": "string",
      "content": "string (optional override)"
    }
  },
  "media_ids": ["string"],
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

### PostResultDto
```json
{
  "post_id": "string",
  "platform": "string",
  "impressions": number,
  "engagements": number,
  "clicks": number,
  "shares": number,
  "comments": number,
  "likes": number,
  "video_views": number | null,
  "updated_at": "ISO 8601 timestamp"
}
```

### SocialAccountDto
```json
{
  "id": "string",
  "platform": "facebook" | "instagram" | "twitter" | "linkedin" | "tiktok" | "youtube" | "pinterest" | "bluesky" | "threads",
  "username": "string",
  "display_name": "string",
  "profile_image": "string (URL)",
  "status": "connected" | "disconnected" | "error",
  "connected_at": "ISO 8601 timestamp",
  "last_sync": "ISO 8601 timestamp"
}
```

---

## 🚀 PowerShell Quick Start

```powershell
# Set your token
$token = Get-Content "credentials/postbridge-api-key.txt"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$base = "https://api.post-bridge.com/v1"

# Get all connected accounts
$accounts = Invoke-RestMethod -Uri "$base/social-accounts" -Headers $headers
$accounts.data

# Create a new post
$body = @{
    posts = @(
        @{
            content = "Hello from OpenClaw!"
            scheduled_at = (Get-Date).AddHours(2).ToString("o")
            platforms = @{
                facebook = @{
                    account_id = "acc_fb_123"
                }
                twitter = @{
                    account_id = "acc_tw_456"
                }
            }
        }
    )
} | ConvertTo-Json -Depth 10

$result = Invoke-RestMethod -Uri "$base/posts" -Method POST -Headers $headers -Body $body
$result

# Get post results
$results = Invoke-RestMethod -Uri "$base/post-results?limit=20" -Headers $headers
$results.data | Format-Table post_id, platform, impressions, engagements
```

---

## 🎯 Common Use Cases

### Use Case 1: Schedule a Multi-Platform Post with Image

```powershell
# Step 1: Upload image
$uploadBody = @{
    filename = "promo.jpg"
    content_type = "image/jpeg"
} | ConvertTo-Json

$upload = Invoke-RestMethod -Uri "$base/media/create-upload-url" -Method POST -Headers $headers -Body $uploadBody

# Step 2: Upload file to pre-signed URL
Invoke-WebRequest -Uri $upload.upload_url -Method PUT -InFile "promo.jpg" -ContentType "image/jpeg"

# Step 3: Create post with media
$postBody = @{
    posts = @(
        @{
            content = "Check out our latest offer!"
            scheduled_at = "2026-02-21T10:00:00Z"
            media_ids = @($upload.media_id)
            platforms = @{
                facebook = @{ account_id = "acc_fb_123" }
                instagram = @{ account_id = "acc_ig_456" }
                twitter = @{ account_id = "acc_tw_789" }
            }
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$base/posts" -Method POST -Headers $headers -Body $postBody
```

---

### Use Case 2: Get Performance Report

```powershell
# Get all post results
$results = Invoke-RestMethod -Uri "$base/post-results?limit=100" -Headers $headers

# Calculate totals by platform
$results.data | Group-Object platform | ForEach-Object {
    [PSCustomObject]@{
        Platform = $_.Name
        Posts = $_.Count
        TotalImpressions = ($_.Group.impressions | Measure-Object -Sum).Sum
        TotalEngagements = ($_.Group.engagements | Measure-Object -Sum).Sum
        AvgEngagementRate = [math]::Round((($_.Group.engagements | Measure-Object -Average).Average / ($_.Group.impressions | Measure-Object -Average).Average) * 100, 2)
    }
} | Format-Table
```

---

### Use Case 3: List All Scheduled Posts

```powershell
$posts = Invoke-RestMethod -Uri "$base/posts?limit=100" -Headers $headers
$scheduled = $posts.data | Where-Object { $_.status -eq "scheduled" } | Sort-Object scheduled_at

$scheduled | Select-Object @{N="Scheduled";E={$_.scheduled_at}}, content, @{N="Platforms";E={($_.platforms.PSObject.Properties.Name -join ", ")}} | Format-Table -Wrap
```

---

## ⚠️ Error Handling

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "scheduled_at",
      "message": "Date must be in the future"
    }
  ]
}
```

---

## 🔒 Security Notes

1. **Never commit tokens** - Store in `credentials/postbridge-api-key.txt`
2. **Use HTTPS only** - All API calls must use secure connections
3. **Rotate tokens regularly** - Generate new tokens periodically
4. **Validate uploads** - Check file types and sizes before uploading
5. **Rate limiting** - Respect API rate limits (details in dashboard)

---

## 📝 Notes

- All timestamps use ISO 8601 format (e.g., `2026-02-20T12:00:00Z`)
- Pagination: Use `offset` and `limit` parameters consistently
- Batch operations: POST /v1/posts supports creating multiple posts in one call
- Platform-specific content: Override global content per platform in the `platforms` object
- Media upload: Two-step process (get URL, then upload file)
- Scheduled posts can be updated/deleted; published posts cannot be modified

---

**Built:** 2026-02-20 by OpenClaw  
**Source:** https://api.post-bridge.com/reference
