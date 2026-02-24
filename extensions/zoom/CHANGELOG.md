# Changelog - Zoom Team Chat Plugin

All notable changes to the Zoom Team Chat plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-31

### Added
- Initial release of Zoom Team Chat plugin for OpenClaw
- Webhook-based message receiving with signature verification
- OAuth 2.0 authentication with automatic token refresh
- Send messages to direct chats and channels
- Reply to messages (threading support)
- Edit and delete sent messages
- Security policies for DMs (open, pairing, allowlist)
- Security policies for channels (open, allowlist, deny)
- Require mention option for channel messages
- Multi-account support for multiple Zoom workspaces
- Webhook URL verification handling
- Connectivity probing for status checks
- Comprehensive documentation and setup guides
- Configuration schema with TypeScript types
- Example configurations

### Plugin Architecture
- `accounts.ts` - Account management and resolution
- `actions.ts` - Message actions (edit, delete, react)
- `auth.ts` - OAuth token management with caching
- `channel.ts` - Main channel plugin implementation
- `config-schema.ts` - JSON schema for configuration
- `monitor.ts` - Webhook handler and message processing
- `probe.ts` - Connectivity testing
- `runtime.ts` - Runtime context management
- `send.ts` - Message sending functionality
- `targets.ts` - Target resolution and validation
- `types.ts` - TypeScript type definitions

### Security
- Webhook signature verification using HMAC-SHA256
- Encrypted storage of client secrets and webhook tokens
- Configurable sender allowlists for DMs and channels
- Pairing mode for gradual permission grants
- Channel-specific access controls

### Documentation
- README.md - Comprehensive feature documentation
- SETUP.md - Step-by-step setup guide
- config-example.json - Example configurations
- CHANGELOG.md - Version history

### Known Limitations
- Reactions not supported (waiting for Zoom API support)
- File uploads not yet implemented (API supports, pending implementation)
- Limited thread support compared to Slack/Discord

## [Unreleased]

### Planned
- [ ] File and media upload support
- [ ] Rich message formatting (cards, interactive buttons)
- [ ] Reaction support when Zoom API allows
- [ ] User directory lookup
- [ ] Channel directory lookup
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Message search functionality
- [ ] Bulk message operations
- [ ] Rate limiting improvements
- [ ] Retry logic for failed sends
- [ ] Webhook delivery status tracking

### Under Consideration
- [ ] Support for Zoom Phone integration
- [ ] Meeting bot integration
- [ ] Screen sharing notifications
- [ ] Custom emoji support
- [ ] Message templates
- [ ] Scheduled messages
- [ ] Message analytics

## Development Notes

### Testing Checklist
- [x] Webhook URL verification
- [x] Webhook signature verification
- [x] Direct message receiving
- [x] Channel message receiving
- [x] Message sending (DM)
- [x] Message sending (channel)
- [x] Reply to message
- [x] Edit message
- [x] Delete message
- [x] OAuth token refresh
- [x] Multi-account support
- [x] DM policy: open
- [x] DM policy: pairing
- [x] DM policy: allowlist
- [x] Group policy: open
- [x] Group policy: allowlist
- [x] Group policy: deny
- [x] Require mention in channels
- [ ] File upload (not implemented)
- [ ] Reactions (API limitation)

### Integration Patterns

This plugin follows the established OpenClaw channel plugin patterns:

1. **BlueBubbles-style webhook handling** - Signature verification, event routing
2. **Slack-style account management** - Multi-account with base + account configs
3. **Standard security policies** - Pairing, allowlist, open modes
4. **SDK integration** - Full use of OpenClaw plugin SDK utilities

### API Compatibility

- **Zoom Team Chat API**: v2
- **OAuth 2.0**: Account credentials grant type
- **Webhook Events**: v1 event subscription format

### Migration Guide

This is the initial release, no migrations needed.

## Contributing

When contributing to this plugin:

1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation (README.md, SETUP.md)
4. Update this changelog
5. Ensure TypeScript types are complete
6. Test with real Zoom workspace before submitting

## Support

For issues, questions, or contributions:
- Check existing documentation first
- Review OpenClaw plugin development guide
- Check Zoom API documentation
- Open an issue with detailed reproduction steps

---

**Legend**:
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security improvements
