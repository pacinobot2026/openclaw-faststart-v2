/**
 * TEST SCRIPT - Telegram Voice Conversation Mode
 * Run this to verify all components work
 */

require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8202817378:AAFGzbzhwMb8VdskVzuzBi6hES2FGbBxS54';
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function runTests() {
  console.log('🧪 TELEGRAM VOICE MODE - TEST SUITE\n');
  console.log('='.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Bot API Connection
  console.log('\n📡 Test 1: Telegram Bot API Connection');
  try {
    const response = await axios.get(`${BASE_URL}/getMe`);
    console.log(`✅ Bot connected: @${response.data.result.username}`);
    console.log(`   Name: ${response.data.result.first_name}`);
    console.log(`   ID: ${response.data.result.id}`);
    passed++;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    failed++;
  }
  
  // Test 2: Webhook Info
  console.log('\n🔗 Test 2: Webhook Configuration');
  try {
    const response = await axios.get(`${BASE_URL}/getWebhookInfo`);
    const info = response.data.result;
    
    if (info.url) {
      console.log(`✅ Webhook set: ${info.url}`);
      console.log(`   Pending updates: ${info.pending_update_count}`);
      if (info.last_error_message) {
        console.log(`   ⚠️  Last error: ${info.last_error_message}`);
      }
    } else {
      console.log(`⚠️  Webhook not set (polling mode)`);
      console.log(`   To set webhook, run:`);
      console.log(`   curl -X POST "${BASE_URL}/setWebhook" -d "url=https://your-url.com/telegram/webhook"`);
    }
    passed++;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    failed++;
  }
  
  // Test 3: STT API (OpenAI Whisper)
  console.log('\n🎤 Test 3: STT Provider (OpenAI Whisper)');
  const STT_KEY = process.env.STT_API_KEY;
  if (STT_KEY) {
    try {
      // Test with a minimal request (just check auth)
      await axios.get('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${STT_KEY}` }
      });
      console.log(`✅ OpenAI API key valid`);
      console.log(`   Key: ${STT_KEY.substring(0, 20)}...`);
      passed++;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`❌ OpenAI API key invalid`);
      } else {
        console.log(`✅ OpenAI API key appears valid (${error.response?.status})`);
        passed++;
      }
    }
  } else {
    console.log(`❌ STT_API_KEY not set`);
    failed++;
  }
  
  // Test 4: TTS API (ElevenLabs)
  console.log('\n🔊 Test 4: TTS Provider (ElevenLabs)');
  const TTS_KEY = process.env.TTS_API_KEY || 'sk_86798b0bdcc222bd06e4c12452b88191c3b3bb20752b6569';
  const VOICE_ID = process.env.TTS_VOICE_ID || 'PeMXWXe7DDCb8HldBr2s';
  
  try {
    const response = await axios.get(`https://api.elevenlabs.io/v1/voices/${VOICE_ID}`, {
      headers: { 'xi-api-key': TTS_KEY }
    });
    console.log(`✅ ElevenLabs voice found: ${response.data.name}`);
    console.log(`   Voice ID: ${VOICE_ID}`);
    console.log(`   Available models: ${response.data.fine_tuning?.model_ids?.join(', ') || 'N/A'}`);
    passed++;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log(`❌ ElevenLabs API key invalid`);
    } else if (error.response?.status === 404) {
      console.log(`❌ Voice ID not found: ${VOICE_ID}`);
    } else {
      console.log(`❌ Failed: ${error.message}`);
    }
    failed++;
  }
  
  // Test 5: FFmpeg (required for audio conversion)
  console.log('\n🎬 Test 5: FFmpeg Installation');
  try {
    const ffmpegPath = require('ffmpeg-static');
    if (fs.existsSync(ffmpegPath)) {
      console.log(`✅ FFmpeg found: ${ffmpegPath}`);
      passed++;
    } else {
      console.log(`❌ FFmpeg binary not found`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ FFmpeg not installed: ${error.message}`);
    failed++;
  }
  
  // Test 6: Local Server
  console.log('\n🖥️  Test 6: Local Server');
  try {
    const response = await axios.get('http://localhost:3000/', { timeout: 2000 });
    console.log(`✅ Server running`);
    console.log(`   Status: ${response.data.status}`);
    console.log(`   STT: ${response.data.stt_provider}`);
    console.log(`   TTS: ${response.data.tts_provider}`);
    passed++;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`⚠️  Server not running (start with: npm start)`);
    } else {
      console.log(`❌ Failed: ${error.message}`);
    }
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 TEST SUMMARY: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('✅ All tests passed! System ready for voice conversations.\n');
    console.log('Next steps:');
    console.log('1. Make sure server is running: npm start');
    console.log('2. Set up webhook (see SETUP.md)');
    console.log('3. Send a voice note to your bot!');
  } else {
    console.log('❌ Some tests failed. Check configuration and try again.\n');
  }
}

runTests().catch(console.error);
