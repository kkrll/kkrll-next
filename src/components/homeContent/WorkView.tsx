import type { WorkMeta } from "@/lib/work";

const WorkView = ({
  work,
  isTransitioning,
}: {
  work: WorkMeta;
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
        <h2 className="mb-4">{work.title}</h2>
        <p>{work.description}</p>
      </div>
    </div>
  );
};

export default WorkView;
