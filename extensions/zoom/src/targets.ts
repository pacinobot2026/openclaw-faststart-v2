/**
 * Zoom Team Chat Target Resolution
 */

/**
 * Check if a string looks like a Zoom target ID
 */
export function looksLikeZoomTargetId(value: string): boolean {
  const trimmed = value.trim();
  
  // Channel ID format
  if (trimmed.startsWith("channel:")) {
    return true;
  }
  
  // JID format (user@xmpp.zoom.us)
  if (trimmed.includes("@") && trimmed.includes("zoom.us")) {
    return true;
  }
  
  // UUID-like format
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(trimmed)) {
    return true;
  }
  
  return false;
}

/**
 * Normalize Zoom messaging target
 */
export function normalizeZoomMessagingTarget(target: string): string {
  const trimmed = target.trim();
  
  // Remove zoom: prefix if present
  const cleaned = trimmed.replace(/^zoom:/i, "");
  
  // Preserve channel: prefix
  if (cleaned.startsWith("channel:")) {
    return cleaned;
  }
  
  return cleaned;
}

/**
 * Format target display name
 */
export function formatZoomTargetDisplay(params: {
  target: string;
  display?: string;
}): string {
  const { target, display } = params;
  
  if (display?.trim()) {
    return display.trim();
  }
  
  // Try to extract a readable name from the target
  if (target.startsWith("channel:")) {
    return target.replace("channel:", "");
  }
  
  // For JIDs, extract the username part
  if (target.includes("@")) {
    const username = target.split("@")[0];
    return username || target;
  }
  
  return target;
}

/**
 * Check if sender is allowed based on policy
 */
export function isAllowedZoomSender(params: {
  senderJid: string;
  allowFrom: string[];
  normalize?: boolean;
}): boolean {
  const { senderJid, allowFrom, normalize = true } = params;
  
  const normalizedSender = normalize ? senderJid.toLowerCase().trim() : senderJid;
  
  return allowFrom.some((allowed) => {
    const normalizedAllowed = normalize ? allowed.toLowerCase().trim() : allowed;
    
    // Exact match
    if (normalizedSender === normalizedAllowed) {
      return true;
    }
    
    // JID partial match (user part only)
    if (normalizedSender.includes("@") && normalizedAllowed.includes("@")) {
      const senderUser = normalizedSender.split("@")[0];
      const allowedUser = normalizedAllowed.split("@")[0];
      if (senderUser === allowedUser) {
        return true;
      }
    }
    
    return false;
  });
}
