import type { WritingMeta } from "@/lib/writings";
import type { ProjectMeta } from "@/lib/projects";
import type { PosterMeta } from "@/lib/posters";
import type { WorkMeta } from "@/lib/work";

export type ListItemProps = {
  slug: string;
  title: string;
  publisher?: string;
  description?: string;
  projectType?: string;
  images?: string[];
  link?: string;
  isExternal?: boolean;
  cover: string;
  type: CategoriesTypes;
  globalId: string;
  date?: string;
  period?: string;
};

export type ViewAllItem = {
  isViewAll: true;
  totalItems: number;
  type: CategoriesTypes;
  globalId: string;
};

export type ListProps = {
  title: string;
  list: (ListItemProps | ViewAllItem)[];
  selectedItemId: string | null;
  onSelect: (id: string) => void;
  category: CategoriesTypes;
};

export type CategoriesTypes = "projects" | "writings" | "posters" | "work";

export type SelectedItemType =
  | WritingMeta
  | ProjectMeta
  | PosterMeta
  | WorkMeta;
