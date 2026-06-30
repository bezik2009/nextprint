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
    image: `${BASE_URL}/og-image.png`,
    description:
      "Малосерійне виробництво пластикових деталей методом FDM 3D друку в Україні.",
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
    image: `${BASE_URL}/og-image.png`,
    description:
      "Виробництво пластикових деталей від прототипу до малих серій на сучасному FDM 3D обладнанні.",
    areaServed: {
      "@type": "Country",
      name: "Ukraine",
    },
    serviceType: [
      "FDM 3D друк",
      "Прототипування",
      "Малосерійне виробництво пластикових деталей",
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
      "Малосерійне виробництво пластикових деталей методом FDM 3D-друку. Прототипування, інженерні матеріали, швидке виготовлення та доставка по всій Україні.",
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
    name: "FDM 3D друк пластикових деталей",
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
      "Прототипування",
      "Малосерійне виробництво",
      "Регулярне виробництво пластикових деталей",
      "Друк інженерними матеріалами",
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
