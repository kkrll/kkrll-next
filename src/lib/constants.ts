export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

export function getR2Url(path: string) {
  return `${R2_PUBLIC_URL}/${path}`;
}
