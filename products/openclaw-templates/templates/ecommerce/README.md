# E-Commerce Operator Template

**Pre-built OpenClaw agent configuration for e-commerce businesses**

From zero to working customer service agent in 15 minutes.

---

## What This Does

Your OpenClaw agent will:
- ✅ Answer customer inquiries instantly (24/7)
- ✅ Check order status and provide tracking
- ✅ Process refunds and returns (within your policy)
- ✅ Answer product questions
- ✅ Monitor inventory and alert on low stock
- ✅ Send automated follow-up emails
- ✅ Request reviews at the right time

---

## Quick Setup (15 Minutes)

### Step 1: Copy Files (2 minutes)
Copy all files from this folder into your OpenClaw workspace:
```
cp -r * ~/.openclaw/workspace/
```

Or manually drag:
- SOUL.md
- AGENTS.md
- TOOLS.md
- USER.md (create this)
- memory/ folder
- skills/ folder

### Step 2: Customize TOOLS.md (5 minutes)
Open `TOOLS.md` and fill in:
- Your store URL
- E-commerce platform (Shopify/WooCommerce/etc.)
- API credentials
- Refund policy
- Shipping carriers
- Product categories

**Important:** Don't skip the refund policy section - your agent needs to know the rules!

### Step 3: Create USER.md (2 minutes)
Create a USER.md file with your info:
```markdown
# USER.md

- **Name:** [Your Name]
- **Store:** [Store Name]
- **Store URL:** https://yourstore.com
- **Timezone:** [Your timezone]

## Store Details
- **Platform:** Shopify
- **Niche:** [What you sell]
- **Peak hours:** [When you get most orders]
- **Busy seasons:** [Holiday schedules]
```

### Step 4: Set Up Integrations (5 minutes)
Connect your agent to:
- **E-commerce platform API** (Shopify, WooCommerce, etc.)
- **Email** (for customer communication)
- **Shipping carriers** (for tracking lookups)

See `skills/shopify/SKILL.md` for Shopify integration guide  
See `skills/woocommerce/SKILL.md` for WooCommerce guide

### Step 5: Test It (1 minute)
Send yourself a test message asking:
- "Where's my order #12345?"
- "What's your return policy?"
- "Tell me about [product name]"

Verify the agent responds correctly!

---

## What's Included

### Core Files
- **SOUL.md** - Agent personality and vibe
- **AGENTS.md** - Operating protocols and workflows
- **TOOLS.md** - Platform integrations and tools

### Skills
- **order-lookup** - Check order status and tracking
- **refund-processor** - Handle returns within policy
- **inventory-monitor** - Alert on low stock
- **review-requester** - Automated review requests
- **email-sequences** - Abandoned cart, post-purchase

### Email Templates
- Order confirmation
- Shipping notification
- Refund processed
- Review request
- Abandoned cart recovery

---

## Customization Tips

### Make It Sound Like You
Edit `SOUL.md` to match your brand voice:
- Casual/fun store? Make it playful
- Luxury brand? Keep it professional
- Tech products? Be precise and helpful

### Add Your Products
Update `TOOLS.md` with:
- Product categories
- Common questions per category
- Sizing charts
- Compatibility info

### Set Your Policies
Be crystal clear on:
- Refund windows (30 days? 60 days?)
- Return conditions (unused? original packaging?)
- Shipping times (processing + transit)
- International orders (if applicable)

---

## Troubleshooting

**Agent isn't responding?**
- Check that all files are in the workspace
- Verify API credentials in TOOLS.md
- Make sure OpenClaw is running

**Wrong information?**
- Update TOOLS.md with correct details
- Clear agent memory: `rm memory/*.md`
- Restart OpenClaw

**Refunds not processing?**
- Check API permissions
- Verify refund limits in TOOLS.md
- Test with small amount first

---

## Support

**Video tutorial:** [Link to 15-min walkthrough]  
**Need help?** support@openclaw.com  
**Updates:** This template gets updated monthly - you get free access!

---

## Next Steps

1. ✅ Get the agent running
2. ✅ Test with real customer questions
3. ✅ Monitor for a few days
4. ✅ Adjust responses based on what works
5. ✅ Add more automation (see advanced guides)

---

**Your agent is ready to handle customers while you sleep. Let it work!**
