import fs from "fs";
import path from "path";
import matter from "gray-matter";

const writingsDirectory = path.join(process.cwd(), "content/writings");

export type Writing = {
  slug: string;
  title: string;
  date: string;
  cover?: string;
  publisher?: string;
  description?: string;
  link?: string;
  content: string;
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
};

export type WritingMetaWithViewAll = WritingMeta | {
  isViewAll: true;
  totalItems: number;
  type: "writings";
  globalId: string;
};

export function getAllWritings(): Writing[] {
  const folders = fs.readdirSync(writingsDirectory);
  const writings = folders.map((folder) => {
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
      content,
    } as Writing;
  });
  return writings.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getAllWritingsMeta(limit?: number): WritingMetaWithViewAll[] {
  const folders = fs.readdirSync(writingsDirectory);
  const writingsMeta = folders.map((folder) => {
    const fullPath = path.join(writingsDirectory, folder, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: folder,
      title: data.title || "Untitled",
      date: data.date || "Unknown date",
      cover: data.cover || null,
      publisher: data.publisher || null,
      description: data.description || null,
      link: data.link || null,
      isExternal: data.isExternal,
      type: "writings",
      globalId: `writings-${folder}`,
    } as WritingMeta;
  });

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
      }
    ];
  }

  return sorted;
}

export function getWritingBySlug(slug: string): Writing | null {
  try {
    const fullPath = path.join(writingsDirectory, slug, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      cover: data.cover,
      publisher: data.publisher,
      link: data.link,
      content,
    };
  } catch (error) {
    return null;
  }
}
