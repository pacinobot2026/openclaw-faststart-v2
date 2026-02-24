/**
 * Zoom Team Chat Account Management
 */

import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk";
import type { ZoomAccountConfig } from "./types.js";

export type ResolvedZoomAccount = {
  accountId: string;
  name: string;
  enabled: boolean;
  configured: boolean;
  config: ZoomAccountConfig;
  clientId: string | null;
  clientSecret: string | null;
  zoomAccountId: string | null;
  botJid: string | null;
  verificationToken: string | null;
  webhookSecretToken: string | null;
};

export function listZoomAccountIds(cfg: OpenClawConfig): string[] {
  const accounts = cfg.channels?.zoom?.accounts;
  const baseEnabled = cfg.channels?.zoom?.enabled !== false;
  const hasBaseConfig =
    cfg.channels?.zoom?.clientId || cfg.channels?.zoom?.accountId || cfg.channels?.zoom?.botJid;

  const accountIds = new Set<string>();

  if (baseEnabled && hasBaseConfig) {
    accountIds.add(DEFAULT_ACCOUNT_ID);
  }

  if (accounts) {
    for (const accountId of Object.keys(accounts)) {
      accountIds.add(accountId);
    }
  }

  return Array.from(accountIds).sort();
}

export function resolveDefaultZoomAccountId(cfg: OpenClawConfig): string {
  const accountIds = listZoomAccountIds(cfg);
  return accountIds.length > 0 ? accountIds[0] : DEFAULT_ACCOUNT_ID;
}

export function resolveZoomAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedZoomAccount {
  const { cfg, accountId: requestedAccountId } = params;
  const accountId = requestedAccountId || resolveDefaultZoomAccountId(cfg);

  const baseConfig = cfg.channels?.zoom || {};
  const accountConfig =
    accountId !== DEFAULT_ACCOUNT_ID ? baseConfig.accounts?.[accountId] || {} : {};

  // Merge account-specific config with base config
  const config: ZoomAccountConfig =
    accountId !== DEFAULT_ACCOUNT_ID
      ? { ...baseConfig, ...accountConfig }
      : { ...baseConfig };

  const clientId = (config.clientId || "").trim() || null;
  const clientSecret = (config.clientSecret || "").trim() || null;
  const zoomAccountId = (config.accountId || "").trim() || null;
  const botJid = (config.botJid || "").trim() || null;
  const verificationToken = (config.verificationToken || "").trim() || null;
  const webhookSecretToken = (config.webhookSecretToken || "").trim() || null;

  const configured = Boolean(
    clientId && clientSecret && zoomAccountId && botJid && verificationToken,
  );

  const enabled = config.enabled !== false;
  const name = config.name || accountId;

  return {
    accountId,
    name,
    enabled,
    configured,
    config,
    clientId,
    clientSecret,
    zoomAccountId,
    botJid,
    verificationToken,
    webhookSecretToken,
  };
}
