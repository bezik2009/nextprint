/**
 * tracking.ts — Conversion tracking events for NextPrint Quote Wizard
 *
 * All calls are fire-and-forget. If GA is unavailable the form works normally.
 * Add new events here; never inline gtag() calls in components.
 */

import { event } from "./analytics";

/**
 * Generic tracking entry point.
 * Keeps call sites clean: track("quote_submitted")
 */
export function track(
  action: string,
  params?: Record<string, string | number | boolean>,
): void {
  try {
    event(action, params);
  } catch {
    // Analytics must never break the product
  }
}

/* ── Named wizard events ─────────────────────────────────────────────────── */

/** User opened the Quote Wizard modal */
export const trackModalOpen    = () => track("contact_modal_open");

/** User selected production type on Step 1 — wizard started */
export const trackQuoteStarted = () => track("quote_started");

/** User advanced to step N */
export const trackStep = (step: 2 | 3 | 4 | 5) =>
  track(`quote_step_${step}`);

/** User pressed "Надіслати заявку" */
export const trackSubmitted    = () => track("quote_submitted");

/** API confirmed Telegram delivery */
export const trackTelegramOk   = () => track("telegram_success");

/** API confirmed email delivery (Resend responded 2xx) */
export const trackEmailOk      = () => track("email_success");
