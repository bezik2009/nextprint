"use client";

import { useEffect, useRef, useState } from "react";
import { useWizard } from "./WizardContext";
import { TOTAL_STEPS } from "./types";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
} from "./WizardSteps";

/* ── Progress bar ───────────────────────────────────────────────────────── */
function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);
  return (
    <div className="wz-progress" aria-label={`Крок ${step} із ${TOTAL_STEPS}`}>
      <div className="wz-progress-text">
        <span className="wz-progress-step">
          Крок {step} із {TOTAL_STEPS}
        </span>
      </div>
      <div className="wz-progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="wz-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Confirm close dialog ───────────────────────────────────────────────── */
function ConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="wz-confirm-overlay" role="dialog" aria-modal="true" aria-label="Закрити форму?">
      <div className="wz-confirm-card">
        <h3 className="wz-confirm-title">Закрити форму?</h3>
        <p className="wz-confirm-body">Введені дані буде збережено. Ви зможете продовжити пізніше.</p>
        <div className="wz-confirm-actions">
          <button type="button" onClick={onCancel} className="wz-btn wz-btn--outline">
            Повернутися
          </button>
          <button type="button" onClick={onConfirm} className="wz-btn wz-btn--ghost">
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Success screen ─────────────────────────────────────────────────────── */
function SuccessScreen({ onClose, onReset }: { onClose: () => void; onReset: () => void }) {
  return (
    <div className="wz-success">
      <div className="wz-success-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="#F5C400" strokeWidth="2" />
          <path d="M14 24L20.5 30.5L34 17" stroke="#F5C400" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="wz-success-title">🎉 Дякуємо!</h3>
      <p className="wz-success-body">
        Вашу заявку успішно отримано. Наш інженер вже почав її опрацьовувати.
      </p>
      <p className="wz-success-body" style={{ marginTop: 8 }}>
        Якщо ви прикріпили модель — ми попередньо її переглянемо ще до дзвінка.
      </p>
      <p className="wz-success-hint">
        Зазвичай ми відповідаємо протягом 1 робочого дня.
      </p>
      <div className="wz-success-actions">
        <button type="button" onClick={onClose} className="wz-btn wz-btn--primary">
          Повернутися на сайт
        </button>
        <button type="button" onClick={onReset} className="wz-btn wz-btn--outline">
          Створити ще одну заявку
        </button>
      </div>
    </div>
  );
}

import { validateEmail, validatePhone } from "./validation";
import type { ContactErrors } from "./types";
import {
  trackQuoteStarted,
  trackStepView,
  trackStepCompleted,
  trackSubmitClick,
  trackSubmitSuccess,
  trackSubmitError,
  trackGenerateLead,
  trackTelegramOk,
  trackEmailOk,
} from "@/lib/tracking";

function validateStep(
  step: number,
  data: ReturnType<typeof useWizard>["data"]
): { valid: boolean; contactErrors?: ContactErrors } {
  switch (step) {
    case 1: return { valid: !!data.step1_productionType };
    case 2: return { valid: data.step2_fileFormat !== "" }; // yes or no — either is valid
    case 3: return {
      valid:
        !!data.step3_quantity &&
        Number(data.step3_quantity) >= 1 &&
        !!data.step5_useCase &&
        !!data.step7_deadline,
    };
    case 4: {
      const c = data.step9_contact;
      const errors: ContactErrors = {};

      if (!c.name.trim() || c.name.trim().length < 2) {
        errors.name = "Вкажіть імʼя";
      }

      // Phone is required in new flow
      const phoneFilled = c.phone.trim().length > 0;
      if (!phoneFilled) {
        errors.phone = "Вкажіть телефон";
      } else if (!validatePhone(c.phone)) {
        errors.phone = "Вкажіть коректний номер телефону";
      }

      // Email optional but validated if filled
      const emailFilled = c.email.trim().length > 0;
      if (emailFilled && !validateEmail(c.email)) {
        errors.email = "Вкажіть коректний email";
      }

      return { valid: Object.keys(errors).length === 0, contactErrors: errors };
    }
    default: return { valid: true };
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   QuoteWizard — modal shell
════════════════════════════════════════════════════════════════════════════ */
export function QuoteWizard() {
  const {
    isOpen,
    step,
    data,
    requestClose,
    confirmClose,
    cancelClose,
    showConfirm,
    goNext,
    goBack,
    setStep,
    updateData,
    submitted,
    setSubmitted,
    resetWizard,
    close,
  } = useWizard();

  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting]  = useState(false);
  const [submitError,  setSubmitError]   = useState<string | null>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  /** Real File objects — never persisted to localStorage, lives only in memory */
  const fileStore   = useRef<File[]>([]);

  /* Focus trap */
  useEffect(() => {
    if (!isOpen) return;
    const el = contentRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, [isOpen, step]);

  /* Reset validation highlight on step change */
  useEffect(() => { setShowValidation(false); }, [step]);

  /* Track step view — fires once per step change, not on re-render */
  useEffect(() => {
    if (isOpen && !submitted) trackStepView(step);
  }, [step, isOpen, submitted]);

  if (!isOpen) return null;

  /** Normalise contact fields (trim, lowercase email) before advancing */
  const normaliseContacts = () => {
    const c = data.step9_contact;
    updateData({
      step9_contact: {
        name:    c.name.trim(),
        company: c.company.trim(),
        email:   c.email.trim().toLowerCase(),
        phone:   c.phone.trim(),
        comment: c.comment.trim(),
      },
    });
  };

  /** Send wizard data + real files to the backend endpoint. */
  const handleSubmitQuote = async () => {
    // Safety re-validation before network call
    const { valid: contactsOk, contactErrors: errs } = validateStep(4, data);
    if (!contactsOk) {
      setShowValidation(true);
      if (errs) setContactErrors(errs);
      setStep(4);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 30_000); // 30s — files may be large

    try {
      // Build FormData — browser sets multipart/form-data + boundary automatically
      const form = new FormData();

      // Payload as JSON string field
      form.append("payload", JSON.stringify({
        step1_productionType: data.step1_productionType,
        step2_fileFormat:     data.step2_fileFormat,
        step3_quantity:       data.step3_quantity,
        step4_size:           data.step4_size,
        step4_sizePreset:     data.step4_sizePreset,
        step5_useCase:        data.step5_useCase,
        step5_useCaseOther:   data.step5_useCaseOther,
        step6_material:       data.step6_material,
        step7_deadline:       data.step7_deadline,
        step9_contact:        data.step9_contact,
        _hp:                  honeypotRef.current?.value ?? "",
      }));

      // Append real File objects (capped server-side too)
      for (const file of fileStore.current) {
        form.append("files", file, file.name);
      }

      const res = await fetch("/api/send-telegram", {
        method: "POST",
        // Do NOT set Content-Type — browser must set multipart + boundary
        signal: controller.signal,
        body:   form,
      });

      clearTimeout(timeoutId);

      const json = (await res.json()) as { success: boolean; error?: string };

      if (!res.ok || !json.success) {
        if (res.status === 429) {
          throw new Error("rate-limited");
        }
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }

      // Success — clear draft and real files
      fileStore.current = [];
      setSubmitted(true);

      // Granular success tracking
      const fileCount = data.step8_files.length;
      trackSubmitSuccess({
        requestIdPresent: !!("requestId" in json),
        hasFile:          fileCount > 0,
        fileCount,
      });
      trackGenerateLead();
      // Legacy channel events (both channels attempted on success)
      trackTelegramOk();
      trackEmailOk();
    } catch (err) {
      clearTimeout(timeoutId);
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[QuoteWizard] Submit failed:", msg);

      // Classify error type for tracking — no personal data
      const errorType =
        msg === "rate-limited"         ? "server"
        : err instanceof Error && err.name === "AbortError" ? "timeout"
        : msg.startsWith("HTTP")       ? "server"
        : "network";
      trackSubmitError(errorType, step);

      setSubmitError(
        msg === "rate-limited"
          ? "Забагато заявок за короткий час. Спробуйте трохи пізніше або напишіть нам на office@nextprint.com.ua"
          : "Не вдалося надіслати заявку. Спробуйте ще раз або напишіть нам на office@nextprint.com.ua"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    // Normalise contacts before validation when leaving step 4
    if (step === 4) normaliseContacts();

    const { valid, contactErrors: errs } = validateStep(step, data);
    if (!valid) {
      setShowValidation(true);
      if (errs) setContactErrors(errs);
      return;
    }
    setContactErrors({});

    if (step === TOTAL_STEPS) {
      // Track submit click with safe params before calling API
      trackSubmitClick({
        hasFile:        data.step8_files.length > 0,
        fileCount:      data.step8_files.length,
        productionType: data.step1_productionType,
        deadline:       data.step7_deadline,
      });
      void handleSubmitQuote();
      return;
    }

    // Track step completed (fires before goNext so step number is still current)
    if (step === 1) trackQuoteStarted();
    trackStepCompleted(step);

    goNext();
  };

  // Enter key on Step 9 text inputs (not textarea) advances the wizard
  const handleStep4KeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
      handleNext();
    }
  };

  /* Click outside to close */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) requestClose();
  };

  const isPreviewStep = step === TOTAL_STEPS;
  const { valid: canProceed } = validateStep(step, data);

  // Step 10 safety: re-validate contacts in case of a stale localStorage draft
  const { valid: contactsValid } = step === TOTAL_STEPS
    ? validateStep(4, data)
    : { valid: true };

  return (
    <div
      ref={overlayRef}
      className="wz-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Отримати розрахунок"
    >
      <div ref={contentRef} className="wz-modal">
        {/* Header */}
        <div className="wz-modal-header">
          <span className="wz-modal-brand">NextPrint</span>
          <button
            type="button"
            onClick={requestClose}
            className="wz-close"
            aria-label="Закрити"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <SuccessScreen
            onClose={close}
            onReset={() => { resetWizard(); }}
          />
        ) : (
          <>
            {/* Progress */}
            <div className="wz-modal-progress">
              <ProgressBar step={step} />
            </div>

            {/* Honeypot — visually hidden, never shown to users */}
            <input
              ref={honeypotRef}
              type="text"
              name="companyWebsiteTrap"
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
              style={{ position: "absolute", left: "-9999px", width: "1px",
                       height: "1px", opacity: 0, pointerEvents: "none" }}
            />

            {/* Step content */}
            <div className="wz-modal-body">
              {step === 1 && (
                <Step1
                  data={data}
                  update={updateData}
                  onAutoAdvance={goNext}
                />
              )}
              {step === 2 && (
                <Step2
                  data={data}
                  update={updateData}
                  onFilesChange={(files) => { fileStore.current = files; }}
                  onAutoAdvance={goNext}
                />
              )}
              {step === 3 && <Step3 data={data} update={updateData} />}
              {step === 4 && (
                <Step4
                  data={data}
                  update={updateData}
                  errors={showValidation ? contactErrors : {}}
                  onKeyDown={handleStep4KeyDown}
                  onFieldChange={(field) => {
                    if (!showValidation) return;
                    setContactErrors((prev) => {
                      const next = { ...prev };
                      delete next[field as keyof typeof next];
                      delete next._contact;
                      return next;
                    });
                  }}
                />
              )}
              {step === 5 && (
                <Step5
                  data={data}
                  contactsValid={contactsValid}
                  submitError={submitError}
                  onEdit={(s) => setStep(s)}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="wz-modal-footer">
              <div className="wz-nav">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1}
                  className="wz-btn wz-btn--outline"
                  aria-label="Назад"
                >
                  ← Назад
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={(isPreviewStep && !contactsValid) || isSubmitting}
                  className={`wz-btn wz-btn--primary${(!canProceed && showValidation) || (isPreviewStep && !contactsValid) ? " wz-btn--invalid" : ""}${isSubmitting ? " wz-btn--loading" : ""}`}
                >
                  {isPreviewStep && isSubmitting
                    ? "Надсилаємо…"
                    : isPreviewStep
                    ? "Надіслати заявку →"
                    : "Далі →"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Confirm dialog */}
        {showConfirm && (
          <ConfirmDialog onConfirm={confirmClose} onCancel={cancelClose} />
        )}
      </div>
    </div>
  );
}
