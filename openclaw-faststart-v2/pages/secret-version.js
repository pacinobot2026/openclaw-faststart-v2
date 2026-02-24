import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function SecretVersion() {
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
        <title>What Fast Movers Know - The FastStart Blueprint</title>
        <meta name="description" content="The operators' secret: speed beats perfection. Every time." />
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
          <div className="inline-block bg-black text-white text-sm font-bold px-4 py-2 rounded-full mb-8">
            🤫 THE OPERATOR'S SECRET
          </div>

          {/* Part 1: Pattern Interrupt */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            Fast Movers Know<br />
            <span className="text-gray-900">Something You Don't.</span>
          </h1>

          {/* Part 2: Mechanism */}
          <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-700 mb-6 leading-tight max-w-4xl mx-auto">
            Speed isn't reckless. It's a framework.
          </p>

          {/* Part 3: Outcome */}
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 mb-10 max-w-3xl mx-auto">
            And it's learnable. Repeatable. Unfairly effective.
          </p>

          {/* Curiosity Box */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-8 mb-10 max-w-3xl mx-auto">
            <p className="text-lg font-bold text-gray-900 mb-3">
              💡 While you plan, they ship.
            </p>
            <p className="text-lg font-bold text-gray-900 mb-3">
              ⚡ While you research, they learn.
            </p>
            <p className="text-lg font-bold text-gray-900">
              🚀 While you perfect, they profit.
            </p>
          </div>

          {/* CTA */}
          <button 
            onClick={handleCheckout}
            className="bg-black text-white text-2xl md:text-3xl font-bold px-12 py-6 rounded-lg hover:bg-gray-900 transition shadow-2xl mb-4"
          >
            Learn The System → $17
          </button>
          <p className="text-sm text-gray-600">
            ✓ Instant access &nbsp;•&nbsp; ✓ 30-day guarantee &nbsp;•&nbsp; ✓ No subscription
          </p>
        </div>

        {/* The Secret Revealed */}
        <div className="mb-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-10">
          <h2 className="text-4xl font-bold mb-8 text-center">The Secret They Won't Tell You</h2>
          <p className="text-xl text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Fast movers aren't smarter. They're not more talented. They just know something you don't.
          </p>

          <div className="bg-white rounded-xl p-8 mb-8 border-2 border-purple-200">
            <h3 className="text-3xl font-black mb-4 text-center">Speed Is A Skill</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Not luck. Not talent. Not connections. It's a learnable system. Decision frameworks. Time constraints. Operational shortcuts. The same moves, every launch. Predictable results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-xl font-bold mb-3">Secret #1</h4>
              <p className="text-gray-700">Perfect is the enemy of shipped. Good enough wins when it's live and theirs is still in Notion.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-xl font-bold mb-3">Secret #2</h4>
              <p className="text-gray-700">Market feedback beats assumptions. Launch fast. Learn faster. Pivot or double down based on real data.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-xl font-bold mb-3">Secret #3</h4>
              <p className="text-gray-700">Low attachment = high velocity. Test ideas, not marry them. Kill losers fast. Scale winners faster.</p>
            </div>
          </div>
        </div>

        {/* What Operators Do Differently */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">What Operators Do That You Don't</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 border-l-4 border-black rounded-r-lg p-8">
              <h3 className="text-2xl font-bold mb-3">They Ship Messy First Versions</h3>
              <p className="text-gray-700 mb-4">
                You: Wait until it's perfect.<br />
                Them: Ship v1, fix in v2, optimize in v3.
              </p>
              <p className="text-sm text-gray-600">Result: They're on v5 while you're still planning v1.</p>
            </div>

            <div className="bg-gray-50 border-l-4 border-black rounded-r-lg p-8">
              <h3 className="text-2xl font-bold mb-3">They Set Brutal Time Limits</h3>
              <p className="text-gray-700 mb-4">
                You: "This will take a week."<br />
                Them: "I have 45 minutes. What can I ship?"
              </p>
              <p className="text-sm text-gray-600">Result: Constraints force creativity. Unlimited time breeds perfectionism.</p>
            </div>

            <div className="bg-gray-50 border-l-4 border-black rounded-r-lg p-8">
              <h3 className="text-2xl font-bold mb-3">They Test In Public</h3>
              <p className="text-gray-700 mb-4">
                You: Build in private until it's "ready."<br />
                Them: Share work-in-progress. Get feedback. Iterate live.
              </p>
              <p className="text-sm text-gray-600">Result: They learn 10x faster from real users, not imaginary ones.</p>
            </div>

            <div className="bg-gray-50 border-l-4 border-black rounded-r-lg p-8">
              <h3 className="text-2xl font-bold mb-3">They Launch Multiple Ideas</h3>
              <p className="text-gray-700 mb-4">
                You: Pick one perfect idea. Go all-in.<br />
                Them: Launch 5 ideas. See what sticks. Double down.
              </p>
              <p className="text-sm text-gray-600">Result: Portfolio approach beats single bet. Every time.</p>
            </div>

            <div className="bg-gray-50 border-l-4 border-black rounded-r-lg p-8">
              <h3 className="text-2xl font-bold mb-3">They Use Boring Tools</h3>
              <p className="text-gray-700 mb-4">
                You: Research the perfect tech stack.<br />
                Them: Carrd, Stripe, Notion. Done in 30 minutes.
              </p>
              <p className="text-sm text-gray-600">Result: No-code beats perfect-code when shipped beats theoretical.</p>
            </div>

            <div className="bg-gray-50 border-l-4 border-black rounded-r-lg p-8">
              <h3 className="text-2xl font-bold mb-3">They Don't Wait For Inspiration</h3>
              <p className="text-gray-700 mb-4">
                You: "I'll start when I feel ready."<br />
                Them: "Tuesday at 9 AM. 45-minute window. Ship or die."
              </p>
              <p className="text-sm text-gray-600">Result: Systems beat motivation. Consistency compounds.</p>
            </div>
          </div>
        </div>

        {/* CTA Mid-Page */}
        <div className="text-center mb-16 bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-10">
          <p className="text-3xl font-bold mb-6">Ready To Move Like An Operator?</p>
          <button 
            onClick={handleCheckout}
            className="bg-black text-white text-2xl font-bold px-12 py-6 rounded-lg hover:bg-gray-900 transition shadow-xl mb-4"
          >
            Get The FastStart Blueprint → $17
          </button>
          <p className="text-sm text-gray-600">30-day guarantee • Instant access • No subscription</p>
        </div>

        {/* Objection Domination */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">But What If...</h2>
          
          <div className="space-y-6">
            {[
              { q: "What if my first launch fails?", a: "It probably will. Fast movers expect that. They launch 5 things, 3 flop, 2 work. Portfolio approach beats perfect launch every time." },
              { q: "I don't want to look amateur", a: "Operators don't care about looking pro—they care about profit. Ship messy, optimize later. Ego is expensive." },
              { q: "My audience will judge me", a: "Your imaginary audience won't buy anyway. Real customers buy from real people shipping real value. Imperfection is human." },
              { q: "I need more skills first", a: "Skills develop through shipping. Launch 10 times and you'll have more expertise than researching for a year." },
              { q: "This approach seems risky", a: "Risk is launching one perfect thing after months of work. Diversification is launching 10 small things fast." },
              { q: "What if it's not original?", a: "Originality doesn't pay. Execution does. Copy what works. Ship faster. Iterate better." },
              { q: "I can't compete with pros", a: "Pros are slow. Agencies take weeks. You can launch in 37 minutes. Speed is your unfair advantage." },
              { q: "I don't have a big idea", a: "Small ideas launched beat big ideas planned. Micro-products compound. Start tiny. Scale what works." },
              { q: "My niche is saturated", a: "Every niche is saturated if you move slow. Fast movers spot gaps, ship solutions, capture market share before competition wakes up." },
              { q: "I need validation first", a: "Launching IS validation. Market tells you if it's good. Surveys lie. Sales don't." },
              { q: "This sounds exhausting", a: "Planning for months is exhausting. Shipping in 37 minutes? Exhilarating. Try it once." },
              { q: "What if I waste time?", a: "37 minutes isn't a waste. 37 days planning something that won't sell? That's the waste." }
            ].map((obj, i) => (
              <div key={i} className="bg-gray-50 border-l-4 border-gray-900 rounded-r-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">"{obj.q}"</h3>
                <p className="text-gray-700">{obj.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Visualization */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 -mx-6 px-6 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center">Life As A Fast Mover</h2>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border-2 border-white/20">
                <p className="text-sm font-bold text-purple-200 mb-2">Next Week</p>
                <p className="text-lg leading-relaxed">
                  You launch three ideas. One flops. One breaks even. One hits $200 in sales. You killed the flop by Wednesday. Doubled down on the winner by Friday. Slow movers are still in "research phase."
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border-2 border-white/20">
                <p className="text-sm font-bold text-purple-200 mb-2">Next Month</p>
                <p className="text-lg leading-relaxed">
                  12 launches. 8 dead. 4 alive. Portfolio generating $800/month. You're not stressed—it's a numbers game now. Launch, kill losers, scale winners. Systematic. Unemotional. Profitable.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border-2 border-white/20">
                <p className="text-sm font-bold text-purple-200 mb-2">Next Quarter</p>
                <p className="text-lg leading-relaxed">
                  You're known as "the person who ships." Opportunities find you. Collaborations happen. People ask how you move so fast. You smile. You know the secret: systems beat talent.
                </p>
              </div>
            </div>

            <p className="text-center text-3xl font-bold mt-12">
              This is the operator's life. It's available to you.
            </p>
          </div>
        </div>

        {/* What's Inside */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">Inside: The Operator's Playbook</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">The Speed Framework</h3>
              <p className="text-gray-700 mb-3">Decision trees. Time boxes. Priority rules. How operators move fast without chaos.</p>
              <p className="text-sm text-gray-600">✓ 37-min blueprint ✓ Phase breakdowns ✓ No guessing</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Launch Templates</h3>
              <p className="text-gray-700 mb-3">Pre-built pages. Proven copy. Tested structures. Skip the blank page problem.</p>
              <p className="text-sm text-gray-600">✓ Sales pages ✓ Landing pages ✓ Launch tweets</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-2xl font-bold mb-3">No-Code Stack</h3>
              <p className="text-gray-700 mb-3">The boring tools that work. Carrd, Stripe, Notion. Set up in under 30 minutes.</p>
              <p className="text-sm text-gray-600">✓ Tool guides ✓ Integration steps ✓ Zero code</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-3">Product Models</h3>
              <p className="text-gray-700 mb-3">Guides, templates, services. What to sell. How to price. Where to start.</p>
              <p className="text-sm text-gray-600">✓ 3 proven formats ✓ Pricing guide ✓ Examples</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">The Testing Protocol</h3>
              <p className="text-gray-700 mb-3">What to track. When to kill. When to scale. Data-driven decisions.</p>
              <p className="text-sm text-gray-600">✓ Metrics that matter ✓ Kill criteria ✓ Scale signals</p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-3">Case Study: This Page</h3>
              <p className="text-gray-700 mb-3">Full breakdown. Real timeline. Actual process. What worked, what didn't.</p>
              <p className="text-sm text-gray-600">✓ 37-min build ✓ Timestamps ✓ Lessons learned</p>
            </div>
          </div>
        </div>

        {/* Differentiation */}
        <div className="bg-gray-900 text-white py-16 -mx-6 px-6 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">Not Your Typical "Course"</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Not endless video lessons</h3>
                  <p className="text-gray-300">No 8-week curriculum. No homework. This is a system you execute today.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Not motivational platitudes</h3>
                  <p className="text-gray-300">No "believe in yourself" speeches. Just operational frameworks that work.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Not unproven theory</h3>
                  <p className="text-gray-300">This page was built with the system. Documented. Timestamped. Repeatable.</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-700 pt-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">✓ What This Actually Is:</h3>
              <ul className="space-y-3 text-gray-300 text-lg">
                <li>• <strong>Operator playbook:</strong> How fast movers actually work</li>
                <li>• <strong>Proven system:</strong> This page is the proof-of-concept</li>
                <li>• <strong>Instant execution:</strong> Use it today, ship today</li>
                <li>• <strong>Repeatable process:</strong> Works for any idea, any niche</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Identity Shift */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">This Isn't About Learning</h2>
          <p className="text-xl text-gray-600 mb-10 text-center max-w-3xl mx-auto">
            It's about becoming. You're not buying information. You're joining the operators.
          </p>

          <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-red-400">Thinkers</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Plan endlessly</li>
                  <li>• Research "best practices"</li>
                  <li>• Wait for perfect conditions</li>
                  <li>• Build in secret</li>
                  <li>• Fear judgment</li>
                  <li>• One big bet</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">Operators</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Ship daily</li>
                  <li>• Learn from market</li>
                  <li>• Move before ready</li>
                  <li>• Test in public</li>
                  <li>• Embrace feedback</li>
                  <li>• Portfolio approach</li>
                </ul>
              </div>
            </div>

            <p className="text-center text-2xl font-bold mt-8">
              Choose your side. Act accordingly.
            </p>
          </div>
        </div>

        {/* Final CTA Stack */}
        <div className="bg-black text-white py-16 -mx-6 px-6 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Become An Operator</h2>
            <p className="text-2xl text-gray-300 mb-10">
              The secret is out. The system is yours.
            </p>

            <div className="bg-white text-black rounded-2xl p-10 mb-10 inline-block">
              <div className="text-7xl font-black mb-3">$17</div>
              <p className="text-gray-600 mb-8">One-time. Instant access. Forever yours.</p>
              
              <button 
                onClick={handleCheckout}
                className="bg-black text-white text-3xl font-bold px-12 py-6 rounded-lg hover:bg-gray-800 transition shadow-2xl w-full mb-6"
              >
                Get The FastStart Blueprint →
              </button>

              <div className="space-y-3 text-left">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-bold">✓ Immediate access:</span> Start shipping in minutes
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-bold">✓ Complete system:</span> Frameworks, templates, tools
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-bold">✓ Operator secrets:</span> What fast movers actually do
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-bold">✓ 30-day guarantee:</span> Ship or refund, no questions
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 text-gray-900 rounded-xl p-8 inline-block">
              <h3 className="text-xl font-bold mb-4">The Operator's Guarantee</h3>
              <p className="text-gray-700">
                Use the system for 7 days. Ship something. If you don't move faster than you ever have, full refund. No questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Final Urgency */}
        <div className="text-center bg-gray-50 rounded-2xl p-10">
          <p className="text-2xl font-bold mb-4">Operators Ship While Thinkers Plan</p>
          <p className="text-xl text-gray-600 mb-6">
            Which one are you becoming today?
          </p>
          <button 
            onClick={handleCheckout}
            className="bg-black text-white text-xl font-bold px-10 py-5 rounded-lg hover:bg-gray-900 transition shadow-xl"
          >
            Join The Operators → $17
          </button>
        </div>

      </div>
    </div>
  );
}
