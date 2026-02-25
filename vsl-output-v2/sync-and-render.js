#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');

console.log('🎯 SYNCING SLIDES TO VOICE + RENDERING\n');

// Load files
const whisperData = JSON.parse(fs.readFileSync('voice.json', 'utf-8'));
const manifest = JSON.parse(fs.readFileSync('manifest-presync.json', 'utf-8'));

console.log(`📊 ${manifest.totalSlides} slides to sync\n`);

// Extract words with timestamps
const words = [];
whisperData.segments.forEach(segment => {
  if (segment.words) {
    segment.words.forEach(word => {
      words.push({
        text: word.word.trim().toUpperCase(),
        start: word.start,
        end: word.end
      });
    });
  }
});

console.log(`📖 Found ${words.length} words with timestamps\n`);

// Match slides to words
console.log('🔗 Matching slides to words...');
let wordIndex = 0;
const syncedSlides = [];

for (let i = 0; i < manifest.slides.length; i++) {
  const slide = manifest.slides[i];
  const slideWords = slide.text.split(/\s+/).filter(w => w.length > 0);
  
  // Find matching words
  let matchStart = wordIndex;
  let matchEnd = wordIndex;
  let matched = 0;
  
  // Try to match slide words to transcript words
  for (let j = 0; j < slideWords.length && wordIndex < words.length; j++) {
    const slideWord = slideWords[j].replace(/[^A-Z0-9]/g, '');
    const transcriptWord = words[wordIndex].text.replace(/[^A-Z0-9]/g, '');
    
    if (slideWord === transcriptWord || transcriptWord.includes(slideWord) || slideWord.includes(transcriptWord)) {
      if (matched === 0) matchStart = wordIndex;
      matchEnd = wordIndex;
      wordIndex++;
      matched++;
    } else if (matched > 0) {
      // Already matched some, this word might be next slide
      break;
    } else {
      // Keep looking
      wordIndex++;
    }
  }
  
  if (matched > 0) {
    const startTime = words[matchStart].start;
    const endTime = words[matchEnd].end + 0.15;
    const duration = endTime - startTime;
    
    syncedSlides.push({
      ...slide,
      start_time: parseFloat(startTime.toFixed(2)),
      end_time: parseFloat(endTime.toFixed(2)),
      duration: parseFloat(duration.toFixed(2))
    });
    
    if ((i + 1) % 20 === 0) {
      console.log(`  ✓ Synced ${i + 1}/${manifest.slides.length}`);
    }
  }
}

console.log(`✓ Synced ${syncedSlides.length} slides\n`);

// Save synced manifest
const syncedManifest = {
  ...manifest,
  slides: syncedSlides,
  sync_method: 'whisper_word_timestamps',
  total_duration: syncedSlides.length > 0 ? syncedSlides[syncedSlides.length - 1].end_time : 0
};

fs.writeFileSync('slides-synced.json', JSON.stringify(syncedManifest, null, 2));
console.log('✓ Saved slides-synced.json\n');

// Now render with synced timing
console.log('🎬 RENDERING VIDEO WITH SYNCED TIMING\n');

(async () => {
  // Create frames directory
  if (!fs.existsSync('frames-synced')) {
    fs.mkdirSync('frames-synced', { recursive: true });
  }

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  console.log('✓ Ready\n');

  // Render slides
  console.log('📸 Rendering slides...');
  for (let i = 0; i < syncedSlides.length; i++) {
    const slide = syncedSlides[i];
    const htmlPath = path.join(__dirname, 'slides', slide.htmlFile);
    const framePath = path.join(__dirname, 'frames-synced', `frame-${String(i + 1).padStart(3, '0')}.png`);

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: framePath, type: 'png', fullPage: false });

    if ((i + 1) % 20 === 0 || i === syncedSlides.length - 1) {
      console.log(`  ✓ ${i + 1}/${syncedSlides.length}`);
    }
  }

  await browser.close();
  console.log('✓ All slides rendered\n');

  // Build concat file
  console.log('🎞️  Compiling...');
  let concatContent = '';
  for (let i = 0; i < syncedSlides.length; i++) {
    const slide = syncedSlides[i];
    const framePath = path.join(__dirname, 'frames-synced', `frame-${String(i + 1).padStart(3, '0')}.png`);
    concatContent += `file '${framePath.replace(/\\/g, '/')}'\n`;
    concatContent += `duration ${slide.duration}\n`;
  }
  const lastFrame = path.join(__dirname, 'frames-synced', `frame-${String(syncedSlides.length).padStart(3, '0')}.png`);
  concatContent += `file '${lastFrame.replace(/\\/g, '/')}'\n`;
  fs.writeFileSync('concat-synced.txt', concatContent);

  // Compile with FFmpeg
  const outputPath = 'vsl_test_SYNCED.mp4';
  process.env.PATH = process.env.PATH + ';C:\\Program Files\\FFmpeg\\bin';
  
  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "concat-synced.txt" -i "voice.mp3" -vf "fps=30,format=yuv420p" -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 192k -shortest "${outputPath}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log('\n✅ SYNCED VIDEO COMPLETE!\n');
    console.log(`📹 ${outputPath}`);
    console.log(`⏱️  Duration: ${Math.floor(syncedManifest.total_duration / 60)}:${Math.floor(syncedManifest.total_duration % 60).toString().padStart(2, '0')}`);
    console.log(`🎯 Perfectly synced to voice\n`);
  } catch (error) {
    console.error('❌ FFmpeg failed:', error.message);
    process.exit(1);
  }

  // Cleanup
  fs.unlinkSync('concat-synced.txt');
  console.log('✓ Done!');
})();
