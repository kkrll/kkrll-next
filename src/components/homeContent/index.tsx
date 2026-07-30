"use client";

import { useEffect } from "react";
import List from "@/components/homeContent/List";
import { useHomeTracking } from "@/hooks/useHomeTracking";
import type { ProjectMetaWithViewAll } from "@/lib/projects";
import type { WritingMetaWithViewAll } from "@/lib/writings";
import { useNavigationStore } from "@/stores/useNavigationStore";
import BioContent from "../BioContent";
import ContentWindow from "./ContentWindow";
import type { ListItemProps, SelectedItemType } from "./types";

const HomeContent = ({
  writings,
  projects,
}: {
  writings: WritingMetaWithViewAll[];
  projects: ProjectMetaWithViewAll[];
  // posters: PosterMetaWithViewAll[];
}) => {
  const { selectedItemId, setSelectedItemId, selectNext, selectPrevious } =
    useNavigationStore();

  const allItems = [...projects, ...writings];
  const allItemsIds = allItems.map((item) => item.globalId);

  const { trackSelection, trackNavigation, trackOpen } = useHomeTracking();

  // A persisted id can point at an item that no longer exists (e.g. the
  // "view all" entry disappears once the list is unlimited) — fall back to the
  // first item so the preview never ends up empty.
  const currentSelectedId =
    (selectedItemId && allItemsIds.includes(selectedItemId)
      ? selectedItemId
      : allItemsIds[0]) ?? null;

  const handleSelect = (id: string, source: "click" | "keyboard") => {
    const item = allItems.find((item) => item.globalId === id);
    if (item) {
      trackSelection(item, source);
      setSelectedItemId(id);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        trackNavigation("down");
        selectNext(allItemsIds);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        trackNavigation("up");
        selectPrevious(allItemsIds);
      } else if (e.key === "Enter" && currentSelectedId) {
        e.preventDefault();
        const item = allItems.find((i) => i.globalId === currentSelectedId);
        if (item) {
          trackOpen(item, "keyboard");
        }
        const link = document
          .querySelector(`[data-item-id="${currentSelectedId}"]`)
          ?.getAttribute("href");
        if (link) {
          window.location.href = link;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectNext,
    selectPrevious,
    allItemsIds,
    currentSelectedId,
    trackNavigation,
    trackOpen,
    allItems,
  ]);

  // Scroll selected item into view when it changes
  useEffect(() => {
    const position = window.pageYOffset;
    if (currentSelectedId && position > 240) {
      const element = document.querySelector(
        `[data-item-id="${currentSelectedId}"]`,
      );
      element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentSelectedId]);

  const selectedItem = allItems.find(
    (item) => item.globalId === currentSelectedId,
  );

  // the page stays the only scroll container; items-start keeps the grid items
  // at their own height so the bio column can stick
  return (
    <section className="min-h-[720px] mt-24 lg:m-0 lg:grid lg:grid-cols-[1fr_3fr] lg:items-start">
      <BioContent />
      <div className="flex h-full gap-12 lg:gap-0">
        <div className="flex-1 flex flex-col gap-20 py-10 lg:border-r border-background-07">
          {projects && (
            <List
              key={"projects"}
              title={"projects"}
              list={projects as ListItemProps[]}
              selectedItemId={currentSelectedId}
              category="projects"
              onSelect={(id) => handleSelect(id, "click")}
            />
          )}
          {writings && (
            <List
              key="writings"
              title="writings"
              list={writings as ListItemProps[]}
              selectedItemId={currentSelectedId}
              category="writings"
              onSelect={(id) => handleSelect(id, "click")}
            />
          )}
        </div>
        <div className="flex-2 motion-safe:animate-[fadeIn_200ms_ease-in-out] hidden md:flex">
          {selectedItem ? (
            <ContentWindow selectedItem={selectedItem as SelectedItemType} />
          ) : (
            "select from the list"
          )}
        </div>
      </div>
      {/* footer */}
      <div className="sticky bottom-0 bg-background hidden sm:block text-foreground-07 lg:col-span-2">
        <p className="font-mono text-sm py-2 px-default border-t border-background-07 lg:pl-[calc(25%_+_16px)]">
          Use ↓ | ↑ or mouse to navigate and ⏎ or click to open
        </p>
      </div>
    </section>
  );
};

export default HomeContent;
