import type { Metadata } from "next";
import BioContent from "@/components/BioContent";
import HomeContent from "@/components/homeContent";
import PageLayout from "@/components/PageLayout";
import { SITE_URL } from "@/lib/constants";
import { getAllProjectsMeta } from "@/lib/projects";
import { getAllWritingsMeta } from "@/lib/writings";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kiryl Kavalenka",
  alternateName: "kkrll",
  jobTitle: "Product Designer",
  url: SITE_URL,
  worksFor: {
    "@type": "Organization",
    name: "Zing Coach",
    url: "https://www.zing.coach/",
  },
};

export default async function Home() {
  const writings = getAllWritingsMeta(5);
  const projects = getAllProjectsMeta();

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        /** biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, < escaped */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h1 className="sr-only">Kiryl Kavalenka — product designer</h1>
      <div className="absolute z-[5] left-0 right-0 top-0 h-16 bg-gradient-to-b from-background to-transparent opacity-80" />
      <BioContent />
      <HomeContent projects={projects} writings={writings} />
    </PageLayout>
  );
}
