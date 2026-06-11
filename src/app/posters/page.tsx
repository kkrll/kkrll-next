import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { getAllPosters } from "@/lib/posters";
import PostersContent from "./PostersContent";

export const metadata: Metadata = {
  title: "Posters",
  description:
    "Sports poster series in black ink and sanguine pencil — prints by Kiryl Kavalenka.",
  alternates: { canonical: "/posters" },
};

export default function PostersPage() {
  const posters = getAllPosters();

  return (
    <PageLayout>
      <PostersContent posters={posters} />
    </PageLayout>
  );
}
