/**
 * Zoom OAuth Authentication
 */

import type { ZoomOAuthTokenResponse } from "./types.js";

const tokenCache = new Map<
  string,
  { token: string; expiresAt: number }
>();

/**
 * Get OAuth access token for Zoom API calls
 */
export async function getZoomAccessToken(params: {
  clientId: string;
  clientSecret: string;
  accountId: string;
}): Promise<string> {
  const { clientId, clientSecret, accountId } = params;
  const cacheKey = `${accountId}:${clientId}`;

  // Check cache
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60000) {
    return cached.token;
  }

  // Request new token
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" + accountId, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Zoom OAuth failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as ZoomOAuthTokenResponse;
  const expiresAt = Date.now() + data.expires_in * 1000;

  tokenCache.set(cacheKey, {
    token: data.access_token,
    expiresAt,
  });

  return data.access_token;
}

/**
 * Clear token cache (useful for testing or after errors)
 */
export function clearZoomTokenCache(): void {
  tokenCache.clear();
}
