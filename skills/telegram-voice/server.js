/**
 * OPENCLAW TELEGRAM VOICE CONVERSATION MODE (2-WAY AUDIO)
 * Complete implementation of voice-to-voice conversation via Telegram
 */

require('dotenv').config();

const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { createClient } = require('redis');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

// ========================================
// ENVIRONMENT CONFIGURATION
// ========================================
const CONFIG = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8202817378:AAFGzbzhwMb8VdskVzuzBi6hES2FGbBxS54',
  
  // STT Configuration
  STT_PROVIDER: process.env.STT_PROVIDER || 'OPENAI_WHISPER',
  STT_API_KEY: process.env.STT_API_KEY || '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',
  
  // TTS Configuration
  TTS_PROVIDER: process.env.TTS_PROVIDER || 'ELEVENLABS',
  TTS_API_KEY: process.env.TTS_API_KEY || 'sk_86798b0bdcc222bd06e4c12452b88191c3b3bb20752b6569',
  TTS_VOICE_ID: process.env.TTS_VOICE_ID || 'PeMXWXe7DDCb8HldBr2s', // Chad's voice
  TTS_MODEL: process.env.TTS_MODEL || 'eleven_turbo_v2_5',
  
  // General settings
  AUDIO_FORMAT: 'ogg_opus',
  MAX_CONTEXT_TURNS: 20,
  PORT: process.env.PORT || 3000,
  TEMP_DIR: path.join(__dirname, 'temp'),
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
};

// Create temp directory
if (!fs.existsSync(CONFIG.TEMP_DIR)) {
  fs.mkdirSync(CONFIG.TEMP_DIR, { recursive: true });
}

// ========================================
// REDIS SESSION MEMORY
// ========================================
let redis;
const sessionMemory = new Map(); // Fallback in-memory store

async function initRedis() {
  try {
    redis = createClient({ 
      url: CONFIG.REDIS_URL,
      socket: {
        reconnectStrategy: false // Don't auto-reconnect on failure
      }
    });
    
    // Only log errors once, not repeatedly
    let errorLogged = false;
    redis.on('error', (err) => {
      if (!errorLogged) {
        console.log('⚠️  Redis connection failed, using in-memory storage');
        errorLogged = true;
      }
    });
    
    await redis.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.log('⚠️  Redis unavailable, using in-memory storage');
    redis = null;
  }
}

async function getSession(userId, chatId) {
  const key = `${userId}:${chatId}`;
  
  if (redis) {
    try {
      const data = await redis.get(`session:${key}`);
      return data ? JSON.parse(data) : { turns: [], voiceMode: true };
    } catch (error) {
      console.error('Redis get error:', error);
    }
  }
  
  return sessionMemory.get(key) || { turns: [], voiceMode: true };
}

async function saveSession(userId, chatId, session) {
  const key = `${userId}:${chatId}`;
  
  // Keep only last MAX_CONTEXT_TURNS
  if (session.turns.length > CONFIG.MAX_CONTEXT_TURNS) {
    session.turns = session.turns.slice(-CONFIG.MAX_CONTEXT_TURNS);
  }
  
  if (redis) {
    try {
      await redis.set(`session:${key}`, JSON.stringify(session), { EX: 86400 }); // 24h TTL
      return;
    } catch (error) {
      console.error('Redis save error:', error);
    }
  }
  
  sessionMemory.set(key, session);
}

async function clearSession(userId, chatId) {
  const key = `${userId}:${chatId}`;
  
  if (redis) {
    try {
      await redis.del(`session:${key}`);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }
  
  sessionMemory.delete(key);
}

// ========================================
// TELEGRAM API HELPERS
// ========================================
const tgAPI = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}`;

async function tg_get_file_path(fileId) {
  const response = await axios.get(`${tgAPI}/getFile?file_id=${fileId}`);
  return response.data.result.file_path;
}

async function tg_download_file(filePath) {
  const fileUrl = `https://api.telegram.org/file/bot${CONFIG.TELEGRAM_BOT_TOKEN}/${filePath}`;
  const tempFile = path.join(CONFIG.TEMP_DIR, `download_${Date.now()}.oga`);
  
  const response = await axios.get(fileUrl, { responseType: 'stream' });
  const writer = fs.createWriteStream(tempFile);
  
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(tempFile));
    writer.on('error', reject);
  });
}

