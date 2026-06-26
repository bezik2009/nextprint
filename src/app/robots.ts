import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [],
      },
    ],
    host: "https://www.nextprint.com.ua",
    sitemap: "https://www.nextprint.com.ua/sitemap.xml",
  };
}
