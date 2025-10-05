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
  link?: string;
  content: string;
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
      link: data.link || null,
      content,
    } as Writing;
  });
  return writings.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
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
