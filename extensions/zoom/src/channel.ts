/**
 * Zoom Team Chat Channel Plugin
 */

import type {
  ChannelPlugin,
  OpenClawConfig,
  ChannelAccountSnapshot,
} from "openclaw/plugin-sdk";
import {
  applyAccountNameToChannelSection,
  buildChannelConfigSchema,
  DEFAULT_ACCOUNT_ID,
  deleteAccountFromConfigSection,
  formatPairingApproveHint,
  migrateBaseNameToDefaultAccount,
  normalizeAccountId,
  PAIRING_APPROVED_MESSAGE,
  setAccountEnabledInConfigSection,
} from "openclaw/plugin-sdk";

import {
  listZoomAccountIds,
  resolveDefaultZoomAccountId,
  resolveZoomAccount,
  type ResolvedZoomAccount,
} from "./accounts.js";
import { ZoomConfigSchema } from "./config-schema.js";
import {
  looksLikeZoomTargetId,
  normalizeZoomMessagingTarget,
  formatZoomTargetDisplay,
} from "./targets.js";
import { sendZoomMessage, parseZoomTarget } from "./send.js";
import { probeZoom, type ZoomProbe } from "./probe.js";
import { zoomMessageActions } from "./actions.js";
import {
  handleZoomWebhookRequest,
  monitorZoomProvider,
  resolveWebhookPathFromConfig,
} from "./monitor.js";

const meta = {
  id: "zoom",
  label: "Zoom Team Chat",
  selectionLabel: "Zoom Team Chat",
  detailLabel: "Zoom Team Chat",
  docsPath: "/channels/zoom",
  docsLabel: "zoom",
  blurb: "Zoom Team Chat integration via Zoom Chat API and webhooks.",
  systemImage: "bubble.left.and.bubble.right",
  aliases: ["ztc"],
  order: 80,
};

