/**
 * OpenClaw Zoom Team Chat Plugin
 * 
 * Integrates Zoom Team Chat as a channel for OpenClaw agents.
 * Supports webhooks for receiving messages and REST API for sending.
 */

import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

import { zoomPlugin } from "./src/channel.js";
import { handleZoomWebhookRequest } from "./src/monitor.js";
import { setZoomRuntime } from "./src/runtime.js";

const plugin = {
  id: "zoom",
  name: "Zoom Team Chat",
  description: "Zoom Team Chat channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setZoomRuntime(api.runtime);
    api.registerChannel({ plugin: zoomPlugin });
    api.registerHttpHandler(handleZoomWebhookRequest);
  },
};

export default plugin;
