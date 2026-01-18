# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 personal portfolio site using the App Router, TypeScript, and Tailwind CSS v4. The site features three main content types: writings (blog posts), posters (artwork), and projects. All content is MDX-based with PostHog analytics integration.

## Development Commands

### Core Commands

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build production bundle with Turbopack (runs prebuild script)
- `bun run prebuild` - Alias for copy-content
- `bun run copy-content` - Copies content from `content/` to `public/` for static serving
- `bun start` - Run production server
- `bun run lint` - Check code with Biome
- `bun run format` - Format code with Biome

### IMPORTANT: Do NOT run `bun run build` locally

The `prebuild` script replaces symlinks in `public/` (writings, projects, posters) with copied files. In development, these are symlinks to `content/` for convenience. Running build will break them.

If you accidentally run build, restore symlinks with:
```bash
rm -rf public/writings public/projects public/posters && ln -s ../content/writings public/writings && ln -s ../content/projects public/projects && ln -s ../content/posters public/posters
```

### Biome Linter/Formatter

This project uses Biome instead of ESLint/Prettier. Biome is configured for Next.js and React recommendations, with automatic import organization enabled.

## Architecture

### Content System

The site uses a file-system based content architecture with three content types:

#### Writings (Blog Posts)

- **Location**: `content/writings/[slug]/index.mdx`
- **Frontmatter**: title, date, cover, publisher?, link?
- **API** (`src/lib/writings.ts`):
  - `getAllWritings()` - Returns all writings sorted by date
  - `getAllWritingsMeta(limit?)` - Returns metadata only, with optional "view all" item
  - `getWritingBySlug(slug)` - Returns specific writing

#### Posters (Artwork)

- **Location**: `content/posters/[slug]/index.mdx`
- **Frontmatter**: title, date, description, order, tier, sm (size), lg (size), smId, lgId, priceSm, priceLg, external?, cover
- **API** (`src/lib/posters.ts`):
  - `getAllPosters()` - Returns all posters sorted by date
  - `getAllPostersMeta(limit?)` - Returns metadata with optional "view all" item
  - `getPosterBySlug(slug)` - Returns specific poster
  - `getPosterImages(slug)` - Returns array of image paths for a poster

#### Projects

- **Location**: `content/projects/[slug]/index.mdx`
- **Frontmatter**: title, date, cover?, publisher?, description?, projectType?, link?, isExternal?
- **API** (`src/lib/projects.ts`):
  - `getAllProjects()` - Returns all projects sorted by date
  - `getAllProjectsMeta(limit?)` - Returns metadata with optional "view all" item
  - `getProjectBySlug(slug)` - Returns specific project

**Important**: All content is copied from `content/` to `public/` during build via the `copy-content` script. This enables static serving of images and MDX files.

### Media Storage

- **Small media** (<5MB, <10 files): Store in `public/` and commit to git
- **Large media/videos**: Use Cloudflare R2 (S3-compatible storage, zero egress fees)
- **R2 Configuration**:
  - Uses `@aws-sdk/client-s3` for uploads
  - Utility: `src/lib/r2.ts` (`uploadToR2()` function)
  - Helper: `src/lib/constants.ts` (`getR2Url()` for public URLs)
  - Env vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `NEXT_PUBLIC_R2_PUBLIC_URL`
  
### MDX Configuration

- MDX components are globally configured in `mdx-components.tsx` (root level)
- Custom components override default HTML elements with Tailwind-styled versions
- Next.js components (Link, Image) are available in MDX
- Next.js config extends `.pageExtensions` to include `.mdx` files
- Uses `@mdx-js/loader`, `@mdx-js/react`, and `@next/mdx` packages

### Analytics

- **PostHog** is used for analytics tracking
- **Provider** (`src/providers/posthog-provider.tsx`): Client-side PostHog initialization with GDPR-friendly settings
- **Hooks**:
  - `useHomeTracking()` - Tracks item selection, navigation, and opens on homepage
  - `useTracking()` - General tracking utilities
  - `useDebounce()` - Debounces callbacks (used for resize handling)

