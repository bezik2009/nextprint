// ─── Site-wide config ──────────────────────────────────────────────────────
// Single source of truth is src/lib/siteConfig.ts.
// SITE_EMAIL and SITE_NAME are re-exported here so existing imports keep working.
export { siteConfig } from "@/lib/siteConfig";
export const SITE_EMAIL = "office@nextprint.com.ua" as const;
export const SITE_NAME  = "NEXT PRINT" as const;

// ─── Navigation ────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href:  string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Про нас",    href: "#about"        },
  { label: "Можливості", href: "#capabilities" },
  { label: "Процес",     href: "#process"      },
  { label: "Контакти",   href: "#contacts"     },
];

// ─── Stats bar ─────────────────────────────────────────────────────────────
export type StatIcon = "cube" | "chart" | "growth" | "battery";

export interface StatItem {
  icon:  StatIcon;
  value: string;
  label: string;
}

export const STATS: StatItem[] = [
  {
    icon:  "cube",
    value: "14 принтерів",
    label: "у виробництві",
  },
  {
    icon:  "chart",
    value: "1000+ виробів",
    label: "на місяць",
  },
  {
    icon:  "growth",
    value: "Масштабування",
    label: "до 2000+ протягом 2 місяців",
  },
  {
    icon:  "battery",
    value: "Резервне живлення",
    label: "безперервне виробництво під час відключень",
  },
];
