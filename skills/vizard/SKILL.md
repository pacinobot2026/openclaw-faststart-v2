---
name: vizard
description: Vizard AI API for automated video clipping. Transform long videos into engaging short clips optimized for TikTok, YouTube Shorts, Instagram Reels. AI-powered clip detection, subtitle generation, template customization, multi-platform optimization. Use when asked to clip videos, generate social shorts, create video content, or automate video editing for social media.
---

# Vizard AI API

AI-powered video clipping service that automatically transforms long videos into engaging short clips optimized for social media platforms.

**API Version:** v1  
**Last Updated:** 2026-02-20  
**Base URL:** `https://elb-api.vizard.ai/hvizard-server-front/open-api/v1`

---

## 🔐 Authentication

**Type:** API Key (Custom Header)

**Header Format:**
```
VIZARDAI_API_KEY: YOUR_API_KEY
Content-Type: application/json
```

**Getting Your API Key:**
1. Log in to your Vizard account
2. Ensure you're on a paid plan (API access is paid-only)
3. Go to Workspace Settings
4. Click on the API tab
5. Click "Generate API Key"
6. Copy and securely store your key

**API Key Location:** `credentials/vizard-api-key.txt`

---

## 📚 ENDPOINTS

### 1. POST /project/create (Clipping Mode)

**Purpose:** Submit a long video (1+ minutes) for AI clipping. Vizard will process the video and generate multiple short clips automatically.

**Endpoint:** `POST https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/create`

---

