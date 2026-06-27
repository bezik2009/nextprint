/* ── TrustBlock ──────────────────────────────────────────────────────────
   Compact confidence-building section before contacts.
   Desktop: 2×2 grid. Mobile: vertical list.
   All tb-* classes. No animations, no redesign.
──────────────────────────────────────────────────────────────────────── */

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 10L8.5 13.5L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    heading: "Власна виробнича ферма",
    body:    "15+ принтерів Bambu Lab P1S у безперервній роботі.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="10" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
    heading: "Стабільна повторювана якість",
    body:    "Контроль геометрії, поверхні та відповідності на кожному етапі.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="2" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 6H9M6 9H9M6 12H7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M13 7V17C13 17.55 13.45 18 14 18H17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M14 18L17 15M17 18L14 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    heading: "Конфіденційність моделей",
    body:    "Ваші файли використовуються виключно для виконання замовлення.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="11" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M13 9H16L18 12V15H13V9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <circle cx="5.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="15" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    heading: "Доставка по всій Україні",
    body:    "Надійне пакування та відправлення у будь-який регіон.",
  },
] as const;

export function TrustBlock() {
  return (
    <section className="tb-section" aria-label="Чому NextPrint">
      <div className="tb-label-row">
        <span className="tb-label-line" aria-hidden="true" />
        <p className="tb-label">Чому NextPrint</p>
      </div>

      <div className="tb-grid" role="list">
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="tb-item" role="listitem">
            <span className="tb-icon">{item.icon}</span>
            <div className="tb-text">
              <p className="tb-heading">{item.heading}</p>
              <p className="tb-body">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
