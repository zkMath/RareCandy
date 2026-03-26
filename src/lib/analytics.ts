import posthog from "posthog-js";

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(event, properties);
  }
}

// Auth events
export function trackWalletConnected(address: string, walletType: string) {
  trackEvent("wallet_connected", { address: address.slice(0, 10), walletType });
}

export function trackWalletDisconnected() {
  trackEvent("wallet_disconnected");
}

// Pull events
export function trackPullInitiated(pullCount: number) {
  trackEvent("pull_initiated", { pullCount });
}

export function trackPullCompleted(tokenId: string, tier: number, fmvUsd: number) {
  trackEvent("pull_completed", { tokenId, tier, fmvUsd });
}

// Buyback events
export function trackBuybackExecuted(tokenId: string, amountUsd: number) {
  trackEvent("buyback_executed", { tokenId, amountUsd });
}

// Marketplace events
export function trackCardListed(tokenId: string, priceUsd: number) {
  trackEvent("card_listed", { tokenId, priceUsd });
}

export function trackCardPurchased(tokenId: string, priceUsd: number) {
  trackEvent("card_purchased", { tokenId, priceUsd });
}

// Redemption events
export function trackRedemptionStarted(tokenId: string) {
  trackEvent("redemption_started", { tokenId });
}

export function trackRedemptionCompleted(tokenId: string) {
  trackEvent("redemption_completed", { tokenId });
}

// Page views
export function trackPageView(page: string) {
  trackEvent("$pageview", { page });
}
