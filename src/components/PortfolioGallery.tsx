"use client";

import Image from "next/image";
import { useWizard } from "@/components/wizard";

/* ── Types ──────────────────────────────────────────────────────────────── */
interface PortfolioItem {
  image: string;
  alt:   string;
  label: string;
}

/* ── Data — exactly 8 images ────────────────────────────────────────────── */
const ITEMS: PortfolioItem[] = [
  {
    image: "/images/portfolio/01_hero_serial_production.jpg",
    alt:   "Серійне виробництво пластикових корпусів NextPrint",
    label: "Серійне виробництво корпусів електронного обладнання",
  },
  {
    image: "/images/portfolio/02_phone_stand_gallery.jpg",
    alt:   "Партія пластикових підставок — контрактне виробництво",
    label: "Функціональні пластикові кріплення — партія 200 шт.",
  },
  {
    image: "/images/portfolio/03_qr_menu_poplavok.jpg",
    alt:   "Виробництво промислових інформаційних елементів серією",
    label: "Виготовлення промислових інформаційних елементів — серія",
  },
  {
    image: "/images/portfolio/04_industrial_parts.jpg",
    alt:   "Точні посадочні деталі для складальних вузлів",
    label: "Точні посадочні деталі для складальних вузлів",
  },
  {
    image: "/images/portfolio/05_large_technical_parts.jpg",
    alt:   "Великогабаритні конструкційні пластикові компоненти",
    label: "Великогабаритні конструкційні компоненти",
  },
  {
    image: "/images/portfolio/06_serial_batch.jpg",
    alt:   "Контрактне виробництво пластикових деталей — повторювані партії",
    label: "Контрактне виробництво пластикових деталей — повторювані партії",
  },
  {
    image: "/images/portfolio/07_precision_components.jpg",
    alt:   "Різьбові та з'єднувальні елементи — серійне виготовлення",
    label: "Різьбові та з'єднувальні елементи — серійне виготовлення",
  },
  {
    image: "/images/portfolio/08_phone_stand_closeup.jpg",
    alt:   "Виробництво з контрольованою якістю поверхні",
    label: "Виробництво з контрольованою якістю поверхні",
  },
];

/* ── Icons ──────────────────────────────────────────────────────────────── */
function IconCube() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M18 4L32 12V24L18 32L4 24V12L18 4Z"
        stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round"
        fill="rgba(245,196,0,0.06)"/>
      <path d="M4 12L18 20L32 12" stroke="#F5C400" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M18 20V32" stroke="#F5C400" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10H16M16 10L11 5M16 10L11 15"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PortfolioGallery
   Layout: 4-column CSS grid
   • Item 01 (featured): col-span 2, row-span 2 — top-left large card
   • Items 02–05: 1×1 cards filling the right two columns (rows 1–2)
   • Items 06–08: 1×1 cards in row 3, columns 1–3
   • CTA tile: row 3, column 4 — no image
═══════════════════════════════════════════════════════════════════════════ */
export function PortfolioGallery() {
  const { open } = useWizard();
  const [featured, ...rest] = ITEMS; // 01 = featured, rest = 02–08

  return (
    <section className="pg-section" aria-label="Реальні вироби — приклади замовлень">

      {/* ── Section header ────────────────────────────────────────────── */}
      <div className="pg-header">
        <div className="pg-label-row">
          <span className="pg-label-line" aria-hidden="true" />
          <p className="pg-label">Реальні вироби</p>
        </div>
        <h2 className="pg-heading">
          Приклади{" "}
          <span className="pg-heading-accent">серійних</span>{" "}
          замовлень
        </h2>
        <p className="pg-sub">
          Від одиничних прототипів до партій з сотень деталей —
          реальні вироби, надруковані на нашій виробничій фермі.
        </p>
      </div>

      {/* ── Asymmetric grid ───────────────────────────────────────────── */}
      <div className="pg-grid" role="list">

        {/* ── 01 Featured — 2×2 ─────────────────────────────────────── */}
        <article className="pg-card pg-card--featured" role="listitem">
          <div className="pg-img-wrap">
            <Image
              src={featured.image}
              alt={featured.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              className="pg-img"
            />
            <div className="pg-img-fade" aria-hidden="true" />
          </div>
          <div className="pg-card-body">
            <p className="pg-card-label">{featured.label}</p>
          </div>
        </article>

        {rest.map((item) => (
          <article key={item.image} className="pg-card" role="listitem">
            <div className="pg-img-wrap">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
                className="pg-img"
              />
              <div className="pg-img-fade" aria-hidden="true" />
            </div>
            <div className="pg-card-body">
              <p className="pg-card-label">{item.label}</p>
            </div>
          </article>
        ))}

        {/* ── CTA tile — no image ───────────────────────────────────── */}
        <button
          type="button"
          onClick={open}
          className="pg-cta-tile"
          aria-label="Отримати розрахунок — відкрити форму"
        >
          {/* Yellow glow accent */}
          <div className="pg-cta-glow" aria-hidden="true" />

          <div className="pg-cta-icon">
            <IconCube />
          </div>

          <p className="pg-cta-title">
            Маєте схожу задачу?
          </p>
          <p className="pg-cta-body">
            Надішліть модель, креслення або фото деталі —
            підготуємо розрахунок.
          </p>

          <span className="pg-cta-btn">
            Зв&apos;язатися з нами
            <IconArrow />
          </span>
        </button>

      </div>
    </section>
  );
}
