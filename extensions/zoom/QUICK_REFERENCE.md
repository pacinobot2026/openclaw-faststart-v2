# Zoom Team Chat Plugin - Quick Reference

## 🚀 Quick Start

```bash
# 1. Install (if published)
npm install @openclaw/zoom

# 2. Setup
openclaw channel setup zoom

# 3. Start
openclaw gateway restart

# 4. Test
openclaw channel status zoom
```

## 📋 Required Zoom App Settings

| Setting | Location | Value |
|---------|----------|-------|
| App Type | Marketplace → Build App | **Chatbot** |
| OAuth Scopes | App → Scopes | `imchat:bot`, `imchat:read`, `imchat:write` |
| Event Subscriptions | App → Features | `endpoint.url_validation`, `chat_message.sent` |
| Webhook URL | Event Subscriptions | `https://your-gateway.com/zoom-webhook` |

## 🔑 Required Configuration

```json
{
  "channels": {
    "zoom": {
      "enabled": true,
      "clientId": "from Zoom app credentials",
      "clientSecret": "from Zoom app credentials",
      "accountId": "from Zoom account settings",
      "botJid": "from Zoom app features (e.g., v1abc@xmpp.zoom.us)",
      "verificationToken": "from Zoom event subscriptions",
      "webhookSecretToken": "from Zoom event subscriptions (optional but recommended)"
    }
  }
}
```

## 🎯 Target Formats

| Type | Format | Example |
|------|--------|---------|
| Direct Message | `user_jid` | `user@xmpp.zoom.us` |
| Channel | `channel:channel_id` | `channel:9d8f7g6h5j4k3l2m` |

## 🔒 Security Policies

### DM Policy

| Policy | Behavior |
|--------|----------|
| `open` | Respond to any DM |
| `pairing` | Require approval before responding (default) |
| `allowlist` | Only respond to users in `allowFrom` |

### Group Policy

| Policy | Behavior |
|--------|----------|
| `open` | Monitor all channels bot is in (default) |
| `allowlist` | Only monitor channels in `groupAllowFrom` |
| `deny` | Ignore all channel messages |

## 💬 Common Commands

```bash
# Send DM
openclaw message send --channel zoom --to "user@xmpp.zoom.us" "Hello!"

# Send to channel
openclaw message send --channel zoom --to "channel:ABC123" "Team update"

# Reply to message
openclaw message send --channel zoom --to "user@xmpp.zoom.us" --reply-to "msg_id" "Thanks!"

# Edit message
openclaw message edit --channel zoom --message-id "msg_id" "Updated text"

# Delete message
openclaw message delete --channel zoom --message-id "msg_id"

# Check status
openclaw channel status zoom

# View logs
openclaw gateway logs --follow

# Pairing (if dmPolicy is "pairing")
openclaw pairing list --channel zoom
openclaw pairing approve --channel zoom --id "user@xmpp.zoom.us"
```

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Webhook verification fails | Check `verificationToken` matches Zoom app |
| Bot not responding | Check policies, ensure sender is authorized |
| Auth errors | Verify credentials, check scopes, restart gateway |
| Channel messages ignored | Add channel to `groupAllowFrom` if using allowlist |
| Not receiving messages | Check webhook URL is accessible, verify event subscriptions |

## 📊 Status Indicators

```bash
openclaw channel status zoom
```

**Expected output when working:**
```
✓ zoom: Connected
  Account: default
  Bot JID: v1abc123@xmpp.zoom.us
  Status: Running
  Webhook: /zoom-webhook
  Last Activity: 2 minutes ago
```

## 🎨 Configuration Snippets

### Development (Permissive)
```json
{
  "dmPolicy": "pairing",
  "groupPolicy": "open",
  "requireMention": false
}
```

### Production (Secure)
```json
{
  "dmPolicy": "allowlist",
  "allowFrom": ["trusted@xmpp.zoom.us"],
  "groupPolicy": "allowlist",
  "groupAllowFrom": ["channel_id_1"],
  "requireMention": true,
  "webhookSecretToken": "REQUIRED_IN_PROD"
}
```

### Multi-Account
```json
{
  "accounts": {
    "work": {
      "enabled": true,
      "clientId": "...",
      "webhookPath": "/zoom-webhook-work"
    },
    "personal": {
      "enabled": true,
      "clientId": "...",
      "webhookPath": "/zoom-webhook-personal"
    }
  }
}
```

## 🔍 Finding Channel IDs

### Method 1: Webhook Logs
```bash
openclaw gateway logs --level debug --follow
# Send a message in the channel
# Look for "channel_id" in the logs
```

### Method 2: Zoom API
```bash
# Get token
curl -X POST "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=YOUR_ACCOUNT" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)"

# List channels
curl "https://api.zoom.us/v2/im/chat/channels" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## 📚 File Reference

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `SETUP.md` | Step-by-step setup guide |
| `config-example.json` | Configuration examples |
| `CHANGELOG.md` | Version history |
| `INTEGRATION_SUMMARY.md` | Technical overview |
| `src/channel.ts` | Main plugin code |
| `src/monitor.ts` | Webhook handler |
| `src/send.ts` | Message sending |

## ⚡ API Endpoints

| Zoom API | Method | Purpose |
|----------|--------|---------|
| `/oauth/token` | POST | Get access token |
| `/v2/im/chat/messages` | POST | Send message |
| `/v2/im/chat/messages/{id}` | PUT | Edit message |
| `/v2/im/chat/messages/{id}` | DELETE | Delete message |
| `/v2/im/chat/channels` | GET | List channels |

## 🎯 Event Flow

```
Zoom User → Zoom Chat → Webhook → OpenClaw Gateway → Monitor → Security Check → Agent
                                                                                    ↓
                                          ← Send Message ← OpenClaw API ← Response ←
```

## 💡 Pro Tips

1. **Always set webhookSecretToken** for signature verification
2. **Use allowlist policies** in production environments
3. **Enable requireMention** in busy channels to reduce noise
4. **Monitor logs** during initial setup: `openclaw gateway logs --follow`
5. **Test with ngrok** during local development
6. **Keep credentials secure** - they're encrypted in the config
7. **Use multi-account** for separate work/community Zoom instances

## 📞 Support Resources

- **Full Docs**: `README.md` and `SETUP.md`
- **OpenClaw Docs**: https://docs.openclaw.ai
- **Zoom API Docs**: https://developers.zoom.us/docs/api/
- **Plugin SDK**: https://docs.openclaw.ai/plugins/

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-31
