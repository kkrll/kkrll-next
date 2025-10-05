import { getPosterBySlug, getAllPosters, getPosterImages } from '@/lib/posters'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

export async function generateStaticParams() {
  const posters = getAllPosters()

  return posters.map((poster) => ({
    slug: poster.slug,
  }))
}

export default function PosterPage({ params }: { params: { slug: string } }) {
  const poster = getPosterBySlug(params.slug)

  if (!poster) {
    notFound()
  }

  const images = getPosterImages(params.slug)

  return (
    <main className="max-w-[1200px] mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images column */}
        <div className="space-y-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${poster.title} - image ${index + 1}`}
              className="w-full rounded-lg"
            />
          ))}
        </div>

        {/* Info column - sticky */}
        <div className="md:sticky md:top-8 h-fit">
          <h1 className="text-4xl font-bold mb-2">{poster.title}</h1>
          <p className="text-sm text-foreground/60 mb-6">{poster.date}</p>

          {poster.description && (
            <p className="mb-6">{poster.description}</p>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-bold mb-2">Sizes:</h3>
            <p className="text-sm">{poster.sm} - €{poster.priceSm}</p>
            <p className="text-sm">{poster.lg} - €{poster.priceLg}</p>
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
                    const src = props.src?.startsWith('./')
                      ? `/posters/${params.slug}/${props.src.replace('./', '')}`
                      : props.src;
                    return <img {...props} src={src} className="rounded-lg my-6" alt={props.alt || ''} />
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
