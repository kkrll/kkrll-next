import type { WritingMeta } from "@/lib/writings";
import type { ProjectMeta } from "@/lib/projects";
import type { PosterMeta } from "@/lib/posters";

export type ListItemProps = {
  slug: string;
  title: string;
  publisher?: string;
  description?: string;
  projectType?: string;
  link?: string;
  isExternal?: boolean;
  cover: string;
  type: CategoriesTypes;
  globalId: string;
  date: string;
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

export type CategoriesTypes = "projects" | "writings" | "posters";

export type SelectedItemType = WritingMeta | ProjectMeta | PosterMeta;
