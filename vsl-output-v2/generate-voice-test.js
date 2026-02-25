#!/usr/bin/env node
const fs = require('fs');
const https = require('https');

const API_KEY = 'sk_86798b0bdcc222bd06e4c12452b88191c3b3bb20752b6569';
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam
const SCRIPT_PATH = '../vsl-faststart-2min.txt';
const OUTPUT_PATH = 'voice.mp3';

async function generateVoice() {
  console.log('🎤 Generating voice for 2-minute test...\n');

  const script = fs.readFileSync(SCRIPT_PATH, 'utf-8');
  console.log(`📝 Script: ${script.length} characters`);

  const payload = JSON.stringify({
    text: script,
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    port: 443,
    path: `/v1/text-to-speech/${VOICE_ID}`,
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let error = '';
        res.on('data', (chunk) => error += chunk);
        res.on('end', () => reject(new Error(`ElevenLabs: ${res.statusCode} - ${error}`)));
        return;
      }

      const fileStream = fs.createWriteStream(OUTPUT_PATH);
      let downloaded = 0;

      res.on('data', (chunk) => {
        downloaded += chunk.length;
        process.stdout.write(`\r⬇️  ${(downloaded / 1024 / 1024).toFixed(2)} MB`);
      });

      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log('\n✅ Voice generated!\n');
        console.log(`📁 ${OUTPUT_PATH}`);
        console.log(`📊 ${(fs.statSync(OUTPUT_PATH).size / 1024 / 1024).toFixed(2)} MB\n`);
        resolve();
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

generateVoice().catch(console.error);
