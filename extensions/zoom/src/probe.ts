/**
 * Zoom Team Chat Connectivity Probe
 */

import { getZoomAccessToken } from "./auth.js";

export type ZoomProbe = {
  ok: boolean;
  error?: string;
  apiReachable?: boolean;
  authValid?: boolean;
  botInfo?: {
    jid?: string;
    accountId?: string;
  };
};

/**
 * Probe Zoom Team Chat connectivity and authentication
 */
export async function probeZoom(params: {
  clientId: string;
  clientSecret: string;
  accountId: string;
  botJid: string;
  timeoutMs?: number;
}): Promise<ZoomProbe> {
  const { clientId, clientSecret, accountId, botJid, timeoutMs = 10000 } = params;

  try {
    // Test OAuth authentication
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let accessToken: string;
    try {
      accessToken = await getZoomAccessToken({
        clientId,
        clientSecret,
        accountId,
      });
    } catch (error) {
      clearTimeout(timeout);
      return {
        ok: false,
        error: `Auth failed: ${error instanceof Error ? error.message : String(error)}`,
        apiReachable: true,
        authValid: false,
      };
    }

    clearTimeout(timeout);

    // Verify we can make an API call
    try {
      const response = await fetch("https://api.zoom.us/v2/users/me", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      if (response.ok) {
        return {
          ok: true,
          apiReachable: true,
          authValid: true,
          botInfo: {
            jid: botJid,
            accountId,
          },
        };
      }

      return {
        ok: false,
        error: `API call failed: ${response.status} ${response.statusText}`,
        apiReachable: true,
        authValid: response.status !== 401,
      };
    } catch (error) {
      return {
        ok: false,
        error: `API unreachable: ${error instanceof Error ? error.message : String(error)}`,
        apiReachable: false,
        authValid: true,
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
