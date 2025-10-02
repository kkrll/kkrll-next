"use client";

import Header from "@/components/header";
import { useState } from "react";

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
      className={`py-2 px-4 hover:pointer ${
        isSelected
          ? "bg-foreground text-background"
          : "bg-background text-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      {item.title}
    </button>
  );
};

const List = ({ title, list }: { title: string; list: ListItemProps[] }) => {
  const [isSelected, setIsSelected] = useState("1");
  return (
    <section className="border-t-1 border-t-foreground py-8 ">
      <div>
        <h2>{title}</h2>
        <div className="flex gap-1 flex-col">
          {list.map((item, index) => (
            <ListItemSelector
              key={index}
              item={item}
              isSelected={isSelected === item.id}
              onClick={() => {
                setIsSelected(item.id);
                console.log("selectedOne:" + isSelected);
              }}
            />
          ))}
        </div>
      </div>
      <div>{isSelected && <div>Selected Item Details</div>}</div>
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
      <section className="grid grid-cols-[1fr 2fr] gap-6 border-t-1 border-t-foreground py-8 ">
        <div>
          <List title="projects" list={dummyList} />
          <List title="writings" list={dummyList} />
          <List title="posters" list={dummyList} />
        </div>
        <div>details of selected item</div>
      </section>
    </main>
  );
}
