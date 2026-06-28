import type { MetadataRoute } from "next";

const BASE_URL = "https://www.nextprint.com.ua";

// Use a fixed date string so the sitemap is stable between builds.
// Update SITE_UPDATED when the content meaningfully changes.
const SITE_UPDATED = new Date("2026-06-26");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: SITE_UPDATED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: SITE_UPDATED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
