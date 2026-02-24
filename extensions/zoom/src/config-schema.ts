/**
 * Zoom Team Chat Config Schema
 */

export const ZoomConfigSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enabled: {
      type: "boolean",
      description: "Enable Zoom Team Chat integration",
    },
    clientId: {
      type: "string",
      description: "Zoom OAuth Client ID",
    },
    clientSecret: {
      type: "string",
      description: "Zoom OAuth Client Secret (encrypted)",
      encrypted: true,
    },
    accountId: {
      type: "string",
      description: "Zoom Account ID",
    },
    botJid: {
      type: "string",
      description: "Zoom Bot JID (Jabber ID)",
    },
    verificationToken: {
      type: "string",
      description: "Webhook verification token",
    },
    webhookSecretToken: {
      type: "string",
      description: "Webhook secret token for signature verification",
      encrypted: true,
    },
    webhookPath: {
      type: "string",
      description: "Custom webhook path (default: /zoom-webhook)",
    },
    name: {
      type: "string",
      description: "Account name/label",
    },
    dmPolicy: {
      type: "string",
      enum: ["open", "pairing", "allowlist"],
      description: "Direct message policy",
    },
    allowFrom: {
      type: "array",
      items: { type: "string" },
      description: "Allowed DM senders (JIDs or user IDs)",
    },
    groupPolicy: {
      type: "string",
      enum: ["open", "allowlist", "deny"],
      description: "Group/channel message policy",
    },
    groupAllowFrom: {
      type: "array",
      items: { type: "string" },
      description: "Allowed channels (channel IDs)",
    },
    requireMention: {
      type: "boolean",
      description: "Require bot mention in channels",
    },
    accounts: {
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          enabled: { type: "boolean" },
          clientId: { type: "string" },
          clientSecret: { type: "string", encrypted: true },
          accountId: { type: "string" },
          botJid: { type: "string" },
          verificationToken: { type: "string" },
          webhookSecretToken: { type: "string", encrypted: true },
          webhookPath: { type: "string" },
          name: { type: "string" },
          dmPolicy: {
            type: "string",
            enum: ["open", "pairing", "allowlist"],
          },
          allowFrom: {
            type: "array",
            items: { type: "string" },
          },
          groupPolicy: {
            type: "string",
            enum: ["open", "allowlist", "deny"],
          },
          groupAllowFrom: {
            type: "array",
            items: { type: "string" },
          },
          requireMention: { type: "boolean" },
        },
      },
    },
  },
} as const;
