/**
 * StructuredData — injects JSON-LD scripts into <head> via Next.js Script.
 * No visible UI. Purely for search engine structured data.
 */
export function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Manufacturer", "LocalBusiness"],
    name: "NextPrint",
    url: "https://www.nextprint.com.ua",
    email: "office@nextprint.com.ua",
    logo: "https://www.nextprint.com.ua/logo.png",
    image: "https://www.nextprint.com.ua/og-image.png",
    description:
      "Малосерійне виробництво пластикових деталей методом FDM 3D-друку. Прототипування, пластикові компоненти, інженерні вироби, малі серії та доставка по Україні.",
    areaServed: {
      "@type": "Country",
      name: "Ukraine",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
      addressLocality: "Україна",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Послуги 3D-друку",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "3D друк пластикових деталей",
            description:
              "FDM друк, прототипування, виготовлення пластикових компонентів, дизайн рішення, малі серії.",
          },
        },
      ],
    },
    // TODO: Add official links when available:
    // LinkedIn, Instagram, Facebook
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NextPrint",
    url: "https://www.nextprint.com.ua",
    description:
      "Малосерійне виробництво пластикових деталей методом FDM 3D-друку. Прототипування, інженерні матеріали, швидке виготовлення та доставка по всій Україні.",
    inLanguage: "uk-UA",
    publisher: {
      "@type": "Organization",
      name: "NextPrint",
      url: "https://www.nextprint.com.ua",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
