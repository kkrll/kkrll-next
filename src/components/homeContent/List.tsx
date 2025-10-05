"use client";

import { useRouter } from "next/navigation";
import type { CategoriesTypes, ListItemProps, ListProps } from "./types";

const ListItemSelector = ({
  item,
  onHover,
  isSelected,
  itemId,
  category,
}: {
  item: ListItemProps;
  onHover: () => void;
  isSelected: boolean;
  itemId: string;
  category: CategoriesTypes;
}) => {
  const router = useRouter();

  const href = item.isExternal ? item.link : `/${category}/${item.slug}`;

  const handleClick = (e: React.MouseEvent) => {
    if (!item.isExternal) {
      e.preventDefault();
      router.push(`/${category}/${item.slug}`);
    }
  };

  const getSecondLine = () => {
    switch (category) {
      case "posters":
        return "date";
      case "projects":
        return item.projectType;
      case "writings":
        if (item.publisher) {
          return `${item.publisher}, ${new Date(item.date).getFullYear()}`;
        } else return new Date(item.date).getFullYear();
    }
  };

  const secondLine = getSecondLine();

  return (
    <a
      href={href}
      data-item-id={itemId}
      onMouseEnter={onHover}
      onClick={handleClick}
      className={`py-2 px-4 hover:pointer text-left block ${
        isSelected
          ? "bg-foreground text-background"
          : "bg-background text-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      {item.title}
      {secondLine && <p className="text-foreground-07 text-sm">{secondLine}</p>}
    </a>
  );
};

const List = ({
  title,
  list,
  selectedItemId,
  onSelect,
  category,
}: ListProps) => {
  return (
    <section>
      <div>
        <h2 className="pl-4 mb-10">{title}</h2>
        <div className="flex gap-1 flex-col">
          {list.map((item) => {
            const globalId = item.globalId || `${category}-${item.slug}`;
            return (
              <ListItemSelector
                key={globalId}
                item={item}
                itemId={globalId}
                category={category}
                isSelected={selectedItemId === globalId}
                onHover={() => onSelect(globalId)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default List;
