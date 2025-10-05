# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 personal portfolio/blog site using the App Router, TypeScript, and Tailwind CSS v4. The site features MDX-based content for blog writings with a focus on product design and UX topics.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle with Turbopack
- `npm start` - Run production server
- `npm run lint` - Check code with Biome
- `npm run format` - Format code with Biome

### Biome Linter/Formatter
This project uses Biome instead of ESLint/Prettier. Biome is configured for Next.js and React recommendations, with automatic import organization enabled.

## Architecture

### Content System
The site uses a file-system based content architecture for blog posts:

- **Content Location**: All writings live in `content/writings/[slug]/index.mdx`
- **Content Structure**: Each writing is a folder containing an `index.mdx` file and associated images
- **Frontmatter**: MDX files include metadata (title, date, cover, publisher, link)
- **Content Loading**: Server-side content loading via `src/lib/writings.ts`:
  - `getAllWritings()` - Returns all writings sorted by date (newest first)
  - `getWritingBySlug(slug)` - Returns specific writing by slug

### MDX Configuration
- MDX components are globally configured in `mdx-components.tsx` (root level)
- Custom components override default HTML elements with Tailwind-styled versions
- Next.js components (Link, Image) are available in MDX
- Next.js config extends `.pageExtensions` to include `.mdx` files

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
│   ├── writings/         # Blog listing and dynamic routes
│   └── layout.tsx        # Root layout with fonts/metadata
├── components/           # React components
│   └── header/          # Navigation header
├── lib/                 # Utility functions
│   └── writings.ts      # Content loading logic
└── stores/              # Zustand stores
    └── useNavigationStore.ts

content/
└── writings/            # MDX blog content
    └── [slug]/
        ├── index.mdx    # Post content + frontmatter
        └── *.png        # Post images
```

## Key Patterns

### Adding New Writings
Create a new folder in `content/writings/[slug]/` with:
1. `index.mdx` file with frontmatter (title, date, cover, publisher?, link?)
2. Images referenced relatively from the MDX file
3. The slug from the folder name becomes the URL

### MDX Component Customization
To customize MDX rendering, edit `mdx-components.tsx` in the root directory. All standard HTML elements can be overridden with custom React components.
