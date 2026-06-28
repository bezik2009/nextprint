/**
 * sitemap.ts — NextPrint sitemap generator
 *
 * Auto-discovery: add a new entry to PUBLIC_ROUTES whenever a new
 * public page route is created under src/app/.
 * API routes, technical paths and auth pages must NOT appear here.
 *
 * Google ignores <changefreq> and <priority> (as of 2025).
 * Only <loc> and <lastmod> are emitted.
 *
 * Update LAST_UPDATED when content meaningfully changes.
 */
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.nextprint.com.ua";

// ISO date of the last meaningful content update.
// Update this string when you publish significant changes.
const LAST_UPDATED = "2026-06-26";

// All public page routes. Sections of the homepage (About, Process, etc.)
// are not separate routes — the entire site is a single-page app at "/".
const PUBLIC_ROUTES: string[] = [
  "",          // → https://www.nextprint.com.ua/
  "/privacy",  // → https://www.nextprint.com.ua/privacy
  "/terms",    // → https://www.nextprint.com.ua/terms
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: LAST_UPDATED,
  }));
}
