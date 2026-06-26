/* ── Shared hex icon wrapper ─────────────────────────────────────────────── */
function HexIcon({ children, size = 56 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
        stroke="#F5C400" strokeWidth="1.5" strokeLinejoin="round"
        fill="rgba(245,196,0,0.04)" />
      {children}
    </svg>
  );
}

/* ── Step icons (24×24, centred at translate(20,20)) ───────────────────── */
function IconUpload() {
  return (
    <g transform="translate(20,20)">
      <path d="M12 15V4M12 4L7 9M12 4L17 9"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 17V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V17"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
    </g>
  );
}
function IconSearch() {
  return (
    <g transform="translate(20,20)">
      <circle cx="10" cy="10" r="7" stroke="#F5C400" strokeWidth="1.8"/>
      <path d="M15.5 15.5L21 21" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 10H13M10 7V13" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  );
}
function IconPrinter() {
  return (
    <g transform="translate(20,20)">
      <rect x="3" y="5" width="18" height="12" rx="1.5" stroke="#F5C400" strokeWidth="1.8"/>
      <path d="M7 17V21H17V17" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 5V2H17V5" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17.5" cy="11" r="1" fill="#F5C400"/>
    </g>
  );
}
function IconShield() {
  return (
    <g transform="translate(20,20)">
      <path d="M12 2L3 6V12C3 16.97 7.02 21.66 12 23C16.98 21.66 21 16.97 21 12V6L12 2Z"
        stroke="#F5C400" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M8 12L10.5 14.5L16 9"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  );
}
function IconPackage() {
  return (
    <g transform="translate(20,20)">
      <path d="M12 2L22 7.5V17L12 22.5L2 17V7.5L12 2Z"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 7.5L12 13L22 7.5"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13V22.5"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 4.75L17 10.25"
        stroke="#F5C400" strokeWidth="1.4" strokeLinecap="round" opacity="0.45"/>
    </g>
  );
}

/* ── Step data ───────────────────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    Icon: IconUpload,
    title: "Надішліть модель",
    desc: "Надішліть STL, STEP або 3MF. Або креслення, якщо моделі ще немає.",
  },
  {
    n: "02",
    Icon: IconSearch,
    title: "Аналіз та прорахунок",
    desc: "Підбираємо матеріал, оцінюємо технологію, розраховуємо вартість та строки.",
  },
  {
    n: "03",
    Icon: IconPrinter,
    title: "3D-Друк",
    desc: "Виготовляємо деталі на виробничій фермі Bambu Lab P1S. Контролюємо повторюваність.",
  },
  {
    n: "04",
    Icon: IconShield,
    title: "Контроль якості",
    desc: "Перевіряємо розміри, геометрію, поверхню та зовнішній вигляд.",
  },
  {
    n: "05",
    Icon: IconPackage,
    title: "Пакування та доставка",
    desc: "Надійно пакуємо. Відправляємо по всій Україні.",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   ProcessSection
══════════════════════════════════════════════════════════════════════════ */
export function ProcessSection() {
  return (
    <section id="process" className="np-proc" aria-label="Процес роботи">

      {/* ── Header block ───────────────────────────────────────────────── */}
      <div className="np-proc-header">
        <div className="np-proc-label-row">
          <span className="np-proc-label-line" aria-hidden="true" />
          <p className="np-proc-label">Процес</p>
        </div>
        <h2 className="np-proc-heading">Як ми працюємо</h2>
        <p className="np-proc-sub">
          Прозорий процес від вашої ідеї<br />до готових деталей.
        </p>
      </div>

      {/* ── Horizontal timeline ────────────────────────────────────────── */}
      <div className="np-proc-timeline" role="list" aria-label="Етапи роботи">

        {STEPS.map((step, i) => (
          <div key={step.n} className="np-proc-step-wrap">

            {/* Card */}
            <div className="np-proc-card" role="listitem">
              <span className="np-proc-step-num" aria-label={`Крок ${step.n}`}>
                {step.n}
              </span>
              <div className="np-proc-icon">
                <HexIcon size={56}><step.Icon /></HexIcon>
              </div>
              <p className="np-proc-card-title">{step.title}</p>
              <p className="np-proc-card-desc">{step.desc}</p>
            </div>

            {/* Connector: line + dot between cards (not after last) */}
            {i < STEPS.length - 1 && (
              <div className="np-proc-connector" aria-hidden="true">
                <span className="np-proc-conn-line" />
                <span className="np-proc-conn-dot" />
                <span className="np-proc-conn-line" />
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
}
