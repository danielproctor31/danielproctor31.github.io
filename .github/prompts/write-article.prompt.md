---
agent: agent
description: Draft a new technical blog post for danielproctor.dev
---

You are writing a technical blog post for **danielproctor.dev**, a personal developer blog by Daniel Proctor. The audience is software engineers and developers. The tone is professional, direct, and informative — no fluff.

## Your Task

Write a complete, publication-ready Markdown blog post about the following subject:

**Subject**: ${input:subject:What is the subject of the article?}

---

## Output Requirements

Produce a single Markdown file with valid frontmatter followed by the article body. Save it to `src/content/blog/<slug>.md` where `<slug>` is a lowercase, hyphen-separated version of the title.

### Frontmatter Template

```yaml
---
title: "<Descriptive title>"
description: "<One or two sentence summary of what the reader will learn>"
pubDatetime: ${currentDate}
author: Daniel Proctor
featured: false
draft: true
tags:
  - <relevant-tag>
---
```

- `draft: true` — always set on new posts; the author will change it when ready to publish
- `pubDatetime` — use today's date in `YYYY-MM-DD` format
- `tags` — use lowercase, hyphen-separated values; pick 2–5 relevant tags

### Article Structure

Follow this section order, omitting sections that don't apply:

1. **Opening paragraph** — State the problem or context. No heading needed.
2. `## Table of contents` — Include this heading exactly as written; remark-toc auto-generates it.
3. `## Prerequisites` — Bullet list of software, tools, or knowledge required. Include version numbers where relevant. Only include if the post involves hands-on setup or tooling.
4. **Main content sections** — Use `##` headings for major sections, `###` for subsections.
5. `## Conclusion` — Brief summary of what was covered and any next steps or further reading.

### Writing Rules

- Use second person ("you", "your") to address the reader directly
- Explain _why_ before _how_ — motivate each step
- Use fenced code blocks with a language identifier for every code sample:
  ````
  ```bash
  pnpm install something
  ```
  ````
- Link external tools and documentation on first mention: `[tool name](https://url)`
- Keep paragraphs short (3–5 sentences max)
- Avoid passive voice where possible
- Do not add marketing language, excessive enthusiasm, or filler phrases like "In this article, we will..."

### Scope

- Aim for a complete, accurate, and practical post
- If the subject involves a step-by-step guide, include every meaningful step with the exact commands or code needed
- If concepts need explaining, be concise — link to official docs rather than reproducing lengthy reference material

---

After generating the file, confirm the file path and a one-line summary of what the post covers.
