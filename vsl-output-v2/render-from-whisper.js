#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎬 Rendering video from Whisper-synced slides...\n');

const manifest = JSON.parse(fs.readFileSync('manifest-whisper.json', 'utf-8'));
console.log(`📊 ${manifest.totalSlides} slides | ${manifest.total_duration}s | 16:9\n`);

(async () => {
  const framesDir = path.join(__dirname, 'frames-whisper');
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }

  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  console.log('✓ Ready\n');

  console.log('📸 Rendering slides...');
  for (let i = 0; i < manifest.slides.length; i++) {
    const slide = manifest.slides[i];
    const htmlPath = path.join(__dirname, 'slides-whisper', slide.htmlFile);
    const framePath = path.join(framesDir, `frame-${String(i + 1).padStart(3, '0')}.png`);

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: framePath, type: 'png', fullPage: false });

    if ((i + 1) % 15 === 0 || i === manifest.slides.length - 1) {
      console.log(`  ✓ ${i + 1}/${manifest.slides.length}`);
    }
  }

  await browser.close();
  console.log('✓ All slides rendered\n');

  console.log('🎞️  Compiling video...');
  let concatContent = '';
  for (let i = 0; i < manifest.slides.length; i++) {
    const slide = manifest.slides[i];
    const framePath = path.join(framesDir, `frame-${String(i + 1).padStart(3, '0')}.png`);
    concatContent += `file '${framePath.replace(/\\/g, '/')}'\n`;
    concatContent += `duration ${slide.duration}\n`;
  }
  const lastFrame = path.join(framesDir, `frame-${String(manifest.slides.length).padStart(3, '0')}.png`);
  concatContent += `file '${lastFrame.replace(/\\/g, '/')}'\n`;
  fs.writeFileSync('concat-whisper.txt', concatContent);

  process.env.PATH = process.env.PATH + ';C:\\Program Files\\FFmpeg\\bin';
  const outputPath = 'vsl_PERFECT_SYNC.mp4';
  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "concat-whisper.txt" -i "voice.mp3" -vf "fps=30,format=yuv420p" -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 192k -shortest "${outputPath}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log('\n🎉 PERFECT SYNC VIDEO COMPLETE!\n');
    console.log(`📹 ${outputPath}`);
    console.log(`📐 1920x1080 (16:9 horizontal)`);
    console.log(`⏱️  ${Math.floor(manifest.total_duration / 60)}:${Math.floor(manifest.total_duration % 60).toString().padStart(2, '0')}`);
    console.log(`🎯 ${manifest.totalSlides} slides synced to Whisper segments\n`);
  } catch (error) {
    console.error('❌ FFmpeg failed:', error.message);
    process.exit(1);
  }

  fs.unlinkSync('concat-whisper.txt');
  console.log('✓ Done!');
})();
