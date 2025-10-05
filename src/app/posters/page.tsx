import { getAllPosters } from '@/lib/posters'
import Link from 'next/link'

export default function PostersPage() {
  const posters = getAllPosters()

  return (
    <main className="max-w-[1200px] mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Posters</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posters.map((poster) => (
          <Link
            key={poster.slug}
            href={`/posters/${poster.slug}`}
            className="group"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
              <img
                src={`/posters/${poster.slug}/1-full.jpg`}
                alt={poster.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="text-xl font-bold group-hover:underline">
              {poster.title}
            </h2>
            <p className="text-sm text-foreground/60">{poster.date}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
