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

The site deploys to **Vercel** (`@sveltejs/adapter-vercel`) through Vercel's native Git
integration — no Vercel token or custom CI deploy steps:

| Trigger             | Result                                                                   |
| ------------------- | ------------------------------------------------------------------------ |
| Push / merge `main` | Production deploy → `wumbo.tech` / `www.wumbo.tech`                      |
| Open a pull request | Automatic Vercel **Preview** URL (ephemeral staging — `noindex`, no GTM) |

GitHub Actions runs `pnpm lint`, `pnpm check`, and `pnpm test` on every pull request
(`.github/workflows/ci.yml`) to gate merges. The serverless runtime is pinned to `nodejs22.x`
in `svelte.config.js`.

### Environment isolation

Analytics and SEO key off Vercel's standard **Production** / **Preview** environments:

- **Analytics** — the GTM snippet renders only when `PUBLIC_GTM_ID` is set, and Vercel Speed
  Insights only runs when `PUBLIC_VERCEL_TARGET_ENV === 'production'`.
- **SEO** — `src/hooks.server.ts` sends `X-Robots-Tag: noindex, nofollow` on every
  non-production deployment, keeping preview URLs out of search indexes.

### Required configuration (Vercel)

- Git integration connected with the **Production Branch** set to `main` (the default).
- Env var `PUBLIC_GTM_ID = GTM-5K34KN7M` set on the **Production** environment only — leave it
  unset for Preview/Development so preview URLs stay GTM-free. (`PUBLIC_VERCEL_TARGET_ENV` is
  injected automatically by Vercel.)
