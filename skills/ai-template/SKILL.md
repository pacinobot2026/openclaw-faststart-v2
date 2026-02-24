# AI Template Service Skill

Generate 12+ premium landing page template variations using AI (Claude/OpenAI).

## When to Use

- User wants to generate multiple design variations for bridge pages or lead steps
- Creating an AI-powered template gallery
- Need unique, high-converting landing page designs
- Want style variations (colors, fonts) without changing content

## Prerequisites

- Anthropic API key OR OpenAI API key configured
- Input data with headline, subheadline, CTA text, button text

## Configuration

```json
{
  "skills": {
    "entries": {
      "ai-template": {
        "anthropicApiKey": "sk-ant-api03-...",
        "openaiApiKey": "sk-proj-...",
        "defaultProvider": "claude"
      }
    }
  }
}
```

## Usage

### Generate Template Variations

```javascript
{
  "action": "generate",
  "input": {
    "main_headline": "Your Amazing Headline",
    "sub_headline": "Your compelling sub-headline",
    "cta_statement": "Your call to action",
    "button_text": "Get Started",
    "privacy_statement": "We respect your privacy"
  },
  "count": 12
}
```

### Output

Returns array of 12+ template objects with unique styling:

```json
{
  "variations": [
    {
      "theme_name": "Tokyo Midnight",
      "page_background_color": "#0A0A1A",
      "headline_font_family": "Montserrat",
      "headline_text_color": "#FFFFFF",
      "button_bg_color": "#00D4FF",
      // ... 50+ styling properties
    }
  ]
}
```

## Design Themes Generated

The AI creates unique combinations of:
- **Color palettes**: Dark mode, light mode, vibrant, muted, gradients
- **Font pairings**: Display + body font combinations
- **Visual effects**: Gradients, shadows, patterns, animations
- **Layout densities**: Full, medium, compact sizes
- **Button styles**: Solid, gradient, pill, rounded, pointed

### Example Themes

1. **Tokyo Midnight** - Dark SaaS with cyan neon accents
2. **Desert Oasis** - Warm organic with serif fonts
3. **Nordic Frost** - Clean minimal white/blue
4. **Cyber Miami** - Neon gradient synthwave
5. **Royal Purple** - Luxury gold accents
6. **Electric Blue** - Energetic dark blue
7. **Sunset Blaze** - Vibrant orange/pink
8. **Midnight Gold** - Premium exclusive
9. **Arctic Frost** - Cool professional light
10. **Emerald Dark** - Natural green
11. **Crimson Power** - Urgent red with pulse
12. **Carbon Fiber** - Industrial orange
13. **Traditional Marketing** - Direct response style
14. **Social Media** - Instagram aesthetic
15. **Ultra Gradient** - Animated rainbow
16. **Neon Cyberpunk** - Synthwave glow
17. **Glassmorphism** - Frosted glass effect
18. **Cosmic Galaxy** - Space nebula
19. **Circuit Board** - Tech green matrix
20. **Matrix** - Classic green code
21. **Aurora Borealis** - Northern lights
22. **Holographic** - Iridescent shimmer
23. **Retro Wave** - 80s sunset
24. **Black Hole** - Cosmic gravity

## Technical Details

### Prompt Engineering

The skill uses a carefully crafted prompt that:
- Gives AI creative freedom (no rigid templates)
- Enforces technical constraints (valid hex, font whitelist)
- Requires contrast and accessibility
- Demands variety across all outputs

### Validation

All outputs are validated:
- Hex color codes (7-char format)
- Font family whitelist
- Size/spacing ranges clamped
- Gradient structure verified

### Fallback Logic

If primary provider fails, automatically tries alternate:
1. Try Claude (Anthropic)
2. If fails, try OpenAI
3. If both fail, return error

## Integration with MintBird/PopLinks

### Workflow

1. User enters content (headline, sub, CTA, button)
2. Call `AITemplateService::generateVariations()`
3. Display gallery of generated designs
4. User selects preferred style
5. Selected variation becomes template settings

### Example Implementation

```php
use App\Services\AITemplateService;

$service = new AITemplateService();
$variations = $service->generateVariations([
    'main_headline' => 'Generate Unlimited Templates',
    'sub_headline' => 'AI-powered designs in seconds',
    'cta_statement' => 'Create high-converting pages',
    'button_text' => 'Get Started'
]);

// Display in gallery
foreach ($variations as $template) {
    echo $template['theme_name']; // "Tokyo Midnight"
    echo $template['page_background_color']; // "#0A0A1A"
    // ...
}
```

## Cost Considerations

- **Claude**: ~$0.50-1.00 per 12-variation generation (depends on token usage)
- **OpenAI GPT-4o**: ~$0.30-0.60 per 12-variation generation
- Generation includes full CSS properties for each variation

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| API key not configured | Missing credentials | Add keys to config |
| JSON parse failed | AI returned malformed JSON | Retry with fallback provider |
| Empty variations | AI returned no results | Check prompt, retry |
| Timeout | Generation took too long | Increase timeout to 120s |

## Live Demo

**Gallery Preview:** https://ai-template-gallery.vercel.app

Shows 25 generated designs with different color palettes, fonts, and visual effects.

## Files

- **Service Class**: `AITemplateService.php`
- **Prompt**: `ai-template-prompt-v2.txt`
- **Gallery Demo**: `ai-template-gallery-preview.html`

## Last Updated

2026-02-17