#### ✅ Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `lang` | string | Language code of spoken content in video (see [Supported Languages](#supported-languages)) |
| `preferLength` | array\<int\> | Target clip lengths (see [Clip Length Values](#clip-length-values)) |
| `videoUrl` | string | URL of the video source |
| `videoType` | int | Type of video source (see [Video Type Values](#video-type-values)) |
| `ext` | string | **Required only for videoType=1** - File extension: mp4, 3gp, avi, mov |

---

#### 📏 Video Type Values

| Value | Source | Notes |
|-------|--------|-------|
| `1` | Remote video file | Direct download URL ending in .mp4, .mov, etc. Requires `ext` parameter |
| `2` | YouTube | Standard video URL only (live videos not supported) |
| `3` | Google Drive | Publicly shared link |
| `4` | Vimeo | |
| `5` | StreamYard | |
| `6` | TikTok | |
| `7` | Twitter | |
| `9` | Twitch | |
| `10` | Loom | |
| `11` | Facebook | |
| `12` | LinkedIn | |

**Video Constraints:**
- **Max length:** 600 minutes (10 hours)
- **Max file size:** 10 GB
- **Max resolution:** 4K (output maintains source resolution)
- **Min length:** 1 minute

---

#### ⏱️ Clip Length Values

| Value | Duration | Best For |
|-------|----------|----------|
| `0` | Auto (AI decides) | General use - let AI choose optimal length |
| `1` | <30 seconds | Ultra-short, TikTok, YouTube Shorts |
| `2` | 30-60 seconds | Instagram Reels, standard shorts |
| `3` | 60-90 seconds | Longer-form shorts |
| `4` | 90 seconds - 3 minutes | Extended clips, detailed content |

**Usage Examples:**
- `[0]` - Auto mode (recommended)
- `[1]` - Only clips under 30 seconds
- `[1, 2]` - Clips under 30s AND 30-60s
- `[2, 3, 4]` - All clips 30s or longer

**⚠️ Important:** Value `0` (auto) cannot be combined with other values. `[0, 1]` is invalid.

---

#### 🌍 Supported Languages

| Code | Language | Code | Language |
|------|----------|------|----------|
| `auto` | Auto-detect (recommended) | `en` | English |
| `es` | Spanish | `pt` | Portuguese |
| `fr` | French | `de` | German |
| `ru` | Russian | `zh` | Chinese |
| `ja` | Japanese | `ko` | Korean |
| `it` | Italian | `nl` | Dutch |
| `pl` | Polish | `tr` | Turkish |
| `ar` | Arabic | `hi` | Hindi |

See full list: https://docs.vizard.ai/docs/supported-languages

---

#### ⚙️ Optional Parameters (Advanced)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ratioOfClip` | int | `1` | Aspect ratio of output clips (see [Aspect Ratios](#aspect-ratios)) |
| `templateId` | long | null | Custom template ID for branding/styling |
| `removeSilenceSwitch` | int | `0` | Remove silent gaps and filler words (0=off, 1=on) |
| `maxClipNumber` | int | all | Max clips to return (1-100), ranked by viral score |
| `keyword` | string | null | AI instruction to clip specific moments/topics |
| `subtitleSwitch` | int | `1` | Show subtitles (0=off, 1=on) |
| `emojiSwitch` | int | `0` | Auto emoji in subtitles (0=off, 1=on) |
| `highlightSwitch` | int | `0` | Highlight keywords in subtitles (0=off, 1=on) |
| `autoBrollSwitch` | int | `0` | Add auto B-roll (0=off, 1=on) |
| `headlineSwitch` | int | `1` | AI-generated headline/hook overlay (0=off, 1=on) |
| `projectName` | string | filename/title | Custom project name |

---

#### 📐 Aspect Ratios

| Value | Ratio | Best For |
|-------|-------|----------|
| `1` | 9:16 (Vertical) | TikTok, Instagram Reels, YouTube Shorts (default) |
| `2` | 1:1 (Square) | Instagram Feed, Facebook Feed |
| `3` | 4:5 (Portrait) | Instagram Feed (optimized height) |
| `4` | 16:9 (Horizontal) | YouTube, LinkedIn, Twitter |

**Note:** Template ratio must match `ratioOfClip` value.

---

#### 🎨 Finding Template IDs

1. Log in to Vizard web app
2. Open any video clip editor
3. Switch to "Template" tab
4. Hover over desired template
5. Copy the template ID
6. Use in API request

Both personal templates and Brand Kit templates are supported.

---

#### 🔍 Using Keywords Parameter

The `keyword` parameter lets AI clip only specific moments or topics:

**Examples:**
- `"Find where Sam talks about GPT-5"`
- `"Get moment of Ronaldo's shot"`
- `"Give me a scene where a sea otter sees a hamburger"`

**Notes:**
- Optional - only use when targeting specific content
- Returns fewer but more focused clips
- If AI can't find matching content, may return no clips
- Available in web interface too

---

#### 📤 Request Example (Minimum)

```bash
curl -X POST https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/create \
 -H "Content-Type: application/json" \
 -H "VIZARDAI_API_KEY: YOUR_API_KEY" \
 -d '{
 "lang": "en",
 "preferLength": [0],
 "videoUrl": "https://www.youtube.com/watch?v=OqLfw-TzzfI",
 "videoType": 2
 }'
```

**Python:**
```python
import requests

headers = {
    "Content-Type": "application/json",
    "VIZARDAI_API_KEY": "YOUR_API_KEY"
}

data = {
    "lang": "en",
    "preferLength": [0],
    "videoUrl": "https://www.youtube.com/watch?v=OqLfw-TzzfI",
    "videoType": 2
}

response = requests.post(
    "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/create",
    headers=headers,
    json=data
)

print(response.json())
```

---

#### 📤 Request Example (Advanced)

```bash
curl -X POST https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/create \
 -H "Content-Type: application/json" \
 -H "VIZARDAI_API_KEY: YOUR_API_KEY" \
 -d '{
 "lang": "en",
 "preferLength": [1, 2],
 "videoUrl": "https://www.youtube.com/watch?v=OqLfw-TzzfI",
 "videoType": 2,
 "ratioOfClip": 1,
 "templateId": 52987165,
 "removeSilenceSwitch": 1,
 "maxClipNumber": 10,
 "keyword": "AI, spark, vizard",
 "subtitleSwitch": 1,
 "emojiSwitch": 1,
 "highlightSwitch": 1,
 "headlineSwitch": 1,
 "projectName": "My Awesome Clips"
 }'
```

---

#### 📥 Response

```json
{
  "code": 2000,
  "projectId": 17861706,
  "shareLink": "https://vizard.ai/project?invite=BW77vF&susId=1862",
  "errMsg": ""
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `code` | int | Status code (see [Status Codes](#status-codes)) |
| `projectId` | long | Unique project ID - **SAVE THIS** for retrieving clips |
| `shareLink` | string | Shareable project link (Business/Team plan only) |
| `errMsg` | string | Error message (only when code ≠ 2000) |

**Important:** Code `2000` means request was accepted, NOT that project succeeded. Use GET /project/query to verify actual creation.

---

### 2. GET /project/query/{projectId}

**Purpose:** Retrieve generated clips for a processed project. Use for polling or after webhook notification.

**Endpoint:** `GET https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/query/{projectId}`

---

#### 📋 Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | long | Yes | Project ID returned from POST /project/create |

---

#### ⏱️ Polling Guidelines

**Recommended polling interval:** 30 seconds

**Processing time estimates:**
- Short videos (<10 min): 2-5 minutes
- Medium videos (10-30 min): 5-15 minutes
- Long videos (30-60 min): 15-30 minutes
- 4K videos: Significantly longer

**Example:** 30-minute talking-head video generates 20+ clips in ~10 minutes

---

#### 📤 Request Example

```bash
curl -X GET "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/query/17861706" \
 -H "VIZARDAI_API_KEY: YOUR_API_KEY"
```

**Python:**
```python
import requests

headers = {"VIZARDAI_API_KEY": "YOUR_API_KEY"}
project_id = "17861706"

response = requests.get(
    f"https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/query/{project_id}",
    headers=headers
)

print(response.json())
```

---

#### 📥 Response (Success)

```json
{
  "code": 2000,
  "shareLink": "https://vizard.ai/project?invite=BW77vF&susId=1862",
  "videos": [
    {
      "videoId": 14015572,
      "videoUrl": "https://cdn-video.vizard.ai/vizard/video/export/...",
      "videoMsDuration": 80400,
      "title": "Transform Content Creation with Spark 1.0's AI Video Editing",
      "transcript": "Hi, we're here with Vizard...",
      "viralScore": "10",
      "viralReason": "This clip leverages the appeal of AI technology...",
      "relatedTopic": "[]",
      "clipEditorUrl": "https://vizard.ai/editor?id=99058552&type=clip"
    }
  ],
  "projectId": 17861706,
  "projectName": "My first project"
}
```

**Response Fields (Top Level):**

| Field | Type | Description |
|-------|------|-------------|
| `code` | int | 2000 = success, 1000 = still processing |
| `projectId` | long | Project ID queried |
| `projectName` | string | Project name |
| `shareLink` | string | Shareable link (Business/Team only) |
| `videos` | array | List of generated clips (sorted by viral score) |

**Video Object Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `videoId` | long | Unique clip identifier |
| `videoUrl` | string | **Temporary download URL** (valid 7 days) |
| `videoMsDuration` | long | Duration in milliseconds |
| `title` | string | AI-generated clip title |
| `transcript` | string | Full transcript of the clip |
| `viralScore` | string | Engagement potential score (0-10, higher = better) |
| `viralReason` | string | Explanation of engagement potential |
| `relatedTopic` | string | Stringified JSON array of keywords/topics |
| `clipEditorUrl` | string | Web editor URL for this clip |

**⚠️ Important:** `videoUrl` expires after 7 days. Re-query the API to get a fresh link.

---

#### 📥 Response (Still Processing)

```json
{
  "code": 1000,
  "videos": [],
  "projectId": 17861706
}
```

When `code` is `1000`, the video is still processing. Poll again after 30+ seconds.

---

### 3. POST /project/create (Editing Mode)

**Purpose:** Submit a SHORT video (<3 minutes) for editing. Add subtitles, B-rolls, emojis, headlines, templates, etc. to an existing short video.

**Endpoint:** `POST https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/create`

**Key Difference:** Set `"getClips": 0` to enable editing mode instead of clipping mode.

---

#### ✅ Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `getClips` | int | **Must be 0** for editing mode (0=edit, 1=clip) |
| `lang` | string | Language code (auto, en, es, etc.) |
| `videoUrl` | string | URL of the SHORT video to edit |
| `videoType` | int | Source type (same as clipping mode) |
| `ext` | string | **Required for videoType=1** - File extension |

**⚠️ Video must be under 3 minutes.** Longer videos will return error code `4005`.

---

#### ⚙️ Optional Parameters (Same as Clipping Mode)

All the advanced options from clipping mode apply here:
- `ratioOfClip` - Aspect ratio (can differ from source)
- `templateId` - Custom branding template
- `removeSilenceSwitch` - Remove silent gaps
- `subtitleSwitch` - Show/hide subtitles
- `emojiSwitch` - Add emojis to subtitles
- `highlightSwitch` - Highlight keywords
- `autoBrollSwitch` - Add B-roll footage
- `headlineSwitch` - Add hook/headline overlay
- `projectName` - Custom project name

**Note:** If template has headline disabled, `headlineSwitch` parameter is ignored.

---

#### 📤 Request Example (Editing Mode)

```bash
curl -X POST https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/create \
 -H "Content-Type: application/json" \
 -H "VIZARDAI_API_KEY: YOUR_API_KEY" \
 -d '{
 "getClips": 0,
 "videoUrl": "https://www.youtube.com/watch?v=short-video",
 "videoType": 2,
 "lang": "auto",
 "ratioOfClip": 1,
 "subtitleSwitch": 1,
 "emojiSwitch": 1,
 "autoBrollSwitch": 1,
 "headlineSwitch": 1,
 "templateId": 52987165,
 "projectName": "My Edited Short"
 }'
```

**Python:**
```python
data = {
    "getClips": 0,  # Editing mode
    "videoUrl": "https://youtu.be/short-video",
    "videoType": 2,
    "lang": "auto",
    "ratioOfClip": 1,
    "subtitleSwitch": 1,
    "emojiSwitch": 1,
    "highlightSwitch": 1,
    "autoBrollSwitch": 1,
    "headlineSwitch": 1,
    "removeSilenceSwitch": 1,
    "templateId": 52987165,
    "projectName": "My Edited Video"
}

response = requests.post(
    "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/create",
    headers=headers,
    json=data
)
```

**Response:** Same format as clipping mode (returns projectId, use GET /project/query to retrieve edited video)

---

### 4. GET /project/social-accounts

**Purpose:** Retrieve list of social media accounts connected to your Vizard workspace. Use these IDs when publishing clips.

**Endpoint:** `GET https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/social-accounts`

**Supported Platforms:**
- TikTok
- YouTube
- Instagram
- Facebook
- Twitter (X)
- LinkedIn

---

#### 📤 Request Example

```bash
curl -X GET "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/social-accounts" \
 -H "VIZARDAI_API_KEY: YOUR_API_KEY"
```

**Python:**
```python
response = requests.get(
    "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/social-accounts",
    headers=headers
)
print(response.json())
```

---

#### 📥 Response

```json
{
  "accounts": [
    {
      "id": "12345",
      "platform": "Instagram",
      "username": "user123",
      "page": "pagename",
      "profilePic": "https://example.com/profile.jpg",
      "pageProfilePic": "https://example.com/profile.jpg",
      "expiresAt": 1712956800,
      "status": "active"
    }
  ],
  "total": 10
}
```

**Account Object Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | **Use this as socialAccountId when publishing** |
| `platform` | string | Platform name (Instagram, TikTok, YouTube, etc.) |
| `username` | string | Username of connected account |
| `page` | string | Page name (for Facebook Pages) |
| `profilePic` | string | User profile image URL |
| `pageProfilePic` | string | Page profile image URL (if applicable) |
| `expiresAt` | long | Unix timestamp when authorization expires (ms) |
| `status` | string | Account status (see below) |

**Status Values:**

| Status | Meaning |
|--------|---------|
| `active` | Ready to publish |
| `expired` | Authorization expired, need to reconnect |
| `locked` | Connected but disabled (plan limit reached) |
| `not connected` | Account not connected |

---

### 5. POST /project/publish-video

**Purpose:** Publish a generated clip to a connected social media account. Optionally schedule for future publishing.

**Endpoint:** `POST https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/publish-video`

**Supported Platforms:** TikTok, YouTube, Instagram, Facebook, Twitter (X), LinkedIn

**AI Auto-Caption:** If `post` is empty, Vizard generates caption and hashtags automatically.

---

#### ✅ Required Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `finalVideoId` | long | Yes | Video ID from GET /project/query response (`videoId` field) |
| `socialAccountId` | string | Yes | Social account ID from GET /project/social-accounts |

#### ⚙️ Optional Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `publishTime` | long | No | Unix timestamp (ms) for scheduled publishing. Omit for immediate publishing. |
| `post` | string | No | Video description/caption. Empty = AI-generated. See [character limits](#character-limits) |
| `title` | string | No | **YouTube only** - Video title. Empty = AI-generated. Max 100 chars. |

---

#### 📏 Character Limits by Platform

| Platform | Caption Limit | Title Limit |
|----------|---------------|-------------|
| TikTok | 2,200 | N/A |
| YouTube | 5,000 | 100 |
| Instagram | 2,200 | N/A |
| Facebook | 2,200 | N/A |
| Twitter (X) | 280 | N/A |
| LinkedIn | 3,000 | N/A |

---

#### 📤 Request Example (Immediate Publishing)

```bash
curl -X POST "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/publish-video" \
 -H "Content-Type: application/json" \
 -H "VIZARDAI_API_KEY: YOUR_API_KEY" \
 -d '{
 "finalVideoId": 14015572,
 "socialAccountId": "123456",
 "post": "Check out this amazing video! 🔥",
 "title": "My Awesome Video"
 }'
```

**Python:**
```python
data = {
    "finalVideoId": 14015572,
    "socialAccountId": "123456",
    "post": "Check out this amazing video! 🔥",
    "title": "My Awesome Video"  # YouTube only
}

response = requests.post(
    "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/publish-video",
    headers=headers,
    json=data
)
```

---

#### 📤 Request Example (Scheduled Publishing)

```python
import time

# Schedule for 2 hours from now
publish_time = int((time.time() + 7200) * 1000)  # Convert to milliseconds

data = {
    "finalVideoId": 14015572,
    "socialAccountId": "123456",
    "publishTime": publish_time,
    "post": "",  # AI will generate
    "title": ""  # AI will generate (YouTube only)
}

response = requests.post(
    "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/publish-video",
    headers=headers,
    json=data
)
```

---

#### 📥 Response

```json
{
  "code": 2000
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `code` | int | Status code (2000 = success) |
| `errMsg` | string | Error message (only when code ≠ 2000) |

**Status Codes:**

| Code | Meaning |
|------|---------|
| `2000` | Publish succeeded |
| `-1000` | Invalid request parameters |
| `4001` | Invalid API key |
| `4004` | Feature requires plan upgrade |
| `4006` | Illegal parameter |
| `4011` | Invalid social account ID |

---

### 6. POST /project/ai-social

**Purpose:** Generate AI-powered social media caption for a clip. Customize tone, voice, and platform style.

**Endpoint:** `POST https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/ai-social`

**Use Cases:**
- Custom automation workflows (Make.com, n8n)
- Generate multiple caption variations
- Fine-tune caption style before publishing

**Note:** Only works for videos with spoken dialogue. Silent videos not supported.

**Auto-Caption in Publish:** When using POST /project/publish-video, caption is auto-generated if `post` is empty. This endpoint provides more control for custom workflows.

---

#### ✅ Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `finalVideoId` | long | Video ID from GET /project/query (`videoId` field) |

#### ⚙️ Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `aiSocialPlatform` | int | 1 | Target platform style (see values below) |
| `tone` | int | 0 | Caption tone (see values below) |
| `voice` | int | 0 | Voice style (0=first person, 1=third person) |

**Platform Values:**

| Value | Platform |
|-------|----------|
| 1 | General (default) |
| 2 | TikTok |
| 3 | Instagram |
| 4 | YouTube |
| 5 | Facebook |
| 6 | LinkedIn |
| 7 | Twitter |

**Tone Values:**

| Value | Tone |
|-------|------|
| 0 | Neutral (default) |
| 1 | Interesting |
| 2 | Catchy |
| 3 | Serious |
| 4 | Question |

**Voice Values:**

| Value | Style |
|-------|-------|
| 0 | First person (default) - "I", "we" |
| 1 | Third person - "they", "it" |

---

#### 📤 Request Example

```bash
curl -X POST "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/ai-social" \
 -H "Content-Type: application/json" \
 -H "VIZARDAI_API_KEY: YOUR_API_KEY" \
 -d '{
 "finalVideoId": 14015572,
 "aiSocialPlatform": 2,
 "tone": 2,
 "voice": 0
 }'
```

**Python:**
```python
data = {
    "finalVideoId": 14015572,
    "aiSocialPlatform": 2,  # TikTok style
    "tone": 2,  # Catchy
    "voice": 0  # First person
}

response = requests.post(
    "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/ai-social",
    headers=headers,
    json=data
)
print(response.json())
```

---

#### 📥 Response

```json
{
  "code": 2000,
  "aiSocialContent": "Unlock your creativity and elevate your video-making skills with Spark 1.0! 🚀✨ Whether you're a seasoned creator or just starting out, this next-gen video understanding model simplifies the way you edit and share your content...",
  "aiSocialTitle": "Transform Your Videos with Spark 1.0"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `code` | int | Status code (2000 = success) |
| `aiSocialContent` | string | Generated social post caption |
| `aiSocialTitle` | string | Generated YouTube title (YouTube requests only) |
| `errMsg` | string | Error message (only when failed) |

**Status Codes:**

| Code | Meaning |
|------|---------|
| `2000` | Success |
| `-1000` | Invalid request parameters |
| `4001` | Invalid API key |
| `4002` | No speech/dialogue detected in video |
| `4006` | Illegal parameter |

**Processing Time:** Response may take a few seconds to a couple of minutes.

---

## 📊 Status Codes

### POST /project/create Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| `2000` | Request accepted, project being created | Use projectId to poll for results |
| `4001` | Invalid API key | Check your API key |
| `4002` | Project creation failed | Check parameters and video URL |
| `4003` | Rate limit exceeded | Wait and retry (see [Rate Limits](#rate-limits)) |
| `4004` | Unsupported video format | Use supported format (mp4, mov, avi, 3gp) |
| `4005` | Video file is broken/corrupted | Use different video |
| `4006` | Illegal parameter | Check parameter formats and values |
| `4007` | Insufficient remaining minutes | Upgrade plan or wait for reset |
| `4008` | Cannot download video from URL | Check URL accessibility |
| `4009` | Invalid video URL | Verify URL format and accessibility |
| `4010` | Cannot detect spoken language | Set `lang` to specific code (not auto) |

**Note:** Code `2000` doesn't guarantee project success (e.g., Google Drive access errors). Always verify with GET /project/query.

### GET /project/query Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| `2000` | Success - clips retrieved | Download clips from videoUrl |
| `1000` | Still processing | Poll again after 30 seconds |
| `4001` | Invalid API key | Check your API key |
| `4002` | Clipping failed | Check source video quality/format |
| `4003` | Rate limit exceeded | Wait and retry |
| `4004` | Unsupported video format | Use supported format |
| `4005` | Invalid URL or video too long | Check constraints |
| `4006` | Illegal parameter | Verify projectId format |
| `4007` | Insufficient account time | Upgrade plan |
| `4008` | Failed to download video | Check source URL |

---

## ⏳ Rate Limits

**API access requires a paid plan.**

**Rate Limits (POST /project/create only):**
- **3 requests per minute**
- **20 requests per hour**

When limit is exceeded:
- Response code: `4003`
- Wait before retrying

**High-Volume Users:** Contact [[email protected]](mailto:[email protected]) for custom increased limits.

**Note:** Rate limits apply to video submission endpoint only, not to query/publish/social endpoints.

---

## 🚀 Common Workflows

### Workflow 1: Basic Video Clipping (Auto Settings)

```python
import requests
import time

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1"
headers = {"VIZARDAI_API_KEY": API_KEY, "Content-Type": "application/json"}

# Step 1: Submit video
data = {
    "lang": "en",
    "preferLength": [0],  # Auto length
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "videoType": 2
}

response = requests.post(f"{BASE_URL}/project/create", headers=headers, json=data)
result = response.json()

if result["code"] != 2000:
    print(f"Error: {result['errMsg']}")
    exit()

project_id = result["projectId"]
print(f"Project created: {project_id}")

# Step 2: Poll for results (every 30 seconds)
while True:
    time.sleep(30)
    
    response = requests.get(f"{BASE_URL}/project/query/{project_id}", headers=headers)
    result = response.json()
    
    if result["code"] == 2000 and len(result["videos"]) > 0:
        print(f"✓ Found {len(result['videos'])} clips!")
        
        for i, clip in enumerate(result["videos"], 1):
            print(f"\nClip {i}:")
            print(f"  Title: {clip['title']}")
            print(f"  Duration: {clip['videoMsDuration'] / 1000}s")
            print(f"  Viral Score: {clip['viralScore']}/10")
            print(f"  Download: {clip['videoUrl']}")
        
        break
    elif result["code"] == 1000:
        print("Still processing...")
    else:
        print(f"Error: {result.get('errMsg', 'Unknown error')}")
        break
```

---

### Workflow 2: Custom Template + Vertical Shorts

```python
# Submit with custom branding
data = {
    "lang": "en",
    "preferLength": [1, 2],  # Under 60 seconds
    "videoUrl": "https://youtu.be/example",
    "videoType": 2,
    "ratioOfClip": 1,  # 9:16 vertical
    "templateId": 52987165,  # Your brand template
    "removeSilenceSwitch": 1,  # Remove pauses
    "maxClipNumber": 5,  # Top 5 clips only
    "headlineSwitch": 1,  # Add hooks
    "projectName": "My TikTok Content"
}

response = requests.post(f"{BASE_URL}/project/create", headers=headers, json=data)
# ... polling code same as above
```

---

### Workflow 3: Topic-Specific Clipping

```python
# Extract only clips about specific topics
data = {
    "lang": "en",
    "preferLength": [0],
    "videoUrl": "https://youtu.be/podcast-episode",
    "videoType": 2,
    "keyword": "Find where the guest talks about AI and future of work",
    "maxClipNumber": 3,  # Just top 3 matches
    "projectName": "AI Future of Work Clips"
}

response = requests.post(f"{BASE_URL}/project/create", headers=headers, json=data)
# Note: May return fewer clips or none if no matches found
```

---

### Workflow 4: Edit Short Video + Custom Branding

```python
# Edit an existing short video (under 3 min)
data = {
    "getClips": 0,  # Editing mode
    "videoUrl": "https://youtu.be/my-short-video",
    "videoType": 2,
    "lang": "en",
    "ratioOfClip": 1,  # Convert to 9:16 vertical
    "templateId": 52987165,  # Brand template
    "subtitleSwitch": 1,
    "emojiSwitch": 1,
    "highlightSwitch": 1,
    "autoBrollSwitch": 1,
    "headlineSwitch": 1,
    "removeSilenceSwitch": 1,
    "projectName": "Branded Short"
}

response = requests.post(f"{BASE_URL}/project/create", headers=headers, json=data)
# Poll same as clipping mode
```

---

### Workflow 5: Auto-Publish to Social Media

```python
# Step 1: Get clips
project_id = 17861706
result = requests.get(f"{BASE_URL}/project/query/{project_id}", headers=headers).json()

# Step 2: Get connected accounts
accounts = requests.get(f"{BASE_URL}/project/social-accounts", headers=headers).json()

# Step 3: Find TikTok account
tiktok_account = next(a for a in accounts["accounts"] if a["platform"] == "TikTok" and a["status"] == "active")

# Step 4: Publish top clip immediately (AI generates caption)
publish_data = {
    "finalVideoId": result["videos"][0]["videoId"],
    "socialAccountId": tiktok_account["id"],
    "post": "",  # AI auto-generates
    "title": ""  # Not used for TikTok
}

publish_response = requests.post(f"{BASE_URL}/project/publish-video", headers=headers, json=publish_data)
print(f"Published: {publish_response.json()}")
```

---

### Workflow 6: Generate Custom Caption + Scheduled Publish

```python
import time

# Step 1: Generate custom caption
video_id = 14015572
caption_data = {
    "finalVideoId": video_id,
    "aiSocialPlatform": 3,  # Instagram style
    "tone": 2,  # Catchy
    "voice": 0  # First person
}

caption_response = requests.post(f"{BASE_URL}/project/ai-social", headers=headers, json=caption_data).json()
custom_caption = caption_response["aiSocialContent"]

# Step 2: Schedule publish for 3 hours from now
publish_time = int((time.time() + 10800) * 1000)  # 3 hours in milliseconds

publish_data = {
    "finalVideoId": video_id,
    "socialAccountId": "123456",
    "publishTime": publish_time,
    "post": custom_caption
}

requests.post(f"{BASE_URL}/project/publish-video", headers=headers, json=publish_data)
print(f"Scheduled for {time.ctime(publish_time / 1000)}")
```

---

### Workflow 7: Multi-Platform Publishing

```python
# Publish same clip to multiple platforms
video_id = 14015572

# Get all active accounts
accounts = requests.get(f"{BASE_URL}/project/social-accounts", headers=headers).json()
active_accounts = [a for a in accounts["accounts"] if a["status"] == "active"]

# Publish to each platform
for account in active_accounts:
    # Generate platform-specific caption
    platform_map = {
        "TikTok": 2, "Instagram": 3, "YouTube": 4,
        "Facebook": 5, "LinkedIn": 6, "Twitter": 7
    }
    
    caption_data = {
        "finalVideoId": video_id,
        "aiSocialPlatform": platform_map.get(account["platform"], 1),
        "tone": 2,  # Catchy
        "voice": 0
    }
    
    caption = requests.post(f"{BASE_URL}/project/ai-social", headers=headers, json=caption_data).json()
    
    # Publish
    publish_data = {
        "finalVideoId": video_id,
        "socialAccountId": account["id"],
        "post": caption["aiSocialContent"]
    }
    
    if account["platform"] == "YouTube":
        publish_data["title"] = caption.get("aiSocialTitle", "My Video")
    
    requests.post(f"{BASE_URL}/project/publish-video", headers=headers, json=publish_data)
    print(f"✓ Published to {account['platform']} (@{account['username']})")
```

---

### Workflow 8: PowerShell Automation

```powershell
$apiKey = Get-Content "credentials/vizard-api-key.txt"
$headers = @{
    "VIZARDAI_API_KEY" = $apiKey
    "Content-Type" = "application/json"
}
$base = "https://elb-api.vizard.ai/hvizard-server-front/open-api/v1"

# Submit video
$body = @{
    lang = "en"
    preferLength = @(0)
    videoUrl = "https://www.youtube.com/watch?v=example"
    videoType = 2
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$base/project/create" -Method POST -Headers $headers -Body $body

if ($response.code -eq 2000) {
    $projectId = $response.projectId
    Write-Host "Project created: $projectId"
    
    # Poll for results
    do {
        Start-Sleep -Seconds 30
        $result = Invoke-RestMethod -Uri "$base/project/query/$projectId" -Headers $headers
        
        if ($result.code -eq 2000 -and $result.videos.Count -gt 0) {
            Write-Host "✓ Found $($result.videos.Count) clips!"
            $result.videos | ForEach-Object {
                Write-Host "`nTitle: $($_.title)"
                Write-Host "Viral Score: $($_.viralScore)/10"
                Write-Host "Download: $($_.videoUrl)"
            }
            break
        } elseif ($result.code -eq 1000) {
            Write-Host "Still processing..."
        } else {
            Write-Host "Error: $($result.errMsg)"
            break
        }
    } while ($true)
} else {
    Write-Host "Error: $($response.errMsg)"
}
```

---

## 🔒 Security Best Practices

1. **Never commit API keys** - Store in `credentials/vizard-api-key.txt`
2. **Use HTTPS only** - All endpoints require secure connections
3. **Validate video URLs** - Check URLs before submitting
4. **Handle expired videoUrl** - Re-query API when download links expire
5. **Rotate keys periodically** - Generate new keys regularly
6. **Monitor usage** - Track API calls to avoid rate limits

---

## 📝 Notes

- **Paid plans only** - API access requires paid subscription
- **Processing time** - Varies by video length and resolution (4K takes longer)
- **Polling interval** - Recommended 30 seconds to balance responsiveness and API load
- **Video URL expiry** - Download links expire after 7 days, re-query for new links
- **Clip ranking** - Videos array sorted by viral score (highest engagement potential first)
- **Template matching** - Template aspect ratio must match `ratioOfClip` parameter
- **Keyword specificity** - More specific keywords = fewer but more targeted clips
- **Auto mode** - `preferLength: [0]` recommended for general use
- **Silent removal** - Can make videos feel choppy if overused, test carefully

---

## 🆘 Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Code 4001 | Invalid API key | Verify key from dashboard, check header format |
| Code 4003 | Rate limit hit | Wait, then retry. Check plan limits |
| Code 4008 | Can't download video | Ensure URL is publicly accessible |
| Code 4009 | Invalid URL | Check URL format, test in browser |
| Code 4010 | Language detection failed | Set `lang` to specific code (not auto) |
| Empty videos array | Still processing | Continue polling every 30s |
| Video URL 403/404 | Link expired (7 days) | Re-query API for fresh download link |
| No clips returned | Keywords too specific | Broaden keywords or remove parameter |
| Project creation says success but query fails | Source error (e.g., Google Drive) | Use GET /project/query to verify |

---

**Built:** 2026-02-20 by OpenClaw  
**Source:** https://docs.vizard.ai/docs  
**Endpoints:** 6 (create clipping + create editing + query + social accounts + publish + AI caption)  
**Pages Ingested:** 13 documentation pages  
**Extraction:** Complete - all parameters, schemas, errors, examples, workflows
