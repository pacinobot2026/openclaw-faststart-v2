#!/usr/bin/env node
/**
 * Build slides DIRECTLY from Whisper segments for perfect sync
 */
const fs = require('fs');
const path = require('path');

console.log('🎯 REBUILDING SLIDES FROM WHISPER\n');

const whisperData = JSON.parse(fs.readFileSync('voice.json', 'utf-8'));
const segments = whisperData.segments;

console.log(`📖 ${segments.length} Whisper segments\n`);

// Create slides from segments
const slides = [];
let slideIndex = 1;

segments.forEach(segment => {
  const text = segment.text.trim().toUpperCase();
  const start = segment.start;
  const end = segment.end;
  const duration = end - start;
  const wordCount = text.split(/\s+/).length;
  
  // Skip very short segments (< 0.5s)
  if (duration < 0.5) return;
  
  slides.push({
    slide_index: slideIndex++,
    text: text,
    word_count: wordCount,
    start_time: parseFloat(start.toFixed(2)),
    end_time: parseFloat(end.toFixed(2)),
    duration: parseFloat(duration.toFixed(2)),
    htmlFile: `slide-${String(slideIndex - 1).padStart(3, '0')}.html`
  });
});

console.log(`✓ Created ${slides.length} slides from segments\n`);

// Save manifest
const manifest = {
  format: '16:9',
  background: 'white',
  totalSlides: slides.length,
  total_duration: parseFloat(slides[slides.length - 1].end_time.toFixed(2)),
  fps: 30,
  resolution: '1920x1080',
  sync_method: 'whisper_segments_direct',
  slides: slides
};

fs.writeFileSync('manifest-whisper.json', JSON.stringify(manifest, null, 2));
console.log('✅ Saved manifest-whisper.json');
console.log(`📊 ${slides.length} slides | ${manifest.total_duration}s\n`);

// Generate HTML slides
console.log('📝 Generating HTML slides...');

// Font size based on word count
function getFontSize(wordCount) {
  if (wordCount <= 4) return 140;
  if (wordCount <= 8) return 100;
  if (wordCount <= 14) return 72;
  return 60;
}

// Create slides directory
const slidesDir = path.join(__dirname, 'slides-whisper');
if (!fs.existsSync(slidesDir)) {
  fs.mkdirSync(slidesDir, { recursive: true });
}

slides.forEach(slide => {
  const fontSize = getFontSize(slide.word_count);
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 1920px;
      height: 1080px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Inter, Montserrat, Helvetica, Arial, sans-serif;
      overflow: hidden;
    }
    .slide {
      color: #000000;
      font-size: ${fontSize}px;
      font-weight: 700;
      text-align: center;
      padding: ${1080 * 0.1}px ${1920 * 0.08}px;
      line-height: 1.2;
      max-width: 100%;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <div class="slide">${slide.text}</div>
</body>
</html>`;

  fs.writeFileSync(path.join(slidesDir, slide.htmlFile), html);
});

console.log(`✓ Saved ${slides.length} HTML files\n`);
console.log('📌 NEXT: Run render-from-whisper.js\n');
