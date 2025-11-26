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
  excerpt?: string;
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
};

export type WritingMetaWithViewAll =
  | WritingMeta
  | {
      isViewAll: true;
      totalItems: number;
      type: "writings";
      globalId: string;
    };

function extractExcerpt(content: string, maxLength = 250): string {
  const lines = content.split("\n");
  let excerpt = "";
  let linesUsed = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed || // Empty
      trimmed.startsWith("import ") || // Imports
      trimmed.startsWith("export ") || // Exports
      trimmed.startsWith("<") || // JSX
      trimmed.startsWith("```") || // Code blocks
      trimmed.startsWith("#") // Headers
    ) {
      continue;
    }

    const cleaned = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
      .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1") // Bold/italic
      .replace(/`([^`]+)`/g, "$1"); // Inline code

    const potentialExcerpt = excerpt + (excerpt ? " " : "") + cleaned;

    if (potentialExcerpt.length > maxLength) {
      const remaining = maxLength - excerpt.length;
      excerpt += (excerpt ? " " : "") + cleaned.substring(0, remaining);
      break;
    }

    excerpt = potentialExcerpt;
    linesUsed++;

    if (linesUsed >= 5) break;
  }

  return excerpt.trim() + (excerpt.length >= maxLength ? "..." : "");
}

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
