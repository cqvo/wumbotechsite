# wumbo.tech

The worldwide leader in wumbology — a blog built with [Astro](https://astro.build/)
and the [AstroPaper](https://github.com/satnaing/astro-paper) theme, with content
managed through [Pages CMS](https://pagescms.org/) and deployed to Vercel.

## Tech stack

- **[Astro 6](https://astro.build/)** — static site generation (no adapter; pure `output: 'static'`).
- **[AstroPaper v6](https://github.com/satnaing/astro-paper)** — minimal, accessible, SEO-friendly blog theme.
- **[Tailwind CSS v4](https://tailwindcss.com/)** via `@tailwindcss/vite` (config lives in `src/styles/`).
- **[Pagefind](https://pagefind.app/)** — static, build-time search index.
- **[Pages CMS](https://pagescms.org/)** — Git-based content editing (see [`.pages.yml`](./.pages.yml)).
- **Analytics** — Google Tag Manager, Amplitude, and Vercel Speed Insights (production only).
- **Deploy + IaC** — Vercel, managed with OpenTofu (state in Cloudflare R2, orchestrated by Digger).

## Prerequisites

- **Node ≥ 22.12** (see `engines` in `package.json`).
- **pnpm 10** — enable via Corepack: `corepack enable && corepack prepare pnpm@10.15.0 --activate`.

## Getting started

```sh
pnpm install
pnpm dev        # http://localhost:4321
```

## Scripts

| Command        | Description                                               |
| -------------- | --------------------------------------------------------- |
| `pnpm dev`     | Start the Astro dev server.                               |
| `pnpm build`   | `astro check` → `astro build` → build the Pagefind index. |
| `pnpm preview` | Preview the production build locally.                     |
| `pnpm sync`    | Regenerate Astro types (`astro sync`).                    |
| `pnpm lint`    | Prettier check + ESLint.                                  |
| `pnpm format`  | Auto-format with Prettier.                                |

## Content

Content is plain Markdown in the repository, validated at build time by the Zod
schemas in `src/content.config.ts`:

- **Blog posts** — `src/content/posts/*.md(x)`. Frontmatter: `title`, `description`,
  `pubDatetime` (required); `author`, `modDatetime`, `featured`, `draft`, `tags`,
  `ogImage`, `canonicalURL` (optional). Files/folders prefixed with `_` are ignored.
- **About page** — `src/content/pages/about.md`.

### Editing with Pages CMS

[`.pages.yml`](./.pages.yml) describes the collections and fields. To edit through
the web UI:

1. Go to [app.pagescms.org](https://app.pagescms.org/) and sign in with GitHub.
2. Install/authorize the Pages CMS GitHub App on `cqvo/wumbotechsite`.
3. Edit posts or the about page; changes are committed back to the repo, which
   triggers a Vercel deploy.

Field names in `.pages.yml` mirror the content schema, so CMS edits stay valid.

## Project structure

```
astro.config.ts          # Astro config: integrations, markdown, fonts, env schema
astro-paper.config.ts    # Site identity, features, socials (edit this, not src/config.ts)
.pages.yml               # Pages CMS configuration
src/
  components/            # Astro components (incl. GoogleTagManager, Amplitude, SpeedInsights)
  content/
    posts/               # Blog posts (Markdown)
    pages/about.md       # About page
  content.config.ts      # Content collection schemas
  layouts/Layout.astro   # Base HTML layout (head, analytics, noindex)
  pages/                 # Routes (index, posts, tags, archives, search, rss, og)
  styles/                # Tailwind v4 + theme tokens
terraform/               # OpenTofu: Vercel project, domains, GitHub repo + ruleset
```

## Environment variables

All are optional and gracefully degrade when unset.

| Variable                          | Used for              | Notes                                                                              |
| --------------------------------- | --------------------- | ---------------------------------------------------------------------------------- |
| `PUBLIC_GTM_ID`                   | Google Tag Manager    | Provisioned for **production** via Terraform.                                      |
| `PUBLIC_AMPLITUDE_API_KEY`        | Amplitude             | Falls back to a public demo key.                                                   |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console | Optional.                                                                          |
| `VERCEL_ENV`                      | Prod gating           | Injected by Vercel; enables Speed Insights and search indexing only in production. |

Non-production deployments emit `<meta name="robots" content="noindex, nofollow">`.

## Deployment

Vercel builds on every push (production = `main`, preview = PRs). The Vercel
project, custom domains (`wumbo.tech` → `www.wumbo.tech`), and the GitHub repo /
branch protection are managed by OpenTofu in [`terraform/`](./terraform); see that
directory for plan/apply via Digger. The Vercel build command is `pnpm build`
with output directory `dist/`.
