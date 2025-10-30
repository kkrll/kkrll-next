import type { WorkMeta } from "@/lib/work";

const WorkView = ({ work }: { work: WorkMeta }) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4">{work.title}</h2>
      <p>{work.description}</p>
    </div>
  );
};

export default WorkView;
