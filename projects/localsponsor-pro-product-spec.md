# LocalSponsor Pro - Product Specification & MVP Features

**Version:** 1.0 MVP
**Stack:** Next.js + Supabase + Stripe
**Launch Timeline:** 4-6 weeks
**Pricing:** $97 one-time (lifetime) or $47/month (subscription)

---

## CORE FEATURES (MVP - Must Ship)

### 1. Sponsor CRM

**Purpose:** Central database for all sponsor information

**Fields:**
- Sponsor name (required)
- Company name
- Contact email (required)
- Phone number
- Logo upload (optional)
- Package tier (dropdown: Bronze, Silver, Gold, Custom)
- Monthly rate / one-time payment
- Contract start date
- Contract end date
- Renewal date (auto-calculated)
- Status (Active, Paused, Ended)
- Notes (rich text)
- Tags (custom labels)

**Features:**
- Search/filter by name, company, status, tags
- Sort by renewal date, monthly rate, contract end
- Quick actions: email sponsor, view invoices, view placements, view reports
- Sponsor detail page with full history (invoices, placements, reports)

**UI Wireframe:**
```
+------------------------------------------+
| Sponsors                    [+ Add New]  |
+------------------------------------------+
| Search: [___________]   Filter: [All ▼] |
+------------------------------------------+
| Name      | Company    | Rate   | Status |
+------------------------------------------+
| ABC Corp  | ABC Inc    | $500   | Active |
| XYZ Media | XYZ LLC    | $300   | Active |
| 123 Local | 123 Co     | $750   | Paused |
+------------------------------------------+
```

---

### 2. Invoice Management

**Purpose:** Generate, send, and track invoices automatically

**Fields:**
- Invoice number (auto-generated)
- Sponsor (dropdown from CRM)
- Amount (pre-filled from sponsor rate or manual)
- Due date (default: 14 days from issue)
- Issue date (auto: today)
- Status (Draft, Sent, Paid, Overdue)
- PDF attachment (auto-generated)
- Payment date (manual entry or Stripe webhook)

**Features:**
- One-click invoice generation
- Auto-send via email (uses template)
- Payment tracking (manual mark-as-paid or Stripe integration)
- Overdue reminders (auto-email 3 days after due date)
- Bulk invoicing (generate invoices for all active sponsors at once)
- Invoice history per sponsor

**Invoice Template:**
```
+------------------------------------------+
| INVOICE #1234                            |
| Issue Date: Feb 28, 2026                 |
| Due Date: Mar 14, 2026                   |
+------------------------------------------+
| Bill To:                                 |
| ABC Corp                                 |
| john@abccorp.com                         |
+------------------------------------------+
| Description              | Amount        |
+------------------------------------------+
| Gold Package Sponsorship | $500          |
+------------------------------------------+
| TOTAL DUE                | $500          |
+------------------------------------------+
| Pay via: [Stripe Link or Manual]         |
+------------------------------------------+
```

**UI Wireframe:**
```
+------------------------------------------+
| Invoices                [+ New Invoice]  |
+------------------------------------------+
| Invoice # | Sponsor  | Amount | Status   |
+------------------------------------------+
| INV-001   | ABC Corp | $500   | Paid ✓   |
| INV-002   | XYZ Media| $300   | Sent     |
| INV-003   | 123 Local| $750   | Overdue! |
+------------------------------------------+
```

---

### 3. Placement Calendar

**Purpose:** Visual schedule of all sponsor placements

**Fields:**
- Placement date (required)
- Sponsor (dropdown from CRM)
- Placement type (Newsletter, Website Banner, Social Post, Event, Custom)
- Placement details (text: what/where)
- Status (Scheduled, Live, Completed)
- Reminder (3 days before, 1 day before, or custom)

**Features:**
- Monthly calendar view (drag-and-drop placements)
- List view (upcoming placements sorted by date)
- Auto-reminders via email (3 days before go-live)
- Mark placements as completed (with optional notes)
- Filter by sponsor, placement type, status
- Bulk placement scheduling (e.g., every Monday newsletter ad for 12 weeks)

