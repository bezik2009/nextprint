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
  : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com";

// In development, HMR requires WebSocket connections (ws:/wss:).
// Production has no HMR, so 'self' only is sufficient.
const CONNECT_SRC = isDev
  ? "connect-src 'self' ws: wss:"
  : "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com";

const CSP = [
  "default-src 'self'",
  SCRIPT_SRC,
  "style-src 'self' 'unsafe-inline'",    // Next.js critical CSS
  "img-src 'self' data: blob: https://www.google-analytics.com", // Next.js Image + GA pixel
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

    // Next.js automatically sets immutable Cache-Control on /_next/static assets.
    // Do NOT add a custom rule for /_next/static — it triggers a warning in both
    // dev and production builds and provides no benefit.
    // Only set Cache-Control for assets we own (/images, /fonts, etc.).
    const cacheHeaders = [
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
