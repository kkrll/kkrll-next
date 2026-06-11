import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { getAllWritings } from "@/lib/writings";
import WritingsContent from "./WritingsContent";

export const metadata: Metadata = {
  title: "Writings",
  description:
    "Articles on product design, UX, and building things — by Kiryl Kavalenka.",
  alternates: { canonical: "/writings" },
};

export default function WritingsPage() {
  const writings = getAllWritings();

  return (
    <PageLayout>
      <WritingsContent writings={writings} />
    </PageLayout>
  );
}
