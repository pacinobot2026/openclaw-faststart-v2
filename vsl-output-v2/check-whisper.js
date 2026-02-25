const data = require('./voice.json');
console.log('Segments:', data.segments.length);
console.log('Duration:', data.segments[data.segments.length-1].end.toFixed(1), 'seconds');
console.log('\nFirst 5 segments:');
data.segments.slice(0, 5).forEach((s, i) => {
  console.log(`${i+1}. [${s.start.toFixed(1)}-${s.end.toFixed(1)}s] ${s.text.substring(0, 60)}`);
});
