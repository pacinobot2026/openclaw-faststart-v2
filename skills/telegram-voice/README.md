# 🎬 OpenClaw Telegram Voice Conversation Mode

**2-way voice conversation system for Telegram**

Speak to OpenClaw via voice notes, get voice replies back. Natural conversation flow with full context memory.

---

## Features

✅ **2-Way Audio** - Send voice, receive voice  
✅ **Automatic Transcription** - OpenAI Whisper STT  
✅ **Natural Voice** - ElevenLabs TTS with Chad's voice  
✅ **Context Memory** - Remembers last 20 turns  
✅ **Error Recovery** - Auto-retry with fallbacks  
✅ **Commands** - /voice_on, /voice_off, /reset  
✅ **Session Persistence** - Redis storage (with in-memory fallback)  
✅ **Multi-User** - Separate sessions per user  

---

## Quick Start

```bash
# 1. Install
cd skills/telegram-voice
npm install

# 2. Start server
npm start

# 3. Run tests
node test.js

# 4. Set up webhook (see SETUP.md)
```

**Full instructions:** See `SETUP.md`

---

## Architecture

```
Voice Note → Telegram → Webhook → STT (Whisper) → LLM (Claude) → TTS (ElevenLabs) → Voice Reply
                                         ↓
                                   Redis Session Memory
```

---

## Environment Variables

All credentials are pre-configured in `.env.example`:

| Variable | Value |
|----------|-------|
| `TELEGRAM_BOT_TOKEN` | ✅ Set |
| `STT_API_KEY` (OpenAI) | ✅ Set |
| `TTS_API_KEY` (ElevenLabs) | ✅ Set |
| `TTS_VOICE_ID` (Chad's voice) | ✅ Set |

Just copy `.env.example` → `.env` and you're ready!

---

## Conversation Flow

**User:** [Voice] "Hey OpenClaw, can you hear me?"  
**Bot:** [Voice] "Yes. I can hear you. What are we building today?"  
**Bot:** [Text] 🎤 Heard: "Hey OpenClaw, can you hear me?"  
         🔊 Said: "Yes. I can hear you. What are we building today?"

---

## Commands

| Command | Action |
|---------|--------|
| `/voice_on` | Enable voice mode (default) |
| `/voice_off` | Text replies only |
| `/reset` | Clear conversation memory |

---

## Session Memory

- **Storage:** Redis (24h TTL) with Map fallback
- **Context:** Last 20 conversation turns
- **Keyed by:** `user_id:chat_id`
- **Auto-cleanup:** Old turns dropped as new ones arrive

---

## Error Handling

| Error | Behavior |
|-------|----------|
| STT fails | Retry once → fallback → send audio apology |
| TTS fails | Retry once → fallback → text-only last resort |
| LLM fails | Generic fallback response |
| Download fails | Send error message |

---

## Testing

```bash
# Run full test suite
node test.js
```

Tests:
1. ✅ Telegram Bot API connection
2. ✅ Webhook configuration
3. ✅ STT provider (OpenAI)
4. ✅ TTS provider (ElevenLabs)
5. ✅ FFmpeg installation
6. ✅ Local server status

---

## Files

```
telegram-voice/
├── server.js          # Main server (complete implementation)
├── package.json       # Dependencies
├── .env.example       # Environment variables (pre-filled)
├── SETUP.md          # Full setup guide
├── test.js           # Test suite
└── README.md         # This file
```

---

## Production Deployment

Use PM2 for 24/7 operation:

```bash
pm2 start server.js --name telegram-voice
pm2 save
pm2 startup
```

See `SETUP.md` for full production deployment guide.

---

## Deliverables

✅ **A) Telegram webhook endpoint** - `/telegram/webhook`  
✅ **B) Environment variables** - All pre-configured in `.env.example`  
✅ **C) Setup instructions** - Complete in `SETUP.md`  
✅ **D) Test suite** - Run with `node test.js`  

---

## Status

🟢 **READY FOR TESTING**

Run the 3 tests from the original spec:

**Test 1:** Send voice "Hey OpenClaw, can you hear me?"  
→ Expected: Voice reply "Yes. I can hear you. What are we building today?"

**Test 2:** Two-step instruction  
→ Expected: Remembers step one and handles both

**Test 3:** Simulate STT failure  
→ Expected: Retries and still returns voice reply

---

Built by Pacino 🎬 for Chad  
2026-02-26
