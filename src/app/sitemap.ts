import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllPosters } from "@/lib/posters";
import { getAllWritings } from "@/lib/writings";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/writings`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/posters`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/now`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const writings: MetadataRoute.Sitemap = getAllWritings().map((writing) => ({
    url: `${SITE_URL}/writings/${writing.slug}`,
    lastModified: new Date(writing.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const posters: MetadataRoute.Sitemap = getAllPosters().map((poster) => ({
    url: `${SITE_URL}/posters/${poster.slug}`,
    lastModified: new Date(poster.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...writings, ...posters];
}
