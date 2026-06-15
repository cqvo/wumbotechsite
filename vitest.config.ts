import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // astro:env/client is a virtual module that only exists inside Astro's
      // build; point it at a stub so consent.ts can be imported under test.
      "astro:env/client": fileURLToPath(
        new URL("./src/test/stubs/astro-env-client.ts", import.meta.url)
      ),
    },
  },
  test: {
    // Unit tests run in node; the DOM integration test opts into happy-dom via
    // a `// @vitest-environment happy-dom` docblock.
    environment: "node",
    include: ["src/**/*.test.ts"],
    environmentOptions: {
      // The consent manager appends the real GTM <script>; treat the (disabled)
      // network load as a no-op success instead of logging DOMExceptions.
      happyDOM: {
        settings: { handleDisabledFileLoadingAsSuccess: true },
      },
    },
  },
});
