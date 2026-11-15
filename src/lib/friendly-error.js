// Server functions mark limit errors with a "RATE_LIMITED:" prefix whose message is safe to
// show; anything else gets the page's generic fallback.
export function friendlyError(error, fallback) {
  const message = String(error?.message || "");
  const marker = message.indexOf("RATE_LIMITED:");
  return marker === -1 ? fallback : message.slice(marker + "RATE_LIMITED:".length).trim();
}
