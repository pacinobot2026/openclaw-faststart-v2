/**
 * Zoom Team Chat Webhook Monitor
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import {
  resolveControlCommandGate,
  logInboundDrop,
} from "openclaw/plugin-sdk";
import type { ResolvedZoomAccount } from "./accounts.js";
import { resolveZoomAccount, listZoomAccountIds } from "./accounts.js";
import type { ZoomWebhookEvent } from "./types.js";
import { getZoomRuntime } from "./runtime.js";
import { isAllowedZoomSender } from "./targets.js";

export type ZoomMonitorOptions = {
  account: ResolvedZoomAccount;
  config: OpenClawConfig;
  runtime: {
    log?: (message: string) => void;
    error?: (message: string) => void;
  };
  abortSignal: AbortSignal;
  statusSink?: (patch: { lastInboundAt?: number; lastOutboundAt?: number }) => void;
  webhookPath?: string;
};

const DEFAULT_WEBHOOK_PATH = "/zoom-webhook";

/**
 * Resolve webhook path from config
 */
export function resolveWebhookPathFromConfig(config: {
  webhookPath?: string;
}): string {
  return config.webhookPath?.trim() || DEFAULT_WEBHOOK_PATH;
}

/**
 * Verify Zoom webhook signature
 */
function verifyZoomWebhookSignature(params: {
  payload: string;
  timestamp: string;
  signature: string;
  secretToken: string;
}): boolean {
  const { payload, timestamp, signature, secretToken } = params;

  const message = `v0:${timestamp}:${payload}`;
  const hmac = crypto.createHmac("sha256", secretToken);
  hmac.update(message);
  const expectedSignature = `v0=${hmac.digest("hex")}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

/**
 * Handle incoming Zoom webhook request
 */
export async function handleZoomWebhookRequest(params: {
  req: IncomingMessage;
  res: ServerResponse;
  body: string;
  runtime: any;
}): Promise<boolean> {
  const { req, res, body, runtime } = params;
  const cfg = runtime.config.loadConfig();

  // Find matching account by webhook path
  const requestPath = req.url || "";
  const accountIds = listZoomAccountIds(cfg);
  
  let matchedAccount: ResolvedZoomAccount | null = null;
  
  for (const accountId of accountIds) {
    const account = resolveZoomAccount({ cfg, accountId });
    const webhookPath = resolveWebhookPathFromConfig(account.config);
    
    if (requestPath.startsWith(webhookPath)) {
      matchedAccount = account;
      break;
    }
  }

  if (!matchedAccount) {
    return false; // Not a Zoom webhook for any configured account
  }

  try {
    const event = JSON.parse(body) as ZoomWebhookEvent;

    // Handle webhook URL verification
    if (event.event === "endpoint.url_validation") {
      const plainToken = event.payload?.plainToken;
      const encryptedToken = event.payload?.encryptedToken;
      
      if (plainToken && encryptedToken && matchedAccount.verificationToken) {
        const hash = crypto
          .createHmac("sha256", matchedAccount.verificationToken)
          .update(plainToken)
          .digest("hex");
        
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          plainToken,
          encryptedToken: hash,
        }));
        return true;
      }
    }

    // Verify webhook signature if secret token is configured
    if (matchedAccount.webhookSecretToken) {
      const signature = req.headers["x-zm-signature"] as string;
      const timestamp = req.headers["x-zm-request-timestamp"] as string;
      
      if (!signature || !timestamp) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Missing signature headers");
        return true;
      }

      const isValid = verifyZoomWebhookSignature({
        payload: body,
        timestamp,
        signature,
        secretToken: matchedAccount.webhookSecretToken,
      });

      if (!isValid) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Invalid signature");
        return true;
      }
    }

    // Process chat message event
    if (event.event === "chat_message.sent") {
      await processZoomChatMessage({
        event,
        account: matchedAccount,
        cfg,
        runtime,
      });
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    runtime.log?.error?.(`Zoom webhook error: ${errorMsg}`);
    
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal error");
    return true;
  }
}

/**
 * Process incoming Zoom chat message
 */
async function processZoomChatMessage(params: {
  event: ZoomWebhookEvent;
  account: ResolvedZoomAccount;
  cfg: OpenClawConfig;
  runtime: any;
}): Promise<void> {
  const { event, account, cfg, runtime } = params;
  const payload = event.payload?.object;

  if (!payload) {
    return;
  }

  const messageText = payload.message || "";
  const senderJid = payload.user_jid || "";
  const senderName = payload.user_name || senderJid;
  const channelId = payload.channel_id;
  const channelName = payload.channel_name;
  const messageId = payload.id || "";
  const timestamp = payload.timestamp || Date.now();
  const replyToId = payload.reply_main_message_id;
  const replyToTimestamp = payload.reply_main_message_timestamp;

  // Ignore messages from the bot itself
  if (senderJid === account.botJid) {
    return;
  }

  // Determine if this is a DM or channel message
  const isDm = !channelId;
  const isChannel = Boolean(channelId);

  // Check permissions
  if (isDm) {
    const dmPolicy = account.config.dmPolicy || "pairing";
    
    if (dmPolicy === "deny") {
      logInboundDrop(runtime, "zoom", senderJid, "DM policy: deny");
      return;
    }
    
    if (dmPolicy === "allowlist") {
      const allowFrom = account.config.allowFrom || [];
      if (!isAllowedZoomSender({ senderJid, allowFrom })) {
        logInboundDrop(runtime, "zoom", senderJid, "Not in DM allowlist");
        return;
      }
    }
    
    // For pairing mode, let the SDK handle it
  }

  if (isChannel) {
    const groupPolicy = account.config.groupPolicy || "open";
    
    if (groupPolicy === "deny") {
      logInboundDrop(runtime, "zoom", channelId!, "Channel policy: deny");
      return;
    }
    
    if (groupPolicy === "allowlist") {
      const groupAllowFrom = account.config.groupAllowFrom || [];
      if (!groupAllowFrom.includes(channelId!)) {
        logInboundDrop(runtime, "zoom", channelId!, "Channel not in allowlist");
        return;
      }
    }

    // Check if bot mention is required
    if (account.config.requireMention) {
      const botMentioned = payload.at_items?.some(
        (item) => item.at_jid === account.botJid,
      );
      
      if (!botMentioned) {
        // Not mentioned, ignore
        return;
      }
    }
  }

  // Check control command gate
  const gateResult = await resolveControlCommandGate({
    cfg,
    runtime,
    channel: "zoom",
    accountId: account.accountId,
    fromId: senderJid,
    fromLabel: senderName,
    text: messageText,
    chatType: isDm ? "direct" : "channel",
  });

  if (!gateResult.allowed) {
    return;
  }

  // Build context for the agent
  const context: Record<string, any> = {
    Channel: "zoom",
    AccountId: account.accountId,
    From: senderJid,
    FromLabel: senderName,
    MessageId: messageId,
    Timestamp: timestamp,
  };

  if (isChannel) {
    context.ChannelId = channelId;
    context.ChannelName = channelName || channelId;
    context.ChatType = "channel";
    context.To = `channel:${channelId}`;
  } else {
    context.ChatType = "direct";
    context.To = senderJid;
  }

  if (replyToId) {
    context.ReplyToId = replyToId;
    context.ReplyToTimestamp = replyToTimestamp;
  }

  // Dispatch to agent
  await runtime.channel.dispatchInbound({
    channel: "zoom",
    accountId: account.accountId,
    fromId: senderJid,
    fromLabel: senderName,
    text: messageText,
    context,
    timestamp,
  });
}

/**
 * Start monitoring Zoom webhooks
 */
export async function monitorZoomProvider(
  options: ZoomMonitorOptions,
): Promise<void> {
  const { account, runtime, abortSignal, statusSink } = options;

  runtime.log?.(`[${account.accountId}] Zoom webhook monitor started`);

  // The actual HTTP handling is registered via registerHttpHandler
  // This function just keeps the monitor "alive" and handles cleanup
  return new Promise((resolve, reject) => {
    abortSignal.addEventListener("abort", () => {
      runtime.log?.(`[${account.accountId}] Zoom webhook monitor stopped`);
      resolve();
    });
  });
}
