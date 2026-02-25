#!/usr/bin/env node
/**
 * Render HTML slides to video
 * Uses Puppeteer to capture slides as images, then FFmpeg to compile
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = __dirname;
const SLIDES_DIR = path.join(OUTPUT_DIR, 'slides');
const FRAMES_DIR = path.join(OUTPUT_DIR, 'frames');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

async function main() {
  console.log('🎬 VSL Video Renderer Starting...\n');

  // Load manifest
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`📋 Loaded manifest: ${manifest.totalSlides} slides, ${manifest.totalDuration}s duration\n`);

  // Create frames directory
  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  }

  // Launch headless browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport to 9:16 vertical (1080x1920)
  await page.setViewport({
    width: 1080,
    height: 1920,
    deviceScaleFactor: 1
  });

  console.log('✓ Browser ready\n');

  // Render each slide
  console.log('📸 Rendering slides to images...');
  for (let i = 0; i < manifest.slides.length; i++) {
    const slide = manifest.slides[i];
    const htmlPath = path.join(SLIDES_DIR, slide.htmlFile);
    const framePath = path.join(FRAMES_DIR, `frame-${String(i + 1).padStart(3, '0')}.png`);

    // Load HTML
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Screenshot
    await page.screenshot({
      path: framePath,
      type: 'png',
      fullPage: false
    });

    // Progress
    if ((i + 1) % 25 === 0 || i === manifest.slides.length - 1) {
      console.log(`  ✓ Rendered ${i + 1}/${manifest.slides.length} slides`);
    }
  }

  await browser.close();
  console.log('✓ All slides rendered\n');

  // Build FFmpeg filter for timing
  console.log('🎞️  Compiling video with FFmpeg...');
  
  // Create concat file with durations
  const concatFile = path.join(OUTPUT_DIR, 'concat.txt');
  let concatContent = '';
  
  for (let i = 0; i < manifest.slides.length; i++) {
    const slide = manifest.slides[i];
    const framePath = path.join(FRAMES_DIR, `frame-${String(i + 1).padStart(3, '0')}.png`);
    concatContent += `file '${framePath.replace(/\\/g, '/')}'\n`;
    concatContent += `duration ${slide.duration}\n`;
  }
  
  // Add last frame again (FFmpeg concat quirk)
  const lastFrame = path.join(FRAMES_DIR, `frame-${String(manifest.slides.length).padStart(3, '0')}.png`);
  concatContent += `file '${lastFrame.replace(/\\/g, '/')}'\n`;
  
  fs.writeFileSync(concatFile, concatContent);

  // FFmpeg command
  const outputPath = path.join(OUTPUT_DIR, 'vsl_silent.mp4');
  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatFile}" -vf "fps=${manifest.fps},format=yuv420p" -c:v libx264 -preset medium -crf 23 "${outputPath}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log('\n✅ VIDEO RENDERED SUCCESSFULLY\n');
    console.log(`📹 Output: ${outputPath}`);
    console.log(`⏱️  Duration: ${manifest.totalDuration}s (${Math.floor(parseFloat(manifest.totalDuration) / 60)}:${Math.floor(parseFloat(manifest.totalDuration) % 60).toString().padStart(2, '0')})`);
    console.log(`🎞️  Slides: ${manifest.totalSlides}`);
    console.log(`📐 Resolution: ${manifest.resolution}`);
  } catch (error) {
    console.error('❌ FFmpeg failed:', error.message);
    process.exit(1);
  }

  // Cleanup
  console.log('\n🧹 Cleaning up...');
  fs.unlinkSync(concatFile);
  console.log('✓ Done');
}

main().catch(console.error);
