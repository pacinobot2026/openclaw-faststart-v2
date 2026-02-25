const manifest = require('./manifest-presync.json');
const whisper = require('./voice.json');

console.log('=== SLIDES (first 10) ===\n');
manifest.slides.slice(0, 10).forEach((s, i) => {
  console.log(`${i+1}. ${s.text}`);
});

console.log('\n=== WHISPER SEGMENTS (first 10) ===\n');
whisper.segments.slice(0, 10).forEach((s, i) => {
  console.log(`${i+1}. [${s.start.toFixed(1)}-${s.end.toFixed(1)}s] ${s.text}`);
});
