# Deployment Checklist - Local Newsletter Playbook

## Checklist

### ✅ COMPLETED
- [x] VSL Script written (5-minute conversion video)
- [x] Sales page coded (Next.js + Tailwind)
- [x] Project created in workspace

### 🔄 IN PROGRESS
- [ ] npm install (running now)

### ⏳ NEXT STEPS

1. **Push to GitHub**
   ```bash
   cd local-newsletter-playbook
   git init
   git add -A
   git commit -m "Initial commit - Local Newsletter Playbook sales page"
   git branch -M main
   git remote add origin https://github.com/pacinobot2026/local-newsletter-playbook.git
   git push -u origin main
   ```

2. **Create Vimeo Video (VSL)**
   - Record VSL using script (or generate with AI avatar)
   - Upload to Vimeo
   - Copy embed URL
   - Update page.tsx line 25 with Vimeo ID

3. **Create Stripe Product**
   - Follow: projects/stripe-setup-instructions.md
   - Copy payment link
   - Update page.tsx line 165

4. **Deploy to Vercel**
   - Connect GitHub repo
   - Deploy
   - Get live URL

5. **Test Everything**
   - Check VSL plays
   - Test Stripe checkout (test mode)
   - Verify mobile responsive

6. **Go Live**
   - Switch Stripe to live mode
   - Announce to email list
   - Launch! 🚀

## Live URLs (will be)
- **Sales Page:** https://local-newsletter-playbook.vercel.app
- **Custom Domain (optional):** localnewsletterplaybook.com

## Current Status
Creating sales page + preparing for GitHub push + Vercel deploy
