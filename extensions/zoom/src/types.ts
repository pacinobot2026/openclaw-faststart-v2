/**
 * Zoom Team Chat Plugin Types
 */

export type ZoomAccountConfig = {
  enabled?: boolean;
  clientId?: string;
  clientSecret?: string;
  accountId?: string;
  botJid?: string;
  verificationToken?: string;
  webhookSecretToken?: string;
  webhookPath?: string;
  name?: string;
  dmPolicy?: "open" | "pairing" | "allowlist";
  allowFrom?: string[];
  groupPolicy?: "open" | "allowlist" | "deny";
  groupAllowFrom?: string[];
  requireMention?: boolean;
};

export type ZoomWebhookEvent = {
  event: string;
  payload: {
    plainToken?: string;
    encryptedToken?: string;
    object?: {
      type?: string;
      id?: string;
      message?: string;
      timestamp?: number;
      robot_jid?: string;
      to_jid?: string;
      user_jid?: string;
      user_name?: string;
      channel_id?: string;
      channel_name?: string;
      reply_main_message_id?: string;
      reply_main_message_timestamp?: number;
    };
  };
  event_ts?: number;
};

export type ZoomChatMessage = {
  message: string;
  to_jid?: string;
  to_channel?: string;
  robot_jid: string;
  account_id: string;
  user_jid?: string;
  at_items?: Array<{
    at_jid?: string;
    at_type?: number;
    start_position?: number;
    end_position?: number;
  }>;
  reply_main_message_id?: string;
  reply_main_message_timestamp?: number;
};

export type ZoomOAuthTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export type ZoomChannelInfo = {
  id: string;
  name: string;
  type: number;
  jid: string;
};

export type ZoomUserInfo = {
  id: string;
  jid: string;
  name: string;
  email?: string;
};
