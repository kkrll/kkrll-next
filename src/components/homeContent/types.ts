export type ListItemProps = {
  slug?: string;
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

export type ListProps = {
  title: string;
  list: ListItemProps[];
  selectedItemId: string | null;
  onSelect: (id: string) => void;
  category: CategoriesTypes;
};

export type CategoriesTypes = "projects" | "writings" | "posters";
