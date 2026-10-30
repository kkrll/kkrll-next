import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getR2Url } from "./constants";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export type Project = {
  slug: string;
  title: string;
  date: string;
  media?: string[];
  publisher?: string;
  description?: string;
  projectType?: string;
  link: string;
  pinned?: boolean | number;
  content: string;
};

export type ProjectMeta = {
  slug: string;
  title: string;
  date: string;
  media?: string[];
  description?: string;
  projectType?: string;
  link: string;
  pinned?: boolean | number;
  isExternal?: boolean;
  type: "projects";
  globalId: string;
};

export type ProjectMetaWithViewAll =
  | ProjectMeta
  | {
    isViewAll: true;
    totalItems: number;
    type: "projects";
    globalId: string;
  };

// `pinned: true` or a position number (1, 2, 3…) floats a project to the top
// in that order; everything else follows, newest first.
const pinRank = (pinned?: boolean | number) =>
  typeof pinned === "number" ? pinned : pinned ? 0 : Number.POSITIVE_INFINITY;

const byPinThenDate = (
  a: { pinned?: boolean | number; date: string },
  b: { pinned?: boolean | number; date: string },
) =>
  pinRank(a.pinned) - pinRank(b.pinned) ||
  new Date(b.date).getTime() - new Date(a.date).getTime();

// Videos live in R2 and are listed in frontmatter (`videos: [projects/x.mp4]`);
// images live next to index.mdx and are picked up from the folder.
export function getProjectMedia(slug: string, videos: string[] = []): string[] {
  const projectDir = path.join(projectsDirectory, slug);
  const videoUrls = videos.map(getR2Url);

  try {
    const files = fs.readdirSync(projectDir);

    const images = files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort()
      .map((file) => `/projects/${slug}/${file}`);

    return [...videoUrls, ...images];
  } catch {
    return videoUrls;
  }
}

export function getAllProjects(): Project[] {
  const folders = fs.readdirSync(projectsDirectory);
  const projects = folders
    .filter((folder) => {
      const folderPath = path.join(projectsDirectory, folder);
      return fs.statSync(folderPath).isDirectory();
    })
    .map((folder) => {
      const fullPath = path.join(projectsDirectory, folder, "index.mdx");
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      return {
        slug: folder,
        title: data.title || "Untitled",
        date: data.date || "Unknown date",
        media: getProjectMedia(folder, data.videos),
        description: data.description || null,
        projectType: data.projectType,
        link: data.link || null,
        pinned: data.pinned || false,
        content,
      } as Project;
    });
  return projects.sort(byPinThenDate);
}

export function getAllProjectsMeta(limit?: number): ProjectMetaWithViewAll[] {
  const folders = fs.readdirSync(projectsDirectory);
  const projectsMeta = folders
    .filter((folder) => {
      const folderPath = path.join(projectsDirectory, folder);
      return fs.statSync(folderPath).isDirectory();
    })
    .map((folder) => {
      const fullPath = path.join(projectsDirectory, folder, "index.mdx");
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: folder,
        title: data.title || "Untitled",
        date: data.date || "Unknown date",
        media: getProjectMedia(folder, data.videos),
        description: data.description || null,
        projectType: data.projectType,
        link: data.link,
        pinned: data.pinned || false,
        isExternal: data.isExternal,
        type: "projects",
        globalId: `projects-${folder}`,
      } as ProjectMeta;
    });

  const sorted = projectsMeta.sort(byPinThenDate);

  if (limit && sorted.length > limit) {
    return [
      ...sorted.slice(0, limit),
      {
        isViewAll: true,
        totalItems: sorted.length,
        type: "projects",
        globalId: "projects-view-all",
      },
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
      media: getProjectMedia(slug, data.videos),
      publisher: data.publisher,
      projectType: data.projectType,
      link: data.link,
      pinned: data.pinned || false,
      content,
    };
  } catch (error) {
    return null;
  }
}
