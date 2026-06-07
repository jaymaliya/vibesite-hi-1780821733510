import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.VAANI_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/product`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/checkout`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
