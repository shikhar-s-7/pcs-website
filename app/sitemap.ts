import type { MetadataRoute } from "next";
import { sitePaths, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return sitePaths.map((path) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified,
  }));
}
