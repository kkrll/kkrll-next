"use client";

import type { CategoriesTypes, ListItemProps, ListProps } from "./types";
import { useTracking } from "@/hooks/useTracking";

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
  const { track } = useTracking()

  const getSecondLine = () => {
    switch (category) {
      case "posters":
        return item.date ? new Date(item.date).getFullYear() : null;
      case "projects":
        return item.projectType;
      case "writings":
      case "writings":
        let copy;
        if (item.publisher && item.date) {
          copy = `${item.publisher}, ${new Date(item.date).getFullYear()}`;
        } else if (item.date) {
          copy = new Date(item.date).getFullYear();
        } else {
          copy = null;
        }

        let badge = null;
        if (item.date) {
          try {
            const itemDate = new Date(item.date);
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            oneMonthAgo.setHours(0, 0, 0, 0);

            if (itemDate >= oneMonthAgo) {
              badge = <span className="bg-foreground text-background text-[10px] font-semibold font-mono uppercase px-1 rounded-full">New</span>;
            }
          } catch (e) {
            console.error("Invalid date format:", item.date);
          }
        }

        return <span className="flex items-center gap-2">{copy} {badge}</span>
      case "work":
        return `${item.projectType}, ${item.period}`;
      default:
        return null;
    }
  };

  const secondLine = getSecondLine();

  return (
    <a
      href={isSelected ? item.link : ""}
      data-item-id={itemId}
      onClick={(e) => {
        e.preventDefault();
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        track("open project", { page: "home", project: item.title })

        if (isMobile || isSelected) {
          // Mobile: always navigate, Desktop: navigate when already selected
          if (item.isExternal) {
            // router.push(item.link);
            // } else {
            window.open(item.link, item.link[0] === "/" ? "_self" : "_blank");
          }
        } else {
          // Desktop: select on first click
          onSelect();
        }
      }}
      className={`py-2 px-default no-underline hover:pointer text-left block bg-background text-foreground ${isSelected
        ? "md:bg-foreground md:text-background"
        : "hover:bg-background-07"
        }`}
    >
      {item.title}
      {secondLine && (
        <p
          className={`${isSelected
            ? "text-foreground-07 md:text-background-07"
            : "text-foreground-07"
            }  text-sm`}
        >
          {secondLine}
        </p>
      )}
      {isSelected && (
        <p className="hidden md:block text-background-07 text-sm mt-2">
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
        <h2 className="pl-8 md:pl-6 mb-10">{title}</h2>
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
                  className={`py-2 px-default hover:pointer text-left block ${isSelected
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