**UI Wireframe (Calendar View):**
```
+------------------------------------------+
|  February 2026          [Month ▼] [+ Add]|
+------------------------------------------+
| Sun | Mon | Tue | Wed | Thu | Fri | Sat |
+------------------------------------------+
|  1  |  2  |  3  |  4  |  5  |  6  |  7  |
|     | ABC |     | XYZ |     |     |     |
|     | Ad  |     | Post|     |     |     |
+------------------------------------------+
| 8-14: [placements continue...]           |
+------------------------------------------+
```

**UI Wireframe (List View):**
```
+------------------------------------------+
| Upcoming Placements      [Calendar View] |
+------------------------------------------+
| Date       | Sponsor  | Type     | Status|
+------------------------------------------+
| Mar 1, 2026| ABC Corp | Newsletter| Due  |
| Mar 4, 2026| XYZ Media| Banner   | Due  |
| Mar 8, 2026| 123 Local| Social   | Due  |
+------------------------------------------+
```

---

### 4. Reporting Dashboard

**Purpose:** Track sponsor performance and generate reports

**Metrics Tracked:**
- Impressions (manual entry or auto-fetch from GA)
- Clicks (manual entry or auto-fetch)
- Conversions (manual entry or goal tracking)
- CTR (calculated: clicks / impressions)
- Cost per click (sponsor rate / clicks)
- ROI estimate (if conversion value provided)

**Features:**
- Per-sponsor report generation
- Date range selection (last 7 days, last 30 days, custom)
- Export as PDF (professional template)
- Email report directly to sponsor (one-click)
- Historical performance comparison (month-over-month)

**Report Template:**
```
+------------------------------------------+
| ABC CORP - SPONSOR REPORT                |
| Period: Feb 1 - Feb 28, 2026             |
+------------------------------------------+
| Metric          | Value                  |
+------------------------------------------+
| Impressions     | 12,450                 |
| Clicks          | 342                    |
| Conversions     | 28                     |
| CTR             | 2.75%                  |
| Cost Per Click  | $1.46                  |
+------------------------------------------+
| Performance Summary:                     |
| Strong engagement this month. CTR above  |
| average. Recommend continuing placement. |
+------------------------------------------+
```

**UI Wireframe:**
```
+------------------------------------------+
| Reports                 [+ Generate New] |
+------------------------------------------+
| Sponsor: [ABC Corp ▼] Period: [Feb ▼]   |
| [Generate Report]                        |
+------------------------------------------+
| Recent Reports:                          |
| ABC Corp - Feb 2026 [View] [Email]      |
| XYZ Media - Feb 2026 [View] [Email]     |
+------------------------------------------+
```

---

### 5. Email Automation

**Purpose:** Automate sponsor communication

**Email Templates:**
1. **Invoice Sent** - "Your invoice is ready"
2. **Payment Received** - "Thank you for your payment"
3. **Placement Reminder** - "Your ad goes live in 3 days"
4. **Renewal Reminder (30 days)** - "Your contract renews in 30 days"
5. **Renewal Reminder (7 days)** - "Your contract renews in 7 days"
6. **Thank You (after placement)** - "Thanks for partnering with us"

**Features:**
- Pre-built templates (customizable)
- Auto-trigger based on events (invoice sent, payment received, etc.)
- Manual send option (one-off emails)
- Email log (track what was sent when)
- Personalization tokens (sponsor name, amount, date, etc.)

**UI Wireframe:**
```
+------------------------------------------+
| Email Automations       [+ New Template] |
+------------------------------------------+
| Template              | Status | Trigger |
+------------------------------------------+
| Invoice Sent          | Active | Auto    |
| Renewal Reminder 30d  | Active | Auto    |
| Placement Reminder    | Active | Auto    |
+------------------------------------------+
| [Edit] [Preview] [Send Test]            |
+------------------------------------------+
```

---

## PHASE 2 FEATURES (Post-Launch)

### Stripe Payment Integration
- One-click payment links in invoices
- Auto-update invoice status on payment
- Recurring billing for subscription sponsors

### Google Analytics Integration
- Auto-fetch impressions/clicks for reports
- UTM parameter tracking per sponsor
- Real-time performance dashboard

