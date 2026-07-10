"use client";

import { useState, useId } from "react";

/* ── Data ───────────────────────────────────────────────────────────────── */
interface FAQItem {
  q: string;
  a: string;
  wide?: boolean; // spans full width in desktop 2-col layout
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "Який мінімальний тираж?",
    a: "Від 1 деталі. Працюємо з одиничними зразками для прототипування, пробними партіями та регулярним серійним виробництвом. Для великих серій обговорюємо виробничий план індивідуально.",
  },
  {
    q: "Які матеріали підтримуються?",
    a: "Працюємо з PETG, PLA, TPU, ABS, Elastan та іншими інженерними пластиками. Підбираємо матеріал під механічні, теплові та хімічні вимоги вашого виробу.",
  },
  {
    q: "Що робити, якщо немає STL?",
    a: "Підійде STEP, SolidWorks або інший CAD-файл. Якщо цифрової моделі немає — можемо створити її на основі креслення або фізичного зразка.",
  },
  {
    q: "Скільки коштує виготовлення деталей?",
    a: "Вартість розраховується індивідуально залежно від матеріалу, складності конструкції та обсягу замовлення.",
  },
  {
    q: "Які строки виготовлення?",
    a: "Залежать від складності виробу та кількості деталей. Після інженерного аналізу ми одразу повідомляємо реальний термін виконання.",
  },
  {
    q: "Чи виготовляєте конфіденційні проєкти?",
    a: "Так. Конфіденційність — стандартна умова для всіх виробничих проєктів. За запитом підписуємо NDA перед передачею моделей або технічної документації. Ваші файли не передаються третім сторонам.",
  },
  {
    q: "Чи можливе регулярне контрактне виробництво?",
    a: "Так. Працюємо на умовах контрактного виробництва: фіксована специфікація, регулярні поставки партій за погодженим графіком. Підходить для компаній, яким потрібен стабільний виробничий ресурс без власних потужностей.",
  },
  {
    q: "Як масштабувати обсяг виробництва?",
    a: "Починаємо з тестової партії, після підтвердження якості переходимо до регулярних виробничих циклів. Збільшення обсягу не потребує зміни постачальника або переналаштування виробничого процесу.",
  },
  {
    q: "Чи можете стати постійним виробничим партнером?",
    a: "Так, саме до цього ми прагнемо. Для компаній з регулярними виробничими потребами забезпечуємо стабільний цикл виготовлення, контроль якості та своєчасне відвантаження. Більшість наших замовників перейшли від разових заявок до довгострокової виробничої співпраці.",
  },
  {
    q: "Як здійснюється доставка?",
    a: "Надійно пакуємо замовлення та відправляємо по всій Україні службою Нова Пошта. Також можливий самовивіз за домовленістю.",
    wide: true,
  },
];

/* ── Chevron icon ───────────────────────────────────────────────────────── */
function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="faq-chevron"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 280ms ease",
        flexShrink: 0,
      }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#F5C400"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Single accordion card ──────────────────────────────────────────────── */
function FAQCard({
  item,
  isOpen,
  onToggle,
  answerId,
  wide,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  answerId: string;
  wide?: boolean;
}) {
  return (
    <div className={`faq-card${isOpen ? " faq-card--open" : ""}${wide ? " faq-card--wide" : ""}`}>
      <button
        className="faq-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={answerId}
        type="button"
      >
        <span className="faq-question">{item.q}</span>
        <ChevronDown open={isOpen} />
      </button>

      <div
        id={answerId}
        className={`faq-answer${isOpen ? " faq-answer--open" : ""}`}
        role="region"
        aria-label={item.q}
      >
        <p className="faq-answer-text">{item.a}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQSection
═══════════════════════════════════════════════════════════════════════════ */
export function FAQSection() {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number>(FAQ_ITEMS.length - 1);
  const uid = useId();

  const toggle = (i: number) => {
    // If clicking the open item, keep it open (always one open)
    setOpenIndex(i);
  };

  // Split into 2-col grid items (first 6) and the full-width last item
  const gridItems = FAQ_ITEMS.filter((item) => !item.wide);
  const wideItem = FAQ_ITEMS.find((item) => item.wide);
  const wideIndex = FAQ_ITEMS.findIndex((item) => item.wide);

  return (
    <section className="faq-section" aria-label="Часті питання">

      {/* Header */}
      <div className="faq-header">
        <div className="faq-label-row">
          <span className="faq-label-line" aria-hidden="true" />
          <p className="faq-label">FAQ</p>
        </div>
        <h2 className="faq-heading">Часті питання</h2>
      </div>

      {/* Desktop 2-col grid for items 1–6 */}
      <div className="faq-grid">
        {gridItems.map((item, i) => (
          <FAQCard
            key={i}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            answerId={`${uid}-answer-${i}`}
          />
        ))}
      </div>

      {/* Full-width item 7 */}
      {wideItem && (
        <div className="faq-wide-row">
          <FAQCard
            item={wideItem}
            isOpen={openIndex === wideIndex}
            onToggle={() => toggle(wideIndex)}
            answerId={`${uid}-answer-${wideIndex}`}
            wide
          />
        </div>
      )}
    </section>
  );
}
