"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DRAFT_KEY,
  INITIAL_DATA,
  TOTAL_STEPS,
  type WizardData,
  type WizardDraft,
} from "./types";

/* ── Context shape ──────────────────────────────────────────────────────── */
interface WizardContextValue {
  isOpen: boolean;
  step: number;
  data: WizardData;
  open: () => void;
  close: () => void;          // direct close (bypasses confirm if < 2 steps)
  requestClose: () => void;   // close with confirm guard
  goNext: () => void;
  goBack: () => void;
  setStep: (n: number) => void;
  updateData: (patch: Partial<WizardData>) => void;
  resetWizard: () => void;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  showConfirm: boolean;
  confirmClose: () => void;
  cancelClose: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}

/* ── Draft helpers ──────────────────────────────────────────────────────── */
function loadDraft(): WizardDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as WizardDraft) : null;
  } catch {
    return null;
  }
}

function saveDraft(step: number, data: WizardData): void {
  try {
    const draft: WizardDraft = { step, data, savedAt: new Date().toISOString() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // localStorage unavailable — degrade gracefully
  }
}

function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   WizardProvider
══════════════════════════════════════════════════════════════════════════ */
export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStepState] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Restore saved scroll position on close
  const scrollYRef = useRef(0);

  /* Draft restore on mount */
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setStepState(draft.step);
      setData(draft.data);
    }
  }, []);

  /* Auto-save draft whenever step or data changes (while open) */
  useEffect(() => {
    if (isOpen && !submitted) {
      saveDraft(step, data);
    }
  }, [isOpen, step, data, submitted]);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.top = "";
      document.body.style.position = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.top = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  /* ESC key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) requestClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const open = useCallback(() => {
    setSubmitted(false);
    setIsOpen(true);
    // note: quote_modal_open is tracked by each CTA button (WizardCTA / HeroSection)
    // so it can carry a location param. Do not re-fire here.
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setShowConfirm(false);
  }, []);

  /* Close with guard: if ≥ 2 steps completed, ask for confirmation */
  const requestClose = useCallback(() => {
    if (submitted) {
      close();
      return;
    }
    if (step >= 2) {
      setShowConfirm(true);
    } else {
      close();
    }
  }, [step, submitted, close]);

  const confirmClose = useCallback(() => {
    setShowConfirm(false);
    setIsOpen(false);
  }, []);

  const cancelClose = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const goNext = useCallback(() => {
    setStepState((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const goBack = useCallback(() => {
    setStepState((s) => Math.max(s - 1, 1));
  }, []);

  const setStep = useCallback((n: number) => {
    setStepState(Math.min(Math.max(n, 1), TOTAL_STEPS));
  }, []);

  const updateData = useCallback((patch: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetWizard = useCallback(() => {
    setStepState(1);
    setData(INITIAL_DATA);
    setSubmitted(false);
    clearDraft();
  }, []);

  const handleSetSubmitted = useCallback((v: boolean) => {
    setSubmitted(v);
    if (v) clearDraft();
  }, []);

  return (
    <WizardContext.Provider
      value={{
        isOpen,
        step,
        data,
        open,
        close,
        requestClose,
        goNext,
        goBack,
        setStep,
        updateData,
        resetWizard,
        submitted,
        setSubmitted: handleSetSubmitted,
        showConfirm,
        confirmClose,
        cancelClose,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}
