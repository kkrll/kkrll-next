import type { WritingMeta } from "@/lib/writings";
import { useRouter } from "next/navigation";

const WritingsView = ({ writing }: { writing: WritingMeta }) => {
  const displayText = writing.description || writing.excerpt;
  const router = useRouter();

  return (
    <div className="mb-8 py-2">
      <h2 className="mb-12">{writing.title}</h2>
      {displayText && <p className="whitespace-pre-line max-w-2xl text-pretty">{displayText}</p>}
      {writing.link && (
        <button
          className="nice-button mt-6"
          onClick={() => router.push(writing.link as string)}
        >
          <span>Continue reading ⏎</span>
        </button>
      )}
    </div>
  );
};

export default WritingsView;
