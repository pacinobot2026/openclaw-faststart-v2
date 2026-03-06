// Local Newsletter Playbook - Sales Page
// File: app/page.tsx

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Build a <span className="text-yellow-400">$10K/Month</span> Media Business
          <br />
          Right In Your Own Hometown
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          While influencers fight for scraps, local newsletter owners are quietly banking consistent monthly revenue from local sponsors. No massive following required.
        </p>
        
        {/* VSL Embed */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-2xl">
            <iframe
              src="https://player.vimeo.com/video/YOUR_VIDEO_ID"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="#order"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xl px-12 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl"
        >
          Get Instant Access Now - $197
        </a>
        <p className="text-slate-400 mt-4">One-time payment. Lifetime access. 30-day guarantee.</p>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Real Results From Real People
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-700 p-6 rounded-lg">
                <p className="text-slate-300 mb-4 italic">
                  "Launched my neighborhood newsletter in 3 weeks. Got my first sponsor at $500/month within 60 days!"
                </p>
                <p className="text-yellow-400 font-semibold">- Newsletter Owner</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Everything You Need To Launch & Monetize
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            { title: "Module 1: The Local Media Goldmine", desc: "Why local newsletters print money + picking your profitable niche" },
            { title: "Module 2: Setup & Launch (Week 1)", desc: "Complete Letterman walkthrough, get your first 10 articles live" },
            { title: "Module 3: Content That Converts", desc: "AI-powered creation, batch 30 days of content in 4 hours" },
            { title: "Module 4: Monetization Blueprint", desc: "Pricing, pitching & closing local sponsors for recurring revenue" },
            { title: "Module 5: Traffic & Growth", desc: "Local SEO, Facebook hacks, community partnerships" },
            { title: "Module 6: Scale & Systemize", desc: "Hire writers, launch multiple newsletters, build a media empire" }
          ].map((module, i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-lg border-l-4 border-yellow-400">
              <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
              <p className="text-slate-300">{module.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bonuses */}
      <section className="bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            PLUS 6 Done-For-You Bonuses
          </h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              "Newsletter Launch Checklist",
              "20 Article Templates",
              "50+ AI Prompt Library",
              "Local SEO Keyword Lists",
              "Legal Templates Pack",
              "Case Study Vault (Private)"
            ].map((bonus, i) => (
              <div key={i} className="bg-slate-700 p-4 rounded-lg flex items-center">
                <span className="text-yellow-400 text-2xl mr-3">✓</span>
                <span className="text-white font-semibold">{bonus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Order */}
      <section id="order" className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto bg-slate-800 rounded-xl p-8 border-4 border-yellow-400">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Get Instant Access Today
          </h2>
          <p className="text-center text-slate-300 mb-6">
            Complete Local Newsletter Playbook + 6 Bonuses
          </p>
          
          <div className="text-center mb-8">
            <p className="text-slate-400 line-through text-xl">Regular Price: $297</p>
            <p className="text-6xl font-bold text-yellow-400 mb-2">$197</p>
            <p className="text-slate-300">One-time payment. Lifetime access.</p>
          </div>

          <a
            href="https://buy.stripe.com/YOUR_PAYMENT_LINK"
            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-2xl py-4 rounded-full text-center transition-all transform hover:scale-105 shadow-xl mb-6"
          >
            YES! Give Me Instant Access
          </a>

          <div className="text-center">
            <p className="text-slate-400 mb-4">🔒 Secure Checkout • 30-Day Money-Back Guarantee</p>
            <div className="flex justify-center items-center gap-4 text-slate-500">
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
              <span>💳 Amex</span>
              <span>💳 PayPal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-6xl mb-4">🛡️</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            30-Day Money-Back Guarantee
          </h2>
          <p className="text-slate-300 text-lg">
            Follow the system and launch your newsletter within 30 days, or get a full refund. No questions asked. You risk nothing.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready To Build Your Local Media Business?
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          While others fight for attention on crowded platforms, you can build real, profitable media right in your backyard.
        </p>
        <a
          href="#order"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xl px-12 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl"
        >
          Get Started Now - $197
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 text-center text-slate-500">
        <p>&copy; 2026 Local Newsletter Playbook. All rights reserved.</p>
        <p className="mt-2">
          <a href="/terms" className="hover:text-slate-300">Terms</a>
          {' • '}
          <a href="/privacy" className="hover:text-slate-300">Privacy</a>
        </p>
      </footer>
    </main>
  );
}
