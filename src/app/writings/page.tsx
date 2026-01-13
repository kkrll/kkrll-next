import { getAllWritings } from "@/lib/writings";
import PageLayout from "@/components/PageLayout";
import WritingsContent from "./WritingsContent";

export default function WritingsPage() {
  const writings = getAllWritings();

  return (
    <PageLayout>
      <WritingsContent writings={writings} />
    </PageLayout>
  );
}
