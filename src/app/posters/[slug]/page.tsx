import { getPosterBySlug, getAllPosters, getPosterImages } from "@/lib/posters";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";

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
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] px-8 md:px-4 gap-12">
        {/* Images column */}
        <div className="space-y-1 rounded-4xl overflow-hidden">
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
        <div className="md:sticky md:top-8 h-fit">
          <h1 className="text-4xl font-bold mb-2">{poster.title}</h1>
          <p className="text-sm text-foreground/60 mb-6">{poster.date}</p>

          {poster.description && <p className="mb-6">{poster.description}</p>}

          <div className="mb-6">
            <h3 className="text-sm font-bold mb-2">Sizes:</h3>
            <p className="text-sm">
              {poster.sm} - €{poster.priceSm}
            </p>
            <p className="text-sm">
              {poster.lg} - €{poster.priceLg}
            </p>
          </div>

          {poster.external && (
            <a
              href={poster.external}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
            >
              View on Good Mood Prints
            </a>
          )}

          {poster.content && (
            <div className="prose prose-invert max-w-none mt-8">
              <MDXRemote
                source={poster.content}
                components={{
                  img: (props) => {
                    const src = props.src?.startsWith("./")
                      ? `/posters/${slug}/${props.src.replace("./", "")}`
                      : props.src;
                    return (
                      <Image
                        {...props}
                        src={src}
                        width={800}
                        height={0}
                        className="rounded-lg my-6"
                        alt={props.alt || ""}
                      />
                    );
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
