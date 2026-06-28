/**
 * Shared validation and formatting helpers for the Quote Wizard.
 * Pure functions — no React dependencies.
 * Phase 2+ can reuse these on the server side.
 */

/* ── Email ──────────────────────────────────────────────────────────────── */

/** Returns true when email matches local@domain.tld */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/* ── Phone ──────────────────────────────────────────────────────────────── */

/**
 * Strip spaces, dashes, brackets, dots, and the leading + sign.
 * "+38 (067) 123-45-67" → "380671234567"
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-().+]/g, "");
}

/**
 * Accepts:
 *   - 10-digit starting with 0  (Ukrainian local):        0671234567
 *   - 12-digit starting with 380 (international no +):    380671234567
 */
export function validatePhone(phone: string): boolean {
  const n = normalizePhone(phone);
  if (/^0\d{9}$/.test(n)) return true;
  if (/^380\d{9}$/.test(n)) return true;
  return false;
}

/**
 * Formats a valid Ukrainian phone for display as "+380 XX XXX XX XX".
 * Falls back to trimmed raw input if the format is unexpected.
 */
export function formatPhoneForDisplay(phone: string): string {
  const n = normalizePhone(phone);
  let digits = n;
  if (digits.startsWith("380")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 9) {
    return `+380 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  }
  return phone.trim();
}
