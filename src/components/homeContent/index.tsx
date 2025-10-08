"use client";

import { useEffect } from "react";

import { useNavigationStore } from "@/stores/useNavigationStore";

import List from "@/components/homeContent/List";
import ContentWindow from "./ContentWindow";
import Divider from "../Divider";

import type { ListItemProps } from "./types";
import type { WritingMeta } from "@/lib/writings";
import type { ProjectMeta } from "@/lib/projects";
import type { PosterMeta } from "@/lib/posters";

const HomeContent = ({
  writings,
  projects,
  posters,
}: {
  writings: WritingMeta[];
  projects: ProjectMeta[];
  posters: PosterMeta[];
}) => {
  const { selectedItemId, setSelectedItemId, selectNext, selectPrevious } =
    useNavigationStore();

  const allItems = [...projects, ...writings, ...posters];
  const allItemsIds = allItems.map((item) => item.globalId);

  useEffect(() => {
    if (!selectedItemId && allItemsIds.length > 0) {
      setSelectedItemId(allItemsIds[0]);
    }
  }, [selectedItemId, setSelectedItemId, allItemsIds]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectNext(allItemsIds);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectPrevious(allItemsIds);
      } else if (e.key === "Enter" && selectedItemId) {
        e.preventDefault();
        const link = document
          .querySelector(`[data-item-id="${selectedItemId}"]`)
          ?.getAttribute("href");
        if (link) {
          window.location.href = link;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectNext, selectPrevious, allItemsIds, selectedItemId]);

  // Scroll selected item into view when it changes
  useEffect(() => {
    if (selectedItemId) {
      const element = document.querySelector(
        `[data-item-id="${selectedItemId}"]`
      );
      element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedItemId]);

  const selectedItem = allItems.find(
    (item) => item.globalId === selectedItemId
  );

  return (
    <section className="min-h-[720px] border-t-1 border-t-foreground ">
      <div className="flex h-full gap-12">
        <div className="flex-1 flex flex-col gap-20 my-8">
          {projects && (
            <List
              key={"projects"}
              title={"projects"}
              list={projects as ListItemProps[]}
              selectedItemId={selectedItemId}
              category="projects"
              onSelect={(id) => setSelectedItemId(id)}
            />
          )}
          {writings && (
            <List
              key="writings"
              title="writings"
              list={writings as ListItemProps[]}
              selectedItemId={selectedItemId}
              category="writings"
              onSelect={(id) => setSelectedItemId(id)}
            />
          )}
          {posters && (
            <List
              key="posters"
              title="posters"
              list={posters as ListItemProps[]}
              selectedItemId={selectedItemId}
              category="posters"
              onSelect={(id) => setSelectedItemId(id)}
            />
          )}
        </div>
        <div className="flex-2 motion-safe:animate-[fadeIn_200ms_ease-in-out] hidden md:flex">
          {selectedItem ? (
            <ContentWindow selectedItem={selectedItem} />
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
