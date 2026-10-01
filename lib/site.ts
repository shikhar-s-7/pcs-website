/** Canonical origin. Set NEXT_PUBLIC_SITE_URL on Vercel. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

/** One flag. Off unless exactly "true". The name and email are still provisional. */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/** Pages in the sitemap. The design-system specimen is internal and left out. */
export const sitePaths = ["/", "/capabilities", "/technology", "/enquiries"] as const;
