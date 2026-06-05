# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **pnpm** (see `packageManager` in `package.json`).

- `pnpm dev` — start the Vite dev server (`pnpm dev --open` to open a browser)
- `pnpm build` — production build (SvelteKit + Vercel adapter)
- `pnpm preview` — preview the production build locally
- `pnpm check` — sync SvelteKit and run `svelte-check` type checking (`pnpm check:watch` for watch mode)
- `pnpm lint` — Prettier check + ESLint
- `pnpm format` — auto-format with Prettier
- `pnpm test` — run all tests once (Vitest); `pnpm test:unit` for watch mode

### Running a single test

Tests run under two Vitest projects (see below), so target by project and name:

- `pnpm test:unit -- --project client path/to/file.svelte.spec.ts`
- `pnpm test:unit -- --project server path/to/file.spec.ts`
- Filter by test name with `-t "partial name"`

## Testing architecture

Vitest is configured with **two projects** in `vite.config.ts`:

- **client** — runs `*.svelte.{test,spec}.{js,ts}` in a real Chromium browser via Playwright. Use `vitest-browser-svelte`'s `render` and `vitest/browser`'s `page` for component tests (see `src/routes/(main)/page.svelte.spec.ts`). Excludes `src/lib/server/**`.
- **server** — runs plain `*.{test,spec}.{js,ts}` (non-Svelte) in a Node environment (see `src/demo.spec.ts`).

`expect.requireAssertions` is enabled — every test must make at least one assertion.

## Code architecture

SvelteKit app (Svelte 5 runes) deployed to **Vercel** (`@sveltejs/adapter-vercel`). Styling is **Tailwind CSS v4** + **Skeleton UI v4**.

- **Routes** use [route groups](https://svelte.dev/docs/kit/advanced-routing#advanced-layouts-group). The root `src/routes/+layout.svelte` is global (favicon, analytics injection). The `(main)` group has its own layout wrapping content in `<main>`. Add new route groups for sections that need a distinct layout.
- **Tailwind/Skeleton config lives in CSS**, not JS. `src/routes/layout.css` imports Tailwind, Skeleton, the `terminus` theme, and plugins via `@import`/`@plugin`. The active theme is set with `data-theme="terminus"` on `<html>` in `src/app.html`. Dark mode uses a custom variant keyed on `[data-mode=dark]`. Prettier's `tailwindStylesheet` points at this file for class sorting.
- **`$lib` modules** are organized by feature with barrel `index.ts` files re-exporting components (e.g. `$lib/analytics` exports `GoogleTagManager` and `SpeedInsights`; `$lib/ui` exports `Sidebar`). Import from the barrel, not the component file.
- **Analytics** (`src/lib/analytics`) is injected once in the root layout: Google Tag Manager (raw snippet in `<svelte:head>`) and Vercel Speed Insights (`injectSpeedInsights()`).

## Conventions

- **Svelte 5 runes** only — use `$props()`, `$state()`, etc. Layouts receive `let { children } = $props()` and render with `{@render children()}`.
- Prettier: **tabs**, single quotes, no trailing commas, 100-char width. Run `pnpm format` before committing.
- TypeScript is `strict` with `checkJs` enabled — `.js` files are type-checked too.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
