import type { WritingMeta } from "@/lib/writings";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const WritingsView = ({ writing }: { writing: WritingMeta }) => {
  const displayText = writing.description || writing.excerpt;
  const router = useRouter();

  return (
    <div className="mb-8">
      <h2 className="mb-4">{writing.title}</h2>
      {displayText && <p>{displayText}</p>}
      {writing.link && (
        <Button
          variant="default"
          className="mt-8"
          onClick={() => router.push(writing.link as string)}
        >
          Continue reading ⏎
        </Button>
      )}
    </div>
  );
};

export default WritingsView;