### State Management

- **Zustand** is used for client-side state
- **Navigation Store** (`src/stores/useNavigationStore.ts`): Persists selected item state to localStorage for navigation tracking with next/previous functionality

### Path Aliases

TypeScript is configured with `@/*` path alias mapping to `src/*`

### Styling

- Tailwind CSS v4 with PostCSS
- Custom font setup: Geist and Geist Mono from next/font/google
- Global styles in `src/app/globals.css`

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/ascii/upload/ # ASCII art upload API (used by draw.kkrll.com)
│   ├── posters/          # Poster listing and dynamic routes
│   ├── writings/         # Writing listing and dynamic routes
│   ├── page.tsx          # Homepage
│   └── layout.tsx        # Root layout with fonts/metadata
├── components/           # React components
│   ├── BioContent/       # Bio section content
│   ├── header/           # Navigation header
│   ├── homeContent/      # Homepage content components
│   ├── Divider.tsx
│   ├── Footer.tsx
│   └── PageLayout.tsx
├── hooks/                # Custom React hooks
│   ├── useDebounce.ts    # Debounce hook for resize/input
│   ├── useHomeTracking.ts
│   └── useTracking.ts
├── lib/                  # Utility functions
│   ├── r2.ts             # R2 upload utility
│   ├── constants.ts      # R2 URL helpers + other constants
│   ├── writings.ts       # Writings content loading
│   ├── posters.ts        # Posters content loading
│   └── projects.ts       # Projects content loading
├── providers/            # React context providers
│   └── posthog-provider.tsx
└── stores/               # Zustand stores
    └── useNavigationStore.ts

content/
├── writings/             # MDX blog content
│   └── [slug]/
│       ├── index.mdx     # Post content + frontmatter
│       └── *.png         # Post images
├── posters/              # MDX poster content
│   └── [slug]/
│       ├── index.mdx     # Poster metadata
│       └── *.{jpg,png}   # Poster images
└── projects/             # MDX project content
    └── [slug]/
        ├── index.mdx     # Project content + frontmatter
        └── *.{jpg,png}   # Project images

public/                   # Static files (auto-copied from content/)
└── [mirrors content/]
```

## Key Patterns

### Adding New Content

**Writings:**
Create a new folder in `content/writings/[slug]/` with:

1. `index.mdx` file with frontmatter (title, date, cover, publisher?, link?)
2. Images referenced relatively from the MDX file
3. The slug from the folder name becomes the URL

**Posters:**
Create a new folder in `content/posters/[slug]/` with:

1. `index.mdx` file with frontmatter (title, date, description, order, tier, sm, lg, smId, lgId, priceSm, priceLg, external?, cover)
2. Images (will be auto-copied to public/)

**Projects:**
Create a new folder in `content/projects/[slug]/` with:

1. `index.mdx` file with frontmatter (title, date, cover?, publisher?, description?, projectType?, link?, isExternal?)
2. Images referenced relatively from the MDX file

### MDX Component Customization

To customize MDX rendering, edit `mdx-components.tsx` in the root directory. All standard HTML elements can be overridden with custom React components.

### Analytics Tracking

**Homepage Tracking** - Use `useHomeTracking()` hook:

- `trackSelection(item, source)` - Track when user selects an item
- `trackNavigation(direction)` - Track keyboard navigation
- `trackOpen(item, method)` - Track when user opens an item

### Draw App

The interactive ASCII drawing canvas has been moved to a separate project at [draw.kkrll.com](https://draw.kkrll.com). Visitors to `/?draw=true` are automatically redirected there.

The `/api/ascii/upload` endpoint remains in this codebase to handle R2 uploads from the draw app (with CORS configured for draw.kkrll.com).
