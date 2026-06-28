import type { NextConfig } from "next";

// ── Content Security Policy ──────────────────────────────────────────────────
// next/font/google: fonts are downloaded at BUILD time and served from 'self'.
// No external font domain exceptions are needed.
// 'unsafe-inline' in script-src covers Next.js JSON-LD script tags in layout.
// 'unsafe-inline' in style-src covers Next.js critical CSS injection.

const isDev = process.env.NODE_ENV === "development";

// Development adds 'unsafe-eval' for Next.js HMR / React Fast Refresh.
// Production omits it — eval is never needed in built output.
const SCRIPT_SRC = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

// In development, HMR requires WebSocket connections (ws:/wss:).
// Production has no HMR, so 'self' only is sufficient.
const CONNECT_SRC = isDev
  ? "connect-src 'self' ws: wss:"
  : "connect-src 'self'";

const CSP = [
  "default-src 'self'",
  SCRIPT_SRC,
  "style-src 'self' 'unsafe-inline'",    // Next.js critical CSS
  "img-src 'self' data: blob:",           // Next.js Image (avif/webp), inline SVG data URIs
  "font-src 'self' data:",               // self-hosted Manrope via next/font
  CONNECT_SRC,                           // 'self' in prod; adds ws:/wss: in dev for HMR
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

  // ── Turbopack ──────────────────────────────────────────────────────────────
  // Explicitly set the workspace root so Turbopack does not warn about
  // multiple lockfiles when running `next dev --turbopack`.
  turbopack: {
    root: __dirname,
  },

  async headers() {
    const securityHeaders = [
      {
        // Security headers applied to every route in all environments
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: PERMISSIONS_POLICY,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value: CSP,
          },
        ],
      },
    ];

    // Cache-Control headers for production only.
    // In development Next.js manages its own cache headers for /_next/static.
    // Setting custom Cache-Control on /_next/static in dev breaks HMR and
    // triggers a "Custom Cache-Control headers detected" warning.
    const cacheHeaders = isDev
      ? []
      : [
          {
            // Long-lived immutable cache for hashed Next.js static assets
            source: "/_next/static/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
          {
            // 30-day cache for public image assets
            source: "/images/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=2592000, stale-while-revalidate=86400",
              },
            ],
          },
        ];

    return [...securityHeaders, ...cacheHeaders];
  },
};

export default nextConfig;
