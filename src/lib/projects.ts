import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export type Project = {
  slug: string;
  title: string;
  date: string;
  images?: string[];
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
  images?: string[];
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

export function getProjectImages(slug: string): string[] {
  const projectDir = path.join(projectsDirectory, slug);

  try {
    const files = fs.readdirSync(projectDir);

    // Filter image files and sort them
    return files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .filter(file => file !== 'index.mdx')
      .sort()
      .map(file => `/projects/${slug}/${file}`);
  } catch {
    return [];
  }
}

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
      images: getProjectImages(folder),
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
      images: getProjectImages(folder),
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
      images: getProjectImages(slug),
      publisher: data.publisher,
      projectType: data.projectType,
      link: data.link,
      content,
    };
  } catch (error) {
    return null;
  }
}
