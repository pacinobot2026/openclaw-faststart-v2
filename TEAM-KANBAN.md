# TEAM KANBAN - Assignment Board

*Last updated: 2026-02-18 11:03 AM CST*

## 🎯 Team Status (From Feb 18 Team Call - Meeting 82250425529)

| Team Member | Current Work | Status | Notes |
|-------------|--------------|--------|-------|
| **Ammad** | Newsletter stats + workflow building | 🟢 Ready | API docs ✅ complete. Starting new work |
| **Gaurav** | OpenClaw container deployment | 🔴 In Progress | Deployed on Cloudflare. Needs 1-2 days. NOT ready for Thursday webinar |
| **Adarsha** | Quizforma templates with Vivek | 🟡 Tomorrow | Coming early to work with Vivek on beautiful templates |
| **Ishwor** | FlexiFunnels GC auth | 🟡 In Progress | Login API ✅ done. Verification API tomorrow with Kafi |
| **Kafi** | FlexiFunnels GC auth + GC Admin | 🟡 In Progress | Verification API with Ishwor. Future: Rebuild GC Admin with Pranay |
| **Vivek** | Quizforma templates | 🟡 Tomorrow | Working with Adarsha |
| **Khushal** | Page Sprout / Poplink templates | ❓ Unknown | Not on recent calls |
| **Renee** | Auto-recording | ⏳ Unknown | Not on Feb 18 call |
| **Hannah** | Self Mastery Co training | 🟢 Ready | Not on Feb 18 call |

**Previous Status (Feb 17):**
| **Ammad** | Email broadcast bug fix | ✅ Done | Moved to new work |
| **Pranay** | Email broadcast support | ✅ Done | |

**From Feb 16:**
| **Vivek** | Template API | ⏳ Waiting | Now working with Adarsha |

## 📋 Backlog
*(Tasks identified but not started)*

### New Tasks - Feb 18, 2026

- [ ] **Update Course Sprout API - pod-to-course mappings** - @Vivek
  - Add endpoint to show which courses are bundled in each pod
  - Current API limitation: can't query pod-specific course lists
  
- [ ] **Build enterprise ad account endpoints** - @Vivek (HIGH PRIORITY)
  - Newsletter ads for client accounts
  - Enterprise-level ad management API
  
- [ ] **Page Sprout pages - Vercel deployment** - @Khushal
  - Continue development on pages deployed last night
  - Ensure stability and performance
  
- [ ] **Quizforma ad features** - @Adarsha + @Vivek
  - Collaborate on ad integration in Quizforma
  - Coordinate with Vivek on enterprise ad system

### From Team Call - Feb 18, 2026 (Meeting 82250425529)

**DONE/Updated:**
- [x] **API Docs** - @Ammad ✅ COMPLETE
  - Ready for newsletter stats and workflow building

**In Progress:**
- [ ] **OpenClaw container deployment** - @Gaurav
  - Deployed one instance on Cloudflare
  - Has pairing issue to solve
  - Needs 1-2 more days (NOT ready for Thursday webinar)
  
- [ ] **FlexiFunnels GC integration** - @Ishwor + @Kafi
  - Login API connected ✅
  - Verification API in progress
  - Will complete tomorrow
  - Once done, future apps will auto-connect to GC

- [ ] **Quizforma templates** - @Adarsha + @Vivek
  - Adarsha will come early tomorrow to work with Vivek
  - Need beautiful, editable templates
  - Critical for Quizforma launch

- [ ] **Rebuild GC Admin** - @Kafi + @Pranay (Future task)
  - Make it easier to add integrations
  - AI should be able to configure integrations automatically

### From Team Call - Feb 17, 2026 (Meeting 82250425529)

**Active (End of Call):**
- [ ] **Fix email sending schedule bug** - @Ammad + @Gaurav + @Pranay (HIGH PRIORITY)
  - Add "sendingSchedule" field (value: "TEST" or "IMMEDIATELY")
  - Fix missing field validation - send proper error if field missing
  - Current issue: API returns success but count=0, emails not sending
  
- [ ] **GC authentication for FlexiFunnels** - @Ishwor + @Kafi
  - Build authentication flow from FlexiFunnels to GC
  - Ishwor done with container work, moved to this
  
**Assigned:**
- [ ] **Set up auto-recording for team calls** - @Renee
  - Configure meeting 82250425529 to record automatically
  - No more manual recording start
  
- [ ] **Quizforma mobile layouts** - @Adarsha (Work with Chad today)
  - Connect one quiz template and verify understanding
  - Fix mobile spacing - buttons too close together
  - Center elements on mobile
  - Reference: vivid.app (clean mobile surveys)
  
- [ ] **Self Mastery Co OpenClaw setup** - @Hannah
  - Help train Nick's team on OpenClaw
  - Guide through: Claude API, Moonshot API, AgentMail, Whisper setup

### From Team Call - Feb 16, 2026

- [ ] **Backend API for activity level filtering** - @Ammad (HIGH PRIORITY - needed for demo Feb 17)
  - Create API to handle activity level selection (clickers/openers)
  - Filter by: inactive, passive, new, dead
  
- [ ] **GC Broadcast Email Integration** - @Ammad (HIGH PRIORITY)
  - Build Clickers and Openers modules
  - Implement activity level logic
  
- [ ] **Preview/UI Component** - @Adarsha
  - Add prompt functionality
  - Test preview display
  
- [ ] **Get API Documentation** - @Kafi
  - Contact PBEC for API docs
  
- [ ] **Secure API Routes** - @Kafi
  - Prevent accidental template deletion
  - Secure route discovery

---

## 🏃 In Progress
*(Currently being worked on)*

- [ ] *Nothing yet*

---

## ✅ Done (Last 7 Days)
*(Completed tasks)*

- [x] Set up Team Zoom link (chadnicely.com/team) - 2026-02-16
- [x] Created team Kanban board - 2026-02-16

---

## 📝 Team Call Transcripts

### 2026-02-16 - Team Meeting (22 minutes)
- **Zoom Meeting ID:** 8204539480
- **Transcript:** `transcripts/zoom/team-call-2026-02-16.vtt`
- **Assignments Extracted:** 5 tasks (2 Ammad, 2 Kafi, 1 Adarsha)
- **Key Topic:** GC broadcast email system with activity levels (demo prep for Feb 17)

---

## 🎯 How This Works

**After each team call:**
1. Someone types `/teamcall` (or I auto-detect new recordings)
2. I pull the Zoom transcript
3. Extract action items and assignments
4. Add them to Backlog with person responsible
5. Update status as work progresses

**Moving tasks:**
- Backlog → In Progress (when someone starts)
- In Progress → Done (when completed)

**Format:**
```
- [ ] Task description - @PersonResponsible (from call YYYY-MM-DD)
```
