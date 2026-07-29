import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteSettings();
  const base = site.url;
  const routes = ["", "/about", "/products", "/industries", "/gallery", "/contact"];
  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/contact" ? 0.8 : 0.7,
  }));
}
