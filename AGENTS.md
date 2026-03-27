# AGENTS.md

This file describes the available AI agents and prompts for the **danielproctor.dev** Astro blog project, and documents conventions for AI-assisted workflows.

---

## Agent Behaviour Guidelines

When an AI agent works on this repository, it must follow these rules:

### Content & Writing

- All blog posts are placed in `src/content/blog/` as `.md` files
- Filenames must be lowercase, hyphen-separated slugs (e.g. `docker-compose-tips.md`)
- Every post **must** include the required frontmatter fields: `title`, `description`, `pubDatetime`
- `pubDatetime` uses ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ` or plain `YYYY-MM-DD`
- Set `draft: true` when creating a post that is not yet ready to publish
- Never modify `modDatetime` unless you are updating existing post content
- Use the Zod schema in `src/content.config.ts` as the canonical reference for valid frontmatter

### Code Changes

- Do not modify files in `dist/` — that is build output only
- Prefer editing `.astro` files over `.tsx` unless browser interactivity is required
- Style with existing Tailwind utility classes and custom `skin`/`accent`/`fill` tokens
- Utility functions belong in `src/utils/` — do not inline logic in page components
- Run `pnpm run build` to validate the build after any structural changes

### New Components

- Astro components go in `src/components/` (file extension `.astro`)
- React components (`.tsx`) are only for interactive islands; always add a `client:` directive at the usage site
- Do not add new pnpm packages without explicit user approval

### TinaCMS

- Do not modify `tina/tina-lock.json` manually — it is auto-generated
- TinaCMS field definitions live in `tina/config.ts`; update them in sync with `src/content/config.ts`

### Git & CI

- The CI workflow is defined in `.github/workflows/build.yaml`
- Do not commit secrets or environment variables into source files
- Required env vars for TinaCMS: `TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_INDEXER_TOKEN`

---

## Project Conventions Summary

| Area | Convention |
|---|---|
| Language | TypeScript everywhere (`.ts`, `.tsx`, `.astro`) |
| Imports | Use `import type { ... }` for type-only imports |
| Styling | Tailwind utility classes; no inline styles |
| Font | IBM Plex Mono |
| Colours | CSS variable tokens only — no hardcoded hex values |
| Post sorting | Always use `getSortedPosts` from `src/utils/getSortedPosts.ts` |
| OG images | Auto-generated via Satori/Resvg; templates in `src/utils/og-templates/` |
| Deployment | `docker compose up -d` or GitHub Pages (branch: `main`) |

---

## Development Commands

```bash
pnpm run dev          # TinaCMS + Astro dev server
pnpm run build        # Production build (Astro + Jampack)
pnpm run tina:build   # Build TinaCMS admin UI
pnpm run preview      # Preview production build locally
```
