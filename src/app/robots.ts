import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ intentionally NOT blocked — crawlers need these assets to render.
        // /api/ NOT blocked — spec requires open crawling; no sensitive routes exposed.
      },
    ],
    sitemap: "https://www.nextprint.com.ua/sitemap.xml",
  };
}