### Sponsor Portal
- Self-service login for sponsors
- View their own invoices, placements, reports
- Update billing info
- Download past reports

### Advanced Reporting
- Multi-sponsor comparison
- Placement type performance (newsletter vs banner vs social)
- Revenue forecasting (based on renewal rates)
- Churn prediction

### Mobile App
- iOS/Android app for on-the-go sponsor management
- Quick invoice generation
- Placement reminders via push notifications

---

## TECHNICAL STACK

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- Shadcn UI components
- React Hook Form (forms)
- React Calendar (placement scheduler)

**Backend:**
- Next.js API routes
- Supabase (PostgreSQL database)
- Supabase Auth (user authentication)
- Supabase Storage (logo uploads, invoice PDFs)

**Payments:**
- Stripe (one-time + subscription)
- Stripe webhooks (payment confirmation)

**Email:**
- Resend or SendGrid (transactional emails)
- Email templates (React Email)

**PDF Generation:**
- jsPDF or Puppeteer (invoice + report PDFs)

**Hosting:**
- Vercel (frontend + API)
- Supabase (database + storage)
- Custom domain (localsponsorpro.com)

---

## DATABASE SCHEMA

### sponsors
```sql
id (uuid, primary key)
user_id (uuid, foreign key → users)
name (text, required)
company (text)
email (text, required)
phone (text)
logo_url (text)
package_tier (text)
monthly_rate (decimal)
contract_start (date)
contract_end (date)
renewal_date (date)
status (text: active, paused, ended)
notes (text)
tags (text[])
created_at (timestamp)
updated_at (timestamp)
```

### invoices
```sql
id (uuid, primary key)
user_id (uuid, foreign key → users)
sponsor_id (uuid, foreign key → sponsors)
invoice_number (text, unique)
amount (decimal, required)
issue_date (date, required)
due_date (date, required)
payment_date (date, nullable)
status (text: draft, sent, paid, overdue)
pdf_url (text)
created_at (timestamp)
updated_at (timestamp)
```

### placements
```sql
id (uuid, primary key)
user_id (uuid, foreign key → users)
sponsor_id (uuid, foreign key → sponsors)
placement_date (date, required)
placement_type (text: newsletter, banner, social, event, custom)
details (text)
status (text: scheduled, live, completed)
reminder_sent (boolean)
created_at (timestamp)
updated_at (timestamp)
```

### reports
```sql
id (uuid, primary key)
user_id (uuid, foreign key → users)
sponsor_id (uuid, foreign key → sponsors)
period_start (date)
period_end (date)
impressions (integer)
clicks (integer)
conversions (integer)
ctr (decimal)
cost_per_click (decimal)
notes (text)
pdf_url (text)
created_at (timestamp)
```

### users
```sql
id (uuid, primary key)
email (text, unique, required)
created_at (timestamp)
subscription_status (text: active, canceled, trial)
stripe_customer_id (text)
```

---

## MVP LAUNCH CHECKLIST

**Design:**
- [ ] Wireframes complete (this doc)
- [ ] UI design (Figma or go straight to code)
- [ ] Logo + branding

**Development:**
- [ ] GitHub repo setup
- [ ] Next.js project scaffolding
- [ ] Supabase project setup + database schema
- [ ] Authentication (signup, login, password reset)
- [ ] Sponsor CRM (CRUD)
- [ ] Invoice management (CRUD + PDF generation)
- [ ] Placement calendar (CRUD + reminders)
- [ ] Reporting (metrics + PDF export)
- [ ] Email automation (templates + triggers)
- [ ] Stripe integration (checkout + webhooks)

**Testing:**
- [ ] User testing (5-10 beta users)
- [ ] Bug fixes
- [ ] Performance optimization

**Launch:**
- [ ] Deploy to Vercel
- [ ] Custom domain setup (localsponsorpro.com)
- [ ] SSL certificate
- [ ] Sales page live (MintBird)
- [ ] VSL uploaded (Vimeo)
- [ ] Email sequence set up (GC)
- [ ] Ad campaign launched (Facebook)

---

**Status:** Product spec complete - ready for development kickoff
**Estimated Build Time:** 4-6 weeks (solo dev) or 2-3 weeks (with team)
