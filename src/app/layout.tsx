import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXT PRINT — Контрактне виробництво пластикових компонентів",
  description:
    "Від прототипу до серійного виробництва. Надійний партнер для технологічних компаній та інженерних команд.",
  keywords: [
    "3D друк",
    "контрактне виробництво",
    "пластикові компоненти",
    "B2B виробництво",
    "серійне виробництво",
  ],
  openGraph: {
    title: "NEXT PRINT — Контрактне виробництво пластикових компонентів",
    description:
      "Від прототипу до серійного виробництва. Надійний партнер для технологічних компаній та інженерних команд.",
    type: "website",
    locale: "uk_UA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={manrope.className}>
      <body>{children}</body>
    </html>
  );
}
