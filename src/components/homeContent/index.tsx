"use client";

import { useEffect } from "react";

import { useNavigationStore } from "@/stores/useNavigationStore";
import { useHomeTracking } from "@/hooks/useHomeTracking";

import List from "@/components/homeContent/List";
import ContentWindow from "./ContentWindow";
import Divider from "../Divider";

import type { ListItemProps, SelectedItemType } from "./types";
import type { WritingMetaWithViewAll } from "@/lib/writings";
import type { ProjectMetaWithViewAll } from "@/lib/projects";
import { WorkMetaWithViewAll } from "@/lib/work";

const HomeContent = ({
  writings,
  projects,
  work,
}: {
  writings: WritingMetaWithViewAll[];
  projects: ProjectMetaWithViewAll[];
  // posters: PosterMetaWithViewAll[];
  work: WorkMetaWithViewAll[];
}) => {
  const { selectedItemId, setSelectedItemId, selectNext, selectPrevious } =
    useNavigationStore();

  const allItems = [...projects, ...writings, ...work];
  const allItemsIds = allItems.map((item) => item.globalId);

  const { trackSelection, trackNavigation, trackOpen } = useHomeTracking();

  const currentSelectedId =
    selectedItemId || (allItemsIds.length > 0 ? allItemsIds[0] : null);

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
    allItems.find,
  ]);

  // Scroll selected item into view when it changes
  useEffect(() => {
    const position = window.pageYOffset;
    if (currentSelectedId && position > 240) {
      const element = document.querySelector(
        `[data-item-id="${currentSelectedId}"]`
      );
      element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentSelectedId]);

  const selectedItem = allItems.find(
    (item) => item.globalId === currentSelectedId
  );

  return (
    <section className="min-h-[720px] mt-24">
      <div className="flex h-full gap-12">
        <div className="flex-1 flex flex-col gap-20 my-8">
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
          {work && (
            <List
              key="work"
              title="work"
              list={work as ListItemProps[]}
              selectedItemId={currentSelectedId}
              category="work"
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
      <div className="sticky bottom-0 bg-background hidden sm:block text-foreground-07">
        <Divider className="bg-foreground-07" />
        <p className="font-mono text-sm py-2">
          Use ↓ | ↑ or mouse to navigate and ⏎ or click to open
        </p>
      </div>
    </section>
  );
};

export default HomeContent;
