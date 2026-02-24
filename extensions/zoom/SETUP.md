# Zoom Team Chat Plugin - Quick Setup Guide

## Prerequisites

- OpenClaw installed and running
- Access to Zoom account with admin privileges
- Public HTTPS endpoint for webhook (OpenClaw gateway must be accessible)

## Step-by-Step Setup

### 1. Create Zoom Chatbot App (5 minutes)

1. **Navigate to Zoom Marketplace**
   ```
   https://marketplace.zoom.us/develop/create
   ```

2. **Create Chatbot App**
   - Click "Build App"
   - Choose "Chatbot" type
   - Click "Create"

3. **Basic Information**
   - App Name: `OpenClaw Agent` (or your preferred name)
   - Short Description: `AI assistant for team collaboration`
   - Company Name: Your organization
   - Developer Name: Your name
   - Developer Email: Your email

4. **App Credentials** (Important - Save These!)
   - Copy **Client ID**
   - Copy **Client Secret**
   - Note your **Account ID** (found in Zoom admin console)

### 2. Configure App Permissions

1. **Go to Scopes**
   - Add `imchat:bot`
   - Add `imchat:read`
   - Add `imchat:write`

2. **Go to Features**
   - Enable "Event Subscriptions"
   - Copy the **Bot JID** (looks like `v1abc123@xmpp.zoom.us`)

### 3. Set Up Webhooks

1. **Event Subscriptions** (in Features tab)
   
   a. **Add Webhook URL**
      ```
      https://your-gateway-domain.com/zoom-webhook
      ```
      Replace `your-gateway-domain.com` with your OpenClaw gateway address.
      
   b. **Copy Tokens** (Important!)
      - Copy **Verification Token**
      - Copy **Secret Token**
   
   c. **Subscribe to Events**
      - `endpoint.url_validation` (required for verification)
      - `chat_message.sent` (for receiving messages)

2. **Save Changes**

### 4. Activate App

1. In app settings, click **"Activate your app"**
2. Install it to your Zoom account when prompted

### 5. Configure OpenClaw

#### Option A: Interactive Setup (Recommended)

```bash
openclaw channel setup zoom
```

Enter the values when prompted:
- Client ID: `[from step 1]`
- Client Secret: `[from step 1]`
- Account ID: `[from step 1]`
- Bot JID: `[from step 2]`
- Verification Token: `[from step 3b]`
- Webhook Secret Token: `[from step 3b]`
- Webhook Path: `/zoom-webhook` (or press Enter for default)

#### Option B: Manual Configuration

Edit `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "zoom": {
      "enabled": true,
      "clientId": "YOUR_CLIENT_ID",
      "clientSecret": "YOUR_CLIENT_SECRET",
      "accountId": "YOUR_ZOOM_ACCOUNT_ID",
      "botJid": "YOUR_BOT_JID",
      "verificationToken": "YOUR_VERIFICATION_TOKEN",
      "webhookSecretToken": "YOUR_SECRET_TOKEN",
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist",
      "requireMention": true,
      "groupAllowFrom": []
    }
  }
}
```

### 6. Restart OpenClaw Gateway

```bash
openclaw gateway restart
```

### 7. Verify Setup

```bash
openclaw channel status zoom
```

Expected output:
```
✓ zoom: Connected
  Account: default
  Bot JID: v1abc123@xmpp.zoom.us
  Status: Running
  Webhook: /zoom-webhook
```

### 8. Test Integration

1. **Test DM**
   - In Zoom, search for your bot name
   - Send a direct message: `Hello!`
   - If `dmPolicy` is `pairing`, approve the sender:
     ```bash
     openclaw pairing approve --channel zoom --id "sender_jid"
     ```
   - Send another message - bot should respond

2. **Test Channel**
   - Add bot to a channel in Zoom
   - Get the channel ID (see "Getting Channel IDs" below)
   - Add channel to allowlist:
     ```json
     "groupAllowFrom": ["channel_id_here"]
     ```
   - Restart gateway
   - In the channel, mention the bot: `@OpenClaw Agent hello`
   - Bot should respond

## Getting Channel IDs

Channel IDs are needed for the `groupAllowFrom` allowlist. To find them:

