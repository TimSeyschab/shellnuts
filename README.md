# Shellnuts

Personal engineering blog built with SvelteKit, focused on practical write-ups around Java, DevOps, observability, migrations and (going forward) more IT security topics.

## Tech Stack

- SvelteKit 2 + Svelte 5 (Runes mode)
- Tailwind CSS 4 + DaisyUI 5
- mdsvex for Markdown-based posts
- Prism CSS theme integration for code highlighting
- Vercel adapter for deployment

## Current App Features

- Home page with hero section and latest post preview (`/`)
- Blog listing with server-side pagination (`/blog`, `/blog/[page]`)
- Post detail pages loaded from markdown (`/post/[slug]`)
- About page (`/about`)
- Sticky top navigation with theme switch
- Theme persistence via `localStorage`
- Light/Dark theme pair currently configured as:
  - `autumn` (light)
  - `forest` (dark)

## Project Structure

```text
src/
  routes/
    +page.svelte                 # home
    blog/[[page]]/               # paginated blog overview
    post/[slug]/                 # post detail route
  lib/
    data/posts.js                # markdown discovery + metadata extraction
    components/                  # shared UI components
posts/
  **/*.md                        # blog content (slug derived from filename/folder)
```

## Content Workflow

Posts live in `posts/**` and are loaded via `import.meta.glob`.

Example frontmatter:

```md
---
title: My Post Title
date: 2026-02-14
preview: Optional short preview text
---
```

Notes:

- The slug is derived from the file path.
- `index.md` inside a folder becomes folder-based slug (e.g. `posts/my-post/index.md` -> `my-post`).
- Headings are extracted for the post table of contents.

## Local Development

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

## Quality Checks

Run linting and formatting checks:

```bash
npm run lint
```

Run Svelte/type checks:

```bash
npm run check
```

## Build & Preview

Create production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Testing

```bash
npm run test
```

This runs:

- Playwright integration tests
- Vitest unit tests
