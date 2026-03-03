# 🎬 TELEGRAM VOICE CONVERSATION MODE - SETUP GUIDE

## Quick Start

### 1. Install Dependencies
```bash
cd skills/telegram-voice
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
copy .env.example .env

# Edit if needed (default values already set for Chad's setup)
```

### 3. Start Redis (Required for production, optional for testing)
```bash
# Windows (if you have Redis installed):
redis-server

# OR use in-memory fallback (no Redis needed)
# The server will auto-detect and use Map() instead
```

### 4. Start the Server
```bash
npm start
```

You should see:
```
🎬 OPENCLAW TELEGRAM VOICE CONVERSATION MODE
==================================================
Telegram Bot Token: 8202817378:AAFGzb...
STT Provider: OPENAI_WHISPER
TTS Provider: ELEVENLABS
TTS Voice: PeMXWXe7DDCb8HldBr2s
Port: 3000
==================================================
✅ Server listening on port 3000
```

---

## Setting Up Telegram Webhook

### Option A: Using ngrok (For Local Testing)

1. **Install ngrok:**
```bash
# Download from https://ngrok.com/download
# Or use choco:
choco install ngrok
```

2. **Start ngrok tunnel:**
```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

3. **Set Telegram webhook:**
```bash
curl -X POST "https://api.telegram.org/bot8202817378:AAFGzbzhwMb8VdskVzuzBi6hES2FGbBxS54/setWebhook" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://YOUR-NGROK-URL.ngrok.io/telegram/webhook\"}"
```

Replace `YOUR-NGROK-URL` with your ngrok URL.

4. **Verify webhook:**
```bash
curl "https://api.telegram.org/bot8202817378:AAFGzbzhwMb8VdskVzuzBi6hES2FGbBxS54/getWebhookInfo"
```

### Option B: Using Public Server

If you have a public domain/IP:

```bash
curl -X POST "https://api.telegram.org/bot8202817378:AAFGzbzhwMb8VdskVzuzBi6hES2FGbBxS54/setWebhook" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://your-domain.com/telegram/webhook\"}"
```

---

## Testing the System

### Test 1: Basic Voice Conversation
1. Open Telegram
2. Find your bot (@moltbot or whatever name)
3. Send a voice message: **"Hey OpenClaw, can you hear me?"**
4. ✅ **Expected:** You receive a voice reply: "Yes. I can hear you. What are we building today?"
5. ✅ **Expected:** Text transcript showing what you said and what it replied

### Test 2: Multi-Turn Conversation
1. Send voice: "Let's build a todo app"
2. Bot replies with voice
3. Send voice: "What should we start with?"
4. ✅ **Expected:** Bot remembers context from previous turn

### Test 3: Error Recovery (Simulated STT Failure)
To test error handling, temporarily break the STT API key:
1. Edit `.env` and change `STT_API_KEY` to something invalid
2. Restart server
3. Send a voice message
4. ✅ **Expected:** Bot retries once, then sends voice saying "I couldn't hear that clearly. Try again."

Restore the correct API key when done.

### Test 4: Commands
```
/voice_on   → Enables voice mode (default: ON)
/voice_off  → Disables voice mode (text replies only)
/reset      → Clears conversation memory
```

---

## Monitoring & Logs

The server outputs detailed logs for each step:
```
📥 Processing voice from user 1643094246 in chat -1003543125728
📂 File path: voice/file_123.oga
💾 Downloaded: temp/download_1234567890.oga
🎤 Heard: "Hey OpenClaw, can you hear me?"
🤖 Reply: "Yes. I can hear you. What are we building today?"
🔊 Voice generated: temp/tts_1234567891.ogg
✅ Voice sent
💾 Session saved
```

---

## Session Memory

Sessions are stored by: `user_id:chat_id`

**Storage:**
- **Production:** Redis (24h TTL)
- **Fallback:** In-memory Map (lost on restart)

**Context limit:** Last 20 turns (configurable via `MAX_CONTEXT_TURNS`)

**Cleanup:** Automatic. Old turns are dropped as new ones arrive.

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | (pre-filled) | Your Telegram bot token |
| `STT_PROVIDER` | ✅ | OPENAI_WHISPER | Speech-to-text provider |
| `STT_API_KEY` | ✅ | (pre-filled) | OpenAI API key |
| `TTS_PROVIDER` | ✅ | ELEVENLABS | Text-to-speech provider |
| `TTS_API_KEY` | ✅ | (pre-filled) | ElevenLabs API key |
| `TTS_VOICE_ID` | ✅ | (Chad's voice) | ElevenLabs voice ID |
| `TTS_MODEL` | ❌ | eleven_turbo_v2_5 | ElevenLabs model |
| `PORT` | ❌ | 3000 | Server port |
| `REDIS_URL` | ❌ | redis://localhost:6379 | Redis connection |
| `OPENCLAW_TOKEN` | ❌ | (pre-filled) | Gateway auth token |

---

## Troubleshooting

### "Redis unavailable, using in-memory storage"
**Fix:** This is OK for testing. For production, start Redis:
```bash
redis-server
```

### "STT error: 401 Unauthorized"
**Fix:** Check `STT_API_KEY` in `.env`

### "TTS error: Invalid voice_id"
**Fix:** Verify `TTS_VOICE_ID` matches your ElevenLabs account

### Bot doesn't respond to voice
**Fix:** 
1. Check webhook is set: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
2. Check server logs for errors
3. Verify ngrok tunnel is still running

### Voice sounds wrong/robotic
**Fix:** Make sure `TTS_MODEL=eleven_turbo_v2_5` (NOT eleven_monolingual_v1)

---

## Production Deployment

For 24/7 operation:

1. **Use PM2:**
```bash
npm install -g pm2
pm2 start server.js --name telegram-voice
pm2 save
pm2 startup
```

2. **Use a real domain** (not ngrok)

3. **Enable Redis** for persistent session memory

4. **Monitor logs:**
```bash
pm2 logs telegram-voice
```

---

## Architecture Overview

```
┌─────────────┐
│  Telegram   │ Voice Note
│   (User)    ├──────────┐
└─────────────┘          │
                         ▼
                  ┌──────────────┐
                  │   Webhook    │
                  │  /telegram/  │
                  │   webhook    │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Download    │
                  │    Audio     │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ STT (Whisper)│ ──► Text
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ LLM (Claude) │ ──► Reply Text
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │TTS (ElevenLabs)│ ──► Audio
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Send Voice  │
                  │  + Transcript│
                  └──────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Save Session │
                  │   (Redis)    │
                  └──────────────┘
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/telegram/webhook` | POST | Telegram updates |

---

**All set! Send a voice note to test.** 🎤