### Method 1: From Webhook Logs

1. Enable debug logging:
   ```bash
   openclaw gateway logs --level debug --follow
   ```

2. Send a test message in the channel (mention the bot if required)

3. Look for webhook payload in logs containing `channel_id`

### Method 2: From Zoom API

1. Get an access token (bot will do this automatically, but for manual testing):
   ```bash
   curl -X POST "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=YOUR_ACCOUNT_ID" \
     -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)"
   ```

2. List channels:
   ```bash
   curl "https://api.zoom.us/v2/im/chat/channels" \
     -H "Authorization: Bearer ACCESS_TOKEN"
   ```

## Security Best Practices

### Production Configuration

```json
{
  "channels": {
    "zoom": {
      "enabled": true,
      "dmPolicy": "allowlist",
      "allowFrom": [
        "approved_user1@xmpp.zoom.us",
        "approved_user2@xmpp.zoom.us"
      ],
      "groupPolicy": "allowlist",
      "groupAllowFrom": [
        "allowed_channel_id_1",
        "allowed_channel_id_2"
      ],
      "requireMention": true,
      "webhookSecretToken": "ALWAYS_SET_THIS"
    }
  }
}
```

**Key security settings:**

1. **`dmPolicy: "allowlist"`** - Only respond to approved users
2. **`groupPolicy: "allowlist"`** - Only monitor specific channels
3. **`requireMention: true`** - Require @mention in channels
4. **`webhookSecretToken`** - Verify webhook signatures

### Development Configuration

For testing, you can use more relaxed settings:

```json
{
  "channels": {
    "zoom": {
      "enabled": true,
      "dmPolicy": "pairing",
      "groupPolicy": "open",
      "requireMention": false
    }
  }
}
```

⚠️ **Warning**: `groupPolicy: "open"` allows the bot to respond in ANY channel it's added to.

## Troubleshooting

### Webhook Verification Fails

**Problem**: Zoom shows "Webhook verification failed"

**Solutions**:
1. Ensure OpenClaw gateway is running and publicly accessible
2. Check that webhook path matches (default: `/zoom-webhook`)
3. Verify `verificationToken` in config matches Zoom app settings
4. Check gateway logs: `openclaw gateway logs --follow`

### Bot Not Responding to Messages

**Problem**: Messages sent but no response

**Check**:
```bash
# 1. Verify channel is running
openclaw channel status zoom

# 2. Check recent activity
openclaw gateway logs --follow

# 3. For DMs with pairing policy
openclaw pairing list --channel zoom

# 4. For channels
# Ensure channel ID is in groupAllowFrom
```

**Common Issues**:
- DM blocked by `dmPolicy: "allowlist"` → Add user to `allowFrom`
- Channel blocked by `groupPolicy: "allowlist"` → Add channel to `groupAllowFrom`
- Not mentioned in channel when `requireMention: true` → @mention the bot
- Bot not added to channel → Add bot to channel in Zoom

### Authentication Errors

**Problem**: "Auth failed" or 401 errors

**Solutions**:
1. Verify credentials in config:
   ```bash
   openclaw configure --section channels.zoom
   ```
2. Check scopes are granted in Zoom app
3. Ensure app is activated and installed
4. Try clearing token cache:
   ```bash
   openclaw gateway restart
   ```

### Gateway Not Accessible

**Problem**: Zoom can't reach webhook

**Solutions**:
1. Check firewall rules allow HTTPS traffic
2. Verify gateway is listening on correct port
3. Test external access:
   ```bash
   curl https://your-gateway-domain.com/zoom-webhook
   ```
4. Consider using ngrok for local testing:
   ```bash
   ngrok http 3000
   # Use the https URL as webhook endpoint
   ```

## Next Steps

- Read the full [README.md](./README.md) for advanced features
- Configure security policies for production use
- Set up multi-account if needed
- Explore message actions (edit, delete)
- Monitor agent activity: `openclaw gateway logs --follow`

## Support

- OpenClaw Docs: https://docs.openclaw.ai
- Zoom API Docs: https://developers.zoom.us/docs/api/
- Issues: GitHub repository issues section
