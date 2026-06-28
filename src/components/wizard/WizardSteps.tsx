"use client";

import { useRef, useState } from "react";
import { formatPhoneForDisplay, validatePhone } from "./validation";
import type {
  ContactErrors,
  Deadline,
  ProductionType,
  UploadedFile,
  UseCase,
  WizardData,
} from "./types";

/* ─────────────────────────────────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────────────────────────────────── */

function StepHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="wz-step-head">
      <h3 className="wz-step-title">{title}</h3>
      {sub && <p className="wz-step-sub">{sub}</p>}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  label,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`wz-option-card${selected ? " wz-option-card--selected" : ""}`}
    >
      <span className="wz-option-label">{label}</span>
      {sub && <span className="wz-option-sub">{sub}</span>}
      {selected && (
        <span className="wz-option-check" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="#F5C400" />
            <path d="M4.5 8L7 10.5L11.5 6" stroke="#020B16"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 1 — What do you need to manufacture?
───────────────────────────────────────────────────────────────────────── */

const PRODUCTION_OPTIONS: { value: ProductionType; label: string; sub: string }[] = [
  { value: "prototype",   label: "Прототип",               sub: "Одна деталь або кілька для тесту" },
  { value: "small-batch", label: "Мала серія",              sub: "Від 10 до 1000 деталей"          },
  { value: "regular",     label: "Регулярне виробництво",   sub: "Постійні замовлення"              },
];

export function Step1({
  data,
  update,
  onAutoAdvance,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  onAutoAdvance?: () => void;
}) {
  return (
    <div className="wz-step">
      <StepHeading title="Що потрібно виготовити?" />
      <div className="wz-options-grid wz-options-grid--1col">
        {PRODUCTION_OPTIONS.map((o) => (
          <OptionCard
            key={o.value}
            selected={data.step1_productionType === o.value}
            onClick={() => {
              update({ step1_productionType: o.value });
              setTimeout(() => onAutoAdvance?.(), 180);
            }}
            label={o.label}
            sub={o.sub}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 2 — Do you have a model? (with inline file upload if Yes)
───────────────────────────────────────────────────────────────────────── */

const ACCEPTED = ".stl,.step,.stp,.3mf,.obj,.zip,.rar,.pdf,.dxf,.png,.jpg,.jpeg";

function fmtBytes(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} МБ`
    : `${Math.round(bytes / 1024)} КБ`;
}

export function Step2({
  data,
  update,
  onFilesChange,
  onAutoAdvance,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  onFilesChange?: (files: File[]) => void;
  onAutoAdvance?: () => void;
}) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const fileObjs  = useRef<File[]>([]);

  const hasModel = data.step2_fileFormat !== "" && data.step2_fileFormat !== "need-modeling"
    ? "yes"
    : data.step2_fileFormat === "need-modeling"
    ? "no"
    : "";

  const handleChoice = (choice: "yes" | "no") => {
    if (choice === "no") {
      update({ step2_fileFormat: "need-modeling", step8_files: [] });
      fileObjs.current = [];
      onFilesChange?.([]);
      setTimeout(() => onAutoAdvance?.(), 180);
    } else {
      update({ step2_fileFormat: "stl" });
    }
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming);
    fileObjs.current = [...fileObjs.current, ...newFiles];
    const metadata: UploadedFile[] = fileObjs.current.map((f) => ({
      name: f.name, size: f.size, type: f.type,
    }));
    const ext = newFiles[0]?.name.split(".").pop()?.toLowerCase();
    const fmt = ext === "step" || ext === "stp" ? "step"
      : ext === "3mf" ? "3mf"
      : "stl";
    update({ step8_files: metadata, step2_fileFormat: fmt as WizardData["step2_fileFormat"] });
    onFilesChange?.(fileObjs.current);
    // Auto-advance after first file is added
    if (fileObjs.current.length === newFiles.length) {
      setTimeout(() => onAutoAdvance?.(), 400);
    }
  };

  const removeFile = (idx: number) => {
    fileObjs.current = fileObjs.current.filter((_, i) => i !== idx);
    update({ step8_files: data.step8_files.filter((_, i) => i !== idx) });
    onFilesChange?.(fileObjs.current);
  };

  return (
    <div className="wz-step">
      <StepHeading
        title="Є готова 3D-модель або креслення?"
        sub="Якщо немає — нічого страшного, наш менеджер допоможе."
      />

      <div className="wz-options-grid wz-options-grid--2col" style={{ marginBottom: 20 }}>
        <OptionCard
          selected={hasModel === "yes"}
          onClick={() => handleChoice("yes")}
          label="Так, є файл"
          sub="STL, STEP, 3MF, PDF, креслення…"
        />
        <OptionCard
          selected={hasModel === "no"}
          onClick={() => handleChoice("no")}
          label="Ні, поки немає"
          sub="Обговоримо деталі після заявки"
        />
      </div>

      {/* Inline dropzone — visible only when "yes" is selected */}
      {hasModel === "yes" && (
        <>
          <div
            className="wz-dropzone"
            role="button"
            tabIndex={0}
            aria-label="Область для завантаження файлів"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("wz-dropzone--over");
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove("wz-dropzone--over")}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("wz-dropzone--over");
              handleFiles(e.dataTransfer.files);
            }}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"
                 aria-hidden="true" className="wz-dropzone-icon">
              <path d="M16 20V8M16 8L11 13M16 8L21 13"
                stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 24H26" stroke="#F5C400" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <p className="wz-dropzone-title">
              Перетягніть файли або{" "}
              <span className="wz-dropzone-link">оберіть файл</span>
            </p>
            <p className="wz-dropzone-hint">STL, STEP, 3MF, OBJ, PDF, DXF, PNG, JPG</p>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              className="wz-file-input"
              aria-label="Вибір файлів"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {data.step8_files.length > 0 && (
            <ul className="wz-file-list" style={{ marginTop: 10 }}>
              {data.step8_files.map((f, i) => (
                <li key={i} className="wz-file-item">
                  <span className="wz-file-name">{f.name}</span>
                  <span className="wz-file-size">{fmtBytes(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="wz-file-remove"
                    aria-label={`Видалити ${f.name}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 2L12 12M12 2L2 12"
                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 3 — Quantity + Use case + Deadline (3-in-1)
───────────────────────────────────────────────────────────────────────── */

const QTY_PRESETS = ["1", "10", "50", "100", "500"];

const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: "electronics", label: "Корпус електроніки" },
  { value: "robotics",    label: "Робототехніка"      },
  { value: "automotive",  label: "Автомобіль"         },
  { value: "industrial",  label: "Промисловість"      },
  { value: "household",   label: "Побут"              },
  { value: "other",       label: "Інше"               },
];

const DEADLINE_OPTIONS: { value: Deadline; label: string; sub: string; dot: string }[] = [
  { value: "urgent",   label: "Терміново",   sub: "1–2 дні", dot: "wz-dot--red"    },
  { value: "3-5-days", label: "3–5 днів",    sub: "",        dot: "wz-dot--yellow" },
  { value: "week",     label: "До тижня",    sub: "",        dot: "wz-dot--green"  },
  { value: "flexible", label: "Не поспішаю", sub: "",        dot: "wz-dot--gray"   },
];

export function Step3({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const [showCustomQty, setShowCustomQty] = useState(
    !!data.step3_quantity && !QTY_PRESETS.includes(data.step3_quantity)
  );

  return (
    <div className="wz-step">
      <StepHeading title="Деталі замовлення" />

      {/* ── Quantity ── */}
      <p className="wz-section-label">Кількість деталей</p>
      <div className="wz-qty-pills">
        {QTY_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setShowCustomQty(false);
              update({ step3_quantity: p });
            }}
            className={`wz-preset-pill${data.step3_quantity === p && !showCustomQty ? " wz-preset-pill--active" : ""}`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setShowCustomQty(true);
            update({ step3_quantity: "" });
          }}
          className={`wz-preset-pill${showCustomQty ? " wz-preset-pill--active" : ""}`}
        >
          Інша
        </button>
      </div>
      {showCustomQty && (
        <input
          type="number"
          min={1}
          placeholder="Введіть кількість"
          value={data.step3_quantity}
          onChange={(e) => update({ step3_quantity: e.target.value })}
          className="wz-input"
          style={{ marginTop: 10 }}
          aria-label="Кількість деталей"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      )}

      {/* ── Use case ── */}
      <p className="wz-section-label" style={{ marginTop: 22 }}>Для чого потрібна деталь?</p>
      <div className="wz-options-grid wz-options-grid--3col">
        {USE_CASE_OPTIONS.map((o) => (
          <OptionCard
            key={o.value}
            selected={data.step5_useCase === o.value}
            onClick={() => update({ step5_useCase: o.value })}
            label={o.label}
          />
        ))}
      </div>
      {data.step5_useCase === "other" && (
        <input
          type="text"
          placeholder="Опишіть призначення деталі"
          value={data.step5_useCaseOther}
          onChange={(e) => update({ step5_useCaseOther: e.target.value })}
          className="wz-input"
          style={{ marginTop: 10 }}
          aria-label="Опис призначення"
        />
      )}

      {/* ── Deadline ── */}
      <p className="wz-section-label" style={{ marginTop: 22 }}>Коли потрібно?</p>
      <div className="wz-options-grid wz-options-grid--2col">
        {DEADLINE_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => update({ step7_deadline: o.value })}
            className={`wz-option-card wz-option-card--deadline${data.step7_deadline === o.value ? " wz-option-card--selected" : ""}`}
          >
            <span className={`wz-dot ${o.dot}`} aria-hidden="true" />
            <span className="wz-option-label">{o.label}</span>
            {o.sub && <span className="wz-option-sub">{o.sub}</span>}
            {data.step7_deadline === o.value && (
              <span className="wz-option-check" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" fill="#F5C400" />
                  <path d="M4.5 8L7 10.5L11.5 6" stroke="#020B16"
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 4 — Contacts
───────────────────────────────────────────────────────────────────────── */

export function Step4({
  data,
  update,
  errors,
  onFieldChange,
  onKeyDown,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  errors: ContactErrors;
  onFieldChange?: (field: keyof ContactErrors) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const c = data.step9_contact;
  const set = (k: keyof typeof c, v: string) => {
    update({ step9_contact: { ...c, [k]: v } });
    onFieldChange?.(k as keyof ContactErrors);
  };

  return (
    <div className="wz-step">
      <StepHeading
        title="Ваші контакти"
        sub="Зв'яжемося, щоб обговорити деталі та підготувати розрахунок."
      />
      <div className="wz-form-grid">

        <div className={`wz-field${errors.name ? " wz-field--error" : ""}`}>
          <label className="wz-label" htmlFor="wz-name">
            Ім&apos;я <span aria-hidden="true">*</span>
          </label>
          <input
            id="wz-name"
            type="text"
            className="wz-input"
            placeholder="Іван Петренко"
            value={c.name}
            onChange={(e) => set("name", e.target.value)}
            onKeyDown={onKeyDown}
            aria-required="true"
          />
          {errors.name && <p className="wz-error" role="alert">{errors.name}</p>}
        </div>

        <div className={`wz-field${errors.phone ? " wz-field--error" : ""}`}>
          <label className="wz-label" htmlFor="wz-phone">
            Телефон <span aria-hidden="true">*</span>
          </label>
          <input
            id="wz-phone"
            type="tel"
            className="wz-input"
            placeholder="+38 (067) 123 45 67"
            value={c.phone}
            onChange={(e) => set("phone", e.target.value)}
            onKeyDown={onKeyDown}
          />
          {errors.phone && errors.phone.trim() && (
            <p className="wz-error" role="alert">{errors.phone}</p>
          )}
        </div>

        <div className={`wz-field${errors.email ? " wz-field--error" : ""}`}>
          <label className="wz-label" htmlFor="wz-email">Email</label>
          <input
            id="wz-email"
            type="email"
            className="wz-input"
            placeholder="ivan@company.com"
            value={c.email}
            onChange={(e) => set("email", e.target.value)}
            onKeyDown={onKeyDown}
          />
          {errors.email && errors.email.trim() && (
            <p className="wz-error" role="alert">{errors.email}</p>
          )}
        </div>

        <div className="wz-field">
          <label className="wz-label" htmlFor="wz-company">Компанія</label>
          <input
            id="wz-company"
            type="text"
            className="wz-input"
            placeholder="NextCorp LLC"
            value={c.company}
            onChange={(e) => set("company", e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        {errors._contact && (
          <p className="wz-error wz-error--span" role="alert">{errors._contact}</p>
        )}

        <div className="wz-field wz-field--full">
          <label className="wz-label" htmlFor="wz-comment">
            Є щось важливе, що нам потрібно знати?
          </label>
          <textarea
            id="wz-comment"
            className="wz-input wz-textarea"
            placeholder="Наприклад: потрібна висока міцність, бажаний колір, потрібно допомогти з вибором матеріалу тощо."
            rows={3}
            value={c.comment}
            onChange={(e) => set("comment", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 5 — Preview / Review
───────────────────────────────────────────────────────────────────────── */

function truncateComment(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.7 ? cut.slice(0, lastSpace) : cut) + "…";
}

const PRODUCTION_TYPE_LABELS: Record<string, string> = {
  prototype:     "Прототип",
  "small-batch": "Мала серія",
  regular:       "Регулярне виробництво",
};

const USE_CASE_LABELS: Record<string, string> = {
  electronics: "Корпус електроніки",
  robotics:    "Робототехніка",
  automotive:  "Автомобіль",
  industrial:  "Промисловість",
  household:   "Побут",
  other:       "Інше",
};

const DEADLINE_LABELS: Record<string, string> = {
  urgent:    "Терміново (1–2 дні)",
  "3-5-days":"3–5 днів",
  week:      "До тижня",
  flexible:  "Не поспішаю",
};

const EMPTY = <span className="wz-review-empty">Не вказано</span>;

function ReviewRow({
  label, value, onEdit,
}: {
  label: string; value: React.ReactNode; onEdit: () => void;
}) {
  return (
    <div className="wz-review-row">
      <div className="wz-review-row-inner">
        <p className="wz-review-label">{label}</p>
        <div className="wz-review-value">{value}</div>
      </div>
      <button type="button" onClick={onEdit} className="wz-review-edit"
              aria-label={`Змінити: ${label}`}>Змінити</button>
    </div>
  );
}

export function Step5({
  data,
  onEdit,
  contactsValid,
  submitError,
}: {
  data: WizardData;
  onEdit: (step: number) => void;
  contactsValid: boolean;
  submitError?: string | null;
}) {
  const c = data.step9_contact;

  const displayPhone = c.phone.trim() && validatePhone(c.phone)
    ? formatPhoneForDisplay(c.phone) : c.phone.trim();

  const contactLines = [c.name, c.company, c.email, displayPhone].filter(Boolean);
  const contactValue = contactLines.length > 0 ? (
    <span className="wz-review-contact-lines">
      {contactLines.map((line, i) => (
        <span key={i} className="wz-review-contact-line">{line}</span>
      ))}
    </span>
  ) : EMPTY;

  const hasModel = data.step2_fileFormat !== "" && data.step2_fileFormat !== "need-modeling";
  const modelValue = hasModel
    ? (data.step8_files.length > 0
        ? `${data.step8_files.length} файл(ів) завантажено`
        : "Є файл")
    : "Немає файлу";

  const useCaseValue =
    data.step5_useCase === "other" && data.step5_useCaseOther
      ? `Інше — ${data.step5_useCaseOther}`
      : data.step5_useCase ? USE_CASE_LABELS[data.step5_useCase] : "";

  const commentDisplay = c.comment.trim() ? truncateComment(c.comment.trim()) : null;

  const rows = [
    { label: "Тип замовлення",    value: PRODUCTION_TYPE_LABELS[data.step1_productionType] || EMPTY, step: 1 },
    { label: "Модель / файл",     value: modelValue,                                                   step: 2 },
    { label: "Кількість",         value: data.step3_quantity ? `${data.step3_quantity} шт.` : EMPTY,  step: 3 },
    { label: "Призначення",       value: useCaseValue || EMPTY,                                        step: 3 },
    { label: "Коли потрібно",     value: DEADLINE_LABELS[data.step7_deadline] || EMPTY,               step: 3 },
    { label: "Контакти",          value: contactValue,                                                  step: 4 },
    { label: "Коментар",          value: commentDisplay || EMPTY,                                       step: 4 },
  ];

  return (
    <div className="wz-step">
      <StepHeading
        title="Перевірте заявку"
        sub="Переконайтесь, що все вірно перед відправкою."
      />

      {/* Engineer info block */}
      {contactsValid && !submitError && (
        <div className="wz-review-info">
          <p className="wz-review-info-title">
            <span className="wz-review-check" aria-hidden="true">✓</span>{" "}
            Все готово!
          </p>
          <p className="wz-review-info-body">
            Після надсилання ми перевіримо заявку, переглянемо модель або
            креслення, якщо ви їх прикріпили, і зв&apos;яжемося з вами для
            уточнення деталей.
          </p>
          <p className="wz-review-info-hint">
            Зазвичай відповідаємо протягом 1 робочого дня.
          </p>
        </div>
      )}

      {submitError ? (
        <p className="wz-review-warning wz-review-warning--submit" role="alert">
          {submitError}
        </p>
      ) : !contactsValid ? (
        <p className="wz-review-warning" role="alert">
          Перевірте контактні дані перед відправкою
        </p>
      ) : null}

      <div className="wz-review-grid">
        {rows.map((row) => (
          <ReviewRow
            key={row.label}
            label={row.label}
            value={row.value}
            onEdit={() => onEdit(row.step)}
          />
        ))}

        {/* Uploaded files — full width */}
        <div className="wz-review-row wz-review-row--full">
          <div className="wz-review-row-inner">
            <p className="wz-review-label">Файли</p>
            <div className="wz-review-value">
              {data.step8_files.length === 0 ? (
                <span className="wz-review-empty">Файли не прикріплено</span>
              ) : (
                <ul className="wz-review-files">
                  {data.step8_files.map((f, i) => (
                    <li key={i} className="wz-review-file">
                      <span className="wz-review-file-name">{f.name}</span>
                      <span className="wz-review-file-meta">{fmtBytes(f.size)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button type="button" onClick={() => onEdit(2)}
                  className="wz-review-edit" aria-label="Змінити: Файли">
            Змінити
          </button>
        </div>
      </div>
    </div>
  );
}
