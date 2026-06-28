/* ═══════════════════════════════════════════════════════════════════════════
   Quote Wizard — shared types
   These interfaces define the data model for the entire wizard.
   Phase 2+ can consume WizardData directly for email / Telegram / CRM.
═══════════════════════════════════════════════════════════════════════════ */

export type ProductionType =
  | "prototype"
  | "small-batch"
  | "medium-batch"
  | "regular";

export type FileFormat =
  | "stl"
  | "step"
  | "3mf"
  | "drawing"
  | "photo"
  | "need-modeling";

export type SizePreset = "xs" | "sm" | "md" | "lg" | "";

export type UseCase =
  | "electronics"
  | "robotics"
  | "automotive"
  | "industrial"
  | "household"
  | "other";

export type Material =
  | "pla"
  | "petg"
  | "abs"
  | "asa"
  | "tpu"
  | "nylon"
  | "pc"
  | "pctg"
  | "unknown";

export type Deadline = "urgent" | "3-5-days" | "week" | "flexible";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export interface ContactInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  comment: string;
}

/** Complete wizard data — sent to backend in Phase 2 */
export interface WizardData {
  step1_productionType: ProductionType | "";
  step2_fileFormat: FileFormat | "";
  step3_quantity: string;
  step4_size: string;
  step4_sizePreset: SizePreset;
  step5_useCase: UseCase | "";
  step5_useCaseOther: string;
  step6_material: Material | "";
  step7_deadline: Deadline | "";
  step8_files: UploadedFile[];
  step9_contact: ContactInfo;
}

export const INITIAL_DATA: WizardData = {
  step1_productionType: "",
  step2_fileFormat: "",
  step3_quantity: "",
  step4_size: "",
  step4_sizePreset: "",
  step5_useCase: "",
  step5_useCaseOther: "",
  step6_material: "",
  step7_deadline: "",
  step8_files: [],
  step9_contact: { name: "", company: "", email: "", phone: "", comment: "" },
};

export const TOTAL_STEPS = 10;

/** Draft stored in localStorage */
export interface WizardDraft {
  step: number;
  data: WizardData;
  savedAt: string; // ISO date
}

export const DRAFT_KEY = "nextprint_quote_wizard_draft";

/**
 * Contact field errors — includes _contact for the cross-field
 * "provide at least one contact method" validation message.
 */
export type ContactErrors = Partial<{
  name:     string;
  email:    string;
  phone:    string;
  company:  string;
  comment:  string;
  _contact: string;
}>;
