# 💳 Stripe Products — OpenClaw Automation Playbook

## PRODUCT 1: Core Playbook

**Name:** OpenClaw Automation Playbook  
**Description:** The complete 30-day system that transforms non-techies into AI automation experts. Includes 42 video lessons, 50+ templates, community access, and group calls.

**Price:** $497 one-time  
**Type:** One-time payment  
**Success URL:** https://[domain]/thank-you  
**Cancel URL:** https://[domain]/checkout-cancelled

---

## PRODUCT 2: Automation Swipe File (Order Bump)

**Name:** Automation Swipe File — 50 Plug-and-Play Templates  
**Description:** Copy-paste automation templates you can implement immediately. Email workflows, social media systems, client onboarding, and more.

**Price:** $97 one-time  
**Type:** Order bump / One-time add-on  
**Success URL:** https://[domain]/thank-you  
**Cancel URL:** https://[domain]/checkout-cancelled

---

## PRODUCT 3: Done-With-You Membership

**Name:** OpenClaw Done-With-You Membership  
**Description:** Bi-weekly 1-on-1 coaching calls, custom automation buildouts, priority support, advanced library, lifetime community access, and monthly live workshops.

**Price:** $197/month or $1,997/year (save $367)  
**Type:** Recurring subscription  
**Trial:** Optional 7-day trial at $1  
**Success URL:** https://[domain]/dwymember-welcome  
**Cancel URL:** https://[domain]/checkout-cancelled

---

## PRODUCT 4: VIP Done-For-You Day

**Name:** OpenClaw VIP Day — Done-FOR-You Automation Buildout  
**Description:** We build your complete automation system in ONE day. Custom OpenClaw setup, 10 automations built for your business, 90-day support, full documentation.

**Price:** $2,997 one-time (or payment plan: $997/month × 3)  
**Type:** One-time payment or payment plan  
**Success URL:** https://[domain]/vip-welcome  
**Cancel URL:** https://[domain]/checkout-cancelled

---

## CHECKOUT FLOW

### Path 1: Core Only
1. Land on sales page
2. Click "Get The Playbook — $497"
3. Checkout page with order bump (Swipe File +$97)
4. Purchase → Thank you page
5. **Upsell Offer:** Done-With-You Membership ($197/mo)

### Path 2: Core + DWY Membership
1. Core purchase complete
2. Upsell page: "Want us to build it WITH you?"
3. Accept → DWY checkout
4. Welcome to membership page

### Path 3: VIP Day (Backend)
1. Offered via email sequence (Day 7, 14, 21)
2. Offered in community (pinned post)
3. Offered on DWY coaching calls
4. Dedicated VIP Day sales page

---

## STRIPE SETUP CHECKLIST

- [ ] Create all 4 products in Stripe
- [ ] Generate checkout links for each
- [ ] Set up webhook for order fulfillment
- [ ] Connect to Course Sprout API for auto-enrollment
- [ ] Create thank-you page with next steps
- [ ] Set up email sequences (Stripe → Zapier/Make → Global Control)
- [ ] Test checkout flow end-to-end

---

## AUTOMATION TRIGGERS

**After Core Purchase:**
1. Enroll in Course Sprout (Course Playbook)
2. Send welcome email with login
3. Add to GC tag: "Playbook Owner"
4. Start email sequence (Days 1, 3, 7, 14, 21, 30)

**After Swipe File Purchase:**
1. Send download link (PDF + templates folder)
2. Add to GC tag: "Swipe File Owner"

**After DWY Purchase:**
1. Enroll in advanced course modules
2. Send booking link for first 1-on-1 call
3. Add to private Slack channel
4. Add to GC tag: "DWY Member"

**After VIP Day Purchase:**
1. Send intake questionnaire
2. Schedule VIP Day date
3. Add to GC tag: "VIP Client"
4. Assign to fulfillment team

---

**Status:** Ready to create in Stripe once domain is confirmed

