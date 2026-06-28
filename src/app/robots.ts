import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ is intentionally NOT blocked — search engines need these
        // assets (JS, CSS) to correctly render and index the page.
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://www.nextprint.com.ua/sitemap.xml",
  };
}
