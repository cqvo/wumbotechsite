# wumbo.tech

Source for [wumbo.tech](https://wumbo.tech) — a personal site built with SvelteKit.

## Tech stack

- **[SvelteKit](https://svelte.dev/docs/kit)** (Svelte 5 runes) on the **[Vercel](https://vercel.com)** adapter
- **[Tailwind CSS v4](https://tailwindcss.com)** + **[Skeleton UI v4](https://www.skeleton.dev)** — configured in CSS (`src/routes/layout.css`)
- **TypeScript** (strict, with `checkJs`)
- **[Vitest](https://vitest.dev)** + **[Playwright](https://playwright.dev)** for tests
- **[pnpm](https://pnpm.io)** package manager

## Prerequisites

- **Node 22** — the Vercel runtime is pinned to `nodejs22.x` in `svelte.config.js`
- **pnpm 10** — enable via Corepack:

  ```sh
  corepack enable
  ```

## Getting started

```sh
pnpm install
pnpm dev          # start the dev server
pnpm dev --open   # …and open it in a browser
```

## Scripts

| Script         | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `pnpm dev`     | Start the Vite dev server                                           |
| `pnpm build`   | Production build (SvelteKit + Vercel adapter)                       |
| `pnpm preview` | Preview the production build locally                                |
| `pnpm check`   | Sync SvelteKit and run `svelte-check` (`pnpm check:watch` to watch) |
| `pnpm lint`    | Prettier check + ESLint                                             |
| `pnpm format`  | Auto-format with Prettier                                           |
| `pnpm test`    | Run all tests once (`pnpm test:unit` for watch mode)                |

## Testing

Vitest runs as two projects (see `vite.config.ts`):

- **client** — `*.svelte.{test,spec}.{js,ts}` in real Chromium via Playwright (`vitest-browser-svelte`).
- **server** — plain `*.{test,spec}.{js,ts}` in Node.

Every test must make at least one assertion (`expect.requireAssertions` is enabled). Target a single
file by project, e.g.:

```sh
pnpm test:unit -- --project client src/routes/\(main\)/page.svelte.spec.ts
pnpm test:unit -- --project server src/demo.spec.ts
```

## Project structure

- `src/routes` — pages, organized with [route groups](https://svelte.dev/docs/kit/advanced-routing#advanced-layouts-group); the root `+layout.svelte` is global, the `(main)` group has its own layout.
- `src/lib` — feature modules with barrel `index.ts` files (e.g. `$lib/analytics`, `$lib/ui`); import from the barrel.
- Styling — Tailwind, Skeleton, the theme, and plugins are imported in `src/routes/layout.css`.

See **[`CLAUDE.md`](./CLAUDE.md)** for the full conventions and architecture notes.

## Deployment

The site is deployed to **Vercel** (`@sveltejs/adapter-vercel`) with a two-tier, release-gated
flow. Vercel's own Git auto-deploys are **disabled** (`vercel.json` → `git.deploymentEnabled: false`);
all deploys are driven by GitHub Actions via the Vercel CLI.

| Environment | URL                             | Trigger                                |
| ----------- | ------------------------------- | -------------------------------------- |
| Staging     | `staging.wumbo.tech`            | every push to `main` (after CI passes) |
| Production  | `wumbo.tech` / `www.wumbo.tech` | publishing a GitHub Release            |

### Release process

1. Merge work into `main` → CI runs (`pnpm lint`, `pnpm check`, `pnpm test`) → auto-deploys to **staging**.
2. Verify on `staging.wumbo.tech`.
3. Cut a release: `gh release create vX.Y.Z --generate-notes` (tagging off `main`).
4. The release workflow builds and deploys to **production**.

To roll back, re-run the production workflow for an earlier tag, or promote a previous
production deployment from the Vercel dashboard.

### Environment isolation

- **Analytics** — the GTM container is only injected when `PUBLIC_GTM_ID` is set (production only),
  and Vercel Speed Insights only runs when `PUBLIC_VERCEL_TARGET_ENV === 'production'`.
- **SEO** — `src/hooks.server.ts` sends `X-Robots-Tag: noindex, nofollow` on every non-production
  environment, keeping staging and previews out of search indexes.

### Required configuration (Vercel + GitHub)

- A Vercel **custom environment** named `staging` with the `staging.wumbo.tech` domain attached.
- Vercel env var `PUBLIC_GTM_ID` set on **production only** (`PUBLIC_VERCEL_TARGET_ENV` is auto-injected).
- GitHub Actions secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
