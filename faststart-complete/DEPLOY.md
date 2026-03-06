# FastStart Blueprint - Deployment Guide

**Complete setup instructions for launching FastStart Blueprint**

---

## 🚀 Quick Deploy (15 minutes)

### Prerequisites
- Node.js installed
- Vercel account (free)
- Stripe account
- Vimeo account (for VSL hosting)

---

## Step 1: Upload VSL to Vimeo (5 min)

1. Go to https://vimeo.com/upload
2. Upload: `vsl-powerpoint-build/FastStart_VSL_Chad_FINAL.mp4`
3. Set privacy to "Anyone can watch"
4. Copy the video ID from URL (e.g., `vimeo.com/123456789` → `123456789`)

---

## Step 2: Create Stripe Product (5 min)

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Fill in:
   - **Name:** The FastStart Blueprint
   - **Description:** Launch your first micro-business in 37 minutes
   - **Price:** $17.00 USD (one-time)
4. Click "Save product"
5. Go to the product page
6. Click "Create payment link"
7. After completion settings:
   - Type: "Hosted confirmation page"
   - Message: "Success! Check your email for The FastStart Blueprint."
8. Click "Create link"
9. Copy the payment link URL

---

## Step 3: Deploy Sales Page (5 min)

```bash
# Navigate to sales folder
cd faststart-sales

# Install dependencies
npm install

# Update video ID
# Edit pages/index.js line 30:
# Replace PLACEHOLDER with your Vimeo video ID

# Update Stripe link
# Edit pages/index.js line 134:
# Replace PLACEHOLDER with your Stripe payment link

# Deploy to Vercel
npx vercel --prod
```

Follow Vercel prompts:
- Project name: `faststart-blueprint`
- Framework: `Next.js`
- Deploy: Yes

Vercel will give you a live URL (e.g., `faststart-blueprint.vercel.app`)

---

## Step 4: Set Up Product Delivery (Automatic)

### Option A: Stripe Webhook (Recommended)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook secret
5. Add to Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Option B: Manual Email (Temporary)

1. Check Stripe dashboard daily
2. Email product to customers manually
3. Use template from `LAUNCH-ASSETS.md` (Email 1)

---

## Step 5: Custom Domain (Optional)

### Connect Custom Domain to Vercel

1. In Vercel project settings → Domains
2. Add your domain (e.g., `faststart.chadnicely.com`)
3. Follow DNS instructions
4. Update Stripe success URL to custom domain

---

## Step 6: Launch! 🎉

### Pre-Launch Checklist

- [ ] VSL uploaded and public on Vimeo
- [ ] Stripe product created and payment link working
- [ ] Sales page deployed and loading correctly
- [ ] Video embed showing correctly
- [ ] CTA button points to correct Stripe link
- [ ] Thank you page working
- [ ] Test purchase (use Stripe test mode first)
- [ ] Product delivery email sent automatically

### Test Flow

1. Visit sales page
2. Watch VSL (at least 30 seconds)
3. Click CTA button
4. Complete test purchase
5. Verify thank you page shows
6. Check if product delivery email sent
7. Verify product file accessible

### Go Live

1. Switch Stripe to live mode
2. Update payment link in sales page
3. Redeploy to Vercel
4. Post launch announcement (use LAUNCH-ASSETS.md)
5. Monitor Stripe dashboard for sales

---

## 📊 Post-Launch

### Daily Tasks

- Check Stripe dashboard for sales
- Respond to support emails (support@chadnicely.com)
- Monitor social media mentions
- Track conversion metrics

### Weekly Tasks

- Review analytics (views, conversions, revenue)
- Test payment flow
- Update launch assets based on performance
- Engage with customers who purchased

### Monthly Tasks

- Analyze what's working
- Update product based on feedback
- Refresh marketing copy
- Test price points

---

## 🔧 Troubleshooting

### Video Not Loading
- Check Vimeo privacy settings (must be "Anyone")
- Verify video ID is correct in code
- Clear browser cache

### Payment Link Not Working
- Verify Stripe is in live mode
- Check payment link hasn't expired
- Test in incognito window

### Product Not Delivering
- Check webhook is configured correctly
- Verify webhook secret is correct
- Check Stripe webhook logs for errors
- Fallback to manual delivery temporarily

---

## 📈 Scaling

### When you hit $1K revenue:

1. **Automate Everything**
   - Set up proper webhook delivery
   - Add email sequences (LAUNCH-ASSETS.md has templates)
   - Connect Google Analytics

2. **Add Upsells**
   - Done-for-you service ($297)
   - 1-on-1 coaching ($997)
   - Group mastermind ($97/mo)

3. **Run Paid Ads**
   - Facebook ads (creative in LAUNCH-ASSETS.md)
   - Google search ads (copy in LAUNCH-ASSETS.md)
   - Budget: $20/day to start

### When you hit $10K revenue:

1. **Build a Team**
   - Hire support person
   - Hire ad manager
   - Automate product updates

2. **Expand Product Line**
   - Advanced Blueprint ($97)
   - Done-with-you program ($497)
   - Certification program ($2K)

---

## Need Help?

Email support@chadnicely.com or reach out to Pacino directly.

**Remember:** Ship first, perfect later. Get it live TODAY.
