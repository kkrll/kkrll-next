"use client";

import { useEffect } from "react";

import { useNavigationStore } from "@/stores/useNavigationStore";
import type { WritingMeta } from "@/lib/writings";

import List from "@/components/homeContent/List";

import type { ListItemProps } from "./types";
import type { ProjectMeta } from "@/lib/projects";
import ContentWindow from "./ContentWindow";
import Divider from "../Divider";

const dummyList = [
  {
    title: "Project 1",
    description: "Description of project 1",
    link: "#",
    cover: "",
    slug: "1",
  },
  {
    title: "Project 2",
    description: "Description of project 2",
    link: "#",
    cover: "",
    slug: "2",
  },
  {
    title: "Project 3",
    description: "Description of project 3",
    link: "#",
    cover: "",
    slug: "3",
  },
];

const HomeContent = ({
  writings,
  projects,
}: {
  writings: WritingMeta[];
  projects: ProjectMeta[];
}) => {
  const { selectedItemId, setSelectedItemId, selectNext, selectPrevious } =
    useNavigationStore();

  const allItems = [
    ...projects,
    ...writings,
    ...dummyList.map((item) => ({
      ...item,
      type: "poster",
      globalId: `posters-${item.slug}`,
    })),
  ];
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
          <List
            key="posters"
            title="posters"
            list={dummyList as ListItemProps[]}
            selectedItemId={selectedItemId}
            category="posters"
            onSelect={(id) => setSelectedItemId(id)}
          />
        </div>
        <div className="flex-2 flex">
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
