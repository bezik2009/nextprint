import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Умови використання — NEXT PRINT",
  description:
    "Умови використання сайту NextPrint та інформації, розміщеної на ньому.",
};

const SECTIONS = [
  {
    n: "1",
    title: "Загальні положення",
    body: (
      <>
        <p>
          Сайт NextPrint призначений для ознайомлення з послугами 3D-друку,
          контрактного виробництва пластикових компонентів та можливостями
          компанії.
        </p>
        <p>
          Інформація на сайті має ознайомчий характер і не є публічною офертою,
          якщо інше прямо не зазначено.
        </p>
      </>
    ),
  },
  {
    n: "2",
    title: "Послуги NextPrint",
    body: (
      <>
        <p>
          NextPrint надає послуги виготовлення пластикових деталей методом FDM
          3D-друку, включно з прототипуванням, малими та середніми серіями,
          підбором матеріалів і виробничою консультацією.
        </p>
        <p>
          Конкретні умови співпраці, вартість, строки та технічні параметри
          погоджуються індивідуально для кожного замовлення.
        </p>
      </>
    ),
  },
  {
    n: "3",
    title: "Надання моделей та технічної інформації",
    body: (
      <>
        <p>
          Користувач може надсилати 3D-моделі, креслення, технічні вимоги або
          іншу інформацію для оцінки можливості виробництва.
        </p>
        <p>
          Надсилаючи такі матеріали, користувач підтверджує, що має право
          використовувати та передавати їх для оцінки або виготовлення деталей.
        </p>
      </>
    ),
  },
  {
    n: "4",
    title: "Розрахунки та строки",
    body: (
      <>
        <p>
          Будь-які попередні розрахунки, строки виготовлення або технічні оцінки,
          надані через сайт або в комунікації з NextPrint, є орієнтовними до
          моменту фінального погодження замовлення.
        </p>
        <p>
          Фінальні умови замовлення визначаються після аналізу моделі, матеріалу,
          обсягу партії та технічних вимог.
        </p>
      </>
    ),
  },
  {
    n: "5",
    title: "Інтелектуальна власність",
    body: (
      <>
        <p>
          Усі матеріали сайту, включно з текстами, дизайном, візуальними
          елементами, логотипами та структурою сторінок, належать NextPrint або
          використовуються на законних підставах.
        </p>
        <p>
          Копіювання, відтворення або використання матеріалів сайту без
          попередньої згоди не допускається, за винятком випадків, дозволених
          законодавством.
        </p>
      </>
    ),
  },
  {
    n: "6",
    title: "Обмеження відповідальності",
    body: (
      <>
        <p>
          NextPrint докладає зусиль для підтримання актуальності та точності
          інформації на сайті, однак не гарантує повну відсутність помилок або
          технічних неточностей.
        </p>
        <p>
          NextPrint не несе відповідальності за прямі чи непрямі збитки, що
          можуть виникнути внаслідок використання сайту або неможливості його
          використання.
        </p>
      </>
    ),
  },
  {
    n: "7",
    title: "Зовнішні посилання",
    body: (
      <>
        <p>Сайт може містити посилання на сторонні ресурси або сервіси.</p>
        <p>
          NextPrint не відповідає за зміст, політики конфіденційності або роботу
          сторонніх сайтів.
        </p>
      </>
    ),
  },
  {
    n: "8",
    title: "Зміни до умов",
    body: (
      <>
        <p>
          NextPrint може періодично оновлювати ці Умови використання.
        </p>
        <p>Актуальна редакція завжди публікується на цій сторінці.</p>
      </>
    ),
  },
  {
    n: "9",
    title: "Контакти",
    body: (
      <>
        <p>
          Якщо у вас виникли питання щодо цих Умов використання, зв'яжіться з
          нами:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${siteConfig.email}`} className="priv-inline-link">
            {siteConfig.email}
          </a>
        </p>
        <p>
          <strong>Локація:</strong> Україна
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      {/* ── Header — static, same as privacy page ── */}
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

        {/* ── Page hero ── */}
        <div className="priv-hero">
          <div className="priv-container">
            <div className="priv-label-row">
              <span className="priv-label-line" aria-hidden="true" />
              <p className="priv-label">Юридична інформація</p>
            </div>
            <h1 className="priv-title">Умови використання</h1>
            <p className="priv-updated">Останнє оновлення: 26 червня 2026 року</p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="priv-body">
          <div className="priv-container">

            {/* Intro */}
            <div className="priv-intro">
              <p>
                Ці Умови використання регулюють доступ до вебсайту NextPrint та
                використання інформації, розміщеної на ньому.
              </p>
              <p>
                Користуючись цим вебсайтом, ви погоджуєтесь із цими Умовами
                використання.
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

        {/* ── Back link ── */}
        <div className="priv-back-wrap">
          <div className="priv-container">
            <Link href="/" className="priv-back-link">
              ← Повернутися на головну
            </Link>
          </div>
        </div>
      </main>

      {/* ── Compact footer — same as privacy page ── */}
      <footer className="nc-footer priv-footer" aria-label="Підвал сайту">
        <div className="nc-footer-bar">
          <p className="nc-footer-copy">© 2026 NextPrint. Усі права захищені.</p>
          <div className="nc-footer-legal">
            <Link href="/privacy" className="nc-footer-legal-link">
              Політика конфіденційності
            </Link>
            <span className="nc-footer-legal-dot" aria-hidden="true">•</span>
            <Link
              href="/terms"
              className="nc-footer-legal-link"
              style={{ color: "#F5C400" }}
            >
              Умови використання
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
