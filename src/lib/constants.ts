export const SITE_URL = "https://kkrll.com";
export const SITE_NAME = "kkrll";
export const SITE_DESCRIPTION =
  "Kiryl Kavalenka — product designer. Writings on design and engineering, posters, and projects.";

// Profiles elsewhere. Not all are linked visibly (LinkedIn isn't — visitors
// arrive from it, nobody leaves to it), but all go in the Person JSON-LD
// `sameAs`, which is what ties them to this site for search engines.
export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/kkrll",
  medium: "https://medium.com/@kkrll",
  twitter: "https://x.com/kkrll_kkrll",
} as const;

export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

export function getR2Url(path: string) {
  return `${R2_PUBLIC_URL}/${path}`;
}
