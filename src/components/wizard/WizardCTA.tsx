"use client";

import { useWizard } from "./WizardContext";

/**
 * WizardCTA — thin client button that opens the Quote Wizard.
 * Use this inside server components (CapabilitiesSection, ContactsSection, etc.)
 * to avoid making the whole component a client component.
 */
export function WizardCTA({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useWizard();
  return (
    <button
      type="button"
      onClick={open}
      className={className}
      aria-label="Отримати розрахунок — відкрити форму"
    >
      {children}
    </button>
  );
}
