import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { WizardCTA } from "@/components/wizard";

/* ── Shared hex icon wrapper (same style as About section) ─────────────── */
function HexIcon({ children, size = 48 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
        stroke="#F5C400" strokeWidth="1.5" strokeLinejoin="round"
        fill="rgba(245,196,0,0.04)" />
      {children}
    </svg>
  );
}

/* ── Left-column bullet icons ──────────────────────────────────────────── */
function IconQuality() {
  return (
    <g transform="translate(20,20)">
      <path d="M12 2L14.5 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9.5L12 2Z"
        stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
    </g>
  );
}
function IconSpeed() {
  return (
    <g transform="translate(20,20)">
      <circle cx="12" cy="12" r="9" stroke="#F5C400" strokeWidth="1.7"/>
      <path d="M12 7V12L15.5 15.5" stroke="#F5C400" strokeWidth="1.7" strokeLinecap="round"/>
    </g>
  );
}
function IconDelivery() {
  return (
    <g transform="translate(20,20)">
      <rect x="1" y="8" width="14" height="10" rx="1.5" stroke="#F5C400" strokeWidth="1.7"/>
      <path d="M15 11H19L22 15V18H15V11Z" stroke="#F5C400" strokeWidth="1.7" strokeLinejoin="round"/>
      <circle cx="5" cy="19" r="2" stroke="#F5C400" strokeWidth="1.5"/>
      <circle cx="18" cy="19" r="2" stroke="#F5C400" strokeWidth="1.5"/>
    </g>
  );
}

/* ── Process-step icons ────────────────────────────────────────────────── */
function IconUpload() {
  return (
    <g transform="translate(20,20)">
      <path d="M12 16V4M12 4L7 9M12 4L17 9" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 18V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V18" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
    </g>
  );
}
function IconAnalysis() {
  return (
    <g transform="translate(20,20)">
      <rect x="3" y="2" width="14" height="18" rx="1.5" stroke="#F5C400" strokeWidth="1.7"/>
      <path d="M7 7H13M7 11H13M7 15H10" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 15L21 19" stroke="#F5C400" strokeWidth="1.7" strokeLinecap="round"/>
      <circle cx="17" cy="13" r="3" stroke="#F5C400" strokeWidth="1.5"/>
    </g>
  );
}
function IconPrint3D() {
  return (
    <g transform="translate(20,20)">
      <rect x="3" y="4" width="18" height="14" rx="1.5" stroke="#F5C400" strokeWidth="1.7"/>
      <path d="M7 11H17M12 8V11" stroke="#F5C400" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M6 18V22M18 18V22" stroke="#F5C400" strokeWidth="1.7" strokeLinecap="round"/>
    </g>
  );
}
function IconCheck() {
  return (
    <g transform="translate(20,20)">
      <circle cx="12" cy="12" r="9" stroke="#F5C400" strokeWidth="1.7"/>
      <circle cx="12" cy="12" r="4.5" stroke="#F5C400" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="1.5" fill="#F5C400"/>
    </g>
  );
}
function IconBox() {
  return (
    <g transform="translate(20,20)">
      <path d="M12 2L22 7.5V17L12 22.5L2 17V7.5L12 2Z"
        stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 7.5L12 13L22 7.5" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13V22.5" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
    </g>
  );
}

