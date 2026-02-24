/**
 * Zoom Team Chat Message Sending
 */

import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { resolveZoomAccount } from "./accounts.js";
import { getZoomAccessToken } from "./auth.js";
import type { ZoomChatMessage } from "./types.js";

export type SendZoomMessageResult = {
  ok: boolean;
  messageId?: string;
  timestamp?: number;
  error?: string;
};

/**
 * Send a chat message via Zoom Team Chat API
 */
export async function sendZoomMessage(
  to: string,
  message: string,
  options: {
    cfg: OpenClawConfig;
    accountId?: string;
    replyToId?: string;
    replyToTimestamp?: number;
  },
): Promise<SendZoomMessageResult> {
  const { cfg, accountId, replyToId, replyToTimestamp } = options;

  try {
    const account = resolveZoomAccount({ cfg, accountId });

    if (!account.configured) {
      return {
        ok: false,
        error: "Zoom account not configured",
      };
    }

    const accessToken = await getZoomAccessToken({
      clientId: account.clientId!,
      clientSecret: account.clientSecret!,
      accountId: account.zoomAccountId!,
    });

    // Parse target: can be JID (direct message) or channel ID
    const isChannel = to.startsWith("channel:");
    const targetJid = isChannel ? undefined : to;
    const targetChannel = isChannel ? to.replace("channel:", "") : undefined;

    const payload: ZoomChatMessage = {
      message,
      robot_jid: account.botJid!,
      account_id: account.zoomAccountId!,
      ...(targetJid && { to_jid: targetJid }),
      ...(targetChannel && { to_channel: targetChannel }),
      ...(replyToId && { reply_main_message_id: replyToId }),
      ...(replyToTimestamp && { reply_main_message_timestamp: replyToTimestamp }),
    };

    const response = await fetch("https://api.zoom.us/v2/im/chat/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        ok: false,
        error: `Zoom API error (${response.status}): ${errorText}`,
      };
    }

    const result = await response.json();

    return {
      ok: true,
      messageId: result.id || result.message_id,
      timestamp: result.date_time || Date.now(),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Parse Zoom target from various formats
 */
export function parseZoomTarget(target: string): {
  kind: "jid" | "channel";
  value: string;
} {
  const trimmed = target.trim();

  if (trimmed.startsWith("channel:")) {
    return {
      kind: "channel",
      value: trimmed.replace("channel:", ""),
    };
  }

  // Zoom JIDs typically look like: user@xmpp.zoom.us
  if (trimmed.includes("@")) {
    return {
      kind: "jid",
      value: trimmed,
    };
  }

  // Default to JID if no clear indicator
  return {
    kind: "jid",
    value: trimmed,
  };
}

/**
 * Normalize Zoom messaging target
 */
export function normalizeZoomTarget(target: string): string {
  const parsed = parseZoomTarget(target);
  if (parsed.kind === "channel") {
    return `channel:${parsed.value}`;
  }
  return parsed.value;
}
