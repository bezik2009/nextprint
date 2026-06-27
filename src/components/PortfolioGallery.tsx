"use client";

import Image from "next/image";
import { useCallback } from "react";

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
    alt:   "Серійне виробництво пластикових деталей NextPrint",
    label: "Серійне виробництво пластикових корпусів",
  },
  {
    image: "/images/portfolio/02_phone_stand_gallery.jpg",
    alt:   "Партія 3D-друкованих підставок для смартфонів",
    label: "Підставки для смартфонів",
  },
  {
    image: "/images/portfolio/03_qr_menu_poplavok.jpg",
    alt:   "3D-друковані настільні QR-меню для ресторану Poplavok",
    label: "QR-меню для ресторанів",
  },
  {
    image: "/images/portfolio/04_industrial_parts.jpg",
    alt:   "Інженерні пластикові деталі складної геометрії",
    label: "Точні інженерні компоненти",
  },
  {
    image: "/images/portfolio/05_large_technical_parts.jpg",
    alt:   "Великі технічні пластикові компоненти",
    label: "Великогабаритні деталі",
  },
  {
    image: "/images/portfolio/06_serial_batch.jpg",
    alt:   "Мала серія пластикових деталей у коробці",
    label: "Пластикові деталі серіями",
  },
  {
    image: "/images/portfolio/07_precision_components.jpg",
    alt:   "Точні 3D-друковані різьбові компоненти",
    label: "Різьбові та посадочні елементи",
  },
  {
    image: "/images/portfolio/08_phone_stand_closeup.jpg",
    alt:   "Крупний план 3D-друкованих підставок для смартфонів",
    label: "Вироби з бездоганною фінішною якістю",
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
  const handleCtaClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("contacts");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#contacts");
    }
  }, []);

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
        <a
          href="#contacts"
          onClick={handleCtaClick}
          className="pg-cta-tile"
          aria-label="Зв'язатися з нами для розрахунку замовлення"
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
        </a>

      </div>
    </section>
  );
}
