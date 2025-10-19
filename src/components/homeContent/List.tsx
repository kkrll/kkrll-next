"use client";

import { useRouter } from "next/navigation";
import type {
  CategoriesTypes,
  ListItemProps,
  ListProps,
  ViewAllItem,
} from "./types";

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

  const href = item.isExternal && item.link ? item.link : `/${item.slug}`;

  const getSecondLine = () => {
    switch (category) {
      case "posters":
        return item.date ? new Date(item.date).getFullYear() : null;
      case "projects":
        return item.projectType;
      case "writings":
        if (item.publisher) {
          return `${item.publisher}, ${
            item.date && new Date(item.date).getFullYear()
          }`;
        } else return item.date ? new Date(item.date).getFullYear() : null;
      case "work":
        return `${item.projectType}, ${item.period}`;
      default:
        return null;
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
            router.push(`/${item.slug}`);
          } else {
            window.location.href = href;
          }
        } else {
          // Desktop: select on first click
          onSelect();
        }
      }}
      className={`py-2 px-8 md:px-4 hover:pointer text-left block bg-background text-foreground ${
        isSelected
          ? "md:bg-foreground md:text-background"
          : "hover:bg-background-07"
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
            // Check if this is a "View All" item
            if ("isViewAll" in item && item.isViewAll) {
              const globalId = item.globalId;
              const isSelected = selectedItemId === globalId;
              return (
                <a
                  key={globalId}
                  href={`/${category}`}
                  data-item-id={globalId}
                  onClick={(e) => {
                    if (!isSelected) {
                      e.preventDefault();
                      onSelect(globalId);
                    }
                  }}
                  className={`py-2 px-8 md:px-4 hover:pointer text-left block ${
                    isSelected
                      ? "md:bg-foreground md:text-background"
                      : "hover:bg-background-07 text-foreground-07"
                  }`}
                >
                  View all {category} →
                </a>
              );
            }

            // Regular item
            const globalId = item.globalId;
            return (
              <ListItemSelector
                key={globalId}
                item={item as ListItemProps}
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
