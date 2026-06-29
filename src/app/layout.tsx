import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { StructuredData } from "@/components/StructuredData";
import { WizardProvider, QuoteWizard } from "@/components/wizard";
import { DraftResumeBanner } from "@/components/DraftResumeBanner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const BASE_URL = "https://www.nextprint.com.ua";

// GA4 — only inject when the env var is set; never hardcode IDs in source
const GA_ID         = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
// Google Search Console verification — add tag only when set
const GSC_TOKEN     = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: "NextPrint — FDM 3D друк пластикових деталей",
  description:
    "Малосерійне виробництво пластикових деталей на FDM 3D-принтерах. Прототипи, серії, інженерні матеріали, доставка по Україні.",

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

  /* Canonical — trailing slash for homepage consistency */
  alternates: {
    canonical: `${BASE_URL}/`,
    languages: { "uk-UA": `${BASE_URL}/` },
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
    url: `${BASE_URL}/`,
    siteName: "NextPrint",
    title: "NextPrint — FDM 3D друк пластикових деталей",
    description:
      "Малосерійне виробництво пластикових деталей на FDM 3D-принтерах. Прототипи, серії, інженерні матеріали, доставка по Україні.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "NextPrint — FDM 3D друк пластикових деталей",
      },
    ],
  },

  /* Twitter / X */
  twitter: {
    card: "summary_large_image",
    title: "NextPrint — FDM 3D друк пластикових деталей",
    description:
      "Малосерійне виробництво пластикових деталей на FDM 3D-принтерах. Прототипи, серії, інженерні матеріали, доставка по Україні.",
    images: [`${BASE_URL}/og-image.png`],
  },

  /* Icons
   * TODO: place NextPrint branded files at:
   *   public/favicon.ico          — 32×32 ICO
   *   public/apple-touch-icon.png — 180×180 PNG
   *   public/android-chrome-192x192.png (already generated)
   *   public/android-chrome-512x512.png (already generated)
   * The app/icon.png route is also supported by Next.js App Router.
   */
  icons: {
    icon: [
      { url: "/favicon.ico",              sizes: "32x32",  type: "image/x-icon" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png"  },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },

  /* Google Search Console verification — set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION */
  ...(GSC_TOKEN
    ? { verification: { google: GSC_TOKEN } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050d18",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={manrope.className}>
      <body>
        {/* Google Analytics 4 — only injected when GA_ID is set */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        <StructuredData />
        <WizardProvider>
          {children}
          <QuoteWizard />
          {/* Draft resume banner — shown outside wizard when a saved draft exists */}
          <DraftResumeBanner />
        </WizardProvider>
      </body>
    </html>
  );
}
