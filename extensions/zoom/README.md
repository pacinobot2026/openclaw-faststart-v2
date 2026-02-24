# Zoom Team Chat Plugin for OpenClaw

This plugin integrates Zoom Team Chat with OpenClaw, allowing your agent to monitor team channels and direct messages, and respond when relevant.

## Features

- ✅ **Webhook-based message receiving** - Real-time message notifications from Zoom
- ✅ **Send messages** - Reply to DMs and channels via Zoom Chat API
- ✅ **Channel monitoring** - Monitor specific channels with optional mention requirement
- ✅ **Direct messages** - Support for 1:1 conversations
- ✅ **Reply threading** - Reply to specific messages
- ✅ **Edit/Delete messages** - Modify or remove sent messages
- ✅ **Security policies** - Control who can interact with the bot (pairing, allowlist, open)
- ✅ **Multi-account support** - Connect multiple Zoom workspaces

## Architecture

This plugin follows OpenClaw's standard channel architecture:

```
extensions/zoom/
├── index.ts              # Plugin entry point
├── package.json          # Plugin metadata
├── openclaw.plugin.json  # Channel registration
└── src/
    ├── accounts.ts       # Account management
    ├── actions.ts        # Message actions (edit, delete, react)
    ├── auth.ts           # OAuth token management
    ├── channel.ts        # Main channel plugin implementation
    ├── config-schema.ts  # Configuration schema
    ├── monitor.ts        # Webhook handler
    ├── probe.ts          # Connectivity testing
    ├── runtime.ts        # Runtime context
    ├── send.ts           # Message sending
    ├── targets.ts        # Target resolution
    └── types.ts          # TypeScript types
```

## Setup Requirements

### 1. Create a Zoom Chat App

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Click **Develop** → **Build App**
3. Choose **Chatbot** app type
4. Fill in app details:
   - **App Name**: Your bot name (e.g., "OpenClaw Agent")
   - **Short Description**: Brief description
   - **Company Name**: Your organization

### 2. Configure OAuth

1. In your app settings, go to **App Credentials**
2. Note down:
   - **Client ID**
   - **Client Secret**
   - **Account ID** (found in Zoom Account settings)
3. Under **Scopes**, add:
   - `imchat:bot`
   - `imchat:read`
   - `imchat:write`

### 3. Get Bot JID

1. In app settings, go to **Features**
2. Enable **Event Subscriptions**
3. Note the **Bot JID** (Jabber ID) - looks like `v1abcdef12345@xmpp.zoom.us`

### 4. Configure Webhooks

1. In **Event Subscriptions**, add your webhook URL:
   ```
   https://your-openclaw-gateway.com/zoom-webhook
   ```
2. Subscribe to events:
   - `endpoint.url_validation`
   - `chat_message.sent`
3. Copy the **Verification Token** and **Secret Token**

### 5. Activate the App

1. In app settings, click **Activate your app**
2. Install it to your Zoom account

## OpenClaw Configuration

### Basic Setup

Run the interactive setup:

```bash
openclaw channel setup zoom
```

You'll be prompted for:
- Client ID
- Client Secret
- Account ID
- Bot JID
- Verification Token
- Webhook Secret Token (optional but recommended)
- Custom webhook path (optional, defaults to `/zoom-webhook`)

### Manual Configuration

Edit `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "zoom": {
      "enabled": true,
      "clientId": "your_client_id",
      "clientSecret": "your_client_secret",
      "accountId": "your_zoom_account_id",
      "botJid": "v1abcdef12345@xmpp.zoom.us",
      "verificationToken": "your_verification_token",
      "webhookSecretToken": "your_secret_token",
      "webhookPath": "/zoom-webhook",
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist",
      "requireMention": true,
      "groupAllowFrom": [
        "channel_id_1",
        "channel_id_2"
      ]
    }
  }
}
```

## Configuration Options

### Security Policies

#### DM Policy (`dmPolicy`)

Controls direct message access:

- **`pairing`** (default): Requires approval before responding
- **`allowlist`**: Only responds to approved users
- **`open`**: Responds to anyone

```json
{
  "dmPolicy": "pairing",
  "allowFrom": [
    "user1@xmpp.zoom.us",
    "user2@xmpp.zoom.us"
  ]
}
```

#### Group Policy (`groupPolicy`)

Controls channel message access:

- **`open`** (default): Responds in all channels (if mentioned when required)
- **`allowlist`**: Only monitors specific channels
- **`deny`**: Ignores all channel messages

