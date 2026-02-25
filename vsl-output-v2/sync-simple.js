#!/usr/bin/env node
const fs = require('fs');

console.log('🎯 SIMPLE SYNC: Even distribution\n');

const whisperData = JSON.parse(fs.readFileSync('voice.json', 'utf-8'));
const manifest = JSON.parse(fs.readFileSync('manifest-presync.json', 'utf-8'));

const audioDuration = whisperData.segments[whisperData.segments.length - 1].end;
const slideCount = manifest.slides.length;
const durationPerSlide = audioDuration / slideCount;

console.log(`📊 ${slideCount} slides`);
console.log(`⏱️  ${audioDuration.toFixed(1)}s audio`);
console.log(`⚡️ ${durationPerSlide.toFixed(2)}s per slide\n`);

const syncedSlides = manifest.slides.map((slide, i) => {
  const start = i * durationPerSlide;
  const end = (i + 1) * durationPerSlide;
  
  return {
    ...slide,
    start_time: parseFloat(start.toFixed(2)),
    end_time: parseFloat(end.toFixed(2)),
    duration: parseFloat(durationPerSlide.toFixed(2))
  };
});

const syncedManifest = {
  ...manifest,
  slides: syncedSlides,
  sync_method: 'even_distribution',
  total_duration: parseFloat(audioDuration.toFixed(2))
};

fs.writeFileSync('slides-synced-simple.json', JSON.stringify(syncedManifest, null, 2));
console.log('✅ Saved slides-synced-simple.json');
console.log(`📹 Ready to render ${slideCount} slides over ${audioDuration.toFixed(1)}s\n`);
