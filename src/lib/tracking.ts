/**
 * tracking.ts — Conversion tracking for NextPrint Quote Wizard
 *
 * Rules:
 * - Client-side only. Never call from server/API routes.
 * - No await — tracking never blocks UX.
 * - No personal data: no email, phone, name, company, filename, comment, requestId.
 * - If GA unavailable — silently no-op.
 * - Errors are swallowed so tracking never breaks the product.
 */

import { event } from "./analytics";

/** Safe wrapper — swallows all errors */
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

/* ── Step name map ───────────────────────────────────────────────────────── */

export const STEP_NAMES: Record<number, string> = {
  1: "production_type",
  2: "model_or_file",
  3: "order_details",
  4: "contacts",
  5: "review",
};

/* ── CTA / modal ─────────────────────────────────────────────────────────── */

/**
 * User clicked a CTA button to open the wizard.
 * location: "hero" | "capabilities" | "contacts" | "portfolio" | other
 */
export const trackMainCtaClick = (location: string) =>
  track("main_cta_click", { location });

/** Wizard modal opened */
export const trackModalOpen = (source = "cta") =>
  track("quote_modal_open", { source });

/** First meaningful action — production type selected, step 1 → 2 */
export const trackQuoteStarted = () => track("quote_started");

/* ── Step events ─────────────────────────────────────────────────────────── */

/** User views a wizard step (fire once per step, not on re-render) */
export const trackStepView = (step: number) =>
  track("quote_step_view", {
    step,
    step_name: STEP_NAMES[step] ?? `step_${step}`,
  });

/** User successfully completed a step (pressed Далі and validation passed) */
export const trackStepCompleted = (step: number) =>
  track("quote_step_completed", {
    step,
    step_name: STEP_NAMES[step] ?? `step_${step}`,
  });

/* ── File events ─────────────────────────────────────────────────────────── */

type FileType = "stl" | "step" | "3mf" | "pdf" | "image" | "mixed" | "other";

function classifyFileType(files: Array<{ name: string; type: string }>): FileType {
  if (files.length === 0) return "other";
  const exts = files.map((f) => f.name.split(".").pop()?.toLowerCase() ?? "");
  const types = new Set(
    exts.map((e) => {
      if (e === "stl") return "stl";
      if (e === "step" || e === "stp") return "step";
      if (e === "3mf") return "3mf";
      if (e === "pdf") return "pdf";
      if (e === "png" || e === "jpg" || e === "jpeg") return "image";
      return "other";
    })
  );
  if (types.size > 1) return "mixed";
  return [...types][0] as FileType;
}

/** User attached one or more files */
export function trackFileAttached(
  files: Array<{ name: string; size: number; type: string }>,
): void {
  const totalMb = files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024);
  track("quote_file_attached", {
    file_count:    files.length,
    total_size_mb: Math.round(totalMb * 10) / 10,
    file_type:     classifyFileType(files),
  });
}

/** User removed a file */
export const trackFileRemoved = (remainingCount: number) =>
  track("quote_file_removed", { remaining_file_count: remainingCount });

/* ── Submit events ───────────────────────────────────────────────────────── */

/** User clicked "Надіслати заявку" */
export function trackSubmitClick(params: {
  hasFile: boolean;
  fileCount: number;
  productionType: string;
  deadline: string;
}): void {
  track("quote_submit_click", {
    has_file:        params.hasFile,
    file_count:      params.fileCount,
    production_type: params.productionType,
    deadline:        params.deadline,
  });
}

/** API returned success */
export function trackSubmitSuccess(params: {
  requestIdPresent: boolean;
  hasFile: boolean;
  fileCount: number;
}): void {
  track("quote_submit_success", {
    request_id_present: params.requestIdPresent,
    has_file:           params.hasFile,
    file_count:         params.fileCount,
  });
}

/** Standard GA4 conversion event — fire only on success */
export const trackGenerateLead = () =>
  track("generate_lead", { currency: "UAH", value: 1 });

type ErrorType = "validation" | "network" | "server" | "timeout" | "unknown";

/** Submit failed */
export function trackSubmitError(errorType: ErrorType, step: number): void {
  track("quote_submit_error", { error_type: errorType, step });
}

/* ── Legacy aliases — kept for backward compat with existing call sites ──── */

/** @deprecated Use trackSubmitClick + trackSubmitSuccess + trackGenerateLead */
export const trackSubmitted  = () => track("quote_submitted");
/** @deprecated Use trackModalOpen */
export const trackTelegramOk = () => track("telegram_success");
/** @deprecated Use trackModalOpen */
export const trackEmailOk    = () => track("email_success");
/** @deprecated Use trackStepCompleted */
export const trackStep = (step: 2 | 3 | 4 | 5) =>
  track(`quote_step_${step}`);