export const zoomPlugin: ChannelPlugin<ResolvedZoomAccount> = {
  id: "zoom",
  meta,
  capabilities: {
    chatTypes: ["direct", "channel"],
    media: false, // Can be enabled when file upload is implemented
    reactions: false, // Not fully supported by Zoom API yet
    edit: true,
    unsend: true,
    reply: true,
    threads: false,
  },
  groups: {
    resolveRequireMention: ({ account }) =>
      account.config.requireMention ?? false,
    resolveToolPolicy: ({ account }) => {
      const policy = account.config.groupPolicy || "open";
      if (policy === "deny") return "deny";
      if (policy === "allowlist") return "allowlist";
      return "allow";
    },
  },
  threading: {
    buildToolContext: ({ context }) => ({
      currentChannelId: context.ChannelId ?? context.To,
      currentThreadTs: context.ReplyToId,
      hasRepliedRef: Boolean(context.ReplyToId),
    }),
  },
  reload: { configPrefixes: ["channels.zoom"] },
  configSchema: buildChannelConfigSchema(ZoomConfigSchema),
  config: {
    listAccountIds: (cfg) => listZoomAccountIds(cfg as OpenClawConfig),
    resolveAccount: (cfg, accountId) =>
      resolveZoomAccount({ cfg: cfg as OpenClawConfig, accountId }),
    defaultAccountId: (cfg) =>
      resolveDefaultZoomAccountId(cfg as OpenClawConfig),
    setAccountEnabled: ({ cfg, accountId, enabled }) =>
      setAccountEnabledInConfigSection({
        cfg: cfg as OpenClawConfig,
        sectionKey: "zoom",
        accountId,
        enabled,
        allowTopLevel: true,
      }),
    deleteAccount: ({ cfg, accountId }) =>
      deleteAccountFromConfigSection({
        cfg: cfg as OpenClawConfig,
        sectionKey: "zoom",
        accountId,
        clearBaseFields: [
          "clientId",
          "clientSecret",
          "accountId",
          "botJid",
          "verificationToken",
          "webhookSecretToken",
          "name",
        ],
      }),
    isConfigured: (account) => account.configured,
    describeAccount: (account): ChannelAccountSnapshot => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: account.configured,
      botJid: account.botJid ?? undefined,
    }),
    resolveAllowFrom: ({ cfg, accountId }) =>
      (resolveZoomAccount({ cfg: cfg as OpenClawConfig, accountId }).config
        .allowFrom ?? []).map((entry) => String(entry)),
    formatAllowFrom: ({ allowFrom }) =>
      allowFrom
        .map((entry) => String(entry).trim())
        .filter(Boolean)
        .map((entry) => entry.toLowerCase()),
  },
  actions: zoomMessageActions,
  security: {
    resolveDmPolicy: ({ cfg, accountId, account }) => {
      const resolvedAccountId =
        accountId ?? account.accountId ?? DEFAULT_ACCOUNT_ID;
      const useAccountPath = Boolean(
        (cfg as OpenClawConfig).channels?.zoom?.accounts?.[resolvedAccountId],
      );
      const basePath = useAccountPath
        ? `channels.zoom.accounts.${resolvedAccountId}.`
        : "channels.zoom.";
      return {
        policy: account.config.dmPolicy ?? "pairing",
        allowFrom: account.config.allowFrom ?? [],
        policyPath: `${basePath}dmPolicy`,
        allowFromPath: basePath,
        approveHint: formatPairingApproveHint("zoom"),
        normalizeEntry: (raw) =>
          raw.replace(/^zoom:/i, "").toLowerCase().trim(),
      };
    },
    collectWarnings: ({ account }) => {
      const groupPolicy = account.config.groupPolicy ?? "open";
      if (groupPolicy !== "open") return [];
      return [
        `- Zoom channels: groupPolicy="open" allows any channel member to trigger the bot. Set channels.zoom.groupPolicy="allowlist" + channels.zoom.groupAllowFrom to restrict channels.`,
      ];
    },
  },
  messaging: {
    normalizeTarget: normalizeZoomMessagingTarget,
    targetResolver: {
      looksLikeId: looksLikeZoomTargetId,
      hint: "<user_jid|channel:CHANNEL_ID>",
    },
    formatTargetDisplay: ({ target, display }) => {
      return formatZoomTargetDisplay({ target, display });
    },
  },
  setup: {
    resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
    applyAccountName: ({ cfg, accountId, name }) =>
      applyAccountNameToChannelSection({
        cfg: cfg as OpenClawConfig,
        channelKey: "zoom",
        accountId,
        name,
      }),
    validateInput: ({ input }) => {
      const required = [
        "clientId",
        "clientSecret",
        "accountId",
        "botJid",
        "verificationToken",
      ];
      const missing = required.filter((key) => !input[key]);
      if (missing.length > 0) {
        return `Zoom requires: ${missing.join(", ")}`;
      }
      return null;
    },
    applyAccountConfig: ({ cfg, accountId, input }) => {
      const namedConfig = applyAccountNameToChannelSection({
        cfg: cfg as OpenClawConfig,
        channelKey: "zoom",
        accountId,
        name: input.name,
      });
      const next =
        accountId !== DEFAULT_ACCOUNT_ID
          ? migrateBaseNameToDefaultAccount({
              cfg: namedConfig,
              channelKey: "zoom",
            })
          : namedConfig;

      if (accountId === DEFAULT_ACCOUNT_ID) {
        return {
          ...next,
          channels: {
            ...next.channels,
            zoom: {
              ...next.channels?.zoom,
              enabled: true,
              ...(input.clientId && { clientId: input.clientId }),
              ...(input.clientSecret && { clientSecret: input.clientSecret }),
              ...(input.accountId && { accountId: input.accountId }),
              ...(input.botJid && { botJid: input.botJid }),
              ...(input.verificationToken && {
                verificationToken: input.verificationToken,
              }),
              ...(input.webhookSecretToken && {
                webhookSecretToken: input.webhookSecretToken,
              }),
              ...(input.webhookPath && { webhookPath: input.webhookPath }),
            },
          },
        } as OpenClawConfig;
      }

      return {
        ...next,
        channels: {
          ...next.channels,
          zoom: {
            ...next.channels?.zoom,
            enabled: true,
            accounts: {
              ...(next.channels?.zoom?.accounts ?? {}),
              [accountId]: {
                ...(next.channels?.zoom?.accounts?.[accountId] ?? {}),
                enabled: true,
                ...(input.clientId && { clientId: input.clientId }),
                ...(input.clientSecret && {
                  clientSecret: input.clientSecret,
                }),
                ...(input.accountId && { accountId: input.accountId }),
                ...(input.botJid && { botJid: input.botJid }),
                ...(input.verificationToken && {
                  verificationToken: input.verificationToken,
                }),
                ...(input.webhookSecretToken && {
                  webhookSecretToken: input.webhookSecretToken,
                }),
                ...(input.webhookPath && { webhookPath: input.webhookPath }),
              },
            },
          },
        },
      } as OpenClawConfig;
    },
  },
  pairing: {
    idLabel: "zoomUserJid",
    normalizeAllowEntry: (entry) =>
      entry.replace(/^zoom:/i, "").toLowerCase().trim(),
    notifyApproval: async ({ cfg, id }) => {
      await sendZoomMessage(id, PAIRING_APPROVED_MESSAGE, {
        cfg: cfg as OpenClawConfig,
      });
    },
  },
  outbound: {
    deliveryMode: "direct",
    textChunkLimit: 4096,
    resolveTarget: ({ to }) => {
      const trimmed = to?.trim();
      if (!trimmed) {
        return {
          ok: false,
          error: new Error(
            "Delivering to Zoom requires --to <user_jid|channel:CHANNEL_ID>",
          ),
        };
      }
      return { ok: true, to: trimmed };
    },
    sendText: async ({ cfg, to, text, accountId, replyToId }) => {
      const result = await sendZoomMessage(to, text, {
        cfg: cfg as OpenClawConfig,
        accountId: accountId ?? undefined,
        replyToId: replyToId ?? undefined,
      });

      if (!result.ok) {
        return {
          channel: "zoom",
          ok: false,
          error: result.error || "Unknown error",
        };
      }

      return {
        channel: "zoom",
        ok: true,
        messageId: result.messageId,
        timestamp: result.timestamp,
      };
    },
  },
  status: {
    defaultRuntime: {
      accountId: DEFAULT_ACCOUNT_ID,
      running: false,
      lastStartAt: null,
      lastStopAt: null,
      lastError: null,
    },
    collectStatusIssues: ({ account }) => {
      const issues: string[] = [];
      if (!account.configured) {
        issues.push("Not configured - run `openclaw channel setup zoom`");
      }
      if (!account.enabled) {
        issues.push("Disabled in config");
      }
      return issues;
    },
    buildChannelSummary: ({ snapshot }) => ({
      configured: snapshot.configured ?? false,
      botJid: snapshot.botJid ?? null,
      running: snapshot.running ?? false,
      lastStartAt: snapshot.lastStartAt ?? null,
      lastStopAt: snapshot.lastStopAt ?? null,
      lastError: snapshot.lastError ?? null,
      probe: snapshot.probe,
      lastProbeAt: snapshot.lastProbeAt ?? null,
    }),
    probeAccount: async ({ account, timeoutMs }) =>
      probeZoom({
        clientId: account.clientId!,
        clientSecret: account.clientSecret!,
        accountId: account.zoomAccountId!,
        botJid: account.botJid!,
        timeoutMs,
      }),
    buildAccountSnapshot: ({ account, runtime, probe }) => {
      const running = runtime?.running ?? false;
      const probeOk = (probe as ZoomProbe | undefined)?.ok;
      return {
        accountId: account.accountId,
        name: account.name,
        enabled: account.enabled,
        configured: account.configured,
        botJid: account.botJid ?? null,
        running,
        connected: probeOk ?? running,
        lastStartAt: runtime?.lastStartAt ?? null,
        lastStopAt: runtime?.lastStopAt ?? null,
        lastError: runtime?.lastError ?? null,
        probe,
        lastInboundAt: runtime?.lastInboundAt ?? null,
        lastOutboundAt: runtime?.lastOutboundAt ?? null,
      };
    },
  },
  gateway: {
    startAccount: async (ctx) => {
      const account = ctx.account;
      const webhookPath = resolveWebhookPathFromConfig(account.config);
      ctx.setStatus({
        accountId: account.accountId,
        botJid: account.botJid ?? undefined,
      });
      ctx.log?.info(
        `[${account.accountId}] starting Zoom provider (webhook=${webhookPath})`,
      );
      return monitorZoomProvider({
        account,
        config: ctx.cfg as OpenClawConfig,
        runtime: ctx.runtime,
        abortSignal: ctx.abortSignal,
        statusSink: (patch) => ctx.setStatus({ accountId: ctx.accountId, ...patch }),
        webhookPath,
      });
    },
  },
};
