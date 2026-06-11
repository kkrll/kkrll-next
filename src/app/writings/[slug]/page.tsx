import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { articleComponents } from "@/components/articles/registry";
import PageLayout from "@/components/PageLayout";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";

// Generate static paths for all writings at build time
export async function generateStaticParams() {
  const writings = getAllWritings();

  return writings.map((writing) => ({
    slug: writing.slug,
  }));
}

function coverUrl(slug: string, cover?: string) {
  return cover ? `/writings/${slug}/${cover.replace("./", "")}` : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);

  if (!writing) {
    return {};
  }

  const cover = coverUrl(slug, writing.cover);

  return {
    title: writing.title,
    description: writing.description,
    alternates: {
      // Republished pieces point to the original; own posts self-canonical
      canonical: writing.link || `/writings/${slug}`,
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: writing.title,
      description: writing.description,
      url: `/writings/${slug}`,
      publishedTime: new Date(writing.date).toISOString(),
      images: cover ? [{ url: cover }] : undefined,
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title: writing.title,
      description: writing.description,
    },
  };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);

  if (!writing) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: writing.title,
    description: writing.description || undefined,
    datePublished: new Date(writing.date).toISOString(),
    image: writing.cover
      ? `${SITE_URL}${coverUrl(slug, writing.cover)}`
      : undefined,
    url: `${SITE_URL}/writings/${slug}`,
    author: {
      "@type": "Person",
      name: "Kiryl Kavalenka",
      url: SITE_URL,
    },
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        /** biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from build-time frontmatter, < escaped */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="max-w-[640px] w-full px-default">
        <header className="mb-8 border-b border-foreground-05 pb-6">
          {writing.cover && (
            <Image
              src={`/writings/${slug}/${writing.cover.replace("./", "")}`}
              alt={writing.title}
              width={800}
              height={400}
              className="w-full rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl font-normal font-serif mt-10 mb-4">
            {writing.title}
          </h1>
          <p className="text-sm mt-2 text-foreground-07">
            <time className="text-sm text-foreground-07">
              {new Date(writing.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {writing.publisher && writing.link && (
              <>
                {". "} Originally published on{" "}
                <a
                  href={writing.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic underline hover:no-underline"
                >
                  {writing.publisher}
                </a>
              </>
            )}
          </p>
        </header>

        <div className="prose prose-invert max-w-none font-serif text-md text-foreground font-regular dark:font-medium [&_*:not(.not-prose):not(.not-prose_*)]:!text-inherit [&_li::marker]:!text-foreground-05">
          <MDXRemote
            source={writing.content}
            components={{
              Link,
              Image,
              ...articleComponents,
              h2: ({ children }) => (
                <h2 className="text-xl font-normal">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg lining-nums font-medium">{children}</h3>
              ),
              a: (props) => (
                <a {...props} className="underline hover:no-underline" />
              ),
              p: ({ children }) => (
                <p className="my-4 leading-relaxed [figcaption_&]:mt-0 [figcaption_&]:text-foreground-07 [figcaption_&]:mb-10 [figcaption_&]:font-sans [figcaption_&]:text-xs [figcaption_&]:font-normal [figcaption_&]:leading-normal">
                  {children}
                </p>
              ),
              hr: () => <hr className="my-18 border-background-05" />,
              li: ({ children }) => (
                <li className="mb-4 font-medium">{children}</li>
              ),
              img: (props) => {
                // Rewrite relative paths (./image.png) to absolute paths (/writings/slug/image.png)
                const src = props.src?.startsWith("./")
                  ? `/writings/${slug}/${props.src.replace("./", "")}`
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
      </article>
    </PageLayout>
  );
}
