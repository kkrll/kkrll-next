import fs from "fs";
import path from "path";
import matter from "gray-matter";

const workDirectory = path.join(process.cwd(), "content/work");

export type Work = {
  slug: string;
  title: string;
  period: string;
  images?: string[];
  description?: string;
  projectType?: string;
  link?: string;
  content: string;
};

export type WorkMeta = {
  slug: string;
  title: string;
  period: string;
  images?: string[];
  description?: string;
  projectType?: string;
  link?: string;
  isExternal?: boolean;
  type: "work";
  globalId: string;
};

export type WorkMetaWithViewAll =
  | WorkMeta
  | {
      isViewAll: true;
      totalItems: number;
      type: "work";
      globalId: string;
    };

export function getAllWorks(): Work[] {
  const folders = fs.readdirSync(workDirectory);
  const work = folders.map((folder) => {
    const fullPath = path.join(workDirectory, folder, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      slug: folder,
      title: data.title || "Untitled",
      period: data.period || "",
      images: data.images || null,
      description: data.description || null,
      projectType: data.projectType,
      link: data.link || null,
      content,
    } as Work;
  });
  return work.sort((a, b) => {
    return new Date(b.period).getTime() - new Date(a.period).getTime();
  });
}

export function getAllWorksMeta(limit?: number): WorkMetaWithViewAll[] {
  const folders = fs.readdirSync(workDirectory);
  const workMeta = folders.map((folder) => {
    const fullPath = path.join(workDirectory, folder, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: folder,
      title: data.title || "Untitled",
      period: data.period || "",
      images: data.images || null,
      description: data.description || null,
      projectType: data.projectType,
      link: data.link || null,
      isExternal: data.isExternal,
      type: "work",
      globalId: `work-${folder}`,
    } as WorkMeta;
  });

  const sorted = workMeta.sort((a, b) => {
    return Number(b.period.substring(0, 4)) - Number(a.period.substring(0, 4));
  });

  if (limit && sorted.length > limit) {
    return [
      ...sorted.slice(0, limit),
      {
        isViewAll: true,
        totalItems: sorted.length,
        type: "work",
        globalId: "view-resume",
      },
    ];
  }

  return sorted;
}

export function getWorkBySlug(slug: string): Work | null {
  try {
    const fullPath = path.join(workDirectory, slug, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      period: data.period,
      images: data.images,
      projectType: data.projectType,
      link: data.link,
      content,
    };
  } catch (error) {
    return null;
  }
}
