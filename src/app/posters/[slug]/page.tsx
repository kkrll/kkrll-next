import { getPosterBySlug, getAllPosters, getPosterImages } from "@/lib/posters";
import { notFound } from "next/navigation";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import PosterInfo from "@/components/PosterInfo";

// Generate static paths for all posters at build time

export async function generateStaticParams() {
  const posters = getAllPosters();

  return posters.map((poster) => ({
    slug: poster.slug,
  }));
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
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] px-default gap-12">
        {/* Images column */}
        <div className="rounded-4xl overflow-hidden space-y-1">
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
