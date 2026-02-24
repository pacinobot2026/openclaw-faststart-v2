# Video Sales Letter (VSL) Skill

**Automates:** Script writing → Voice generation → Slide creation → Video rendering
**Output:** Finished MP4 video file, ready to upload
**Purpose:** Create high-conversion video sales letters that match existing sales pages

---

## What This Skill Does

Turns a sales page into a professional video sales letter:

1. **Script Generation** - Analyzes sales page, writes spoken-language script
2. **Voice Synthesis** - Generates professional narration (ElevenLabs)
3. **Slide Design** - Creates visual slides programmatically
4. **Video Compilation** - Renders final MP4 with FFmpeg

**Full automation:** Sales page URL → Finished VSL video

---

## VSL Generation Command

```
🎬 OPENCLAW SALES VIDEO SCRIPT COMMAND

You are generating a high-conversion Video Sales Letter (VSL).
This video must be built FROM the existing sales page.
It must NOT contradict, rename, or introduce new mechanisms.
It must amplify emotional intensity while preserving factual alignment.

⸻ STEP 1 — PAGE ASSIMILATION (MANDATORY)

Before writing the script:

Scan the entire sales page and extract:
• Core promise
• Primary mechanism
• Unique differentiator
• Revenue proof
• Time proof
• Offer stack
• Price
• Guarantee
• Urgency mechanism
• Emotional tone

Return this in structured format. Do NOT write the script yet.

⸻ STEP 2 — MESSAGE CONSISTENCY CHECK

Confirm:
• The VSL will not introduce new claims
• The VSL will not change pricing
• The VSL will not exaggerate proof
• The VSL will not rename the mechanism
• The VSL will not shift positioning

If any inconsistency is detected, flag it before proceeding.

⸻ STEP 3 — VSL CONSTRUCTION MODE

Now build a spoken-language script optimized for:
• Cold-to-warm conversion
• Retention
• Psychological escalation
• Identity shift
• Urgency

Do NOT narrate the page. Rebuild it for video psychology.

⸻ STRUCTURE REQUIREMENT (MANDATORY)

The script must follow:

1️⃣ Hook (0–30 sec)
Pattern interrupt. Bold claim. Curiosity loop.

2️⃣ Problem Escalation
Highlight builder trap, speed problem, identity friction.

3️⃣ The Core Event
Explain what happened clearly and credibly.

4️⃣ Mechanism
Explain the system simply.

5️⃣ Proof
Breakdown + validation (aligned with page).

6️⃣ Transformation
What this means for the viewer.

7️⃣ Objection Handling
Naturally woven, at least 5 objections.

8️⃣ Offer Stack
What they get. Why it matters.

9️⃣ Urgency
Reinforce pricing window or increase trigger.

🔟 Close
Identity shift + direct CTA.

⸻ DELIVERY RULES

• 6–10 minutes long
• Spoken language (short sentences)
• No long paragraphs
• No corporate tone
• No "hey guys" intro
• Use rhythm and pacing
• Include pauses (…)
• Include emphasis moments
• Include 3 curiosity loops in first 2 minutes

⸻ OPTIONAL STAGE DIRECTIONS

Include cues like:
[Lean in]
[Pause]
[Lower voice]
[Show screen]
[Cut to proof]

Make it record-ready.

⸻ INTENSITY REQUIREMENT

Increase emotional intensity 30% beyond the page.
But do NOT alter factual claims.
Amplify tension. Preserve truth.

⸻ FINAL OUTPUT

After script completion, output:

Message Alignment Confirmation:
• Promise matched: Yes/No
• Mechanism matched: Yes/No
• Pricing matched: Yes/No
• Guarantee matched: Yes/No
• Urgency matched: Yes/No

If any answer is "No," revise automatically.

⸻ LENGTH CONTROL

Minimum 1,200 words.
Do not stop early.
Do not summarize.
```

---

## VSL_POWERPOINT_AUTOBUILDER Mode

**Streamlined version:** Takes a finished script → outputs finished MP4 video automatically.

**When to use:** Script already written, just need fast video render.

**Process:**
1. **Slide Creation** - Break script into slides (max 8 words each, dramatic pacing)
2. **Voice Generation** - Send full script to ElevenLabs, generate single MP3
3. **Timing Logic** - Calculate slide duration: `max(2.5s, 0.45s per word)`, cap at 6s
4. **Video Style** - 9:16 vertical, black background, white bold text, centered, subtle fade (0.3s)
5. **Render Engine** - Generate HTML slides, render to MP4 with voice
6. **Output** - Return video_path, audio_path, total_slides, duration_seconds

