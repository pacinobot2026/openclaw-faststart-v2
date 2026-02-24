# /replay - Quick Replay Workflow

## Command
`/replay`

## What It Does
Grabs a Vimeo video, downloads transcript, creates Course Sprout lesson with descriptions and goal block.

## Default Settings
- **Course:** OpenClaw Shadow Intensive (ID: 340)
- **Chapter:** Replays (ID: 958)
- **Points:** 10
- **Goal Type:** Points + Comments + User Input

## Workflow Steps
1. User types `/replay`
2. Bot asks: "What's the Vimeo URL?"
3. Bot asks: "What's the lesson title?" (or auto-generates from video name)
4. Bot executes:
   - Get video details from Vimeo API
   - Download transcript
   - Generate short description (1-2 sentences)
   - Generate long description (sections + bullets, NO EMOJIS)
   - Create lesson via Course Sprout API
   - Create goal block with standard framework:
     - "Here's the deal" - reinforce the breakthrough
     - "Your one thing" - ONE action step
     - "Drop a comment below" - engagement prompt

## Custom Options
- Different course: `/replay course:123`
- Different chapter: `/replay chapter:456`
- Different points: `/replay points:25`

## Example
```
User: /replay
Bot: What's the Vimeo URL?
User: https://vimeo.com/1165483176
Bot: What should I call this lesson? (or press enter for auto-title)
User: Day 2: GC API Integration
Bot: [executes workflow]
Bot: ✅ Lesson created! ID: 6089
```

## Files Created
- Transcript: `transcripts/vimeo/[video-name].vtt`
- No recap file (that's separate workflow)

## Related Commands
- `/recap` - Create meeting notes from transcript
- `/grab` - Just download transcript without creating lesson
