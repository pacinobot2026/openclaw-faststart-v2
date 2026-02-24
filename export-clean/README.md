# OpenClaw Skills Package

**Version:** 2.0  
**Updated:** 2026-02-19  
**Status:** ✅ Production Ready

---

## 📦 What's Included

This package contains **3 complete skills** with **7 working commands**.

### Skills

1. **globalcontrol** — Global Control CRM API
   - Contacts, tags, broadcasts, custom fields, domains
   - 39+ API endpoints documented
   - Test harness included

2. **reengagement** — Email Re-engagement Campaigns
   - CSV import with progressive sending
   - Pace control (Mild/Normal/Aggressive)
   - State persistence with pause/resume

3. **poplinks-manager** — PopLinks/MintBird API
   - URL shortener (PopLinks)
   - Lead capture pages
   - Bridge pages (pre-sell/advertorial)
   - Complete with setup wizards

### Commands (SHORTCODES.md)

| Shortcode | Purpose | Skill |
|-----------|---------|-------|
| `/broadcast` | Send broadcast email with re-engagement fork | globalcontrol |
| `/reactivation` | Progressive CSV campaign | reengagement |
| `/poplink` | Create shortened link | poplinks-manager |
| `/leadstep` | Create lead capture page | poplinks-manager |
| `/bridgepage` | Create/clone bridge page | poplinks-manager |
| `/tag` | Fire tag on contact | globalcontrol |
| `/contact` | Get contact history | globalcontrol |

**Total: 7 available commands**

---

## 📋 Quick Start

### 1. Extract Skills
```bash
# Copy skills to your OpenClaw workspace
cp -r skills/* ~/.openclaw/workspace/skills/
cp SHORTCODES.md ~/.openclaw/workspace/
```

### 2. Set Up Credentials

Each skill needs API credentials:

**globalcontrol:**
```bash
# Create credentials/globalcontrol-api.txt
echo "API_KEY=your_gc_api_key" > credentials/globalcontrol-api.txt
```

**poplinks-manager:**
```bash
# Run interactive setup wizard
cd skills/poplinks-manager
bash setup.sh  # or powershell setup.ps1
```

**reengagement:**
- Uses Global Control API (same credentials as above)
- No additional setup needed

### 3. Use Commands

Just say the shortcode in chat:
```
/broadcast
/poplink https://example.com
/tag contact@example.com
```

---

## 🔒 Security Notes

**⚠️ BEFORE SHARING THIS PACKAGE:**
- ✅ Already sanitized — no API keys included
- ✅ Templates provided for all credentials
- ✅ .gitignore protects credential files

**To use:**
1. Add your API keys to credential files (see each skill's README)
2. Never commit credentials to git
3. Use setup wizards for easy configuration

---

## 📚 Documentation

### Per-Skill Documentation

**globalcontrol:**
- `skills/globalcontrol/SKILL.md` — Complete API reference
- `skills/globalcontrol/api_map.json` — Full endpoint map
- `skills/globalcontrol/test_harness.ps1` — Testing tool

**reengagement:**
- `skills/reengagement/SKILL.md` — Campaign workflow
- `skills/reengagement/PACING_GUIDE.md` — Sending pace options
- `skills/reengagement/helpers.ps1` — PowerShell utilities

**poplinks-manager:**
- `skills/poplinks-manager/SKILL.md` — API reference
- `skills/poplinks-manager/SETUP.md` — Credential setup
- `skills/poplinks-manager/QUICK_REFERENCE.md` — Common tasks
- `skills/poplinks-manager/EXAMPLES.md` — Real-world workflows
- `skills/poplinks-manager/README.md` — Installation guide

### Global Documentation

- **SHORTCODES.md** — Command reference (this file is your cheat sheet!)

---

## 🚀 Features

### Automatic Credential Management
All commands automatically:
- ✅ Check if credentials exist
- ✅ Prompt to set up if missing
- ✅ Validate API connections
- ✅ Show helpful error messages

**No cryptic "API key not found" errors!**

### Interactive Setup Wizards
- **poplinks-manager:** `bash setup.sh` or `powershell setup.ps1`
- Guides you through getting API tokens
- Validates connections
- Saves credentials securely

### Production-Ready Code
- Error handling built-in
- Retry logic where needed
- Rate limit awareness
- State persistence

---

## 📊 Package Contents

```
export-clean/
├── README.md (this file)
├── SHORTCODES.md (command reference)
└── skills/
    ├── globalcontrol/
    │   ├── SKILL.md
    │   ├── api_map.json (39 endpoints)
    │   ├── test_harness.ps1
    │   └── references/
    │       └── wrapper-plan.md
    ├── reengagement/
    │   ├── SKILL.md
    │   ├── PACING_GUIDE.md
    │   └── helpers.ps1
    └── poplinks-manager/
        ├── SKILL.md
        ├── README.md
        ├── SETUP.md
        ├── QUICK_REFERENCE.md
        ├── EXAMPLES.md
        ├── PACKAGE_CONTENTS.md
        ├── setup.sh (Linux/Mac wizard)
        ├── setup.ps1 (Windows wizard)
        ├── validate-credentials.js
        ├── lib-credentials.js
        ├── example-commands.js
        ├── credentials.template.txt
        ├── skill.json
        └── .gitignore
```

**Total:** 22 files, ~120 KB

---

## ❌ What's NOT Included

The following commands from the original SHORTCODES.md are **not available** because their skills aren't implemented yet:

- `/replay` — Course Sprout lesson creation
- `/article` — Letterman article creation
- `/systemhealth` — API health monitoring
- `/teamcall` — Zoom call processing

**To add these:** Create the corresponding skills and update SHORTCODES.md

---

## 🔧 Requirements

- OpenClaw installation
- Node.js (for poplinks-manager examples)
- API access to:
  - Global Control CRM
  - PopLinks/MintBird
  - (Optional) EmailListVerify for reengagement

---

## 💡 Tips

### Learning Path

**Beginner:**
1. Read SHORTCODES.md
2. Set up poplinks-manager with wizard
3. Try `/poplink` command

**Intermediate:**
1. Explore globalcontrol API map
2. Try `/broadcast` workflow
3. Set up `/reactivation` campaign

**Advanced:**
1. Study skill implementations
2. Build custom commands
3. Extend with new skills

### Troubleshooting

**"Credentials not found"**
- Run setup wizard: `bash skills/poplinks-manager/setup.sh`
- Or manually create credential files (see skill READMEs)

**"API connection failed"**
- Check API token is valid
- Verify you have API access in platform
- See skill SETUP.md for instructions

**"Command not working"**
- Check SHORTCODES.md for correct syntax
- Verify skill is installed in `skills/` folder
- Read skill's SKILL.md for detailed workflow

---

## 🤝 Support

- **OpenClaw Docs:** https://docs.openclaw.ai
- **Community:** https://discord.com/invite/clawd
- **Skills Hub:** https://clawdhub.com

---

## 📄 License

Each skill may have its own license. Check individual skill folders for details.

This package compiled by OpenClaw AI assistant.

---

**Ready to use! 🎬**

Extract, set up credentials, and start automating.
