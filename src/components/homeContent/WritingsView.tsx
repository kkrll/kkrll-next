import type { WritingMeta } from "@/lib/writings";

const WritingsView = ({
  writing,
  isTransitioning,
}: {
  writing: WritingMeta;
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
        <h2 className="mb-4">{writing.title}</h2>
        <p>{writing.description}</p>
      </div>
    </div>
  );
};

export default WritingsView;
