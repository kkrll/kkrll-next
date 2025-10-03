"use client";

import Header from "@/components/header";
import { useNavigationStore } from "@/stores/useNavigationStore";
import { Key, useEffect, useState } from "react";

const ListItemSelector = ({
  item,
  onClick,
  isSelected,
}: {
  item: ListItemProps;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 hover:pointer text-left ${
        isSelected
          ? "bg-foreground text-background"
          : "bg-background text-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      {item.title}
    </button>
  );
};

type ListProps = {
  title: string;
  list: ListItemProps[];
  selectedItemId: string | null;
  onSelect: (id: string) => void;
  category: "project" | "writing" | "poster";
};

const List = ({
  title,
  list,
  selectedItemId,
  onSelect,
  category,
}: ListProps) => {
  return (
    <section className="border-t-1 border-t-foreground py-8 ">
      <div>
        <h2>{title}</h2>
        <div className="flex gap-1 flex-col">
          {list.map((item, index) => {
            const globalId = `${category}-${item.id}`;
            return (
              <ListItemSelector
                key={index}
                item={item}
                isSelected={selectedItemId === globalId}
                onClick={() => onSelect(globalId)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

type ListItemProps = {
  title: string;
  description: string;
  link: string;
  cover: string;
  id: string;
};

const dummyList: ListItemProps[] = [
  {
    title: "Project 1",
    description: "Description of project 1",
    link: "#",
    cover: "",
    id: "1",
  },
  {
    title: "Project 2",
    description: "Description of project 1",
    link: "#",
    cover: "",
    id: "2",
  },
  {
    title: "Project 3",
    description: "Description of project 1",
    link: "#",
    cover: "",
    id: "3",
  },
];

export default function Home() {
  const { selectedItemId, setSelectedItemId, selectNext, selectPrevious } =
    useNavigationStore();

  const allItems = [
    ...dummyList.map((item) => ({
      ...item,
      type: "project",
      globalId: "project-" + item.id,
    })),
    ...dummyList.map((item) => ({
      ...item,
      type: "writing",
      globalId: "writing-" + item.id,
    })),
    ...dummyList.map((item) => ({
      ...item,
      type: "poster",
      globalId: "poster-" + item.id,
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectNext, selectPrevious, allItemsIds]);

  const selectedItem = allItems.find(
    (item) => item.globalId === selectedItemId
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between  max-w-[1200px] mx-auto">
      <Header />
      <section>
        <p>Hey. </p>
        <p>I'm Kiryl, a product designer at Zing Coach. </p>
        <p>
          You can find here some of my posters, articles, resume, and something
          else, occasionally.
        </p>
        <p>Welcome.</p>
      </section>
      <section className="grid grid-cols-[1fr_2fr] gap-6 border-t-1 border-t-foreground py-8 ">
        <div>
          {["projects", "writings", "posters"].map((category, index) => (
            <List
              key={index}
              title={category}
              list={dummyList}
              selectedItemId={selectedItemId}
              category={
                category.slice(0, -1) as "project" | "writing" | "poster"
              }
              onSelect={(id) => setSelectedItemId(id)}
            />
          ))}
        </div>
        <div>
          {selectedItem ? (
            <div>
              <h3>{selectedItem.title}</h3>
              <p>{selectedItem.description}</p>
            </div>
          ) : (
            "select from the list"
          )}
        </div>
      </section>
    </main>
  );
}
