import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { WizardCTA } from "@/components/wizard";

/* ── Shared hex icon wrapper (same pattern as all other sections) ────────── */
function HexIcon({ children, size = 56 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
        stroke="#F5C400" strokeWidth="1.5" strokeLinejoin="round"
        fill="rgba(245,196,0,0.06)" />
      {children}
    </svg>
  );
}

function IconEmail() {
  return (
    <g transform="translate(20,20)">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="#F5C400" strokeWidth="1.8"/>
      <path d="M2 7L12 13L22 7" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  );
}

function IconLocation() {
  return (
    <g transform="translate(20,20)">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
        stroke="#F5C400" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="2.5" stroke="#F5C400" strokeWidth="1.6"/>
    </g>
  );
}

/* ── Ukraine dot-map SVG ─────────────────────────────────────────────────── */
/*
 * Simplified Ukraine silhouette rendered as a dot-matrix pattern.
 * The shape is approximated with circles arranged to suggest the country outline.
 * Yellow square marker placed roughly at Dnipro (central-east).
 */
function UkraineMap() {
  // Dot grid: [cx, cy] pairs approximating Ukraine's silhouette in a 420×260 canvas
  const dots: [number, number][] = [
    // Top row (north border)
    [62,28],[82,22],[102,18],[122,16],[142,18],[162,16],[182,18],[202,16],
    [222,18],[242,16],[262,18],[282,20],[302,22],[322,24],[342,26],[355,30],
    // Upper-mid
    [52,46],[68,40],[88,36],[108,32],[128,30],[148,28],[168,28],[188,28],
    [208,28],[228,28],[248,28],[268,30],[288,32],[308,34],[328,36],[345,40],
    [358,44],[368,50],
    // Mid
    [44,62],[58,56],[75,52],[95,48],[115,44],[135,42],[155,40],[175,40],
    [195,40],[215,40],[235,40],[255,42],[275,44],[295,46],[315,48],[332,50],
    [348,54],[362,58],[372,64],[378,72],
    // Mid-lower
    [40,78],[52,72],[68,68],[85,64],[105,60],[125,58],[145,56],[165,56],
    [185,56],[205,56],[225,56],[245,58],[265,60],[285,62],[305,64],[322,66],
    [338,70],[352,74],[364,78],[374,84],[380,92],
    // Lower
    [48,90],[62,86],[78,82],[96,78],[116,76],[136,74],[156,74],[176,74],
    [196,74],[216,74],[236,76],[256,78],[276,80],[296,82],[313,84],[330,88],
    [344,92],[356,96],[366,102],[372,110],[376,118],
    // Lower-mid
    [56,104],[70,100],[86,96],[104,92],[122,90],[140,90],[158,90],[176,90],
    [194,90],[212,90],[230,92],[248,94],[266,96],[284,98],[300,100],[316,104],
    [330,108],[342,114],[352,120],[360,128],[364,136],
    // Bottom rows
    [66,118],[80,114],[96,110],[112,108],[128,108],[144,108],[160,108],
    [176,108],[192,108],[208,110],[224,112],[240,114],[256,116],[270,120],
    [284,124],[296,130],[308,136],[320,142],[330,150],
    [78,132],[92,128],[106,126],[120,126],[134,126],[148,126],[162,126],
    [176,128],[190,130],[204,132],[218,134],[232,138],[244,144],[256,150],
    [266,158],[274,166],
    [88,146],[102,142],[116,140],[128,140],[140,140],[152,142],[164,144],
    [176,148],[188,152],[200,156],[212,162],[222,170],
    [98,160],[110,156],[122,154],[134,156],[144,160],[154,164],[164,170],
    [174,176],[182,184],
    [108,172],[118,170],[128,172],[136,178],[144,184],[152,190],
    // Crimea peninsula suggestion
    [192,172],[206,170],[220,172],[234,176],[244,184],[250,192],
    [196,188],[210,184],[222,186],[232,192],
  ];

  return (
    <svg
      viewBox="0 0 420 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="nc-map-svg"
      aria-hidden="true"
      role="img"
    >
      {/* Dot matrix */}
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill="rgba(180,190,210,0.28)" />
      ))}
      {/* Yellow location marker — Dnipro region (~55% across, ~55% down) */}
      <rect x="226" y="96" width="10" height="10" rx="1" fill="#F5C400" />
      {/* Subtle glow behind marker */}
      <circle cx="231" cy="101" r="14" fill="rgba(245,196,0,0.08)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ContactsSection
