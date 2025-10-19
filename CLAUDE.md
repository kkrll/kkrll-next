# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 personal portfolio site using the App Router, TypeScript, and Tailwind CSS v4. The site features three main content types: writings (blog posts), posters (artwork), and projects. All content is MDX-based with PostHog analytics integration.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle with Turbopack (runs prebuild script)
- `npm run prebuild` - Alias for copy-content
- `npm run copy-content` - Copies content from `content/` to `public/` for static serving
- `npm start` - Run production server
- `npm run lint` - Check code with Biome
- `npm run format` - Format code with Biome

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
  - `useTracking()` - General tracking utilities (used in ASCII canvas, etc.)
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
│   ├── posters/          # Poster listing and dynamic routes
│   ├── writings/         # Writing listing and dynamic routes
│   ├── page.tsx          # Homepage
│   └── layout.tsx        # Root layout with fonts/metadata
├── components/           # React components
│   ├── Bio/              # Bio component with ASCII art
│   │   └── HeroAscii/    # Interactive ASCII canvas (see below)
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

**ASCII Canvas Tracking** - Automatically tracked in `HeroAscii` component:
- `ascii_drawing_mode_entered` - User enters drawing mode
- `ascii_drawing_mode_exited` - User exits drawing mode
- `ascii_symbol_changed` - User changes drawing symbol (includes symbol & index)
- `ascii_custom_symbol_added` - User adds custom character (includes symbol)
- `ascii_canvas_cleared` - User clears canvas
- `ascii_saved_as_png` - User downloads PNG
- `ascii_saved_as_txt` - User downloads TXT

See `src/components/Bio/HeroAscii/TRACKING.md` for detailed event documentation.

### HeroAscii Component (Interactive ASCII Canvas)

**Location**: `src/components/Bio/HeroAscii/`

**Architecture**:
```
HeroAscii/
├── constants.ts              # ASCII chars, dimensions, font config
├── types.ts                  # TypeScript interfaces (CharCell, Colors)
├── NavButton.tsx             # Symbol button component
├── CustomSymbolButton.tsx    # Custom symbol input component
├── DrawingControls.tsx       # Action buttons (Clear/Save/Exit)
├── ResizingIndicator.tsx     # Loading overlay during resize
├── SymbolSelector.tsx        # Symbol picker bar
├── TRACKING.md               # PostHog event documentation
└── index.tsx                 # Main component (~450 lines)
```

**Key Features**:
- Interactive fullscreen ASCII art canvas
- Draw with 9 default symbols + custom characters
- Preserves drawing during window resize (center-anchored)
- Export as PNG or TXT
- RAF-throttled drawing for 60fps performance
- Debounced resize handling (200ms)
- PostHog event tracking for all user actions

**Performance Patterns**:
- Uses refs for non-UI state (avoids re-renders)
- `selectedSymbol` state for UI + `selectedSymbolRef` for drawing logic
- `asciiCharsDrawRef` for character array (ref to prevent re-renders)
- `requestAnimationFrame` throttling for mousemove events
- Color caching via `colorsRef` (avoids expensive `getComputedStyle()` calls)
- Debounced resize with visual feedback

**Resize Behavior**:
- Preserves center content when resizing
- Adds/removes columns and rows from edges
- In drawing mode: new cells are blank
- In normal mode: new cells get gradient
- Shows "Resizing..." indicator during resize

**Do NOT**:
- Extract logic into custom hooks (not reused anywhere)
- Over-engineer the component structure
- Add state that could be refs (causes unnecessary re-renders)
