export const SITE_URL = "https://kkrll.com";
export const SITE_NAME = "kkrll";
export const SITE_DESCRIPTION =
  "Kiryl Kavalenka — product designer. Writings on design and engineering, posters, and projects.";

export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

export function getR2Url(path: string) {
  return `${R2_PUBLIC_URL}/${path}`;
}
