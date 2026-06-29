"use client";

/**
 * DraftResumeBanner
 *
 * Shown at the bottom of the page when the wizard is closed but a saved
 * draft exists in localStorage. Lets the user resume or discard the draft.
 *
 * Renders nothing if:
 *   - the wizard is currently open
 *   - no draft exists
 *   - the draft has been dismissed this session
 */

import { useEffect, useState } from "react";
import { useWizard } from "@/components/wizard";
import { DRAFT_KEY } from "@/components/wizard/types";

export function DraftResumeBanner() {
  const { isOpen, open } = useWizard();
  const [visible, setVisible] = useState(false);

  // Check for draft on mount and whenever the wizard closes
  useEffect(() => {
    if (isOpen) {
      setVisible(false);
      return;
    }
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        // Small delay so it doesn't flash on initial load
        const id = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(id);
      }
    } catch {
      // localStorage unavailable — degrade silently
    }
  }, [isOpen]);

  const handleResume = () => {
    setVisible(false);
    open();
  };

  const handleDiscard = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="draft-banner" role="status" aria-live="polite">
      <div className="draft-banner-inner">
        <span className="draft-banner-icon" aria-hidden="true">📋</span>
        <p className="draft-banner-text">
          У вас є незавершена заявка.
        </p>
        <button
          type="button"
          onClick={handleResume}
          className="draft-banner-btn draft-banner-btn--primary"
        >
          Продовжити
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          className="draft-banner-btn draft-banner-btn--ghost"
          aria-label="Скасувати чернетку"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
