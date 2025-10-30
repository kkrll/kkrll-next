import type { WritingMeta } from "@/lib/writings";

const WritingsView = ({ writing }: { writing: WritingMeta }) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4">{writing.title}</h2>
      <p>{writing.description}</p>
    </div>
  );
};

export default WritingsView;
