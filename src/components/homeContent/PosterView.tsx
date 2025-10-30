import PosterPreview from "./PosterPreview";
import type { PosterMeta } from "@/lib/posters";

const PosterView = ({ poster }: { poster: PosterMeta }) => {
  return (
    <>
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
    </>
  );
};

export default PosterView;
