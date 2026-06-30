"use client";

import { useWizard } from "./WizardContext";
import { trackMainCtaClick, trackModalOpen } from "@/lib/tracking";

/**
 * WizardCTA — thin client button that opens the Quote Wizard.
 * Use inside server components (CapabilitiesSection, ContactsSection, etc.)
 *
 * location — identifies which CTA triggered the open (for GA4 funnel analysis)
 */
export function WizardCTA({
  className,
  children,
  location = "cta",
}: {
  className?: string;
  children: React.ReactNode;
  location?: string;
}) {
  const { open } = useWizard();

  const handleClick = () => {
    trackMainCtaClick(location);
    trackModalOpen("cta");
    open();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label="Отримати розрахунок — відкрити форму"
    >
      {children}
    </button>
  );
}
