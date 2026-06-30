/**
 * analytics.ts — Google Analytics 4 integration for NextPrint
 *
 * Single source of truth for all GA4 tracking. No other file should call
 * window.gtag directly or duplicate event-sending logic.
 *
 * Rules:
 * - Client-side only. Never call from server/API routes.
 * - Fire-and-forget — never await, never block UX.
 * - No personal data: no name, email, phone, comment text, requestId, filenames.
 * - If GA is unavailable, every function silently no-ops.
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local to enable GA4.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

const IS_DEV = process.env.NODE_ENV === "development";

/* ═══════════════════════════════════════════════════════════════════════════
   Low-level gtag wrapper — the ONLY place that touches window.gtag
═══════════════════════════════════════════════════════════════════════════ */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/** Send a page view. Call on route change if using a custom router. */
export function pageview(url: string): void {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

type EventParams = Record<string, string | number | boolean>;

/**
 * Low-level event sender. Prefer the named track* functions below —
 * this is exported only for the legacy tracking.ts shim.
 */
export function event(action: string, params?: EventParams): void {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", action, params ?? {});
  }
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

/** Safe wrapper — swallows all errors so analytics never breaks the product. */
function safeTrack(action: string, params?: EventParams): void {
  try {
    event(action, params);
  } catch {
    // Analytics must never throw into product code
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════════════════════════ */

/** A wizard step identified by both its number and a stable machine name. */
export interface AnalyticsStep {
  stepNumber: number;
  stepName: string;
}

/** CTA click attribution — where on the site the click originated. */
export interface AnalyticsCTA {
  location:
    | "hero"
    | "header"
    | "footer"
    | "sticky_button"
    | "mobile_menu"
    | "capabilities"
    | "contacts"
    | "portfolio"
    | string;
}

/** Safe, non-personal snapshot of a submitted lead for generate_lead. */
export interface AnalyticsLead {
  orderType: string;
  fileType: string;
  quantityBucket: string;
  urgency: string;
  purpose: string;
  hasComment: boolean;
  hasAttachment: boolean;
}

type ErrorType = "validation" | "network" | "server" | "timeout" | "unknown";

/* ═══════════════════════════════════════════════════════════════════════════
   Step name map — single source of truth for step_name across all events
═══════════════════════════════════════════════════════════════════════════ */

export const STEP_NAMES: Record<number, string> = {
  1: "order_type",
  2: "file_upload",
  3: "order_details",
  4: "contacts",
  5: "review",
};

export function stepNameFor(stepNumber: number): string {
  return STEP_NAMES[stepNumber] ?? `step_${stepNumber}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Named tracking functions — one per GA4 event
   Event names below are FROZEN for backward compatibility with existing
   GA4 reports. Only payloads are enriched.
═══════════════════════════════════════════════════════════════════════════ */

/** main_cta_click — user clicked a button that opens the Quote Wizard */
export function trackCTA(cta: AnalyticsCTA): void {
  safeTrack("main_cta_click", { location: cta.location });
}

/** quote_modal_open — wizard modal became visible */
export function trackModalOpen(source = "cta"): void {
  safeTrack("quote_modal_open", { source });
}

/** quote_started — first meaningful action inside the wizard (step 1 completed) */
export function trackQuoteStarted(): void {
  safeTrack("quote_started");
}

/** quote_step_view — user is shown a step (fire once per step change) */
export function trackStepView(step: AnalyticsStep): void {
  safeTrack("quote_step_view", {
    step_number: step.stepNumber,
    step_name: step.stepName,
  });
}

/** quote_step_completed — user pressed "Далі" and validation passed */
export function trackStepCompleted(step: AnalyticsStep): void {
  safeTrack("quote_step_completed", {
    step_number: step.stepNumber,
    step_name: step.stepName,
  });
}

/* ── File events ─────────────────────────────────────────────────────────── */

type FileCategory = "stl" | "step" | "3mf" | "pdf" | "image" | "mixed" | "other";

function classifyFileType(files: Array<{ name: string }>): FileCategory {
  if (files.length === 0) return "other";
  const exts = files.map((f) => f.name.split(".").pop()?.toLowerCase() ?? "");
  const categories = new Set<FileCategory>(
    exts.map((e): FileCategory => {
      if (e === "stl") return "stl";
      if (e === "step" || e === "stp") return "step";
      if (e === "3mf") return "3mf";
      if (e === "pdf") return "pdf";
      if (e === "png" || e === "jpg" || e === "jpeg") return "image";
      return "other";
    }),
  );
  if (categories.size > 1) return "mixed";
  return [...categories][0];
}

/** quote_file_attached — user attached one or more files */
export function trackFileAttached(files: Array<{ name: string; size: number }>): void {
  const totalMb = files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024);
  safeTrack("quote_file_attached", {
    file_count: files.length,
    total_size_mb: Math.round(totalMb * 10) / 10,
    file_type: classifyFileType(files),
  });
}

/** quote_file_removed — user removed a previously attached file */
export function trackFileRemoved(remainingCount: number): void {
  safeTrack("quote_file_removed", { remaining_file_count: remainingCount });
}

/* ── Submit funnel ───────────────────────────────────────────────────────── */

/** quote_submit_click — user pressed "Надіслати заявку" */
export function trackSubmitClick(params: {
  hasFile: boolean;
  fileCount: number;
  productionType: string;
  deadline: string;
}): void {
  safeTrack("quote_submit_click", {
    has_file: params.hasFile,
    file_count: params.fileCount,
    production_type: params.productionType,
    deadline: params.deadline,
  });
}

/**
 * quote_submit_success — API confirmed the lead was accepted.
 * duration_seconds / steps_completed let you analyze time-in-wizard.
 */
export function trackSubmit(params: {
  requestIdPresent: boolean;
  hasFile: boolean;
  fileCount: number;
  durationSeconds: number;
  stepsCompleted: number;
}): void {
  safeTrack("quote_submit_success", {
    request_id_present: params.requestIdPresent,
    has_file: params.hasFile,
    file_count: params.fileCount,
    duration_seconds: Math.round(params.durationSeconds),
    steps_completed: params.stepsCompleted,
  });
}

/**
 * generate_lead — standard GA4 recommended conversion event.
 * Fire only once, immediately after a successful submit.
 * Enriched with safe, non-personal order attributes for funnel segmentation.
 */
export function trackLead(lead: AnalyticsLead): void {
  safeTrack("generate_lead", {
    currency: "UAH",
    value: 1,
    order_type: lead.orderType,
    file_type: lead.fileType,
    quantity_bucket: lead.quantityBucket,
    urgency: lead.urgency,
    purpose: lead.purpose,
    has_comment: lead.hasComment,
    has_attachment: lead.hasAttachment,
  });
}

/** quote_submit_error — submit failed (network, server, validation, timeout) */
export function trackSubmitError(errorType: ErrorType, step: number): void {
  safeTrack("quote_submit_error", { error_type: errorType, step });
}

/* ── Abandonment ─────────────────────────────────────────────────────────── */

/**
 * quote_abandon — user closed the wizard before submitting.
 * Call once per wizard session; the caller is responsible for the "fire once"
 * guard (WizardContext tracks this via a ref).
 */
export function trackAbandon(params: { lastStep: number; timeSpentSeconds: number }): void {
  safeTrack("quote_abandon", {
    last_step: params.lastStep,
    time_spent_seconds: Math.round(params.timeSpentSeconds),
  });
}

/* ── Channel delivery confirmation ───────────────────────────────────────── */

/** telegram_success — Telegram delivery confirmed by the API response */
export function trackTelegramSuccess(): void {
  safeTrack("telegram_success");
}

/** email_success — email delivery confirmed by the API response */
export function trackEmailSuccess(): void {
  safeTrack("email_success");
}
