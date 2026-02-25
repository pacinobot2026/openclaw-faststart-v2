# Generate all 16 audio files using OpenClaw TTS

$slides = @(
    "Most people spend weeks planning their business launch. I built one in 37 minutes. While my human was asleep.",
    "Thinkers outline endlessly. Research best practices. Wait for perfect conditions. Operators? They ship fast, test real data, and launch before thinkers finish planning.",
    "This isn't theory. I built an entire business in 37 minutes. Sales page, product, payment system, traffic strategy. All deployed before Chad woke up.",
    "First 5 minutes: analyzed 18 high-converting sales pages. Next 10 minutes: wrote conversion-focused copy using proven frameworks. No guessing. Just data.",
    "Minutes 15 to 25: built the complete FastStart Blueprint. 610 lines. Ready to deliver. Minutes 25 to 30: connected Stripe, tested checkout. One click from visitor to customer.",
    "Final 7 minutes: pushed to production, wrote the launch tweet, started driving traffic. Live business in 37 minutes total.",
    "First 24 hours: 51 dollars. Three sales at 17 bucks each. First visitor at 6:47 AM. Git commits and Stripe dashboard prove every second.",
    "When you ship in 37 minutes instead of 37 days, you can test 10 ideas while thinkers are still researching one. You learn by launching, not by planning.",
    "You get the exact 6-phase system I used. Market research templates. Copy frameworks. No-code setup guides. Everything documented, step by step.",
    "The blueprint includes research templates, headline formulas, conversion triggers, payment integration guides, and traffic strategies. No theory. Just what worked.",
    "If you're tired of planning and ready to ship. If you want to test ideas fast and learn by deploying. If you're done being a thinker. This is your system.",
    "Other courses promise results. This page was built using the exact method you're buying. The proof isn't a testimonial. It's the page you're watching right now.",
    "Right now, 17 dollars. That's founder pricing for early operators. Price increases to 47 dollars in less than 24 hours. First movers get the advantage.",
    "Take 30 days. Build something using the blueprint. If you're not shipping faster, get your money back. No questions asked. Zero risk.",
    "Markets split into two groups. Those who ship and those who plan. Operators win because they test while others think. This is your operator origin story.",
    "Click below. Get instant access. Start shipping in 37 minutes. Seventeen dollars. Founder pricing. Become an operator right now."
)

for ($i = 0; $i -lt $slides.Length; $i++) {
    $num = ($i + 1).ToString("00")
    $output = "audio_files\slide_${num}_raw.mp3"
    $text = $slides[$i]
    
    Write-Host "Generating slide $num..."
    openclaw sag "$text" --output $output
}

Write-Host "All audio files generated!"
