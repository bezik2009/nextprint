/**
 * StructuredData — injects JSON-LD scripts into <head> via Next.js Script.
 * No visible UI. Purely for search engine structured data.
 *
 * Schemas included:
 *   1. Organization        — brand identity, logo, contact email
 *   2. ProfessionalService  — local/regional business entity (replaces the
 *                             previous combined Organization+LocalBusiness
 *                             array type, which Google's structured data
 *                             guidelines discourage in favor of separate
 *                             distinct types)
 *   3. WebSite              — site-level metadata for sitelinks search box
 *   4. Service              — the core offering, for rich result eligibility
 *
 * Only real, verifiable data is included. No fabricated address, phone,
 * ratings, reviews, or prices. sameAs stays empty until real social profile
 * URLs exist in the project.
 */
export function StructuredData() {
  const BASE_URL = "https://www.nextprint.com.ua";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NextPrint",
    url: BASE_URL,
    email: "office@nextprint.com.ua",
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/og-image-v2.png`,
    description:
      "Виробничий партнер для серійного виробництва пластикових компонентів. Від прототипу до регулярних виробничих партій. Інженерні матеріали, контроль якості та швидкий запуск виробництва.",
    areaServed: {
      "@type": "Country",
      name: "Ukraine",
    },
    // TODO: add real social profile URLs (LinkedIn, Instagram, Facebook) when available.
    sameAs: [],
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "NextPrint",
    url: BASE_URL,
    image: `${BASE_URL}/og-image-v2.png`,
    description:
      "Виробничий партнер для серійного виробництва пластикових компонентів. Від прототипу до регулярних виробничих партій. Інженерні матеріали, контроль якості та швидкий запуск виробництва.",
    areaServed: {
      "@type": "Country",
      name: "Ukraine",
    },
    serviceType: [
      "Контрактне виробництво",
      "Серійне виробництво пластикових компонентів",
      "Прототипування",
      "FDM 3D друк",
    ],
    // No street address is published — omit rather than fabricate one.
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NextPrint",
    url: BASE_URL,
    description:
      "Виробничий партнер для серійного виробництва пластикових компонентів. Від прототипу до регулярних виробничих партій. Інженерні матеріали, контроль якості та швидкий запуск виробництва.",
    inLanguage: "uk-UA",
    publisher: {
      "@type": "Organization",
      name: "NextPrint",
      url: BASE_URL,
    },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Контрактне виробництво пластикових компонентів",
    provider: {
      "@type": "Organization",
      name: "NextPrint",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Ukraine",
    },
    serviceType: [
      "Контрактне виробництво",
      "Серійне виробництво пластикових компонентів",
      "Прототипування",
      "FDM 3D друк",
    ],
    description:
      "Послуги FDM 3D друку для прототипів, корпусів електроніки, функціональних деталей, малих серій та регулярного виробництва.",
  };

  const schemas = [organization, professionalService, website, service];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
