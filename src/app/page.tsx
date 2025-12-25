import HomeContent from "@/components/homeContent";
import Bio from "@/components/Bio";

import { getAllProjectsMeta } from "@/lib/projects";
import { getAllWritingsMeta } from "@/lib/writings";
import PageLayout from "@/components/PageLayout";
import { Suspense } from "react";
import BioContent from "@/components/BioContent";

export default async function Home() {
  const writings = getAllWritingsMeta(4);
  const projects = getAllProjectsMeta(4);

  return (
    <PageLayout>
      <div className="absolute z-[5] left-0 right-0 top-0 h-16 bg-gradient-to-b from-background to-transparent opacity-80" />
      <Suspense fallback={<BioContent />}>
        <Bio />
      </Suspense>
      <HomeContent projects={projects} writings={writings} />
    </PageLayout>
  );
}
