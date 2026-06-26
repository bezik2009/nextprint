import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────────────
   HexIcon — shared hexagon outline wrapper.
   Feature-card icons: size=48. Audience-card icons: size=48.
───────────────────────────────────────────────────────────────────────── */
function HexIcon({ children, size = 48 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
        stroke="#F5C400" strokeWidth="1.5"
        strokeLinejoin="round"
        fill="rgba(245,196,0,0.04)"
      />
      {children}
    </svg>
  );
}

/* ── Inner icons — 24×24 viewport, centred at translate(20,20) ── */

function IconCube() {
  return (
    <g transform="translate(20,20)">
      <path d="M12 2L22 7.5V17L12 22.5L2 17V7.5L12 2Z"
        stroke="#F5C400" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 7.5L12 13L22 7.5"
        stroke="#F5C400" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13V22.5"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
    </g>
  );
}

function IconTarget() {
  return (
    <g transform="translate(20,20)">
      <circle cx="12" cy="12" r="10" stroke="#F5C400" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="5.5" stroke="#F5C400" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="1.5" fill="#F5C400"/>
    </g>
  );
}

function IconGrowth() {
  return (
    <g transform="translate(20,20)">
      <path d="M2 20L8 12L13 16L20 6"
        stroke="#F5C400" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 6H20V11"
        stroke="#F5C400" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 22H22"
        stroke="#F5C400" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.30"/>
    </g>
  );
}

function IconBattery() {
  return (
    <g transform="translate(20,20)">
      <rect x="1" y="6" width="18" height="11" rx="2"
        stroke="#F5C400" strokeWidth="1.8"/>
      <path d="M19 9.5H22V13.5H19"
        stroke="#F5C400" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 8.5L9 12H12.5L9.5 15.5L15.5 11.5H12L13 8.5Z"
        stroke="#F5C400" strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  );
}

function IconFactory() {
  return (
    <g transform="translate(20,20)">
      <rect x="2" y="12" width="20" height="11" rx="1"
        stroke="#F5C400" strokeWidth="1.8"/>
      <path d="M6 12V7M10 12V9M14 12V7"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="9" y="17" width="6" height="6" rx="0.5"
        stroke="#F5C400" strokeWidth="1.5"/>
      <rect x="3" y="14" width="3" height="3" rx="0.5"
        stroke="#F5C400" strokeWidth="1.4"/>
      <rect x="18" y="14" width="3" height="3" rx="0.5"
        stroke="#F5C400" strokeWidth="1.4"/>
    </g>
  );
}

function IconEngineering() {
  return (
    <g transform="translate(20,20)">
      <circle cx="12" cy="10" r="4" stroke="#F5C400" strokeWidth="1.8"/>
      <path d="M12 4V6M12 14V16M6 10H4M20 10H18M7.76 6.34L6.34 4.93M17.66 15.07L16.24 13.66M7.76 13.66L6.34 15.07M17.66 4.93L16.24 6.34"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M10 16L6 21"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
    </g>
  );
}

function IconPartnership() {
  return (
    <g transform="translate(20,20)">
      <path d="M2 13C2 13 4 11 7 11C8.5 11 9.5 11.5 10 12"
        stroke="#F5C400" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 13C22 13 20 11 17 11C15.5 11 14.5 11.5 14 12"
        stroke="#F5C400" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 12L12 14L14 12"
        stroke="#F5C400" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 15C7 15 9 17 12 17C15 17 17 15 17 15"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 4V7M10.5 5.5L13.5 5.5"
        stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   AboutSection
───────────────────────────────────────────────────────────────────────── */
export function AboutSection() {
  return (
    <section id="about" className="np-about" aria-label="Про NEXT PRINT">

      {/* ── Two-column grid: left 44% / right 56% ────────────────────── */}
      <div className="np-about-grid">

        {/* LEFT: label · heading · body · printer image */}
        <div className="np-about-left">

          <div className="np-about-label-row">
            <span className="np-about-label-line" aria-hidden="true" />
            <p className="np-about-label">Про Next Print</p>
          </div>

          <h2 className="np-about-heading">
            <span className="np-about-heading-white">Виробнича ферма 3D-друку<br /></span>
            <span className="np-about-heading-yellow">для серійних задач</span>
          </h2>

          <p className="np-about-body">
            NextPrint допомагає технологічним компаніям, виробникам та інженерним
            командам швидко переходити від прототипу до стабільного серійного
            виробництва пластикових компонентів.
          </p>
          <p className="np-about-body np-about-body--last">
            Ми працюємо з малими та середніми партіями, контролюємо повторюваність
            якості та можемо масштабувати виробництво під регулярні замовлення.
          </p>

          <div className="np-about-printers">
            <Image
              src="/about-printers.png"
              alt="Bambu Lab P1S принтери NEXT PRINT"
              width={620}
              height={290}
              className="np-about-printers-img"
              priority={false}
            />
          </div>
        </div>

        {/* RIGHT: feature card — stretches to match left column height */}
        <div className="np-about-feature-card">

          <p className="np-about-feature-title">Що ми забезпечуємо</p>

          <ul className="np-about-feature-list">

            <li className="np-about-feature-row">
              <HexIcon><IconCube /></HexIcon>
              <div className="np-about-feature-text">
                <p className="np-about-feature-row-title">Серійний FDM-друк</p>
                <p className="np-about-feature-row-desc">Партії деталей для регулярних виробничих потреб</p>
              </div>
            </li>

            <li className="np-about-feature-row">
              <HexIcon><IconTarget /></HexIcon>
              <div className="np-about-feature-text">
                <p className="np-about-feature-row-title">Повторюваність</p>
                <p className="np-about-feature-row-desc">Стабільні параметри друку та контроль якості</p>
              </div>
            </li>

            <li className="np-about-feature-row">
              <HexIcon><IconGrowth /></HexIcon>
              <div className="np-about-feature-text">
                <p className="np-about-feature-row-title">Масштабування</p>
                <p className="np-about-feature-row-desc">Можливість збільшення обсягу під замовлення</p>
              </div>
            </li>

            <li className="np-about-feature-row">
              <HexIcon><IconBattery /></HexIcon>
              <div className="np-about-feature-text">
                <p className="np-about-feature-row-title">Резервне живлення</p>
                <p className="np-about-feature-row-desc">Безперервність роботи під час відключень</p>
              </div>
            </li>

          </ul>
        </div>
      </div>

      {/* ── Bottom 3 audience cards ───────────────────────────────────── */}
      <div className="np-audience-strip">

        <div className="np-audience-card">
          <HexIcon size={48}><IconFactory /></HexIcon>
          <div className="np-audience-text">
            <p className="np-audience-title">Для виробників</p>
            <p className="np-audience-desc">Деталі, кріплення, корпуси та функціональні пластикові компоненти.</p>
          </div>
        </div>

        <div className="np-audience-card">
          <HexIcon size={48}><IconEngineering /></HexIcon>
          <div className="np-audience-text">
            <p className="np-audience-title">Для інженерних команд</p>
            <p className="np-audience-desc">Швидке тестування конструкцій і перехід до малих серій.</p>
          </div>
        </div>

        <div className="np-audience-card">
          <HexIcon size={48}><IconPartnership /></HexIcon>
          <div className="np-audience-text">
            <p className="np-audience-title">Для технологічних компаній</p>
            <p className="np-audience-desc">Партнерство для регулярного виготовлення пластикових виробів.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