/* ── CTA icon ───────────────────────────────────────────────────────────── */
function IconConsult() {
  return (
    <g transform="translate(20,20)">
      <rect x="2" y="4" width="20" height="14" rx="2" stroke="#F5C400" strokeWidth="1.7"/>
      <path d="M7 22L12 18L17 22" stroke="#F5C400" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 9H17M7 13H13" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  );
}

/* ── Data ───────────────────────────────────────────────────────────────── */
const PROCESS_STEPS = [
  { n: "01", title: "ВИ НАДАЄТЕ МОДЕЛЬ",       desc: "Надішліть 3D-модель та технічні вимоги.", Icon: IconUpload   },
  { n: "02", title: "АНАЛІЗ ТА ПІДГОТОВКА",    desc: "Оцінюємо модель, підбираємо матеріал та оптимізуємо друк.", Icon: IconAnalysis },
  { n: "03", title: "3D-ДРУК",                  desc: "Друкуємо деталі на Bambu Lab P1S у виробничій фермі.", Icon: IconPrint3D  },
  { n: "04", title: "КОНТРОЛЬ ЯКОСТІ",          desc: "Перевіряємо розміри, геометрію та зовнішній вигляд.", Icon: IconCheck    },
  { n: "05", title: "ПАКУВАННЯ ТА ДОСТАВКА",   desc: "Надійно пакуємо та відправляємо замовлення.", Icon: IconBox      },
];

const STATS = [
  { value: "15+",    unit: "",   label: "3D-принтерів"       },
  { value: "24/7",   unit: "",   label: "Безперервна робота"  },
  { value: "1000+",  unit: "",   label: "Деталей на день"     },
  { value: "0.1",    unit: "мм", label: "Точність друку"      },
];

const MATERIALS = [
  { name: "PETG",    desc: "Функціональні деталі, корпуси, кріплення" },
  { name: "PLA",     desc: "Прототипи, декоративні деталі"            },
  { name: "TPU",     desc: "Гнучкі деталі, ущільнення, амортизатори"  },
  { name: "ABS",     desc: "Міцні деталі, стійкі до навантажень"      },
  { name: "ELASTAN", desc: "Висока еластичність, зносостійкість"      },
  { name: "PLA-LW",  desc: "Легкі деталі, зменшена вага"              },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CapabilitiesSection
═══════════════════════════════════════════════════════════════════════════ */
export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="np-cap" aria-label="Можливості">

      {/* ── TOP TWO-COLUMN BLOCK ──────────────────────────────────────── */}
      <div className="np-cap-top">

        {/* LEFT: label · headline · paragraph · bullets */}
        <div className="np-cap-left">

          <div className="np-cap-label-row">
            <span className="np-cap-label-line" aria-hidden="true" />
            <p className="np-cap-label">Можливості</p>
          </div>

          <h2 className="np-cap-heading">
            <span className="np-cap-heading-white">Від 3D-моделі<br />до готових деталей —<br /></span>
            <span className="np-cap-heading-yellow">Повний цикл</span>
          </h2>

          <p className="np-cap-body">
            Ми беремо на себе весь процес: від підготовки моделі до серійного
            виробництва та доставки готових деталей.
          </p>

          <ul className="np-cap-bullets">
            <li className="np-cap-bullet">
              <HexIcon size={44}><IconQuality /></HexIcon>
              <div>
                <p className="np-cap-bullet-title">Контроль якості</p>
                <p className="np-cap-bullet-desc">Багаторівневий контроль на кожному етапі виробництва.</p>
              </div>
            </li>
            <li className="np-cap-bullet">
              <HexIcon size={44}><IconSpeed /></HexIcon>
              <div>
                <p className="np-cap-bullet-title">Швидкі терміни</p>
                <p className="np-cap-bullet-desc">Оптимізовані процеси для швидкого виконання замовлень.</p>
              </div>
            </li>
            <li className="np-cap-bullet">
              <HexIcon size={44}><IconDelivery /></HexIcon>
              <div>
                <p className="np-cap-bullet-title">Доставка по Україні</p>
                <p className="np-cap-bullet-desc">Надійне пакування та швидка доставка до вашого виробництва.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* RIGHT: process timeline */}
        <div className="np-cap-right">

          <p className="np-cap-process-title">Як ми працюємо</p>

          {/* Timeline: thin line + dots above cards */}
          <div className="np-cap-timeline-wrap">
            {/* Connector line */}
            <div className="np-cap-timeline-line" aria-hidden="true" />
            {/* Dots */}
            <div className="np-cap-timeline-dots" aria-hidden="true">
              {PROCESS_STEPS.map((s) => (
                <span key={s.n} className="np-cap-dot" />
              ))}
            </div>
            {/* Cards */}
            <div className="np-cap-steps">
              {PROCESS_STEPS.map((step) => (
                <div key={step.n} className="np-cap-step">
                  <span className="np-cap-step-num">{step.n}</span>
                  <HexIcon size={44}><step.Icon /></HexIcon>
                  <p className="np-cap-step-title">{step.title}</p>
                  <p className="np-cap-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── LOWER TWO CARDS ──────────────────────────────────────────── */}
      <div className="np-cap-lower">

        {/* LEFT CARD: equipment */}
        <div className="np-cap-equip-card">
          <p className="np-cap-card-title">Наше обладнання</p>
          <p className="np-cap-card-sub">Промислова ферма на базі Bambu Lab P1S / P1S Combo</p>

          <div className="np-cap-stats-row">
            {STATS.map((s) => (
              <div key={s.label} className="np-cap-stat">
                <p className="np-cap-stat-value">
                  {s.value}<span className="np-cap-stat-unit">{s.unit}</span>
                </p>
                <p className="np-cap-stat-label">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Printer row image — replaceable, no layout baked in */}
          <div className="np-cap-equip-img-wrap">
            <div className="np-cap-equip-img-overlay" aria-hidden="true" />
            <Image
              src="/about-printers-row.png"
              alt="Ряд Bambu Lab P1S принтерів NEXT PRINT"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="np-cap-equip-img"
            />
          </div>
        </div>

        {/* RIGHT CARD: materials */}
        <div className="np-cap-mat-card">
          <p className="np-cap-card-title">Матеріали</p>
          <p className="np-cap-card-sub">Працюємо з інженерними пластиками для різних задач</p>

          <div className="np-cap-mat-grid">
            {MATERIALS.map((m) => (
              <div key={m.name} className="np-cap-mat-item">
                {/* Monochrome placeholder square for material render */}
                <div className="np-cap-mat-img" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                    <rect x="4" y="4" width="40" height="40" rx="4" stroke="rgba(245,196,0,0.25)" strokeWidth="1.2"/>
                    <path d="M14 24C14 18.477 18.477 14 24 14C29.523 14 34 18.477 34 24C34 29.523 29.523 34 24 34"
                      stroke="rgba(245,196,0,0.40)" strokeWidth="1.2" strokeLinecap="round"/>
                    <circle cx="24" cy="24" r="4" stroke="rgba(245,196,0,0.50)" strokeWidth="1.2"/>
                  </svg>
                </div>
                <div>
                  <p className="np-cap-mat-name">{m.name}</p>
                  <p className="np-cap-mat-desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA STRIP ────────────────────────────────────────────────── */}
      <div className="np-cap-cta">
        <div className="np-cap-cta-left">
          <HexIcon size={44}><IconConsult /></HexIcon>
          <p className="np-cap-cta-text">Потрібна консультація або розрахунок?</p>
        </div>
        <WizardCTA className="np-cap-cta-btn">
          Звʼязатися з нами →
        </WizardCTA>
      </div>

    </section>
  );
}
