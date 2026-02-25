# BUILD_LOCKED_SYNC_VSL

## Current Status

**✅ Phase 1: Audio Generation - IN PROGRESS**
- Generated slides 1-2 successfully
- Need to generate slides 3-16

**⏳ Phase 2: PowerPoint Assembly - READY**
- Script built: `build_pptx_only.py`
- Will create perfectly synced PowerPoint with your audio files

## Quick Start

### Option A: Manual Audio Generation (Fastest)

1. Use ElevenLabs web interface to generate each voiceover
2. Save as `audio_files/slide_01_raw.mp3` through `slide_16_raw.mp3`
3. Run: `python build_pptx_only.py`

### Option B: Automated (if openclaw sag works)

Run: `.\generate_audio.ps1`

### Option C: Continue with TTS tool

I can continue generating each slide via TTS tool (13 more to go)

##Scripts

- `build_pptx_only.py` - Assembles PowerPoint from existing audio files
- `generate_audio.ps1` - PowerShell script to batch generate audio  
- `script-breakdown.md` - Full script with all 16 slides

## What You'll Get

- **FastStart_VSL_LOCKED_SYNC.pptx** - PowerPoint with perfect sync
- Each slide advances EXACTLY when its audio ends
- No drift, no manual timing, mathematically perfect

Then export from PowerPoint:
- File > Export > Create a Video
- Full HD (1080p), 30fps
- Use Recorded Timings and Narrations

## The Science

- ONE audio file per slide (no cumulative timeline)
- Silence trimmed automatically
- Exact duration detection via ffprobe
- Transition timing = audio duration (no guessing)
