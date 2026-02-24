# VSL PowerPoint Autobuilder - Usage Guide

## Quick Start

**Input:** Long-form script (any text file)
**Output:** Finished 9:16 vertical MP4 video with voiceover

---

## How to Use

### 1. Save Your Script
```bash
# Save script to a text file
echo "Your script here..." > script.txt
```

### 2. Run Autobuilder
```bash
node skills/vsl/powerpoint-autobuilder.js script.txt
```

### 3. Check Output
```
vsl-output/
├── manifest.json          # Video configuration
├── timing.txt             # Slide timing reference
└── slides/
    ├── slide-001.html     # Generated slides
    ├── slide-002.html
    └── ...
```

---

## What It Does Automatically

### Slide Creation
- Breaks script into max 8 words per slide
- Removes filler words (um, uh, like, etc.)
- Capitalizes for impact
- Adds emphasis slides ("READ THAT AGAIN")

### Timing Logic
```javascript
duration = max(2.5 seconds, 0.45 × word_count)
// Capped at 6 seconds per slide
```

### Visual Style
- **Format:** 9:16 vertical (1080x1920)
- **Background:** Pure black (#000000)
- **Text:** White (#FFFFFF), bold sans-serif
- **Position:** Centered both axes
- **Transition:** 0.3s fade
- **No:** Images, logos, music

---

## Full Pipeline (Manual Steps After Autobuilder)

### Step 1: Generate Voice (ElevenLabs)
```bash
# Send full original script to ElevenLabs API
# Save as: vsl-output/voice.mp3
```

**ElevenLabs Settings:**
- Voice: (Your chosen voice)
- Stability: 0.5
- Similarity: 0.75
- Output: MP3

### Step 2: Render Slides to Images
```bash
# Use Puppeteer to capture each HTML slide as PNG
node render-slides.js
```

### Step 3: Compile Video
```bash
# Use FFmpeg to combine images + voice
ffmpeg -framerate 30 \
  -pattern_type glob -i 'vsl-output/slides/*.png' \
  -i vsl-output/voice.mp3 \
  -c:v libx264 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -shortest \
  vsl-output/vsl_final.mp4
```

---

## Example Output

**Input Script:** 2,500 words
**Output:**
- 45 slides
- 7:30 duration
- File: `vsl-output/vsl_final.mp4`

---

## Configuration

Edit `powerpoint-autobuilder.js` to customize:

```javascript
const CONFIG = {
  maxWordsPerSlide: 8,      // Adjust for pacing
  minSlideDuration: 2.5,    // Minimum time per slide
  maxSlideDuration: 6.0,    // Maximum time per slide
  secondsPerWord: 0.45,     // Reading speed
  fadeTransition: 0.3,      // Transition duration
  
  videoFormat: {
    width: 1080,             // 9:16 vertical
    height: 1920,
    fps: 30,
    bgColor: '#000000',      // Pure black
    textColor: '#FFFFFF',    // Pure white
    fontFamily: 'Arial Black, sans-serif'
  }
};
```

---

## Emphasis Slides

Automatically inserted every ~12 slides:
- "READ THAT AGAIN."
- "LET THAT SINK IN."
- "THIS IS IMPORTANT."
- "REMEMBER THIS."

---

## Tips

**Script Writing:**
- Write in spoken language (short sentences)
- One idea per sentence
- Remove complex words
- Use rhythm and pacing
- Include natural pauses

**Voice Generation:**
- Always send FULL original script to ElevenLabs
- Don't send slide-broken version
- Let the voice flow naturally

**Video Style:**
- Keep it simple (black/white only)
- Bold text = high impact
- Max 8 words = easy to read
- Vertical format = mobile-first

---

## Troubleshooting

**Slides too fast:**
- Increase `minSlideDuration` in config
- Or increase `secondsPerWord`

**Slides too slow:**
- Decrease `maxSlideDuration`
- Or decrease `secondsPerWord`

**Text too small:**
- Edit HTML template in `generateSlideHTML()`
- Increase `font-size` value

**Voice doesn't match timing:**
- Re-generate voice with same script
- Check total duration in manifest.json
- Adjust slide timing if needed

---

## Future Automation

**Next phase:** Full automation from script → finished MP4
- Auto-generate voice via ElevenLabs API
- Auto-render slides to PNG via Puppeteer
- Auto-compile video via FFmpeg
- Single command execution

**For now:** Autobuilder creates slides + timing manifest.
Manual steps: Voice generation + video rendering.
