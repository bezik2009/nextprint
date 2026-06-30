/**
 * tracking.ts — DEPRECATED, kept for backward compatibility.
 *
 * All tracking logic now lives in lib/analytics.ts (single source of truth).
 * This file re-exports the same functions under their old names so existing
 * call sites (components written before the analytics.ts consolidation)
 * keep working without modification.
 *
 * New code should import directly from "@/lib/analytics".
 */

import {
  trackCTA,
  trackModalOpen,
  trackQuoteStarted,
  trackStepView as _trackStepView,
  trackStepCompleted as _trackStepCompleted,
  trackFileAttached,
  trackFileRemoved,
  trackSubmitClick,
  trackSubmit,
  trackLead,
  trackSubmitError,
  trackAbandon,
  trackTelegramSuccess,
  trackEmailSuccess,
  stepNameFor,
  event,
} from "./analytics";

/** @deprecated import { event } from "@/lib/analytics" and call directly */
export const track = event;

/** @deprecated use trackCTA({ location }) from "@/lib/analytics" */
export const trackMainCtaClick = (location: string) => trackCTA({ location });

export { trackModalOpen, trackQuoteStarted, trackFileAttached, trackFileRemoved, trackSubmitClick };

/** @deprecated use trackStepView({ stepNumber, stepName }) from "@/lib/analytics" */
export const trackStepView = (step: number) =>
  _trackStepView({ stepNumber: step, stepName: stepNameFor(step) });

/** @deprecated use trackStepCompleted({ stepNumber, stepName }) from "@/lib/analytics" */
export const trackStepCompleted = (step: number) =>
  _trackStepCompleted({ stepNumber: step, stepName: stepNameFor(step) });

/** @deprecated use trackSubmit(...) from "@/lib/analytics" — now requires duration/steps */
export const trackSubmitSuccess = (params: {
  requestIdPresent: boolean;
  hasFile: boolean;
  fileCount: number;
}) =>
  trackSubmit({ ...params, durationSeconds: 0, stepsCompleted: 0 });

export { trackSubmitError, trackAbandon };

/** @deprecated use trackLead(...) from "@/lib/analytics" */
export const trackGenerateLead = () =>
  trackLead({
    orderType: "unknown",
    fileType: "unknown",
    quantityBucket: "unknown",
    urgency: "unknown",
    purpose: "unknown",
    hasComment: false,
    hasAttachment: false,
  });

/** @deprecated use trackTelegramSuccess() from "@/lib/analytics" */
export const trackTelegramOk = trackTelegramSuccess;
/** @deprecated use trackEmailSuccess() from "@/lib/analytics" */
export const trackEmailOk = trackEmailSuccess;

export const STEP_NAMES: Record<number, string> = {
  1: "order_type",
  2: "file_upload",
  3: "order_details",
  4: "contacts",
  5: "review",
};
