import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postersDirectory = path.join(process.cwd(), 'content/posters')

export type Poster = {
  slug: string
  title: string
  date: string
  description: string
  order?: string
  tier?: string
  sm: string        // Small size (e.g., "A3")
  lg: string        // Large size (e.g., "50x70 cm")
  smId: string
  lgId: string
  priceSm: number
  priceLg: number
  external?: string
  cover: string
  content: string
}

export type PosterMeta = {
  slug: string
  title: string
  date: string
  description: string
  cover: string
  type: "posters"
  globalId: string
}

export type PosterMetaWithViewAll = PosterMeta | {
  isViewAll: true
  totalItems: number
  type: "posters"
  globalId: string
}

// Get all posters with their frontmatter
export function getAllPosters(): Poster[] {
  const folders = fs.readdirSync(postersDirectory)

  const posters = folders.map((folder) => {
    const fullPath = path.join(postersDirectory, folder, 'index.mdx')

    // Skip if index.mdx doesn't exist
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: folder,
      title: data.title,
      date: data.date,
      description: data.description,
      order: data.order,
      tier: data.tier,
      sm: data.sm,
      lg: data.lg,
      smId: data.smId,
      lgId: data.lgId,
      priceSm: data.priceSm,
      priceLg: data.priceLg,
      external: data.external,
      cover: data.cover,
      content,
    }
  }).filter(Boolean) as Poster[]

  // Sort by date, newest first
  return posters.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

// Get all posters metadata (without content)
export function getAllPostersMeta(limit?: number): PosterMetaWithViewAll[] {
  const folders = fs.readdirSync(postersDirectory)

  const postersMeta = folders.map((folder) => {
    const fullPath = path.join(postersDirectory, folder, 'index.mdx')

    // Skip if index.mdx doesn't exist
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug: folder,
      title: data.title || 'Untitled',
      date: data.date || 'Unknown date',
      description: data.description || '',
      cover: data.cover || null,
      type: 'posters',
      globalId: `posters-${folder}`,
    } as PosterMeta
  }).filter(Boolean) as PosterMeta[]

  // Sort by date, newest first
  const sorted = postersMeta.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  if (limit && sorted.length > limit) {
    return [
      ...sorted.slice(0, limit),
      {
        isViewAll: true,
        totalItems: sorted.length,
        type: 'posters',
        globalId: 'posters-view-all',
      }
    ]
  }

  return sorted
}

// Get a single poster by slug
export function getPosterBySlug(slug: string): Poster | null {
  try {
    const fullPath = path.join(postersDirectory, slug, 'index.mdx')
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      order: data.order,
      tier: data.tier,
      sm: data.sm,
      lg: data.lg,
      smId: data.smId,
      lgId: data.lgId,
      priceSm: data.priceSm,
      priceLg: data.priceLg,
      external: data.external,
      cover: data.cover,
      content,
    }
  } catch {
    return null
  }
}

// Get all images for a poster
export function getPosterImages(slug: string): string[] {
  const posterDir = path.join(postersDirectory, slug)

  try {
    const files = fs.readdirSync(posterDir)

    // Filter image files and sort them
    return files
      .filter(file => /\.(jpg|jpeg|png|svg)$/i.test(file))
      .filter(file => file !== 'index.mdx')
      .sort()
      .map(file => `/posters/${slug}/${file}`)
  } catch {
    return []
  }
}
