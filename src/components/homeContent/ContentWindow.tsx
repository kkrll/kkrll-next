import Image from "next/image";

import type { WritingMeta } from "@/lib/writings";
import type { ProjectMeta } from "@/lib/projects";

type SelectedItemType =
  | WritingMeta
  | ProjectMeta
  | {
      type: string;
      globalId: string;
      title: string;
      description: string;
      link: string;
      cover: string;
      slug: string;
    };

const ContentWindow = ({
  selectedItem,
}: {
  selectedItem: SelectedItemType;
}) => {
  return (
    <div className="sticky top-0 size-fit py-8">
      <div className="mb-8">
        <h2>{selectedItem.title}</h2>
        <p>{selectedItem.description}</p>
      </div>
      {selectedItem.cover && (
        <Image
          src={`/${selectedItem.type}/${
            selectedItem.slug
          }/${selectedItem.cover.replace("./", "")}`}
          width={512}
          height={512}
          alt={selectedItem.title}
          className="w-full rounded-lg mb-4"
        />
      )}
    </div>
  );
};

export default ContentWindow;
