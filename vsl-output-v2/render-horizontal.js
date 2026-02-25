#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎬 Rendering HORIZONTAL video...\n');

const manifest = JSON.parse(fs.readFileSync('slides-synced-simple.json', 'utf-8'));
console.log(`📊 ${manifest.totalSlides} slides | ${manifest.total_duration}s\n`);

(async () => {
  // Create frames directory
  if (!fs.existsSync('frames-horizontal')) {
    fs.mkdirSync('frames-horizontal', { recursive: true });
  }

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport to 16:9 horizontal (1920x1080)
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  console.log('✓ Ready (16:9 horizontal)\n');

  // Render slides
  console.log('📸 Rendering slides...');
  for (let i = 0; i < manifest.slides.length; i++) {
    const slide = manifest.slides[i];
    const htmlPath = path.join(__dirname, 'slides', slide.htmlFile);
    const framePath = path.join(__dirname, 'frames-horizontal', `frame-${String(i + 1).padStart(3, '0')}.png`);

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: framePath, type: 'png', fullPage: false });

    if ((i + 1) % 20 === 0 || i === manifest.slides.length - 1) {
      console.log(`  ✓ ${i + 1}/${manifest.slides.length}`);
    }
  }

  await browser.close();
  console.log('✓ All slides rendered\n');

  // Build concat file
  console.log('🎞️  Compiling...');
  let concatContent = '';
  for (let i = 0; i < manifest.slides.length; i++) {
    const slide = manifest.slides[i];
    const framePath = path.join(__dirname, 'frames-horizontal', `frame-${String(i + 1).padStart(3, '0')}.png`);
    concatContent += `file '${framePath.replace(/\\/g, '/')}'\n`;
    concatContent += `duration ${slide.duration}\n`;
  }
  const lastFrame = path.join(__dirname, 'frames-horizontal', `frame-${String(manifest.slides.length).padStart(3, '0')}.png`);
  concatContent += `file '${lastFrame.replace(/\\/g, '/')}'\n`;
  fs.writeFileSync('concat-horizontal.txt', concatContent);

  // Compile with FFmpeg
  process.env.PATH = process.env.PATH + ';C:\\Program Files\\FFmpeg\\bin';
  const outputPath = 'vsl_test_HORIZONTAL.mp4';
  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "concat-horizontal.txt" -i "voice.mp3" -vf "fps=30,format=yuv420p" -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 192k -shortest "${outputPath}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log('\n✅ HORIZONTAL VIDEO COMPLETE!\n');
    console.log(`📹 ${outputPath}`);
    console.log(`📐 1920x1080 (16:9 horizontal)`);
    console.log(`⏱️  ${Math.floor(manifest.total_duration / 60)}:${Math.floor(manifest.total_duration % 60).toString().padStart(2, '0')}\n`);
  } catch (error) {
    console.error('❌ FFmpeg failed:', error.message);
    process.exit(1);
  }

  // Cleanup
  fs.unlinkSync('concat-horizontal.txt');
  console.log('✓ Done!');
})();
