import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const BASE_URL = "https://www.nextprint.com.ua";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: "Малосерійне виробництво пластикових деталей та компонентів | NextPrint",
  description:
    "NextPrint — малосерійне виробництво пластикових деталей та компонентів. FDM 3D-друк, прототипування, дизайн виробів, інженерні матеріали, малі серії та доставка по Україні.",

  applicationName: "NextPrint",
  authors: [{ name: "NextPrint", url: BASE_URL }],
  creator: "NextPrint",
  publisher: "NextPrint",

  /* Keywords */
  keywords: [
    "3D друк",
    "FDM друк",
    "малосерійне виробництво",
    "пластикові компоненти",
    "пластикові деталі",
    "виробництво пластикових виробів",
    "прототипування",
    "інженерні пластики",
    "дизайн виробів",
    "малі серії",
    "B2B виробництво",
    "3D printing Ukraine",
  ],
  alternates: {
    canonical: BASE_URL,
    languages: { "uk-UA": BASE_URL },
  },

  /* Robots */
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  /* Open Graph */
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: BASE_URL,
    siteName: "NextPrint",
    title: "NextPrint — Малосерійне виробництво пластикових деталей",
    description:
      "Від прототипу до серії. Професійний FDM 3D-друк, інженерні матеріали та доставка по Україні.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "NextPrint — Малосерійне виробництво пластикових деталей",
      },
    ],
  },

  /* Twitter / X */
  twitter: {
    card: "summary_large_image",
    title: "NextPrint — Малосерійне виробництво пластикових деталей",
    description:
      "Від прототипу до серії. Професійний FDM 3D-друк, інженерні матеріали та доставка по Україні.",
    images: [`${BASE_URL}/og-image.png`],
  },

  /* Icons */
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050d18",
  colorScheme: "dark",
};

import { WizardProvider, QuoteWizard } from "@/components/wizard";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={manrope.className}>
      <body>
        <StructuredData />
        <WizardProvider>
          {children}
          <QuoteWizard />
        </WizardProvider>
      </body>
    </html>
  );
}
