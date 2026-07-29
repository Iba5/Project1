import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteSettings();
  return {
    name: site.companyName,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1F3A5F",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
