# Bridge Page Complete Workflow

*Created: 2026-02-04*  
*Last tested: 2026-02-04 with "26. Newsletter Hour"*

## 🎯 Purpose
Complete automation guide for cloning and updating bridge pages in PopLinks. This solves the Vue.js automation challenges we've encountered.

## ⚠️ CRITICAL: Token Management
Bridge page snapshots are **MASSIVE** (50-150k tokens each). Follow this protocol:

1. **BEFORE starting:** Journal all steps to `memory/YYYY-MM-DD.md`
2. **ONE snapshot → extract data → WRITE TO FILE → close**
3. Never take more than 2-3 snapshots per task

## 📋 Complete Workflow

### Step 1: Navigate to Bridge Pages
```
URL: https://app.poplinks.io/app/funnels/bridge-pages
```

### Step 2: Clone the Bridge Page

**Find the source page:**
- Identify the LAST page in the series (e.g., "26. Newsletter Hour" when creating 27)
- Note the number - you'll create the NEXT sequential number

**Clone it:**
1. Click 3-dot menu button on the source page
2. Click "Clone Bridge Page"
3. Confirm in dialog (click "Clone" button)
4. Success message: "Cloned!" dialog appears
5. Click "OK"

**Result:** New page appears at top of list with "(Copy)" suffix

### Step 3: Rename the Clone

**IMPORTANT:** This is where Vue.js issues happen most. Use this exact sequence:

1. Click 3-dot menu on the NEW clone (the one with "Copy")
2. Look for rename option OR
3. If no rename in menu, the name field might be inline-editable

**Naming convention:**
- Remove "(Copy)" suffix
- Update to next sequential number
- Format: `[NUMBER]. [TYPE]` (e.g., "27. Newsletter Hour")

**Save the rename:**
- Click checkmark/save icon
- OR click outside the field (auto-save)

### Step 4: Set Category (if needed)

Categories by page type:
- **Newsletter Hour** → Newsletter Hour
- **Titanium Tech Call** → Titanium Call
- **Round Table** → Round Table
- **Entourage Strategy Call** → Entourage
- **PPTraining** → PowerPlay Offers

**How:**
1. 3-dot menu → Update Category
2. Select from dropdown
3. Save

### Step 5: Setup URL

1. 3-dot menu → Setup URL's
2. Change slug to match page number (e.g., `/27a` for Newsletter Hour 27)
3. Click "Save Links"

**URL format examples:**
- Newsletter Hour 27: `/27a`
- Titanium Call 44: `/44t`
- Round Table 38: `/38r`

### Step 6: Edit Page Content (if needed)

**ONLY do this if you need to update content.** For simple clones, skip this.

1. 3-dot menu → Edit Bridge Page
2. **Text editing:**
   - Click on text element in preview
   - Edit inline (type directly)
   - Click anywhere else to save (auto-saves)
3. **Video URL:**
   - Click on video element
   - Right panel shows "Video URL" field
   - Update URL
   - Auto-saves when you click out
4. **IMPORTANT:** Set video to PUBLIC in Vimeo first

**Don't:**
- Use Ctrl+S (not needed, auto-saves)
- Try to edit via right panel for text (use inline)
- Get stuck in Edit mode - click back to dashboard when done

## 🐛 Common Issues & Solutions

### Issue: Menu doesn't expand
**Solution:** Click the 3-dot button again, wait 500ms

### Issue: Rename field not visible
**Solution:** Try clicking directly on the title text (might be inline-editable)

### Issue: "Copy" suffix won't delete
**Solution:** Select all text in field, then type new name completely

### Issue: Changes don't save
**Solution:** Make sure you clicked the checkmark or clicked outside the field

### Issue: Context compaction during work
**Solution:** You forgot to journal! Write steps to memory file BEFORE starting

## 📝 Journaling Template

Always write this to `memory/YYYY-MM-DD.md` BEFORE starting:

```markdown
## [TIME] - Clone Bridge Page for [TYPE] [NUMBER]

**Goal:** Create bridge page [NUMBER] from [SOURCE]

**Steps:**
1. Navigate to bridge pages
2. Find source page: [SOURCE NAME]
3. Clone via 3-dot menu
4. Rename: Remove "Copy" → "[NEW NAME]"
5. Category: [CATEGORY]
6. Setup URL: [NEW SLUG]
7. (Optional) Edit content: [WHAT TO UPDATE]

**Status:** STARTING...
```

**During work:** Update status after each step

**After:** Mark COMPLETE or FAILED with details

## ✅ Success Indicators

- New page appears in list with correct name
- No "(Copy)" suffix visible
- URL is correct format
- Category matches page type
- Page shows 0 views, 0 clicks (fresh clone)

## 🔗 Related Files

- Main tool reference: `TOOLS.md` (PopLinks section)
- Vimeo workflow: `TOOLS.md` (Vimeo section)
- Memory protocol: `AGENTS.md` (Real-Time Journaling Protocol)

---

*This workflow was tested successfully on 2026-02-04. If you encounter new issues, update this file.*