**Visual Style:**
- Format: 9:16 vertical
- Background: black (#000000)
- Text: white (#FFFFFF)
- Font: bold sans-serif, centered both axes
- Transitions: 0.3s fade
- No images, logos, or music

**Slide Rules:**
- Maximum 8 words per slide
- One idea per slide
- Remove filler words
- Capitalize for impact
- Add emphasis slides: "READ THAT AGAIN." / "LET THAT SINK IN."

**Timing Formula:**
```javascript
duration = max(2.5 seconds, 0.45 seconds × word_count)
// Never exceed 6 seconds per slide
```

**Output Format:**
```json
{
  "video_path": "/outputs/vsl_final.mp4",
  "audio_path": "/outputs/voice.mp3",
  "total_slides": 45,
  "duration_seconds": 420
}
```

**Usage:**
```
[Paste script here]

Execute VSL_POWERPOINT_AUTOBUILDER mode
```

---

## Usage Examples

### Basic Usage
```
Create a VSL for openclaw-faststart-v2.vercel.app/operator-version
```

### With Custom Voice
```
Generate VSL for [URL]
Voice: Pacino (confident, operator tone)
Length: 8 minutes
```

### With Specific Focus
```
VSL for [product URL]
Emphasize: Speed advantage, proof points
Target: Cold traffic
```

### PowerPoint Autobuilder Mode
```
[Paste finished script]

Use VSL_POWERPOINT_AUTOBUILDER
```

---

## Technical Stack

### 1. Script Generation
- Sales page analysis (web scraping or direct file read)
- Copy framework application
- Spoken-language optimization

### 2. Voice Synthesis
**Tool:** ElevenLabs API
**Voice ID:** (Configure per project)
**Settings:**
- Stability: 0.5
- Similarity: 0.75
- Style: 0.0 (neutral)

### 3. Slide Generation
**Options:**
- **FFmpeg + ImageMagick** (Programmatic, free)
- **Canva API** (If available)
- **Pillow (Python)** (Image generation)

**Slide Style:**
- Bold headlines
- Minimal text per slide
- High contrast (black/white/yellow)
- Professional typography

### 4. Video Compilation
**Tool:** FFmpeg
**Command:**
```bash
ffmpeg -loop 1 -t [duration] -i slide001.png \
  -loop 1 -t [duration] -i slide002.png \
  ... \
  -i audio.mp3 \
  -filter_complex "[0:v][1:v]...concat=n=[count]:v=1:a=0[v]" \
  -map "[v]" -map [count]:a \
  -c:v libx264 -c:a aac -shortest \
  output.mp4
```

---

## Output Structure

```
vsl-output/
├── script.md              # Full script with timing
├── audio.mp3              # ElevenLabs voice
├── slides/
│   ├── slide-001.png
│   ├── slide-002.png
│   └── ...
└── final-vsl.mp4          # Rendered video
```

---

## Workflow States

**Phase 1: Analysis**
- Extract page elements
- Identify core messaging
- Confirm alignment

**Phase 2: Script**
- Write spoken-language version
- Add stage directions
- Validate message match

**Phase 3: Voice**
- Generate ElevenLabs audio
- Review pacing
- Export MP3

**Phase 4: Visuals**
- Generate slide images
- Sync timing to script
- Create transitions

**Phase 5: Render**
- Compile with FFmpeg
- Add music (optional)
- Export final MP4

**Phase 6: Delivery**
- Save to workspace
- Upload to storage (optional)
- Provide download link

---

## Configuration

**ElevenLabs Settings:**
- API Key: (Store in credentials)
- Voice ID: (Configure per project)
- Model: eleven_monolingual_v1

**Video Settings:**
- Resolution: 1920x1080
- Frame Rate: 30fps
- Codec: H.264
- Audio: AAC 192kbps

**Slide Timing:**
- Hook: 30 seconds
- Problem: 90 seconds
- Mechanism: 60 seconds
- Proof: 45 seconds
- Transformation: 45 seconds
- Objections: 60 seconds
- Offer: 60 seconds
- Urgency: 30 seconds
- Close: 30 seconds

---

## Examples

### Example 1: FastStart VSL
**Input:** openclaw-faststart-v2.vercel.app/operator-version
**Output:** 10-minute VSL, Pacino voice, operator positioning
**File:** `openclaw-faststart-v2/VSL-SCRIPT.md`

### Example 2: Product Launch VSL
**Input:** Product landing page URL
**Output:** 7-minute VSL, cold traffic optimized

---

## Error Handling

**No sales page found:**
- Request URL or file path
- Cannot proceed without source material

**Message misalignment:**
- Flag inconsistencies
- Request manual review before proceeding

**Voice generation fails:**
- Fallback to text output
- Notify user to generate voice manually

**Video render fails:**
- Export slides + audio separately
- Provide assembly instructions

---

## Future Enhancements

- [ ] Auto-upload to YouTube (unlisted)
- [ ] Captions/subtitles generation
- [ ] Background music integration
- [ ] Multiple voice options
- [ ] A/B testing variations
- [ ] Direct Canva integration
- [ ] Animated text overlays
- [ ] Stock footage integration

---

## Dependencies

**Required:**
- ElevenLabs API access
- FFmpeg installed
- ImageMagick or Pillow (Python)

**Optional:**
- Canva API
- YouTube API
- Storage (Dropbox/S3)

---

## Cost Per Video

**ElevenLabs:** ~$0.30-0.50 per 10-min video
**Storage:** Minimal (~50MB per video)
**Compute:** Local (free)

**Total:** < $1 per VSL

---

## Notes

- Script must match sales page messaging exactly
- Voice pacing critical for retention
- Slide timing synced to natural speech pauses
- Export in multiple formats (MP4, WebM) for compatibility
- Keep source files for future edits

---

**Skill Status:** Ready for implementation
**Next Step:** Build automation pipeline (script → voice → slides → video)
