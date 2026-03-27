# GitHub Copilot Instructions

## Project Overview

This is **danielproctor.dev** — a personal technical blog built with [Astro](https://astro.build/) (v5) using the AstroPaper theme. Content is authored in Markdown, managed via TinaCMS, styled with Tailwind CSS, and deployed via Docker/Nginx or GitHub Pages.

## Tech Stack

- **Framework**: Astro v5 with static site generation
- **Styling**: Tailwind CSS v3 with custom `skin` color tokens via CSS variables
- **Components**: Astro + React 18 (interactive islands only)
- **CMS**: TinaCMS (git-backed, admin at `/admin`)
- **Search**: Fuse.js
- **OG Images**: Satori + Resvg (generated at build time)
- **Content**: Astro Content Collections with Zod schema validation
- **Markdown**: remark-toc + remark-collapse plugins
- **Syntax Highlighting**: One Dark Pro theme

## Project Structure

```
src/
  config.ts          # Site-wide config (SITE, SOCIALS constants)
  content.config.ts     # Zod schema for blog collection frontmatter
    blog/            # Markdown blog posts live here
  components/        # Astro + React UI components
  layouts/           # Page layout wrappers
  pages/             # File-based routing
  utils/             # Helper functions (sorting, pagination, OG images)
  styles/base.css    # Global styles
tina/config.ts       # TinaCMS collection & field definitions
```

## Content Guidelines

### Blog Post Frontmatter

All posts in `src/content/blog/` must conform to this schema (defined in `src/content.config.ts`):

```yaml
---
title: "Post Title" # required
description: "Brief summary" # required
pubDatetime: 2024-01-01 # required (ISO date)
modDatetime: 2024-01-02 # optional, set when updating
author: Daniel Proctor # optional (defaults to "Daniel Proctor")
featured: false # optional boolean
draft: false # optional boolean; true = excluded from prod
tags: # optional array (defaults to ["others"])
  - tag-name
ogImage: "" # optional custom OG image path or URL
canonicalURL: "" # optional canonical URL
---
```

### Writing Style

- Technical, developer-focused audience
- Professional tone, direct and informative
- Use code blocks with language identifiers for all code examples
- Include a `## Prerequisites` section for tool-heavy posts
- Use `[link text](URL)` for external references
- Table of contents is auto-generated via remark-toc (use `## Table of contents`)

## Development Commands

```bash
npm run dev          # Start TinaCMS + Astro dev server
npm run build        # Production build (Astro + Jampack optimisation)
npm run tina:build   # Build TinaCMS admin UI separately
npm run preview      # Preview production build
```

## Coding Conventions

### Astro Components

- Use `.astro` for layout/presentation components, `.tsx` only when React interactivity is needed
- Keep interactive React islands minimal — prefer Astro components
- Use `client:load` directive sparingly; prefer `client:idle` or `client:visible`
- Style with Tailwind utility classes; avoid inline styles
- Use scoped styles (`<style>`) only when Tailwind is insufficient

### TypeScript

- All new files should be TypeScript (`.ts` / `.tsx` / `.astro`)
- Import types with `import type { ... }` where possible
- Use the Zod schema in `src/content.config.ts` as the source of truth for post type shapes

### Utilities

- Post filtering/sorting logic belongs in `src/utils/`
- Do not add post-processing logic directly in page files
- `getSortedPosts` is the standard entry point for fetching publishable posts

### Styling

- Use the custom Tailwind tokens (`skin`, `accent`, `fill`) rather than hardcoded colours
- The `IBM Plex Mono` font is the primary typeface
- Dark/light mode is controlled via CSS variables — do not hardcode dark mode colours

## OG Image Generation

- OG images are auto-generated at build time using Satori + Resvg
- Templates are in `src/utils/og-templates/` (post.tsx, site.tsx)
- Generated size: 1200×630px PNG
- Do not introduce network calls in OG image generation that could fail silently

## Content Collections

- All blog posts must be in `src/content/blog/`
- Filenames become the URL slug by default (slugified)
- Duplicate the `hello-word.md` post structure when creating new posts
- Draft posts (`draft: true`) are visible in dev but excluded from production builds

## Environment Variables (TinaCMS)

```
TINA_CLIENT_ID
TINA_TOKEN
TINA_INDEXER_TOKEN
GITHUB_BRANCH  # or VERCEL_GIT_COMMIT_REF
```

## Deployment

- **Docker**: `docker compose up -d` (serves built site via Nginx on ports 8080/8443)
- **GitHub Pages**: Push to main branch; CNAME set to `danielproctor.dev`
- Build output is in `dist/`
