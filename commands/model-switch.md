# Model Selection System

## 🤖 AUTO MODE (Default)

Model switches automatically based on task type:

| Task Type | Model | Triggers |
|-----------|-------|----------|
| Coding | Sonnet 3.5 | code, debug, script, API, build |
| Deep Reasoning | Kimi Thinking | analyze, strategy, complex, why |
| Training/Teaching | Opus 4.5 | explain, teach, workshop, students |
| Quick/Simple | Haiku 3.5 | quick, simple, yes/no, status |
| General | Kimi K2.5 | everything else |

**No commands needed — just talk naturally and I pick the right model.**

---

## 🎛️ MANUAL OVERRIDE

Force a specific model when needed:

| Command | Model | Best For |
|---------|-------|----------|
| `/model fast` | Kimi K2.5 | General tasks, daily ops |
| `/model thinking` | Kimi K2 Thinking | Complex reasoning, strategy |
| `/model coding` | Sonnet 3.5 | Code generation, debugging |
| `/model training` | Opus 4.5 | Deep training, workshops |
| `/model cheap` | Haiku 3.5 | Quick/simple tasks |
| `/model` | — | Show current model |

## Model Aliases

```
fast      → moonshot/kimi-k2.5
thinking  → kimi-coding/kimi-k2-thinking
coding    → anthropic/claude-3-5-sonnet-20241022
training  → anthropic/claude-opus-4-5
cheap     → anthropic/claude-3-5-haiku-20241022
```

---

*Created: 2026-02-17 for OpenClaw Workshop*
*Updated: Auto-detection now active by default*
