# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **pnpm** (see `packageManager` in `package.json`; Node ≥ 22.12).

- `pnpm dev` — start the Astro dev server (http://localhost:4321)
- `pnpm build` — `astro check` → `astro build` → build the Pagefind search index
- `pnpm preview` — preview the production build locally
- `pnpm sync` — regenerate Astro types (`astro sync`); run after changing content schemas or env config
- `pnpm lint` — Prettier check + ESLint
- `pnpm format` — auto-format with Prettier

There is no unit-test framework; `pnpm build` (which runs `astro check`) is the type/build gate, and is what CI's `verify` job runs.

## Architecture

Static **Astro 6** site using the **AstroPaper v6** theme, deployed to **Vercel** as pure static output (`output: 'static'`, no adapter). Styling is **Tailwind CSS v4** (via `@tailwindcss/vite`); search is **Pagefind**; content is editable via **Pages CMS**.

- **Config split:** edit `astro-paper.config.ts` for site identity, features, and socials. `src/config.ts` only resolves it with defaults — don't edit it. `astro.config.ts` holds integrations (mdx, sitemap), markdown/Shiki config, fonts, and the `astro:env` schema.
- **Content collections** (`src/content.config.ts`): `posts` (`src/content/posts/`) and `pages` (`src/content/pages/`), loaded with `glob()`. Files/folders prefixed with `_` are excluded. Post dates use `z.coerce.date()` so Pages-CMS-written ISO strings and hand-authored YAML timestamps both parse. The field named `body` in `.pages.yml` maps to the Markdown body.
- **Routes** are file-based under `src/pages/` (`index.astro`, `posts/`, `tags/`, `archives/`, `search.astro`, `rss.xml.ts`, dynamic OG images via `og.png.ts` + `[...slug]/index.png.ts`).
- **Base layout** `src/layouts/Layout.astro` owns `<head>` (SEO/OG meta, fonts, the FOUC theme script, `<ClientRouter />`) and is where analytics + the noindex meta are injected.

## Analytics & environment

Three client components in `src/components/` are wired into `Layout.astro`:

- `GoogleTagManager.astro` — head snippet, renders only when `PUBLIC_GTM_ID` is set (provisioned for production via Terraform); the matching `<noscript>` is in `Layout.astro`'s body.
- `Amplitude.astro` — autocapture init using `PUBLIC_AMPLITUDE_API_KEY` (falls back to a public demo key).
- `SpeedInsights.astro` — Vercel Speed Insights, gated to production via `process.env.VERCEL_ENV === 'production'`.

Public env vars are declared in the `env.schema` in `astro.config.ts` and read via `astro:env/client`. Build-time-only flags (e.g. prod gating, noindex) use `process.env.VERCEL_ENV` (not exposed to the client). Non-production builds emit `<meta name="robots" content="noindex, nofollow">`.

## Styling

Tailwind v4 with config in CSS, not JS:

- `src/styles/global.css` imports Tailwind, the theme, typography, and defines the `dark` variant (`@custom-variant dark (&:where([data-theme=dark], ...))`).
- `src/styles/theme.css` registers design tokens (`@theme inline`) and sets the light/dark CSS variables (`--accent`, `--background`, `--foreground`, `--muted`, `--border`, …). Theme classes: `text-accent`, `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.
- Note Tailwind v4 renames: use `bg-linear-to-r` (not `bg-gradient-to-r`). Prettier's `tailwindStylesheet` points at `src/styles/global.css` for class sorting.

## Conventions

- Astro components (`.astro`) with Tailwind utility classes.
- Prettier (see `.prettierrc`): **2-space**, double quotes, semicolons, `printWidth` 100→80 default, `arrowParens: avoid`. Run `pnpm format` before committing.
- ESLint: `eslint-plugin-astro` recommended + `no-console: error`. Inline (`is:inline`) scripts are exempt; bundled `<script>` blocks are linted.

## Deployment & IaC

- **Vercel** builds on push (production = `main`, preview = PRs); build command `pnpm build`, output `dist/`.
- **OpenTofu** in `terraform/` manages the Vercel project (`framework = "astro"`), domains (`wumbo.tech` → `www.wumbo.tech`), the `PUBLIC_GTM_ID` production env var, and the GitHub repo + branch-protection ruleset (which requires the CI status check named `verify`). State is in Cloudflare R2; plan/apply runs via Digger. If you change framework/build settings, run `tofu plan` in `terraform/`.
- **Pages CMS** edits commit Markdown to the repo (config in `.pages.yml`), which triggers a Vercel deploy. The Pages CMS GitHub App must be authorized on the repo (one-time manual step at app.pagescms.org).

## Astro docs

An Astro Docs MCP server (`https://mcp.docs.astro.build/mcp`) is configured for up-to-date Astro/AstroPaper documentation — use it when working on Astro features.
