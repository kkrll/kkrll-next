import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export type Project = {
  slug: string;
  title: string;
  date: string;
  cover?: string;
  publisher?: string;
  description?: string;
  projectType?: string;
  link?: string;
  content: string;
};

export type ProjectMeta = {
  slug: string;
  title: string;
  date: string;
  cover?: string;
  description?: string;
  projectType?: string;
  link?: string;
  isExternal?: boolean;
  type: "projects";
  globalId: string;
};

export type ProjectMetaWithViewAll = ProjectMeta | {
  isViewAll: true;
  totalItems: number;
  type: "projects";
  globalId: string;
};

export function getAllProjects(): Project[] {
  const folders = fs.readdirSync(projectsDirectory);
  const projects = folders.map((folder) => {
    const fullPath = path.join(projectsDirectory, folder, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      slug: folder,
      title: data.title || "Untitled",
      date: data.date || "Unknown date",
      cover: data.cover || null,
      description: data.description || null,
      projectType: data.projectType,
      link: data.link || null,
      content,
    } as Project;
  });
  return projects.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getAllProjectsMeta(limit?: number): ProjectMetaWithViewAll[] {
  const folders = fs.readdirSync(projectsDirectory);
  const projectsMeta = folders.map((folder) => {
    const fullPath = path.join(projectsDirectory, folder, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: folder,
      title: data.title || "Untitled",
      date: data.date || "Unknown date",
      cover: data.cover || null,
      description: data.description || null,
      projectType: data.projectType,
      link: data.link || null,
      isExternal: data.isExternal,
      type: "projects",
      globalId: `projects-${folder}`,
    } as ProjectMeta;
  });

  const sorted = projectsMeta.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (limit && sorted.length > limit) {
    return [
      ...sorted.slice(0, limit),
      {
        isViewAll: true,
        totalItems: sorted.length,
        type: "projects",
        globalId: "projects-view-all",
      }
    ];
  }

  return sorted;
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const fullPath = path.join(projectsDirectory, slug, "index.mdx");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      cover: data.cover,
      publisher: data.publisher,
      projectType: data.projectType,
      link: data.link,
      content,
    };
  } catch (error) {
    return null;
  }
}