async function tg_send_voice(chatId, oggFile, replyToMessageId = null) {
  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('voice', fs.createReadStream(oggFile));
  
  if (replyToMessageId) {
    form.append('reply_to_message_id', replyToMessageId);
  }
  
  const response = await axios.post(`${tgAPI}/sendVoice`, form, {
    headers: form.getHeaders()
  });
  
  return response.data;
}

async function tg_send_message(chatId, text, replyToMessageId = null) {
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };
  
  if (replyToMessageId) {
    payload.reply_to_message_id = replyToMessageId;
  }
  
  const response = await axios.post(`${tgAPI}/sendMessage`, payload);
  return response.data;
}

// ========================================
// AUDIO CONVERSION
// ========================================
async function audio_convert_to_wav(inputFile) {
  const outputFile = inputFile.replace(/\.[^.]+$/, '.wav');
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .toFormat('wav')
      .audioFrequency(16000)
      .audioChannels(1)
      .on('end', () => resolve(outputFile))
      .on('error', reject)
      .save(outputFile);
  });
}

async function audio_convert_to_ogg(inputFile) {
  const outputFile = inputFile.replace(/\.[^.]+$/, '.ogg');
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .toFormat('opus')
      .audioCodec('libopus')
      .on('end', () => resolve(outputFile))
      .on('error', reject)
      .save(outputFile);
  });
}

