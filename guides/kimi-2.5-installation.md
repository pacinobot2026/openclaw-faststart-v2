# Kimi 2.5 Installation Guide

**Status:** Ready to install - just need API key!

## About Kimi 2.5

Kimi is an AI model from **Moonshot AI** (Chinese company). Their latest version, Kimi 2.5, is competitive with top models and especially strong at:
- Long-context tasks (up to 128K tokens)
- Coding
- Mathematical reasoning
- Chinese language tasks

## Step 1: Get API Key

1. Go to: https://platform.moonshot.cn
2. Sign up / log in (may need Chinese phone number, or use international: https://api.moonshot.ai)
3. Navigate to API Keys section
4. Create a new key
5. Fund your account (they use prepaid credits)

## Step 2: Installation Command

Once you have the API key, tell me:
```
Here's my Moonshot API key: sk-xxxxx
```

I'll run this config patch:

```json
{
  "models": {
    "providers": {
      "moonshot": {
        "baseUrl": "https://api.moonshot.cn/v1",
        "apiKey": "YOUR_KEY_HERE",
        "models": []
      }
    }
  },
  "agents": {
    "defaults": {
      "models": {
        "moonshot/moonshot-v1-8k": {
          "alias": "kimi8k"
        },
        "moonshot/moonshot-v1-32k": {
          "alias": "kimi32k"
        },
        "moonshot/moonshot-v1-128k": {
          "alias": "kimi128k"
        }
      }
    }
  }
}
```

## Available Models

| Model | Context | Alias | Best For |
|-------|---------|-------|----------|
| `moonshot-v1-8k` | 8K tokens | kimi8k | Quick tasks, lowest cost |
| `moonshot-v1-32k` | 32K tokens | kimi32k | Medium documents |
| `moonshot-v1-128k` | 128K tokens | kimi128k | Long documents, full codebases |

## Usage After Installation

Switch to Kimi using:
```
/model kimi32k
```

Or use in config for specific agents/tasks.

## Pricing (Approximate)

- Input: ~¥0.012/1K tokens (~$0.0017)
- Output: ~¥0.012/1K tokens (~$0.0017)

Very affordable compared to Western models!

## Alternative: OpenRouter

If Moonshot sign-up is difficult, Kimi might be available through OpenRouter:
- URL: https://openrouter.ai
- Model: `moonshot/moonshot-v1-128k` (check availability)

---

*Guide created: 2026-02-15*
*Status: Waiting for API key from Chad*
