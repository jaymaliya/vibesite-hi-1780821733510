import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.VAANI_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/checkout" },
    sitemap: `${base}/sitemap.xml`,
  };
}
