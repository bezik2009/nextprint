"use client";

import { useRef } from "react";
import { formatPhoneForDisplay, validatePhone } from "./validation";
import type { ContactErrors, WizardData, Deadline, FileFormat, Material,
  ProductionType, SizePreset, UploadedFile, UseCase } from "./types";

/* ── Shared sub-components ──────────────────────────────────────────────── */

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
            <path
              d="M4.5 8L7 10.5L11.5 6"
              stroke="#020B16"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

function StepHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="wz-step-head">
      <h3 className="wz-step-title">{title}</h3>
      {sub && <p className="wz-step-sub">{sub}</p>}
    </div>
  );
}

/* ── Step 1 — Production type ────────────────────────────────────────────── */
export function Step1({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const options: { value: ProductionType; label: string; sub: string }[] = [
    { value: "prototype", label: "Прототип", sub: "Одна деталь або кілька для тесту" },
    { value: "small-batch", label: "Мала серія", sub: "1–100 деталей" },
    { value: "medium-batch", label: "Середня серія", sub: "100–1000 деталей" },
    { value: "regular", label: "Регулярне виробництво", sub: "Постійні замовлення" },
  ];
  return (
    <div className="wz-step">
      <StepHeading title="Що потрібно виготовити?" />
      <div className="wz-options-grid wz-options-grid--2col">
        {options.map((o) => (
          <OptionCard
            key={o.value}
            selected={data.step1_productionType === o.value}
            onClick={() => update({ step1_productionType: o.value })}
            label={o.label}
            sub={o.sub}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Step 2 — File format ─────────────────────────────────────────────────── */
export function Step2({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const options: { value: FileFormat; label: string; sub?: string }[] = [
    { value: "stl", label: "STL" },
    { value: "step", label: "STEP" },
    { value: "3mf", label: "3MF" },
    { value: "drawing", label: "Креслення", sub: "PDF, DXF" },
    { value: "photo", label: "Фото", sub: "PNG, JPG" },
    { value: "need-modeling", label: "Потрібно змоделювати", sub: "У нас немає файлу" },
  ];
  return (
    <div className="wz-step">
      <StepHeading
        title="Чи є у вас модель?"
        sub="Оберіть формат наявного файлу або яку допомогу вам потрібно"
      />
      <div className="wz-options-grid wz-options-grid--3col">
        {options.map((o) => (
          <OptionCard
            key={o.value}
            selected={data.step2_fileFormat === o.value}
            onClick={() => update({ step2_fileFormat: o.value })}
            label={o.label}
            sub={o.sub}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Step 3 — Quantity ────────────────────────────────────────────────────── */
export function Step3({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const presets = [1, 10, 50, 100, 500];
  return (
    <div className="wz-step">
      <StepHeading
        title="Яка кількість деталей?"
        sub="Вкажіть орієнтовну кількість"
      />
      <div className="wz-qty-wrap">
        <input
          type="number"
          min={1}
          placeholder="250"
          value={data.step3_quantity}
          onChange={(e) => update({ step3_quantity: e.target.value })}
          className="wz-input wz-input--lg"
          aria-label="Кількість деталей"
        />
        <span className="wz-input-unit">шт.</span>
      </div>
      <div className="wz-presets">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => update({ step3_quantity: String(p) })}
            className={`wz-preset-pill${data.step3_quantity === String(p) ? " wz-preset-pill--active" : ""}`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Step 4 — Size ────────────────────────────────────────────────────────── */
export function Step4({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const presets: { value: SizePreset; label: string; sub: string }[] = [
    { value: "xs", label: "до 5 см", sub: "Дрібні деталі" },
    { value: "sm", label: "5–15 см", sub: "Середні деталі" },
    { value: "md", label: "15–30 см", sub: "Великі деталі" },
    { value: "lg", label: "більше 30 см", sub: "Габаритні деталі" },
  ];
  return (
    <div className="wz-step">
      <StepHeading
        title="Приблизний розмір деталі"
        sub="Вкажіть довжину × ширину × висоту або оберіть приблизний розмір"
      />
      <div className="wz-size-input-wrap">
        <input
          type="text"
          placeholder="100 × 80 × 20"
          value={data.step4_size}
          onChange={(e) => {
            update({ step4_size: e.target.value, step4_sizePreset: "" });
          }}
          className="wz-input"
          aria-label="Розміри деталі"
        />
        <span className="wz-input-unit">мм</span>
      </div>
      <p className="wz-or-label">або оберіть приблизний розмір</p>
      <div className="wz-options-grid wz-options-grid--4col">
        {presets.map((p) => (
          <OptionCard
            key={p.value}
            selected={data.step4_sizePreset === p.value}
            onClick={() =>
              update({ step4_sizePreset: p.value, step4_size: "" })
            }
            label={p.label}
            sub={p.sub}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Step 5 — Use case ────────────────────────────────────────────────────── */
export function Step5({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const options: { value: UseCase; label: string }[] = [
    { value: "electronics", label: "Корпус електроніки" },
    { value: "robotics", label: "Робототехніка" },
    { value: "automotive", label: "Автомобіль" },
    { value: "industrial", label: "Промисловість" },
    { value: "household", label: "Побут" },
    { value: "other", label: "Інше" },
  ];
  return (
    <div className="wz-step">
      <StepHeading title="Для чого використовується деталь?" />
      <div className="wz-options-grid wz-options-grid--3col">
        {options.map((o) => (
          <OptionCard
            key={o.value}
            selected={data.step5_useCase === o.value}
            onClick={() => update({ step5_useCase: o.value })}
            label={o.label}
          />
        ))}
      </div>
      {data.step5_useCase === "other" && (
        <div className="wz-follow-up">
          <input
            type="text"
            placeholder="Опишіть призначення деталі"
            value={data.step5_useCaseOther}
            onChange={(e) => update({ step5_useCaseOther: e.target.value })}
            className="wz-input"
            aria-label="Опис призначення деталі"
          />
        </div>
      )}
    </div>
  );
}

/* ── Step 6 — Material ────────────────────────────────────────────────────── */
export function Step6({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const options: { value: Material; label: string; sub?: string }[] = [
    { value: "pla", label: "PLA", sub: "Прототипи, декор" },
    { value: "petg", label: "PETG", sub: "Функціональні деталі" },
    { value: "abs", label: "ABS", sub: "Міцні деталі" },
    { value: "asa", label: "ASA", sub: "Вулиця, UV-стійкий" },
    { value: "tpu", label: "TPU", sub: "Гнучкі деталі" },
    { value: "nylon", label: "Nylon", sub: "Інженерний пластик" },
    { value: "pc", label: "PC", sub: "Полікарбонат" },
    { value: "pctg", label: "PCTG", sub: "Прозорий, міцний" },
    { value: "unknown", label: "Не знаю", sub: "Допоможемо обрати" },
  ];
  return (
    <div className="wz-step">
      <StepHeading
        title="Який матеріал потрібен?"
        sub="Оберіть матеріал або вкажіть що не знаєте — ми підберемо"
      />
      <div className="wz-options-grid wz-options-grid--3col">
        {options.map((o) => (
          <OptionCard
            key={o.value}
            selected={data.step6_material === o.value}
            onClick={() => update({ step6_material: o.value })}
            label={o.label}
            sub={o.sub}
          />
        ))}
      </div>
      {data.step6_material === "unknown" && (
        <p className="wz-helper-text">
          Не проблема — ми допоможемо підібрати найкращий матеріал для вашого завдання.
        </p>
      )}
    </div>
  );
}

/* ── Step 7 — Deadline ────────────────────────────────────────────────────── */
export function Step7({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const options: { value: Deadline; label: string; sub: string }[] = [
    { value: "urgent", label: "Терміново", sub: "1–2 дні" },
    { value: "3-5-days", label: "3–5 днів", sub: "Стандартні строки" },
    { value: "week", label: "До тижня", sub: "Є час на якість" },
    { value: "flexible", label: "Не поспішає", sub: "Більше тижня" },
  ];
  return (
    <div className="wz-step">
      <StepHeading title="Коли потрібно?" />
      <div className="wz-options-grid wz-options-grid--2col">
        {options.map((o) => (
          <OptionCard
            key={o.value}
            selected={data.step7_deadline === o.value}
            onClick={() => update({ step7_deadline: o.value })}
            label={o.label}
            sub={o.sub}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Step 8 — File upload ─────────────────────────────────────────────────── */
const ACCEPTED = ".stl,.step,.stp,.3mf,.obj,.zip,.rar,.pdf,.dxf,.png,.jpg,.jpeg";

export function Step8({
  data,
  update,
  onFilesChange,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  /** Called with the current full File[] whenever the list changes */
  onFilesChange?: (files: File[]) => void;
}) {
  const inputRef  = useRef<HTMLInputElement>(null);
  /** Mirror of data.step8_files as real File objects — kept in sync with metadata */
  const fileObjs  = useRef<File[]>([]);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming);
    fileObjs.current = [...fileObjs.current, ...newFiles];
    const metadata: UploadedFile[] = fileObjs.current.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    update({ step8_files: metadata });
    onFilesChange?.(fileObjs.current);
  };

  const removeFile = (idx: number) => {
    fileObjs.current = fileObjs.current.filter((_, i) => i !== idx);
    update({
      step8_files: data.step8_files.filter((_, i) => i !== idx),
    });
    onFilesChange?.(fileObjs.current);
  };

  const fmt = (bytes: number) =>
    bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} МБ`
      : `${Math.round(bytes / 1024)} КБ`;

  return (
    <div className="wz-step">
      <StepHeading
        title="Завантажте модель або креслення"
        sub="Необов'язково — можна пропустити і надіслати файли пізніше"
      />

      {/* Drop zone */}
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
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("wz-dropzone--over");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("wz-dropzone--over");
          handleFiles(e.dataTransfer.files);
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
          className="wz-dropzone-icon"
        >
          <path
            d="M16 20V8M16 8L11 13M16 8L21 13"
            stroke="#F5C400"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 24H26"
            stroke="#F5C400"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <p className="wz-dropzone-title">
          Перетягніть файли сюди або{" "}
          <span className="wz-dropzone-link">оберіть файл</span>
        </p>
        <p className="wz-dropzone-hint">STL, STEP, 3MF, OBJ, ZIP, RAR, PDF, DXF, PNG, JPG</p>
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

      {/* File list */}
      {data.step8_files.length > 0 && (
        <ul className="wz-file-list" aria-label="Завантажені файли">
          {data.step8_files.map((f, i) => (
            <li key={i} className="wz-file-item">
              <span className="wz-file-name">{f.name}</span>
              <span className="wz-file-size">{fmt(f.size)}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="wz-file-remove"
                aria-label={`Видалити ${f.name}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Step 9 — Contacts ────────────────────────────────────────────────────── */
export function Step9({
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
    onFieldChange?.(k);
  };

  return (
    <div className="wz-step">
      <StepHeading
        title="Ваші контакти"
        sub="Вкажіть ім'я та хоча б один спосіб зв'язку"
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
            aria-describedby={errors.name ? "wz-name-err" : undefined}
          />
          {errors.name && (
            <p className="wz-error" id="wz-name-err" role="alert">
              {errors.name}
            </p>
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
            aria-describedby={errors.email ? "wz-email-err" : undefined}
          />
          {errors.email && errors.email.trim() && (
            <p className="wz-error" id="wz-email-err" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className={`wz-field${errors.phone ? " wz-field--error" : ""}`}>
          <label className="wz-label" htmlFor="wz-phone">Телефон</label>
          <input
            id="wz-phone"
            type="tel"
            className="wz-input"
            placeholder="+38 (067) 123 45 67"
            value={c.phone}
            onChange={(e) => set("phone", e.target.value)}
            onKeyDown={onKeyDown}
            aria-describedby={errors.phone ? "wz-phone-err" : undefined}
          />
          {errors.phone && errors.phone.trim() && (
            <p className="wz-error" id="wz-phone-err" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        {errors._contact && (
          <p className="wz-error wz-error--span" role="alert">
            {errors._contact}
          </p>
        )}

        <div className="wz-field wz-field--full">
          <label className="wz-label" htmlFor="wz-comment">Коментар</label>
          <textarea
            id="wz-comment"
            className="wz-input wz-textarea"
            placeholder="Будь-яка додаткова інформація про ваше замовлення"
            rows={3}
            value={c.comment}
            onChange={(e) => set("comment", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Step 10 — Preview / Review ───────────────────────────────────────────── */

function fmtBytes(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} МБ`
    : `${Math.round(bytes / 1024)} КБ`;
}

/** Truncate long comment to ~160 chars at a word boundary */
function truncateComment(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.7 ? cut.slice(0, lastSpace) : cut) + "…";
}

const PRODUCTION_TYPE_LABELS: Record<string, string> = {
  prototype: "Прототип",
  "small-batch": "Мала серія (1–100)",
  "medium-batch": "Середня серія (100–1000)",
  regular: "Регулярне виробництво",
};
const FILE_FORMAT_LABELS: Record<string, string> = {
  stl: "STL",
  step: "STEP",
  "3mf": "3MF",
  drawing: "Креслення",
  photo: "Фото",
  "need-modeling": "Потрібно змоделювати",
};
const USE_CASE_LABELS: Record<string, string> = {
  electronics: "Корпус електроніки",
  robotics: "Робототехніка",
  automotive: "Автомобіль",
  industrial: "Промисловість",
  household: "Побут",
  other: "Інше",
};
const MATERIAL_LABELS: Record<string, string> = {
  pla: "PLA",
  petg: "PETG",
  abs: "ABS",
  asa: "ASA",
  tpu: "TPU",
  nylon: "Nylon",
  pc: "PC",
  pctg: "PCTG",
  unknown: "Не знаю (допоможіть обрати)",
};
const DEADLINE_LABELS: Record<string, string> = {
  urgent: "Терміново (1–2 дні)",
  "3-5-days": "3–5 днів",
  week: "До тижня",
  flexible: "Не поспішає",
};
const SIZE_PRESET_LABELS: Record<string, string> = {
  xs: "до 5 см",
  sm: "5–15 см",
  md: "15–30 см",
  lg: "більше 30 см",
};

const EMPTY = <span className="wz-review-empty">Не вказано</span>;

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="wz-review-row">
      <div className="wz-review-row-inner">
        <p className="wz-review-label">{label}</p>
        <div className="wz-review-value">{value}</div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="wz-review-edit"
        aria-label={`Змінити: ${label}`}
      >
        Змінити
      </button>
    </div>
  );
}

export function Step10({
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

  /* ── Contact multiline block ── */
  const displayPhone = c.phone.trim() && validatePhone(c.phone)
    ? formatPhoneForDisplay(c.phone)
    : c.phone.trim();

  const contactLines = [c.name, c.company, c.email, displayPhone].filter(Boolean);
  const contactValue =
    contactLines.length > 0 ? (
      <span className="wz-review-contact-lines">
        {contactLines.map((line, i) => (
          <span key={i} className="wz-review-contact-line">{line}</span>
        ))}
      </span>
    ) : EMPTY;

  /* ── Size ── */
  const sizeValue = data.step4_size
    ? `${data.step4_size} мм`
    : data.step4_sizePreset
    ? SIZE_PRESET_LABELS[data.step4_sizePreset]
    : "";

  /* ── Use case ── */
  const useCaseValue =
    data.step5_useCase === "other" && data.step5_useCaseOther
      ? `Інше: ${data.step5_useCaseOther}`
      : data.step5_useCase
      ? USE_CASE_LABELS[data.step5_useCase]
      : "";

  /* ── Comment (truncated) ── */
  const commentDisplay = c.comment.trim()
    ? truncateComment(c.comment.trim())
    : null;

  const rows: { label: string; value: React.ReactNode; step: number }[] = [
    { label: "Тип замовлення",    value: PRODUCTION_TYPE_LABELS[data.step1_productionType] || EMPTY, step: 1 },
    { label: "Модель / файл",     value: FILE_FORMAT_LABELS[data.step2_fileFormat] || EMPTY,         step: 2 },
    { label: "Кількість деталей", value: data.step3_quantity ? `${data.step3_quantity} шт.` : EMPTY, step: 3 },
    { label: "Розмір деталі",     value: sizeValue || EMPTY,                                          step: 4 },
    { label: "Сфера використання",value: useCaseValue || EMPTY,                                       step: 5 },
    { label: "Матеріал",          value: MATERIAL_LABELS[data.step6_material] || EMPTY,               step: 6 },
    { label: "Строки",            value: DEADLINE_LABELS[data.step7_deadline] || EMPTY,               step: 7 },
    { label: "Контакти",          value: contactValue,                                                 step: 9 },
    { label: "Коментар",          value: commentDisplay || EMPTY,                                      step: 9 },
  ];

  return (
    <div className="wz-step">
      <StepHeading
        title="Перевірте заявку"
        sub="Переконайтесь, що все вірно перед відправкою."
      />

      {/* Status / error line */}
      {submitError ? (
        <p className="wz-review-warning wz-review-warning--submit" role="alert">
          {submitError}
        </p>
      ) : contactsValid ? (
        <p className="wz-review-status">
          <span className="wz-review-check" aria-hidden="true">✓</span>{" "}
          Все готово до відправки.
        </p>
      ) : (
        <p className="wz-review-warning" role="alert">
          Перевірте контактні дані перед відправкою
        </p>
      )}

      <div className="wz-review-grid">
        {rows.map((row) => (
          <ReviewRow
            key={row.label}
            label={row.label}
            value={row.value}
            onEdit={() => onEdit(row.step)}
          />
        ))}

        {/* Files row — full width */}
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
          <button
            type="button"
            onClick={() => onEdit(8)}
            className="wz-review-edit"
            aria-label="Змінити: Файли"
          >
            Змінити
          </button>
        </div>
      </div>
    </div>
  );
}
