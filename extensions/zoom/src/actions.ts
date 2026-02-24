/**
 * Zoom Team Chat Message Actions
 */

import type { ChannelMessageAction } from "openclaw/plugin-sdk";
import { getZoomAccessToken } from "./auth.js";
import type { ResolvedZoomAccount } from "./accounts.js";

/**
 * Edit a Zoom chat message
 */
async function editZoomMessage(params: {
  account: ResolvedZoomAccount;
  messageId: string;
  newText: string;
}): Promise<{ ok: boolean; error?: string }> {
  const { account, messageId, newText } = params;

  try {
    const accessToken = await getZoomAccessToken({
      clientId: account.clientId!,
      clientSecret: account.clientSecret!,
      accountId: account.zoomAccountId!,
    });

    const response = await fetch(
      `https://api.zoom.us/v2/im/chat/messages/${messageId}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newText,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        ok: false,
        error: `Failed to edit message: ${response.status} ${errorText}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Delete a Zoom chat message
 */
async function deleteZoomMessage(params: {
  account: ResolvedZoomAccount;
  messageId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const { account, messageId } = params;

  try {
    const accessToken = await getZoomAccessToken({
      clientId: account.clientId!,
      clientSecret: account.clientSecret!,
      accountId: account.zoomAccountId!,
    });

    const response = await fetch(
      `https://api.zoom.us/v2/im/chat/messages/${messageId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        ok: false,
        error: `Failed to delete message: ${response.status} ${errorText}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * React to a Zoom chat message (if supported by API)
 */
async function reactToZoomMessage(params: {
  account: ResolvedZoomAccount;
  messageId: string;
  emoji: string;
}): Promise<{ ok: boolean; error?: string }> {
  // Note: As of current Zoom API docs, reactions may not be fully supported
  // This is a placeholder for future implementation
  return {
    ok: false,
    error: "Reactions not yet supported by Zoom Team Chat API",
  };
}

/**
 * Zoom message actions
 */
export const zoomMessageActions: ChannelMessageAction[] = [
  {
    name: "edit",
    description: "Edit a Zoom chat message",
    async execute(ctx) {
      const { account, messageId, text } = ctx as {
        account: ResolvedZoomAccount;
        messageId: string;
        text: string;
      };

      return editZoomMessage({
        account,
        messageId,
        newText: text,
      });
    },
  },
  {
    name: "delete",
    description: "Delete a Zoom chat message",
    async execute(ctx) {
      const { account, messageId } = ctx as {
        account: ResolvedZoomAccount;
        messageId: string;
      };

      return deleteZoomMessage({
        account,
        messageId,
      });
    },
  },
  {
    name: "react",
    description: "React to a Zoom chat message",
    async execute(ctx) {
      const { account, messageId, emoji } = ctx as {
        account: ResolvedZoomAccount;
        messageId: string;
        emoji: string;
      };

      return reactToZoomMessage({
        account,
        messageId,
        emoji,
      });
    },
  },
];
