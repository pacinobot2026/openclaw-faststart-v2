# Titanium Software APIs

API documentation for the Titanium software suite.

## Platforms

| Platform | Base URL | Auth | Docs Status |
|----------|----------|------|-------------|
| Global Control | `https://api.globalcontrol.io/api` | X-API-KEY header | ⚠️ Partial |
| MintBird | TBD | TBD | ❌ Needed |
| PopLinks | TBD | TBD | ❌ Needed |
| Course Sprout | TBD | TBD | ❌ Needed |
| Quizforma | TBD | TBD | ❌ Needed |
| Letterman | TBD | TBD | ❌ Needed |

## Global Control API

**Base URL:** `https://api.globalcontrol.io/api`

**Authentication:**
```
X-API-KEY: your-api-token
```

### Known Endpoints (partial list)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get authenticated user info |
| GET | `/integrations` | Get all integrations |

*More endpoints in full Postman collection - need complete export*

## How to Add API Docs

1. Export from Postman as Collection v2.1
2. Save to `docs/apis/{platform}-api.json`
3. I'll parse and create skills automatically
