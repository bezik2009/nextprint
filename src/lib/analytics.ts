/**
 * analytics.ts — Google Analytics 4 helpers
 *
 * Uses window.gtag injected by the GA script in layout.tsx.
 * All functions are safe to call even when GA is not loaded —
 * they degrade silently without throwing.
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local to enable.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

const IS_DEV = process.env.NODE_ENV === "development";

/** Send a page view. Call on route change if using a custom router. */
export function pageview(url: string): void {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

/** Send a custom event. Safe to call from any client component. */
export function event(
  action: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.debug("[tracking]", action, params ?? {});
  }
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

// Extend the Window interface so TypeScript knows about gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
