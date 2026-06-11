import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import PosterInfo from "@/components/PosterInfo";
import { SITE_NAME } from "@/lib/constants";
import { getAllPosters, getPosterBySlug, getPosterImages } from "@/lib/posters";

// Generate static paths for all posters at build time

export async function generateStaticParams() {
  const posters = getAllPosters();

  return posters.map((poster) => ({
    slug: poster.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const poster = getPosterBySlug(slug);

  if (!poster) {
    return {};
  }

  const title = `${poster.title} — poster`;
  const description = poster.description?.trim();
  const cover = poster.cover
    ? `/posters/${slug}/${poster.cover.replace("./", "")}`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/posters/${slug}`,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: `/posters/${slug}`,
      images: cover ? [{ url: cover }] : undefined,
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function PosterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poster = getPosterBySlug(slug);

  if (!poster) {
    notFound();
  }

  const images = getPosterImages(slug);

  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
        {/* Images column */}
        <div className="rounded-4xl overflow-hidden space-y-1 px-default ">
          {images.map((image, index) => (
            <Image
              key={image}
              width={800}
              height={0}
              src={image}
              alt={`${poster.title} - image ${index + 1}`}
              className="w-full"
            />
          ))}
        </div>

        {/* Info column - sticky */}
        <PosterInfo
          title={poster.title}
          date={poster.date}
          description={poster.description}
          sm={poster.sm}
          lg={poster.lg}
          external={poster.external}
          content={poster.content}
          slug={slug}
        />
      </div>
    </PageLayout>
  );
}
