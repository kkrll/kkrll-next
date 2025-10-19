import PosterPreview from "./PosterPreview";
import type { PosterMeta } from "@/lib/posters";

const WorkView = ({
  poster,
  isTransitioning,
}: {
  poster: PosterMeta;
  isTransitioning: boolean;
}) => {
  return (
    <div
      className={`sticky top-0 size-fit p-8 shadow-2xl w-full ${
        isTransitioning
          ? "animate-[fadeOut_200ms_ease-in-out]"
          : "animate-[fadeIn_200ms_ease-in-out]"
      }`}
    >
      <div className="mb-8">
        <h2 className="mb-4">{poster.title}</h2>
        <p>{poster.description}</p>
      </div>

      {poster.cover && (
        <PosterPreview
          poster={{
            slug: poster.slug,
            cover: `/${poster.type}/${poster.slug}/${poster.cover.replace(
              "./",
              ""
            )}`,
            title: poster.title,
          }}
        />
      )}
    </div>
  );
};

export default WorkView;
