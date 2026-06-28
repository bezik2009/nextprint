import type { NextConfig } from "next";

// ── Content Security Policy ──────────────────────────────────────────────────
// next/font/google: fonts are downloaded at BUILD time and served from 'self'.
// No external font domain exceptions are needed.
// 'unsafe-inline' in script-src covers Next.js JSON-LD script tags in layout.
// 'unsafe-inline' in style-src covers Next.js critical CSS injection.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",   // Next.js inline scripts + JSON-LD
  "style-src 'self' 'unsafe-inline'",    // Next.js critical CSS
  "img-src 'self' data: blob:",           // Next.js Image (avif/webp), inline SVG data URIs
  "font-src 'self' data:",               // self-hosted Manrope via next/font
  "connect-src 'self'",                  // no external API calls
  "media-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",             // equivalent to X-Frame-Options: DENY
  "upgrade-insecure-requests",
].join("; ");

// ── Permissions Policy ───────────────────────────────────────────────────────
const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "sync-xhr=()",
  "usb=()",
  "web-share=()",
  "xr-spatial-tracking=()",
].join(", ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // ── HTTP Security Headers ──────────────────────────────────────────────────
  // Applied to every response. Next.js merges these with its own default headers.
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          // Enforce HTTPS for 1 year, include subdomains, enable preload list
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Prevent MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Only send origin (no path/query) in Referer header to third parties
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Disable browser features not used by this site
          {
            key: "Permissions-Policy",
            value: PERMISSIONS_POLICY,
          },
          // Prevent clickjacking (belt-and-suspenders with CSP frame-ancestors)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: CSP,
          },
        ],
      },
      {
        // Long-lived cache for static assets (Next.js hashes filenames)
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache public images for 30 days
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
