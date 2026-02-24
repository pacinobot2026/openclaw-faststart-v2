import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function ProblemVersion() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/create-checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert('Error processing checkout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Stop Planning. Start Shipping. - The FastStart Blueprint</title>
        <meta name="description" content="The real cost of perfectionism. And the system that breaks the cycle." />
      </Head>

      {/* Countdown Banner */}
      <div className="bg-black text-white py-3 text-center sticky top-0 z-50 border-b-2 border-yellow-400">
        <p className="text-sm md:text-base font-semibold">
          ⚡ Founder Pricing: <span className="text-yellow-400 font-mono">{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span> until price increases to $47
        </p>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-8">
            ⚠️ THE PLANNING TRAP
          </div>

          {/* Part 1: Pattern Interrupt */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            You're Not Failing<br />
            <span className="text-red-600">Because You're Bad.</span>
          </h1>

          {/* Part 2: Mechanism */}
          <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-700 mb-6 leading-tight max-w-4xl mx-auto">
            You're failing because you're planning instead of shipping.
          </p>

          {/* Part 3: Outcome */}
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 mb-10 max-w-3xl mx-auto">
            And every day you wait, someone faster takes your opportunity.
          </p>

          {/* Pain Box */}
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-8 mb-10 max-w-3xl mx-auto">
            <p className="text-lg font-bold text-gray-900 mb-3">
              📅 3 months ago: "I should launch something."
            </p>
            <p className="text-lg font-bold text-gray-900 mb-3">
              📚 2 months ago: "Let me research first."
            </p>
            <p className="text-lg font-bold text-gray-900">
              🔄 Today: Still researching. Still planning. Still $0.
            </p>
          </div>

          {/* CTA */}
          <button 
            onClick={handleCheckout}
            className="bg-black text-white text-2xl md:text-3xl font-bold px-12 py-6 rounded-lg hover:bg-gray-900 transition shadow-2xl mb-4"
          >
            Break The Cycle → $17
          </button>
          <p className="text-sm text-gray-600">
            ✓ Instant access &nbsp;•&nbsp; ✓ 30-day guarantee &nbsp;•&nbsp; ✓ No subscription
          </p>
        </div>

        {/* The Pain - Agitate */}
        <div className="mb-16 bg-gray-50 rounded-2xl p-10">
          <h2 className="text-4xl font-bold mb-8 text-center">Sound Familiar?</h2>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white border-l-4 border-red-500 rounded-r-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">The Endless Research Phase</h3>
              <p className="text-gray-700">
                You've watched 47 YouTube videos. Read 23 blog posts. Joined 8 courses. Downloaded 14 templates. Still haven't shipped anything. Knowledge isn't the problem. Action is.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 rounded-r-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">The Perfect Timing Myth</h3>
              <p className="text-gray-700">
                "Once I finish this course..." "After I learn X skill..." "When I have more time..." Perfect timing doesn't exist. You're waiting for a bus that never comes.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 rounded-r-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">The Comparison Paralysis</h3>
              <p className="text-gray-700">
                Everyone else looks successful. Their launches look polished. You assume they know something you don't. Reality: They shipped messy. Optimized later. You're seeing v7, not v1.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 rounded-r-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">The Idea Graveyard</h3>
              <p className="text-gray-700">
                Your Notes app has 47 "brilliant ideas." Notion has 23 project outlines. None are live. All are "almost ready." They'll die there unless something changes.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 rounded-r-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">The Revenue You're Not Making</h3>
              <p className="text-gray-700">
                If you'd launched 3 months ago—even messy—you'd have data. Customers. Revenue. Instead: $0, zero feedback, no progress. Planning costs opportunity.
              </p>
            </div>
          </div>
        </div>

        {/* The Cost */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-red-600">The Real Cost Of Waiting</h2>
          <p className="text-xl text-gray-600 mb-10 text-center max-w-3xl mx-auto">
            Every day you don't ship, you're not just standing still. You're falling behind.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
              <h3 className="text-3xl font-black mb-4 text-red-600">$0</h3>
              <h4 className="text-xl font-bold mb-3">Zero Revenue</h4>
              <p className="text-gray-700">
                Your competitor shipped a $27 product last month. Made $1,200. You're still planning. Still $0.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
              <h3 className="text-3xl font-black mb-4 text-red-600">0x</h3>
              <h4 className="text-xl font-bold mb-3">Zero Learning</h4>
              <p className="text-gray-700">
                Market feedback beats assumptions. They've learned what converts. You're guessing in a vacuum.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
              <h3 className="text-3xl font-black mb-4 text-red-600">90d</h3>
              <h4 className="text-xl font-bold mb-3">90 Days Lost</h4>
              <p className="text-gray-700">
                Time doesn't pause. Opportunities close. Markets shift. Competitors move. You're still "getting ready."
              </p>
            </div>
          </div>
        </div>

        {/* CTA Mid-Page */}
        <div className="text-center mb-16 bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-10">
          <p className="text-3xl font-bold mb-6">Ready To Ship Instead Of Plan?</p>
          <button 
            onClick={handleCheckout}
            className="bg-black text-white text-2xl font-bold px-12 py-6 rounded-lg hover:bg-gray-900 transition shadow-xl mb-4"
          >
            Get The FastStart Blueprint → $17
          </button>
          <p className="text-sm text-gray-600">30-day guarantee • Instant access • No subscription</p>
        </div>

        {/* The Solution */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">There's A Way Out</h2>
          <p className="text-xl text-gray-600 mb-10 text-center max-w-3xl mx-auto">
            Fast movers aren't smarter. They just have a system. And now, so can you.
          </p>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-10">
            <h3 className="text-3xl font-bold mb-6 text-center">The FastStart System</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold mb-3">Instead of endless research...</h4>
                <p className="text-gray-700">
                  5-minute market scan. Extract patterns. Move on. Research in action, not theory.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold mb-3">Instead of perfect timing...</h4>
                <p className="text-gray-700">
                  37-minute launch window. Brutal time limits. Constraints force creativity.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold mb-3">Instead of comparison paralysis...</h4>
                <p className="text-gray-700">
                  Ship v1 messy. Optimize based on real data, not imaginary standards.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold mb-3">Instead of idea graveyards...</h4>
                <p className="text-gray-700">
                  Launch multiple ideas fast. Kill losers. Scale winners. Portfolio approach.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold mb-3">Instead of zero revenue...</h4>
                <p className="text-gray-700">
                  Revenue-ready in 37 minutes. Payment processor live. First sale possible today.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold mb-3">Instead of zero learning...</h4>
                <p className="text-gray-700">
                  Real feedback from real customers. Market tells you what works. Fast iteration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Objection Domination */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">But You're Probably Thinking...</h2>
          
          <div className="space-y-6">
            {[
              { q: "I've tried fast launches before", a: "You launched randomly. Not systematically. FastStart is a framework—decision trees, time limits, proven structures. Repeatable." },
              { q: "My situation is different", a: "Everyone's situation is different. The framework adapts. Different niche? Same system. Different product type? Same system. It's universal." },
              { q: "I don't have time to launch", a: "You don't have time NOT to. Planning for weeks wastes more time than shipping in 37 minutes. Speed saves time." },
              { q: "I'll look unprofessional", a: "No one cares about polish if the value is real. Done beats perfect. Shipped beats polished. Always." },
              { q: "What if no one buys?", a: "Then you know fast and pivot. Better than planning for months and then finding out. Speed reduces risk." },
              { q: "I need more skills first", a: "Skills develop through action. Launch 10 times, learn 10x more than researching for months." },
              { q: "My niche is too competitive", a: "Competitive niches validate demand. Fast movers capture market share before slow movers finish planning. Speed wins." },
              { q: "I don't know what to launch", a: "The system includes product models. Templates. Frameworks. You're not creating from scratch. You're executing proven patterns." },
              { q: "This sounds too simple", a: "Simple systems scale. Complex systems fail. Fast beats perfect. Simple beats complex. Every time." },
              { q: "I'm not ready", a: "You'll never feel ready. Ready is a myth. Prepared is launching and learning. Action creates readiness." },
              { q: "What if I waste the $17?", a: "You've wasted more than $17 planning. This breaks the cycle. 30-day guarantee removes the risk." },
              { q: "I need to think about it", a: "That's the problem. You've been thinking for months. Try executing for 37 minutes." }
            ].map((obj, i) => (
              <div key={i} className="bg-gray-50 border-l-4 border-gray-900 rounded-r-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">"{obj.q}"</h3>
                <p className="text-gray-700">{obj.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Visualization */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16 -mx-6 px-6 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center">Imagine This Instead</h2>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border-2 border-white/20">
                <p className="text-sm font-bold text-emerald-200 mb-2">Tonight, 11:47 PM</p>
                <p className="text-lg leading-relaxed">
                  You just hit publish. 37 minutes ago you started. Now it's live. Payment link works. Product delivers. You're nervous but exhilarated. For the first time in months, you shipped.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border-2 border-white/20">
                <p className="text-sm font-bold text-emerald-200 mb-2">Next Week</p>
                <p className="text-lg leading-relaxed">
                  Three sales. $81. Not life-changing money. But proof it works. Real customers. Real feedback. You're iterating based on data, not assumptions. Version 2 launching Friday.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border-2 border-white/20">
                <p className="text-sm font-bold text-emerald-200 mb-2">Next Month</p>
                <p className="text-lg leading-relaxed">
                  Six products live. Two profitable. One break-even. Three killed. Portfolio generating $600/month. Not your job yet—but compound growth happening. The graveyard is empty. Your Stripe balance isn't.
                </p>
              </div>
            </div>

            <p className="text-center text-3xl font-bold mt-12">
              This future costs $17 and 37 minutes. That's it.
            </p>
          </div>
        </div>

        {/* What's Inside */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">Inside: The FastStart Blueprint</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">The 37-Minute Framework</h3>
              <p className="text-gray-700 mb-3">Stop planning. Start shipping. 6 phases, 37 minutes, revenue-ready.</p>
              <p className="text-sm text-gray-600">✓ Time-boxed phases ✓ Decision frameworks ✓ No guessing</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-3">Pre-Built Templates</h3>
              <p className="text-gray-700 mb-3">Sales pages, landing pages, tweets. Proven copy. Just customize.</p>
              <p className="text-sm text-gray-600">✓ Conversion-tested ✓ Fill-in-blank ✓ Multiple formats</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-2xl font-bold mb-3">No-Code Stack Guide</h3>
              <p className="text-gray-700 mb-3">Carrd, Stripe, Notion. Simple tools. Fast setup. No code required.</p>
              <p className="text-sm text-gray-600">✓ Tool walkthroughs ✓ Integration guides ✓ Screenshots</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-3">Product Models</h3>
              <p className="text-gray-700 mb-3">What to sell. How to price. Positioning frameworks. 3 proven formats.</p>
              <p className="text-sm text-gray-600">✓ Guides ✓ Templates ✓ Services ✓ Examples</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Launch Protocol</h3>
              <p className="text-gray-700 mb-3">Pre-launch checklist. Post-launch actions. What to track. When to pivot.</p>
              <p className="text-sm text-gray-600">✓ Testing steps ✓ Traffic sources ✓ Iteration guide</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Real Case Study</h3>
              <p className="text-gray-700 mb-3">This page. Built in 37 minutes. Full breakdown. Timestamps. Lessons.</p>
              <p className="text-sm text-gray-600">✓ Timeline ✓ Metrics ✓ What worked</p>
            </div>
          </div>
        </div>

        {/* Differentiation */}
        <div className="bg-gray-900 text-white py-16 -mx-6 px-6 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">This Isn't Another Course</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Not 40 videos to watch</h3>
                  <p className="text-gray-300">No modules. No homework. This is an execution system, not a curriculum.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Not vague advice</h3>
                  <p className="text-gray-300">Specific steps. Exact timelines. Concrete tools. No "figure it out" gaps.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Not unproven theory</h3>
                  <p className="text-gray-300">This page proves the system. Built in 37 minutes. Documented. Repeatable.</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-700 pt-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">✓ What This Actually Is:</h3>
              <ul className="space-y-3 text-gray-300 text-lg">
                <li>• <strong>Execution framework:</strong> System, not theory</li>
                <li>• <strong>Proven velocity:</strong> This page is the proof</li>
                <li>• <strong>Immediate action:</strong> Use today, ship today</li>
                <li>• <strong>Break the cycle:</strong> Planning trap ends here</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Identity Shift */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">You're One Decision Away</h2>
          <p className="text-xl text-gray-600 mb-10 text-center max-w-3xl mx-auto">
            From planning to shipping. From stuck to moving. From $0 to revenue.
          </p>

          <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-10">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">The Choice</h3>
              <p className="text-xl text-gray-300">
                Keep planning. Or start shipping.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-900/30 border-2 border-red-500/50 rounded-lg p-6">
                <h4 className="text-2xl font-bold mb-4 text-red-400">Path A: Keep Planning</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Another month of research</li>
                  <li>• Another idea in the graveyard</li>
                  <li>• Another $0 month</li>
                  <li>• Another competitor launches</li>
                  <li>• Still waiting for "ready"</li>
                </ul>
              </div>

              <div className="bg-green-900/30 border-2 border-green-500/50 rounded-lg p-6">
                <h4 className="text-2xl font-bold mb-4 text-green-400">Path B: Start Shipping</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• 37 minutes to launch</li>
                  <li>• Real feedback today</li>
                  <li>• Revenue possible this week</li>
                  <li>• Portfolio growing monthly</li>
                  <li>• Momentum building</li>
                </ul>
              </div>
            </div>

            <p className="text-center text-2xl font-bold mt-8">
              One costs $17. One costs everything.
            </p>
          </div>
        </div>

        {/* Final CTA Stack */}
        <div className="bg-black text-white py-16 -mx-6 px-6 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Break The Planning Trap</h2>
            <p className="text-2xl text-gray-300 mb-10">
              37 minutes. One system. No more waiting.
            </p>

            <div className="bg-white text-black rounded-2xl p-10 mb-10 inline-block">
              <div className="text-7xl font-black mb-3">$17</div>
              <p className="text-gray-600 mb-8">One-time. Instant access. Forever yours.</p>
              
              <button 
                onClick={handleCheckout}
                className="bg-black text-white text-3xl font-bold px-12 py-6 rounded-lg hover:bg-gray-800 transition shadow-2xl w-full mb-6"
              >
                Start Shipping Today →
              </button>

              <div className="space-y-3 text-left">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-bold">✓ Instant access:</span> Start in 2 minutes
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-bold">✓ Complete system:</span> Everything you need to ship
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-bold">✓ End the cycle:</span> Planning trap ends here
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-bold">✓ 30-day guarantee:</span> Ship or refund, no questions
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 text-gray-900 rounded-xl p-8 inline-block">
              <h3 className="text-xl font-bold mb-4">The Shipper's Guarantee</h3>
              <p className="text-gray-700">
                Use FastStart for 7 days. Launch something. If you don't break your planning cycle, full refund. I want you shipping, not stuck.
              </p>
            </div>
          </div>
        </div>

        {/* Final Urgency */}
        <div className="text-center bg-gray-50 rounded-2xl p-10">
          <p className="text-2xl font-bold mb-4">How Many More Months Will You Plan?</p>
          <p className="text-xl text-gray-600 mb-6">
            Or will today be the day you finally ship?
          </p>
          <button 
            onClick={handleCheckout}
            className="bg-black text-white text-xl font-bold px-10 py-5 rounded-lg hover:bg-gray-900 transition shadow-xl"
          >
            Break The Cycle → Ship Today
          </button>
        </div>

      </div>
    </div>
  );
}
