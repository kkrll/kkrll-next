import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { extractExcerpt } from "./excerpt";

const writingsDirectory = path.join(process.cwd(), "content/writings");

// Drafts stay visible while writing locally, but never ship: production
// builds drop them from listings, the sitemap, static params, and direct URLs
const showDrafts = process.env.NODE_ENV === "development";

export type Writing = {
  slug: string;
  title: string;
  date: string;
  cover?: string;
  publisher?: string;
  description?: string;
  link?: string;
  content: string;
  excerpt?: string;
  draft?: boolean;
};

export type WritingMeta = {
  slug: string;
  title: string;
  date: string;
  cover?: string;
  publisher?: string;
  description?: string;
  isExternal?: boolean;
  link?: string;
  type: "writings";
  globalId: string;
  excerpt?: string;
  draft?: boolean;
};

export type WritingMetaWithViewAll =
  | WritingMeta
  | {
      isViewAll: true;
      totalItems: number;
      type: "writings";
      globalId: string;
    };

export function getAllWritings(): Writing[] {
  const folders = fs.readdirSync(writingsDirectory);
  const writings = folders
    .map((folder) => {
      const fullPath = path.join(writingsDirectory, folder, "index.mdx");
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      return {
        slug: folder,
        title: data.title || "Untitled",
        date: data.date || "Unknown date",
        cover: data.cover || null,
        publisher: data.publisher || null,
        description: data.description || null,
        link: data.link || null,
        // no title = frontmatter-less WIP; treat like a draft
        draft: data.draft === true || !data.title,
        content,
      } as Writing;
    })
    .filter((writing) => showDrafts || !writing.draft);
  return writings.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getAllWritingsMeta(limit?: number): WritingMetaWithViewAll[] {
  const folders = fs.readdirSync(writingsDirectory);
  const writingsMeta = folders
    .map((folder) => {
      const fullPath = path.join(writingsDirectory, folder, "index.mdx");
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const excerpt = data.description ? undefined : extractExcerpt(content);

      return {
        slug: folder,
        title: data.title || "Untitled",
        date: data.date || "Unknown date",
        cover: data.cover || null,
        publisher: data.publisher || null,
        description: data.description || null,
        link: `/writings/${folder}`,
        isExternal: data.isExternal,
        type: "writings",
        globalId: `writings-${folder}`,
        excerpt: excerpt,
        draft: data.draft === true || !data.title,
      } as WritingMeta;
    })
    .filter((writing) => showDrafts || !writing.draft);

  const sorted = writingsMeta.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (limit && sorted.length > limit) {
    return [
      ...sorted.slice(0, limit),
      {
        isViewAll: true,
        totalItems: sorted.length,
        type: "writings",
        globalId: "writings-view-all",
      },
    ];
  }

  return sorted;
}

export function getWritingBySlug(slug: string): Writing | null {
  try {
    const fullPath = path.join(writingsDirectory, slug, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Drafts (and untitled WIP) 404 in production even when the URL is known
    if ((data.draft === true || !data.title) && !showDrafts) {
      return null;
    }

    return {
      slug,
      title: data.title,
      date: data.date,
      cover: data.cover,
      publisher: data.publisher,
      description: data.description,
      link: data.link,
      draft: data.draft === true,
      content,
    };
  } catch (error) {
    return null;
  }
}
