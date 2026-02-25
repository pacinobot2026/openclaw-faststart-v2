#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = __dirname;
const SLIDES_DIR = path.join(OUTPUT_DIR, 'slides');
const FRAMES_DIR = path.join(OUTPUT_DIR, 'frames');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest-presync.json');

async function main() {
  console.log('🎬 Rendering 2-minute test video...\n');

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`📋 ${manifest.totalSlides} slides, ${manifest.estimatedDuration}s\n`);

  // Create frames directory
  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  }

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  console.log('✓ Browser ready\n');

  // Render slides
  console.log('📸 Rendering slides to images...');
  for (let i = 0; i < manifest.slides.length; i++) {
    const slide = manifest.slides[i];
    const htmlPath = path.join(SLIDES_DIR, slide.htmlFile);
    const framePath = path.join(FRAMES_DIR, `frame-${String(i + 1).padStart(3, '0')}.png`);

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: framePath, type: 'png', fullPage: false });

    if ((i + 1) % 20 === 0 || i === manifest.slides.length - 1) {
      console.log(`  ✓ ${i + 1}/${manifest.slides.length} slides`);
    }
  }

  await browser.close();
  console.log('✓ All slides rendered\n');

  // Build concat file
  console.log('🎞️  Compiling video...');
  const concatFile = path.join(OUTPUT_DIR, 'concat.txt');
  let concatContent = '';
  
  for (let i = 0; i < manifest.slides.length; i++) {
    const slide = manifest.slides[i];
    const framePath = path.join(FRAMES_DIR, `frame-${String(i + 1).padStart(3, '0')}.png`);
    concatContent += `file '${framePath.replace(/\\/g, '/')}'\n`;
    concatContent += `duration ${slide.estimated_duration}\n`;
  }
  
  const lastFrame = path.join(FRAMES_DIR, `frame-${String(manifest.slides.length).padStart(3, '0')}.png`);
  concatContent += `file '${lastFrame.replace(/\\/g, '/')}'\n`;
  fs.writeFileSync(concatFile, concatContent);

  // Compile with FFmpeg
  const outputPath = path.join(OUTPUT_DIR, 'vsl_test_2min.mp4');
  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatFile}" -i "${path.join(OUTPUT_DIR, 'voice.mp3')}" -vf "fps=30,format=yuv420p" -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 192k -shortest "${outputPath}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log('\n✅ VIDEO COMPLETE\n');
    console.log(`📹 ${outputPath}`);
    console.log(`⏱️  Duration: ~${Math.floor(manifest.estimatedDuration / 60)}:${Math.floor(manifest.estimatedDuration % 60).toString().padStart(2, '0')}`);
    console.log(`📊 ${manifest.totalSlides} slides`);
    console.log(`📐 ${manifest.format} | ${manifest.background} background\n`);
  } catch (error) {
    console.error('❌ FFmpeg failed:', error.message);
    process.exit(1);
  }

  // Cleanup
  fs.unlinkSync(concatFile);
  console.log('✓ Done');
}

main().catch(console.error);
