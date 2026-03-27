# danielproctor.dev

> Personal technical blog by [Daniel Proctor](https://danielproctor.dev)

Built with [Astro](https://astro.build/) v6 using the [AstroPaper](https://github.com/satnaing/astro-paper) theme, managed via [TinaCMS](https://tina.io), and deployed via Docker/Nginx or GitHub Pages.

---

## Tech Stack

|                |                                          |
| -------------- | ---------------------------------------- |
| **Framework**  | Astro v6 (static site generation)        |
| **Styling**    | Tailwind CSS v3 with custom skin tokens  |
| **Components** | Astro + React 18 (interactive islands)   |
| **CMS**        | TinaCMS (git-backed, admin at `/admin`)  |
| **Search**     | Fuse.js                                  |
| **OG Images**  | Satori + Resvg (generated at build time) |
| **Deployment** | Docker/Nginx · GitHub Pages              |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+
- [Docker](https://www.docker.com/) (optional, for containerised dev)

A **Dev Container** is available for VS Code — open the repo and select **Reopen in Container** to get a fully configured environment automatically.

### Install dependencies

```bash
pnpm install
```

### Start the dev server

```bash
pnpm run dev
```

| URL                                      | Description         |
| ---------------------------------------- | ------------------- |
| `http://localhost:4321`                  | Site                |
| `http://localhost:4321/admin/index.html` | TinaCMS admin       |
| `http://localhost:4001/graphql`          | TinaCMS GraphQL API |

---

## Development

### Available commands

```bash
pnpm run dev          # Start TinaCMS + Astro dev server
pnpm run build        # Production build (Astro + Jampack optimisation)
pnpm run tina:build   # Build TinaCMS admin UI separately
pnpm run preview      # Preview the production build locally
pnpm run lint         # Lint all source files
pnpm run format       # Format all source files with Prettier
```

### Project structure

```
src/
  config.ts          # Site-wide config (SITE, SOCIALS constants)
  content.config.ts  # Zod schema for blog collection frontmatter
  content/blog/      # Markdown blog posts
  components/        # Astro + React UI components
  layouts/           # Page layout wrappers
  pages/             # File-based routing
  utils/             # Helper functions (sorting, pagination, OG images)
  styles/base.css    # Global styles
tina/config.ts       # TinaCMS collection & field definitions
```

### Writing a post

Create a new `.md` file in `src/content/blog/` with the following frontmatter:

```yaml
---
title: "Your Post Title"
description: "A brief summary"
pubDatetime: 2026-01-01
author: Daniel Proctor
featured: false
draft: true
tags:
  - your-tag
---
```

Set `draft: false` when the post is ready to publish. Filenames become URL slugs automatically.

---

## Production Build

### Environment variables (TinaCMS)

Copy these into a `.env` file or your hosting provider's environment settings:

```env
TINA_CLIENT_ID=
TINA_TOKEN=
TINA_INDEXER_TOKEN=
GITHUB_BRANCH=main
```

### Build & deploy

**Docker** (recommended):

```bash
docker compose up -d
```

The container builds the site and serves it via Nginx on ports `8080` (HTTP) and `8443` (HTTPS).

**Manual build:**

```bash
pnpm run build
```

Output is written to `dist/`. Deploy the contents of that folder to any static host.

---

## License

[MIT](LICENSE)
