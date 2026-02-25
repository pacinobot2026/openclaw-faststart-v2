#!/usr/bin/env node
const fs = require('fs');

console.log('🎯 SYNCING SLIDES TO WHISPER SEGMENTS\n');

const whisperData = JSON.parse(fs.readFileSync('voice.json', 'utf-8'));
const manifest = JSON.parse(fs.readFileSync('manifest-presync.json', 'utf-8'));

console.log(`📊 ${manifest.totalSlides} slides`);
console.log(`📖 ${whisperData.segments.length} Whisper segments\n`);

// Map slides to segments
console.log('🔗 Mapping slides to segments...');

const syncedSlides = [];
let slideIdx = 0;

for (let segIdx = 0; segIdx < whisperData.segments.length && slideIdx < manifest.slides.length; segIdx++) {
  const segment = whisperData.segments[segIdx];
  const segmentText = segment.text.trim().toUpperCase();
  const segmentStart = segment.start;
  const segmentEnd = segment.end;
  const segmentDuration = segmentEnd - segmentStart;
  
  // Find all slides that belong to this segment
  const segmentSlides = [];
  
  while (slideIdx < manifest.slides.length) {
    const slide = manifest.slides[slideIdx];
    const slideText = slide.text;
    
    // Check if slide text appears in segment
    // Remove punctuation for matching
    const cleanSegment = segmentText.replace(/[^A-Z0-9\s]/g, '');
    const cleanSlide = slideText.replace(/[^A-Z0-9\s]/g, '');
    
    if (cleanSegment.includes(cleanSlide) || cleanSlide.length < 20) {
      // This slide belongs to current segment
      segmentSlides.push(slide);
      slideIdx++;
      
      // If slide is long, it's probably the whole segment
      if (cleanSlide.length > 30) break;
    } else {
      // This slide belongs to next segment
      break;
    }
  }
  
  // Split segment duration among its slides
  if (segmentSlides.length > 0) {
    const durationPerSlide = segmentDuration / segmentSlides.length;
    
    segmentSlides.forEach((slide, i) => {
      const start = segmentStart + (i * durationPerSlide);
      const end = start + durationPerSlide;
      
      syncedSlides.push({
        ...slide,
        start_time: parseFloat(start.toFixed(2)),
        end_time: parseFloat(end.toFixed(2)),
        duration: parseFloat(durationPerSlide.toFixed(2))
      });
    });
  }
}

console.log(`✓ Synced ${syncedSlides.length} slides\n`);

// Check coverage
const lastSlideEnd = syncedSlides[syncedSlides.length - 1].end_time;
const audioDuration = whisperData.segments[whisperData.segments.length - 1].end;
console.log(`🔍 Coverage check:`);
console.log(`   Audio: ${audioDuration.toFixed(1)}s`);
console.log(`   Slides: ${lastSlideEnd.toFixed(1)}s`);
console.log(`   Difference: ${Math.abs(audioDuration - lastSlideEnd).toFixed(1)}s\n`);

// Save
const syncedManifest = {
  ...manifest,
  slides: syncedSlides,
  sync_method: 'whisper_segments',
  total_duration: parseFloat(lastSlideEnd.toFixed(2)),
  audio_duration: parseFloat(audioDuration.toFixed(2))
};

fs.writeFileSync('slides-synced-v2.json', JSON.stringify(syncedManifest, null, 2));
console.log('✅ Saved slides-synced-v2.json\n');
