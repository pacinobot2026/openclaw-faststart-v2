# 🚀 FINISH IN 2 MINUTES - FINAL STEPS

## ✅ WHAT'S READY:
- Sales page: LIVE at https://local-newsletter-playbook.vercel.app
- VSL video: Created (4.46 MB file ready)
- Thank-you page: Live
- Auto-deploy: Configured

## 🔥 DO THIS NOW (2 MINUTES):

### STEP 1: Upload VSL (1 minute)
1. Go to: https://vimeo.com/upload
2. Drag this file: `C:\Users\Administrator\.openclaw\workspace\projects\local-newsletter-playbook-vsl.mp4`
3. While uploading, set:
   - Privacy: "Anyone can watch"
   - Title: "Local Newsletter Playbook"
4. Copy the video ID from the URL (vimeo.com/XXXXXXX)

**Paste video ID here:** _________________

### STEP 2: Create Stripe Product (1 minute)
1. Go to: https://dashboard.stripe.com/test/products/create
2. Fill in:
   - **Name:** Local Newsletter Playbook
   - **Price:** $197 USD
   - **Type:** One-time
3. Click "Save product"
4. Click "Create payment link"
5. **Success URL:** `https://local-newsletter-playbook.vercel.app/thank-you`
6. Click "Create link"
7. Copy the payment link (https://buy.stripe.com/XXXXXX)

**Paste payment link here:** _________________

### STEP 3: Update Sales Page (30 seconds)
```bash
cd C:\Users\Administrator\.openclaw\workspace\local-newsletter-playbook
```

Open `app/page.tsx` and:

**Line 25** - Replace `YOUR_VIDEO_ID` with your Vimeo ID
**Line 165** - Replace `YOUR_PAYMENT_LINK` with your Stripe link

```bash
git add app/page.tsx
git commit -m "Add VSL and Stripe checkout"
git push origin main
```

✅ **DONE!** Vercel deploys in 60 seconds. YOU'RE LIVE! 🚀

---

## 📝 NOTES:
- VSL file location: `projects/local-newsletter-playbook-vsl.mp4`
- Vimeo upload failed via API (403 permission error)
- Stripe API key is restricted (no Products permission)
- Both need manual upload but only take 2 minutes total

## 🎯 AFTER LAUNCH:
- Switch Stripe to LIVE mode (currently test)
- Send to your email list
- Post in Entourage
- Start making sales! 💰
