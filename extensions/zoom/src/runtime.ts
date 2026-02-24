/**
 * Zoom Team Chat Plugin Runtime
 */

import type { OpenClawRuntime } from "openclaw/plugin-sdk";

let runtime: OpenClawRuntime | null = null;

export function setZoomRuntime(rt: OpenClawRuntime): void {
  runtime = rt;
}

export function getZoomRuntime(): OpenClawRuntime {
  if (!runtime) {
    throw new Error("Zoom runtime not initialized");
  }
  return runtime;
}
