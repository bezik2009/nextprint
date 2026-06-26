import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Політика конфіденційності — NEXT PRINT",
  description:
    "NextPrint поважає вашу конфіденційність та забезпечує захист персональних даних кожного відвідувача сайту.",
};

/* ── Minimal sections for the privacy page ──────────────────────────────── */
const SECTIONS = [
  {
    n: "1",
    title: "Які дані ми можемо отримувати",
    body: (
      <>
        <p>Ми можемо отримувати лише ті дані, які ви добровільно надаєте нам, зокрема:</p>
        <ul>
          <li>ім'я;</li>
          <li>електронну адресу;</li>
          <li>інформацію про ваш проєкт або запит;</li>
          <li>вкладені файли моделей або креслень, якщо ви їх надсилаєте.</li>
        </ul>
      </>
    ),
  },
  {
    n: "2",
    title: "Як ми використовуємо інформацію",
    body: (
      <>
        <p>Надані вами дані використовуються виключно для:</p>
        <ul>
          <li>обробки ваших звернень;</li>
          <li>підготовки попередніх розрахунків;</li>
          <li>комунікації щодо виконання замовлення;</li>
          <li>покращення якості наших послуг.</li>
        </ul>
        <p>Ми не використовуємо персональні дані для масових рекламних розсилок без вашої згоди.</p>
      </>
    ),
  },
  {
    n: "3",
    title: "Передача інформації третім особам",
    body: (
      <p>
        Ми не продаємо, не передаємо та не обмінюємося персональними даними
        користувачів із третіми особами, за винятком випадків, передбачених
        чинним законодавством України.
      </p>
    ),
  },
  {
    n: "4",
    title: "Конфіденційність ваших моделей",
    body: (
      <>
        <p>
          Моделі, креслення, технічна документація та інші матеріали, які ви
          надсилаєте для оцінки або виробництва, використовуються виключно для
          виконання вашого замовлення.
        </p>
        <p>
          Ми не використовуємо ці матеріали у власних цілях та не передаємо їх
          третім особам без вашої згоди.
        </p>
      </>
    ),
  },
  {
    n: "5",
    title: "Cookies",
    body: (
      <>
        <p>
          Сайт може використовувати cookies для забезпечення коректної роботи та
          покращення взаємодії з користувачами.
        </p>
        <p>Cookies не використовуються для збору конфіденційної інформації.</p>
      </>
    ),
  },
  {
    n: "6",
    title: "Зовнішні сервіси",
    body: (
      <p>
        Сайт може використовувати сторонні сервіси, наприклад хостинг, аналітику
        або засоби захисту сайту, які можуть обробляти технічну інформацію
        відповідно до власних політик конфіденційності.
      </p>
    ),
  },
  {
    n: "7",
    title: "Захист інформації",
    body: (
      <p>
        Ми вживаємо розумних організаційних та технічних заходів для захисту
        інформації від несанкціонованого доступу, втрати або зміни.
      </p>
    ),
  },
  {
    n: "8",
    title: "Ваші права",
    body: (
      <>
        <p>Ви можете звернутися до нас із проханням:</p>
        <ul>
          <li>отримати інформацію про свої персональні дані;</li>
          <li>виправити неточні дані;</li>
          <li>видалити персональні дані, якщо їх зберігання більше не є необхідним.</li>
        </ul>
      </>
    ),
  },
  {
    n: "9",
    title: "Контакти",
    body: (
      <>
        <p>Якщо у вас виникли питання щодо цієї Політики конфіденційності, зв'яжіться з нами:</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${siteConfig.email}`} className="priv-inline-link">
            {siteConfig.email}
          </a>
        </p>
        <p><strong>Локація:</strong> Україна</p>
      </>
    ),
  },
  {
    n: "10",
    title: "Зміни до політики",
    body: (
      <>
        <p>Ми можемо періодично оновлювати цю Політику конфіденційності.</p>
        <p>Актуальна редакція завжди публікується на цій сторінці.</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* ── Minimal header (static — no active nav needed on legal page) ── */}
      <header className="np-header priv-header-static">
        <Link href="/" className="np-header-logo" aria-label="NEXT PRINT — на головну">
          <Image
            src="/logo.png"
            alt="NEXT PRINT"
            height={56}
            width={210}
            style={{ height: 56, width: "auto" }}
            priority
          />
        </Link>
        <div className="np-header-spacer" aria-hidden="true" />
        <nav className="np-header-nav" aria-label="Головна навігація">
          <Link href="/#about"        className="np-nav-link">Про нас</Link>
          <Link href="/#capabilities" className="np-nav-link">Можливості</Link>
          <Link href="/#process"      className="np-nav-link">Процес</Link>
          <Link href="/#contacts"     className="np-nav-link">Контакти</Link>
        </nav>
        <Link href="/#contacts" className="np-btn-contact">Звʼязатися</Link>
      </header>

      <main className="priv-main">

        {/* ── Page hero ─────────────────────────────────────────────────── */}
        <div className="priv-hero">
          <div className="priv-container">
            <div className="priv-label-row">
              <span className="priv-label-line" aria-hidden="true" />
              <p className="priv-label">Юридична інформація</p>
            </div>
            <h1 className="priv-title">Політика конфіденційності</h1>
            <p className="priv-updated">Останнє оновлення: 26 червня 2026 року</p>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div className="priv-body">
          <div className="priv-container">

            {/* Intro */}
            <div className="priv-intro">
              <p>
                Компанія NextPrint поважає вашу конфіденційність та прагне
                забезпечити захист персональних даних кожного відвідувача сайту.
              </p>
              <p>
                Користуючись цим вебсайтом, ви погоджуєтесь із цією Політикою
                конфіденційності.
              </p>
            </div>

            {/* Sections */}
            {SECTIONS.map((s, i) => (
              <div key={s.n} className="priv-section">
                {i > 0 && <div className="priv-divider" aria-hidden="true" />}
                <div className="priv-section-head">
                  <span className="priv-section-num">{s.n}</span>
                  <h2 className="priv-section-title">{s.title}</h2>
                </div>
                <div className="priv-section-body">{s.body}</div>
              </div>
            ))}

          </div>
        </div>

        {/* ── Back link ─────────────────────────────────────────────────── */}
        <div className="priv-back-wrap">
          <div className="priv-container">
            <Link href="/" className="priv-back-link">
              ← Повернутися на головну
            </Link>
          </div>
        </div>
      </main>

      {/* ── Minimal footer ────────────────────────────────────────────────── */}
      <footer className="nc-footer priv-footer" aria-label="Підвал сайту">
        <div className="nc-footer-bar">
          <p className="nc-footer-copy">© 2026 NextPrint. Усі права захищені.</p>
          <div className="nc-footer-legal">
            <Link href="/privacy" className="nc-footer-legal-link" style={{ color: "#F5C400" }}>
              Політика конфіденційності
            </Link>
            <span className="nc-footer-legal-dot" aria-hidden="true">•</span>
            <a href="#" className="nc-footer-legal-link">Умови використання</a>
          </div>
        </div>
      </footer>
    </>
  );
}