// ========================================
// STT: SPEECH-TO-TEXT
// ========================================
async function stt_transcribe(audioFile, retryCount = 0) {
  try {
    if (CONFIG.STT_PROVIDER === 'OPENAI_WHISPER') {
      // Convert to WAV if needed
      let wavFile = audioFile;
      if (!audioFile.endsWith('.wav')) {
        wavFile = await audio_convert_to_wav(audioFile);
      }
      
      const form = new FormData();
      form.append('file', fs.createReadStream(wavFile));
      form.append('model', 'whisper-1');
      form.append('response_format', 'verbose_json');
      
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${CONFIG.STT_API_KEY}`
        }
      });
      
      // Cleanup
      if (wavFile !== audioFile && fs.existsSync(wavFile)) {
        fs.unlinkSync(wavFile);
      }
      
      return {
        text: response.data.text,
        confidence: 1.0 // Whisper doesn't return confidence
      };
    }
    
    throw new Error('Unsupported STT provider');
    
  } catch (error) {
    console.error('STT error:', error.message);
    
    if (retryCount < 1) {
      console.log('Retrying STT...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return stt_transcribe(audioFile, retryCount + 1);
    }
    
    throw error;
  }
}

// ========================================
// TTS: TEXT-TO-SPEECH
// ========================================
async function tts_speak(text, retryCount = 0) {
  try {
    if (CONFIG.TTS_PROVIDER === 'ELEVENLABS') {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${CONFIG.TTS_VOICE_ID}`,
        {
          text: text,
          model_id: CONFIG.TTS_MODEL,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': CONFIG.TTS_API_KEY,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );
      
      // Save as MP3, then convert to OGG
      const mp3File = path.join(CONFIG.TEMP_DIR, `tts_${Date.now()}.mp3`);
      fs.writeFileSync(mp3File, response.data);
      
      const oggFile = await audio_convert_to_ogg(mp3File);
      
      // Cleanup MP3
      if (fs.existsSync(mp3File)) {
        fs.unlinkSync(mp3File);
      }
      
      return oggFile;
    }
    
    throw new Error('Unsupported TTS provider');
    
  } catch (error) {
    console.error('TTS error:', error.message);
    
    if (retryCount < 1) {
      console.log('Retrying TTS...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return tts_speak(text, retryCount + 1);
    }
    
    throw error;
  }
}

// ========================================
// LLM REPLY GENERATION
// ========================================
async function llm_reply(userText, sessionContext) {
  // Build context from session history
  let contextPrompt = "You are OpenClaw, an AI assistant having a voice conversation via Telegram.\n\n";
  contextPrompt += "Keep your responses concise and natural for voice conversation.\n";
  contextPrompt += "Ask at most ONE question at a time.\n";
  contextPrompt += "Confirm numbers, URLs, or names when important.\n\n";
  
  if (sessionContext.turns && sessionContext.turns.length > 0) {
    contextPrompt += "Recent conversation:\n";
    sessionContext.turns.slice(-10).forEach(turn => {
      contextPrompt += `User: ${turn.user}\n`;
      contextPrompt += `You: ${turn.assistant}\n`;
    });
  }
  
  contextPrompt += `\nUser: ${userText}\nYou:`;
  
  // Use OpenClaw's built-in LLM via gateway API
  try {
    const response = await axios.post('http://localhost:18789/api/chat', {
      message: contextPrompt,
      model: 'anthropic/claude-sonnet-4-5'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENCLAW_TOKEN || '2333619584caa298dbf29050c5720c9de3e677b129f13a7c'}`
      }
    });
    
    return response.data.reply || "I'm here. What can I help you with?";
  } catch (error) {
    console.error('LLM error:', error.message);
    
    // Fallback response
    if (userText.toLowerCase().includes('hear me')) {
      return "Yes. I can hear you. What are we building today?";
    }
    return "I'm listening. Tell me more.";
  }
}

// ========================================
// MAIN VOICE PROCESSING PIPELINE
// ========================================
async function processVoiceMessage(message, chatId, userId, messageId) {
  let tempFiles = [];
  
  try {
    console.log(`📥 Processing voice from user ${userId} in chat ${chatId}`);
    
    // Get session
    const session = await getSession(userId, chatId);
    
    if (!session.voiceMode) {
      console.log('Voice mode is OFF for this chat');
      return;
    }
    
    // Step 1: Get file path
    const fileId = message.voice ? message.voice.file_id : message.audio.file_id;
    const filePath = await tg_get_file_path(fileId);
    console.log(`📂 File path: ${filePath}`);
    
    // Step 2: Download audio
    const audioFile = await tg_download_file(filePath);
    tempFiles.push(audioFile);
    console.log(`💾 Downloaded: ${audioFile}`);
    
    // Step 3: Transcribe (STT)
    const transcription = await stt_transcribe(audioFile);
    console.log(`🎤 Heard: "${transcription.text}"`);
    
    if (!transcription.text || transcription.text.trim().length === 0) {
      await tg_send_message(chatId, "I couldn't hear that clearly. Could you try again?", messageId);
      return;
    }
    
    // Step 4: Generate reply (LLM)
    const replyText = await llm_reply(transcription.text, session);
    console.log(`🤖 Reply: "${replyText}"`);
    
    // Step 5: Convert to speech (TTS)
    const voiceFile = await tts_speak(replyText);
    tempFiles.push(voiceFile);
    console.log(`🔊 Voice generated: ${voiceFile}`);
    
    // Step 6: Send voice message
    await tg_send_voice(chatId, voiceFile, messageId);
    console.log(`✅ Voice sent`);
    
    // Step 7: Send text transcript
    const transcript = `🎤 **Heard:** ${transcription.text}\n\n🔊 **Said:** ${replyText}\n\n_Session: ${userId}:${chatId}_`;
    await tg_send_message(chatId, transcript);
    
    // Step 8: Update session memory
    session.turns.push({
      user: transcription.text,
      assistant: replyText,
      timestamp: new Date().toISOString()
    });
    
    await saveSession(userId, chatId, session);
    console.log(`💾 Session saved`);
    
  } catch (error) {
    console.error('❌ Error processing voice:', error);
    
    // Send error message as voice
    try {
      const errorText = "I couldn't hear that clearly. Try again.";
      const errorVoice = await tts_speak(errorText);
      tempFiles.push(errorVoice);
      await tg_send_voice(chatId, errorVoice, messageId);
      await tg_send_message(chatId, `⚠️ Error: ${error.message}`);
    } catch (fallbackError) {
      // Last resort: text only
      await tg_send_message(chatId, `⚠️ Voice processing failed: ${error.message}`, messageId);
    }
    
  } finally {
    // Cleanup temp files
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch (e) {
          console.error(`Failed to delete ${file}:`, e.message);
        }
      }
    });
  }
}

// ========================================
// COMMAND HANDLERS
// ========================================
async function handleCommand(command, chatId, userId) {
  const session = await getSession(userId, chatId);
  
  switch (command) {
    case '/voice_on':
      session.voiceMode = true;
      await saveSession(userId, chatId, session);
      await tg_send_message(chatId, "🔊 Voice mode ON. Send me voice notes!");
      break;
      
    case '/voice_off':
      session.voiceMode = false;
      await saveSession(userId, chatId, session);
      await tg_send_message(chatId, "🔇 Voice mode OFF. I'll reply with text.");
      break;
      
    case '/reset':
      await clearSession(userId, chatId);
      await tg_send_message(chatId, "🔄 Session memory cleared.");
      break;
      
    default:
      await tg_send_message(chatId, "Unknown command. Available: /voice_on, /voice_off, /reset");
  }
}

// ========================================
// EXPRESS SERVER & WEBHOOK
// ========================================
const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    voice_mode: 'enabled',
    stt_provider: CONFIG.STT_PROVIDER,
    tts_provider: CONFIG.TTS_PROVIDER
  });
});

// Telegram webhook endpoint
app.post('/telegram/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    // Quick response to Telegram
    res.sendStatus(200);
    
    if (!update.message) return;
    
    const message = update.message;
    const chatId = message.chat.id;
    const userId = message.from.id;
    const messageId = message.message_id;
    
    // Handle commands
    if (message.text && message.text.startsWith('/')) {
      await handleCommand(message.text.split(' ')[0], chatId, userId);
      return;
    }
    
    // Handle voice messages
    if (message.voice || message.audio) {
      // Process in background (don't block webhook)
      processVoiceMessage(message, chatId, userId, messageId).catch(err => {
        console.error('Background voice processing error:', err);
      });
    }
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

// ========================================
// STARTUP
// ========================================
async function main() {
  console.log('🎬 OPENCLAW TELEGRAM VOICE CONVERSATION MODE');
  console.log('='.repeat(50));
  console.log(`Telegram Bot Token: ${CONFIG.TELEGRAM_BOT_TOKEN.substring(0, 20)}...`);
  console.log(`STT Provider: ${CONFIG.STT_PROVIDER}`);
  console.log(`TTS Provider: ${CONFIG.TTS_PROVIDER}`);
  console.log(`TTS Voice: ${CONFIG.TTS_VOICE_ID}`);
  console.log(`Port: ${CONFIG.PORT}`);
  console.log('='.repeat(50));
  
  // Initialize Redis
  await initRedis();
  
  // Start server
  app.listen(CONFIG.PORT, () => {
    console.log(`✅ Server listening on port ${CONFIG.PORT}`);
    console.log(`\n📝 Next steps:`);
    console.log(`1. Set webhook: POST to https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/setWebhook`);
    console.log(`   Body: { "url": "https://your-domain.com/telegram/webhook" }`);
    console.log(`\n2. Send a voice note to your bot!`);
  });
}

main().catch(console.error);
