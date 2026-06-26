"use client";

import Image from "next/image";
import { useCallback } from "react";

/* ── SVG icons for feature cards ────────────────────────────────────────── */
function IconBox() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3L25 8.5V19.5L14 25L3 19.5V8.5L14 3Z"
        stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M3 8.5L14 14L25 8.5" stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M14 14V25" stroke="#F5C400" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="11" stroke="#F5C400" strokeWidth="1.6"/>
      <path d="M14 8V14L18 17" stroke="#F5C400" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconLayers() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3L25 8L14 13L3 8L14 3Z" stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M3 14L14 19L25 14" stroke="#F5C400" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 20L14 25L25 20" stroke="#F5C400" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconTruck() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="16" height="12" rx="1.5" stroke="#F5C400" strokeWidth="1.6"/>
      <path d="M18 11H23L26 15V20H18V11Z" stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="7" cy="21" r="2.5" stroke="#F5C400" strokeWidth="1.5"/>
      <circle cx="21" cy="21" r="2.5" stroke="#F5C400" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── SVG icons for advantages row ───────────────────────────────────────── */
function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2L3 5V10C3 13.87 6.13 17.49 10 18C13.87 17.49 17 13.87 17 10V5L10 2Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.22 4.22L5.64 5.64M14.36 14.36L15.78 15.78M4.22 15.78L5.64 14.36M14.36 5.64L15.78 4.22"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 2V6M14 2V6M2 9H18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6 13H8M10 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M7 9V6C7 4.34 8.34 3 10 3C11.66 3 13 4.34 13 6V9"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="10" cy="14" r="1.2" fill="currentColor"/>
    </svg>
  );
}

/* ── Stats bar icons ─────────────────────────────────────────────────────── */
function IconPrinter() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="24" height="18" rx="2" stroke="#F5C400" strokeWidth="1.6"/>
      <rect x="8" y="22" width="16" height="6" rx="1" stroke="#F5C400" strokeWidth="1.5"/>
      <path d="M10 14H22M10 9H16" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 4V2M24 4V2" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconCube() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3L29 10V22L16 29L3 22V10L16 3Z"
        stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M3 10L16 17L29 10" stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M16 17V29" stroke="#F5C400" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function IconRuler() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="12" width="24" height="8" rx="1.5" stroke="#F5C400" strokeWidth="1.6"/>
      <path d="M9 12V15M14 12V17M19 12V15M24 12V17" stroke="#F5C400" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconTarget() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="#F5C400" strokeWidth="1.6"/>
      <circle cx="16" cy="16" r="7" stroke="#F5C400" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="2.5" fill="#F5C400"/>
    </svg>
  );
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const FEATURE_CARDS = [
  { Icon: IconBox,   line1: "Від 1 до 1000+", line2: "деталей"        },
  { Icon: IconClock, line1: "Виробництво",     line2: "від 24 годин"   },
  { Icon: IconLayers,line1: "Інженерні",       line2: "матеріали"      },
  { Icon: IconTruck, line1: "Доставка",        line2: "по Україні"     },
];

const ADVANTAGES = [
  { Icon: IconShield,   line1: "Стабільна якість",    line2: "кожної деталі"     },
  { Icon: IconSettings, line1: "Контроль",             line2: "на всіх етапах"    },
  { Icon: IconCalendar, line1: "Дотримуємось",         line2: "термінів"          },
  { Icon: IconLock,     line1: "Конфіденційність",     line2: "ваших проєктів"    },
];

const STATS = [
  { Icon: IconPrinter, value: "15+",             unit: "",   label: "3D принтерів", sub: "Bambu Lab P1S" },
  { Icon: IconCube,    value: "1000+",            unit: "",   label: "деталей щодня", sub: "" },
  { Icon: IconRuler,   value: "до 256×256×256",   unit: " мм",label: "максимальний розмір деталі", sub: "" },
  { Icon: IconTarget,  value: "±0.1",             unit: " мм",label: "точність друку", sub: "" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HeroSection
═══════════════════════════════════════════════════════════════════════════ */
export function HeroSection() {
  const handleCtaClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("contacts");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#contacts");
    }
  }, []);

  return (
    <section id="hero" className="nh-section" aria-label="Головний екран">

      {/* ── Two-column hero body ─────────────────────────────────────────── */}
      <div className="nh-body">

        {/* LEFT: label + headline + subtitle only */}
        <div className="nh-left">
          <div className="nh-label-row">
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true" className="nh-label-arrow">
              <path d="M1 5H15M15 5L11 1M15 5L11 9" stroke="#F5C400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="nh-label">Професійний FDM 3D Друк</span>
          </div>

          <h1 className="nh-headline">
            Малосерійне<br />
            виробництво<br />
            пластикових деталей
          </h1>

          <p className="nh-sub">
            Від прототипу до серії. Швидко, точно, надійно.<br />
            Сучасне обладнання та інженерні матеріали<br />
            для ваших ідей та виробництва.
          </p>
        </div>

        {/* IMAGE — right column on desktop, moves above CTA on mobile */}
        <div className="nh-right" aria-hidden="true">
          <Image
            src="/hero-visual.png"
            alt="Bambu Lab P1S 3D принтер з пластиковими деталями"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 54vw"
            style={{ objectFit: "cover", objectPosition: "center right" }}
          />
          <div className="nh-right-fade" aria-hidden="true" />
        </div>

        {/* CTA — left col on desktop, just below image on mobile */}
        <a
          href="#contacts"
          onClick={handleCtaClick}
          className="nh-cta"
          aria-label="Зв'язатися з нами — перейти до контактів"
        >
          Зв&apos;язатися з нами
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 9H15M15 9L10 4M15 9L10 14"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        {/* FEATURE CARDS — left col on desktop, below CTA on mobile */}
        <div className="nh-cards" role="list">
          {FEATURE_CARDS.map((card, i) => (
            <div key={i} className="nh-card" role="listitem">
              <card.Icon />
              <p className="nh-card-line1">{card.line1}</p>
              <p className="nh-card-line2">{card.line2}</p>
            </div>
          ))}
        </div>

        {/* ADVANTAGES — left col on desktop, below cards on mobile */}
        <div className="nh-adv" role="list" aria-label="Наші переваги">
          {ADVANTAGES.map((adv, i) => (
            <div key={i} className="nh-adv-item" role="listitem">
              {i > 0 && <span className="nh-adv-divider" aria-hidden="true" />}
              <adv.Icon />
              <p className="nh-adv-text">
                {adv.line1}<br />{adv.line2}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom stats bar ─────────────────────────────────────────────── */}
      <div className="nh-stats" role="list" aria-label="Ключові показники">
        {STATS.map((stat, i) => (
          <div key={i} className="nh-stat" role="listitem">
            {i > 0 && <span className="nh-stat-divider" aria-hidden="true" />}
            <stat.Icon />
            <div>
              <p className="nh-stat-value">
                {stat.value}
                {stat.unit && <span className="nh-stat-unit">{stat.unit}</span>}
              </p>
              <p className="nh-stat-label">{stat.label}</p>
              {stat.sub && <p className="nh-stat-sub">{stat.sub}</p>}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
