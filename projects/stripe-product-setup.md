# Stripe Product Setup - Local Newsletter Playbook

## ✅ WHAT YOU NEED TO DO:

### 1. Go to Stripe Dashboard
https://dashboard.stripe.com/products

### 2. Create Product
Click **"Add product"**

**Product Details:**
- **Name:** Local Newsletter Playbook
- **Description:** Complete system to launch and monetize a profitable local newsletter in 30 days or less. Includes 6 training modules + 6 done-for-you bonuses.
- **Image:** (optional - add product image if you have one)

**Pricing:**
- **Pricing model:** One-time
- **Price:** $197.00 USD
- **Billing period:** One-time purchase

Click **"Save product"**

### 3. Create Payment Link
After saving, click **"Create payment link"** button

**Payment link settings:**
- **Quantity:** Fixed quantity (1)
- **After payment:** Redirect to a page
  - **Success URL:** `https://local-newsletter-playbook.vercel.app/thank-you`
  - (We'll create this thank-you page next)

Click **"Create link"**

### 4. Copy Payment Link
You'll get a URL like:
`https://buy.stripe.com/XXXXXXXXXXXXX`

**Copy this link!**

### 5. Update Sales Page
Open: `local-newsletter-playbook/app/page.tsx`

Find line 165 (the big yellow button):
```tsx
href="https://buy.stripe.com/YOUR_PAYMENT_LINK"
```

Replace `YOUR_PAYMENT_LINK` with your actual Stripe link.

Save, commit, push:
```bash
cd local-newsletter-playbook
git add app/page.tsx
git commit -m "Add Stripe checkout link"
git push origin main
```

Vercel will auto-deploy in ~60 seconds.

---

## 🎁 OPTIONAL: Order Bump (Quick Start Templates - $67)

If you want to add the upsell on checkout:

1. In Stripe, edit your payment link
2. Click "Add products"
3. Create another product: "Quick Start Templates Bundle" - $67
4. Add as optional add-on
5. Save

---

## ✅ DONE!

Once you paste the Stripe link into the sales page, you're LIVE and ready to sell! 🚀

**Files Ready:**
- Sales page: ✅ LIVE at https://local-newsletter-playbook.vercel.app
- VSL video: ✅ projects/local-newsletter-playbook-vsl.mp4 (upload to Vimeo)
- VSL audio: ✅ projects/local-newsletter-playbook-vsl.mp3
- GitHub: ✅ https://github.com/pacinobot2026/local-newsletter-playbook

**Next: Create thank-you page + email sequence (optional)**