```json
{
  "groupPolicy": "allowlist",
  "groupAllowFrom": [
    "9d8f7g6h5j4k3l2m",
    "a1b2c3d4e5f6g7h8"
  ],
  "requireMention": true
}
```

### Multi-Account Configuration

Support multiple Zoom workspaces:

```json
{
  "channels": {
    "zoom": {
      "enabled": true,
      "accounts": {
        "work": {
          "enabled": true,
          "clientId": "work_client_id",
          "clientSecret": "work_secret",
          "accountId": "work_account_id",
          "botJid": "work_bot@xmpp.zoom.us",
          "verificationToken": "work_token",
          "name": "Work Zoom"
        },
        "community": {
          "enabled": true,
          "clientId": "community_client_id",
          "clientSecret": "community_secret",
          "accountId": "community_account_id",
          "botJid": "community_bot@xmpp.zoom.us",
          "verificationToken": "community_token",
          "name": "Community Zoom"
        }
      }
    }
  }
}
```

## Usage

### Sending Messages

#### From Agent

The agent will automatically respond to messages in configured channels and DMs.

#### Manual Sending

```bash
# Send to a user (DM)
openclaw message send --channel zoom --to "user@xmpp.zoom.us" "Hello!"

# Send to a channel
openclaw message send --channel zoom --to "channel:9d8f7g6h5j4k3l2m" "Team update!"

# Reply to a message
openclaw message send --channel zoom --to "user@xmpp.zoom.us" --reply-to "msg_id" "Got it!"
```

### Message Actions

```bash
# Edit a message
openclaw message edit --channel zoom --message-id "msg_id" "Updated text"

# Delete a message
openclaw message delete --channel zoom --message-id "msg_id"
```

## Testing & Troubleshooting

### Test Connectivity

```bash
openclaw channel status zoom
```

### Check Logs

Monitor gateway logs:

```bash
openclaw gateway logs --follow
```

### Common Issues

#### Webhook Not Receiving Messages

1. **Check webhook URL is accessible**: Ensure your gateway is publicly accessible
2. **Verify webhook path**: Default is `/zoom-webhook`, check if custom path is configured
3. **Check event subscriptions**: Ensure `chat_message.sent` is subscribed in Zoom app
4. **Verify verification token**: Token must match between Zoom app and OpenClaw config

#### Authentication Errors

1. **Check credentials**: Verify Client ID, Client Secret, and Account ID
2. **Check scopes**: Ensure required OAuth scopes are granted
3. **Token cache**: Try restarting the gateway to clear token cache

#### Messages Not Sending

1. **Check account configuration**: Run `openclaw channel status zoom`
2. **Verify bot JID**: Must match the one from Zoom app settings
3. **Check target format**: Use `user@xmpp.zoom.us` for DMs, `channel:ID` for channels

#### Channel Not Responding

1. **Check groupPolicy**: If set to `allowlist`, add the channel ID to `groupAllowFrom`
2. **Check requireMention**: If `true`, bot must be @mentioned in channels
3. **Check permissions**: Ensure bot is added to the channel in Zoom

## API Reference

### Types

See `src/types.ts` for full TypeScript type definitions.

### Key Functions

- `sendZoomMessage()` - Send a chat message
- `handleZoomWebhookRequest()` - Process incoming webhooks
- `probeZoom()` - Test connectivity
- `getZoomAccessToken()` - Get OAuth access token

## Security Considerations

1. **Webhook Secret**: Always configure `webhookSecretToken` to verify webhook signatures
2. **DM Policy**: Use `pairing` or `allowlist` in production to prevent unauthorized access
3. **Channel Policy**: Use `allowlist` to restrict which channels the bot can access
4. **Credentials**: Client Secret and Webhook Secret are encrypted in the config

## Limitations

- **Reactions**: Not fully supported by Zoom Team Chat API yet
- **File uploads**: Not yet implemented (API supports it)
- **Thread support**: Limited compared to platforms like Slack

## Future Enhancements

- [ ] File/media upload support
- [ ] Rich message formatting (cards, buttons)
- [ ] Reaction support when API allows
- [ ] User/channel directory lookup
- [ ] Typing indicators
- [ ] Read receipts

## Contributing

Contributions welcome! Please follow the OpenClaw plugin development guidelines.

## License

Same as OpenClaw (MIT)

## Resources

- [Zoom Chat API Documentation](https://developers.zoom.us/docs/api/rest/reference/chat/)
- [Zoom Chatbot Guide](https://developers.zoom.us/docs/team-chat-apps/)
- [OpenClaw Plugin SDK](https://docs.openclaw.ai/plugins/)
