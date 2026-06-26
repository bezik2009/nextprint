import Image from "next/image";

export function HeroSection() {
  return (
    <section id="hero" className="np-hero" aria-label="Головний екран">

      <div className="np-hero-body">

        {/* ── Left: text content ──────────────────────────────────────── */}
        <div className="np-hero-content">

          <h1 className="np-headline">
            <span style={{ color: "#F4F7FA" }}>
              Контрактне<br />
              виробництво<br />
            </span>
            <span style={{ color: "#F5C400" }}>
              пластикових<br />
              компонентів
            </span>
          </h1>

          <p className="np-sub">
            Від прототипу до серійного виробництва.<br />
            Надійний партнер для технологічних компаній та інженерних команд.
          </p>

          <a href="#about" aria-label="Дізнатися більше про NEXT PRINT" className="np-btn-learn group">
            Дізнатися більше
            <svg
              width="16" height="16" viewBox="0 0 16 16"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="np-btn-learn-arrow"
            >
              <path d="M8 3V13M8 13L3 8M8 13L13 8"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* ── Right: production photo ─────────────────────────────────── */}
        <div className="np-hero-image">
          <Image
            src="/hero-printers.png"
            alt="Ряди 3D-принтерів у виробничому приміщенні NEXT PRINT"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 67vw"
            style={{ objectFit: "cover", objectPosition: "left center" }}
          />
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────────────────── */}
      <div className="np-stats" role="list" aria-label="Ключові показники">

        {/* ─── Cube ───
         * Isometric 3-face box. Top face = flat hexagon. Left + right faces
         * drop down from the top edges to a lower horizontal seam.
         * Three bottom edges converge to the base points.
         * viewBox 36×36, stroke 1.8, round joins.
         */}
        <div className="np-stat-item" role="listitem">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
               xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
               className="np-stat-icon">
            {/* Top face — flat hexagonal diamond */}
            <path d="M18 4L32 12V20L18 28L4 20V12L18 4Z"
              stroke="#F5C400" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
            {/* Horizontal mid-seam */}
            <path d="M4 12L18 20L32 12"
              stroke="#F5C400" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
            {/* Center vertical spine */}
            <path d="M18 20V28"
              stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
            {/* Bottom-left edge */}
            <path d="M4 20V28L18 34"
              stroke="#F5C400" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
            {/* Bottom-right edge */}
            <path d="M32 20V28L18 34"
              stroke="#F5C400" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div className="np-stat-value">14 принтерів</div>
            <div className="np-stat-label">у виробництві</div>
          </div>
        </div>

        {/* ─── Bar chart ───
         * 3 ascending rectangular bars (outline) on a baseline.
         * Bars: left=short, mid=medium, right=tall.
         * Baseline sits below all bars.
         */}
        <div className="np-stat-item" role="listitem">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
               xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
               className="np-stat-icon">
            {/* Baseline */}
            <path d="M3 32H33"
              stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
            {/* Bar 1 — short, left */}
            <rect x="4" y="22" width="7" height="10" rx="0.5"
              stroke="#F5C400" strokeWidth="1.8"/>
            {/* Bar 2 — medium, center */}
            <rect x="15" y="14" width="7" height="18" rx="0.5"
              stroke="#F5C400" strokeWidth="1.8"/>
            {/* Bar 3 — tall, right */}
            <rect x="26" y="6" width="7" height="26" rx="0.5"
              stroke="#F5C400" strokeWidth="1.8"/>
          </svg>
          <div>
            <div className="np-stat-value">1000+ виробів</div>
            <div className="np-stat-label">на місяць</div>
          </div>
        </div>

        {/* ─── Growth arrow ───
         * Zigzag trendline: starts bottom-left, goes up, dips, then rises
         * to top-right with a right-angle arrowhead (L-shape: left then down).
         * Faint horizontal ground line.
         */}
        <div className="np-stat-item" role="listitem">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
               xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
               className="np-stat-icon">
            {/* Ground line */}
            <path d="M3 32H33"
              stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
            {/* Trendline: up → dip → up-right */}
            <path d="M3 27L12 16L19 22L29 8"
              stroke="#F5C400" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
            {/* Arrowhead: horizontal arm left, then vertical arm down */}
            <path d="M23 8H29V14"
              stroke="#F5C400" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div className="np-stat-value">Масштабування</div>
            <div className="np-stat-label">до 2000+ протягом 2 місяців</div>
          </div>
        </div>

        {/* ─── Battery ───
         * Rounded rectangle body. Small terminal nub on the right.
         * Lightning bolt stroke inside (outline only, no fill).
         */}
        <div className="np-stat-item" role="listitem">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
               xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
               className="np-stat-icon">
            {/* Body */}
            <rect x="2" y="10" width="28" height="16" rx="2.5"
              stroke="#F5C400" strokeWidth="1.8"/>
            {/* Terminal nub */}
            <path d="M30 15H34V21H30"
              stroke="#F5C400" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
            {/* Lightning bolt — top point → lower-left → mid-right → bottom point */}
            <path d="M19 13L13 19H18.5L14 23L22 18H17L19 13Z"
              stroke="#F5C400" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div className="np-stat-value">Резервне живлення</div>
            <div className="np-stat-label">безперервне виробництво під час відключень</div>
          </div>
        </div>

      </div>
    </section>
  );
}
