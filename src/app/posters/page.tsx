import { getAllPosters } from "@/lib/posters";
import PageLayout from "@/components/PageLayout";
import PostersContent from "./PostersContent";

export default function PostersPage() {
  const posters = getAllPosters();

  return (
    <PageLayout>
      <PostersContent posters={posters} />
    </PageLayout>
  );
}