═══════════════════════════════════════════════════════════════════════════ */
export function ContactsSection() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          CONTACTS SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section id="contacts" className="nc-section" aria-label="Контакти">

        {/* Two-column: left text / right map */}
        <div className="nc-top-grid">

          {/* Left */}
          <div className="nc-left">
            <div className="nc-label-row">
              <span className="nc-label-line" aria-hidden="true" />
              <p className="nc-label">Контакти</p>
            </div>
            <h2 className="nc-heading">Зв&apos;яжіться з нами</h2>
            <p className="nc-sub">
              Надішліть STL, STEP, 3MF, креслення або фото деталі —
              підготуємо розрахунок вартості та строків.
            </p>
          </div>

          {/* Right — decorative map */}
          <div className="nc-map-wrap" aria-hidden="true">
            <UkraineMap />
          </div>
        </div>

        {/* Contact info card */}
        <div className="nc-card" role="list" aria-label="Контактна інформація">

          {/* Email */}
          <div className="nc-card-item" role="listitem">
            <HexIcon size={56}><IconEmail /></HexIcon>
            <div>
              <p className="nc-card-label">Email</p>
              <a href={`mailto:${siteConfig.email}`} className="nc-card-value nc-card-link">
                {siteConfig.email}
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="nc-card-divider" aria-hidden="true" />

          {/* Location */}
          <div className="nc-card-item" role="listitem">
            <HexIcon size={56}><IconLocation /></HexIcon>
            <div>
              <p className="nc-card-label">Локація</p>
              <p className="nc-card-value">Україна</p>
            </div>
          </div>
        </div>

        {/* Primary CTA — opens Quote Wizard */}
        <div className="nc-wizard-cta">
          <WizardCTA className="nc-wizard-btn" location="contacts">
            Отримати розрахунок →
          </WizardCTA>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer className="nc-footer" aria-label="Підвал сайту">
        <div className="nc-footer-grid">

          {/* Col 1 — logo + tagline */}
          <div className="nc-footer-col">
            <Link href="/" aria-label="NEXT PRINT — на головну" className="nc-footer-logo-link">
              {/*
               * /public/logo-footer.png — place your footer logo here.
               * Recommended: white/light version, transparent bg, ~280px wide.
               */}
              <Image
                src="/logo-footer.png"
                alt="NEXT PRINT"
                width={280}
                height={72}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: 200,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Link>
            <p className="nc-footer-tagline" style={{ marginTop: 20 }}>
              Професійний 3D-друк деталей<br />
              будь-якої складності для бізнесу<br />
              та інженерних проєктів.
            </p>
          </div>

          {/* Col 2 — nav */}
          <div className="nc-footer-col">
            <p className="nc-footer-col-title">Навігація</p>
            <ul className="nc-footer-list">
              <li><a href="#about"        className="nc-footer-link">Про нас</a></li>
              <li><a href="#capabilities" className="nc-footer-link">Можливості</a></li>
              <li><a href="#process"      className="nc-footer-link">Процес роботи</a></li>
              <li><a href="#contacts"     className="nc-footer-link nc-footer-link--accent">Контакти</a></li>
            </ul>
          </div>

          {/* Col 3 — contacts */}
          <div className="nc-footer-col">
            <p className="nc-footer-col-title">Контакти</p>
            <ul className="nc-footer-list">
              <li className="nc-footer-contact-item">
                {/* Small inline email icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="nc-footer-icon">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <a href={`mailto:${siteConfig.email}`} className="nc-footer-link">{siteConfig.email}</a>
              </li>
              <li className="nc-footer-contact-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="nc-footer-icon">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                    stroke="currentColor" strokeWidth="1.6"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="nc-footer-link">Україна</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="nc-footer-bar">
          <p className="nc-footer-copy">© 2026 NextPrint. Усі права захищені.</p>
          <div className="nc-footer-legal">
            <a href="/privacy" className="nc-footer-legal-link">Політика конфіденційності</a>
            <span className="nc-footer-legal-dot" aria-hidden="true">•</span>
            <a href="/terms" className="nc-footer-legal-link">Умови використання</a>
          </div>
        </div>
      </footer>
    </>
  );
}
