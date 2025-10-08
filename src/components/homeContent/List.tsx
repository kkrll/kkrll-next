"use client";

import { useRouter } from "next/navigation";
import type { CategoriesTypes, ListItemProps, ListProps } from "./types";

const ListItemSelector = ({
  item,
  onSelect,
  isSelected,
  itemId,
  category,
}: {
  item: ListItemProps;
  onSelect: () => void;
  isSelected: boolean;
  itemId: string;
  category: CategoriesTypes;
}) => {
  const router = useRouter();

  const href =
    item.isExternal && item.link ? item.link : `/${category}/${item.slug}`;

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
      href={isSelected ? href : ""}
      data-item-id={itemId}
      onClick={(e) => {
        e.preventDefault();
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile || isSelected) {
          // Mobile: always navigate, Desktop: navigate when already selected
          if (!item.isExternal) {
            router.push(`/${category}/${item.slug}`);
          } else {
            window.location.href = href;
          }
        } else {
          // Desktop: select on first click
          onSelect();
        }
      }}
      className={`py-2 px-8 md:px-4 hover:pointer text-left block bg-background text-foreground hover:bg-background-07 ${
        isSelected ? "md:bg-foreground md:text-background" : ""
      }`}
    >
      {item.title}
      {secondLine && <p className="text-foreground-07 text-sm">{secondLine}</p>}
      {isSelected && (
        <p className="hidden md:block text-foreground-07 text-sm mt-2">
          Open link →
        </p>
      )}
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
        <h2 className="pl-8 md:pl-4 mb-10">{title}</h2>
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
                onSelect={() => onSelect(globalId)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default List;
