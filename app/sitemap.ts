import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_ROUTES.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/agents/") ? "monthly" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/agents/") ? 0.9 : 0.7,
  }));
}
