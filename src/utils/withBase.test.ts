import { describe, it, expect } from "vitest";
import { stripLocale, stripBase, getAssetPath } from "./withBase";

// Under Vitest `import.meta.env.BASE_URL` defaults to "/", so the module
// resolves `base` to "" — these tests cover that (default) configuration.

describe("stripLocale", () => {
  it("removes a locale prefix from a nested path", () => {
    expect(stripLocale("/en/posts/foo", "en")).toBe("/posts/foo");
  });

  it("maps a bare locale path to the root", () => {
    expect(stripLocale("/en", "en")).toBe("/");
  });

  it("leaves non-matching paths unchanged", () => {
    expect(stripLocale("/posts/foo", "en")).toBe("/posts/foo");
    // a locale that is only a substring prefix must not be stripped
    expect(stripLocale("/english/foo", "en")).toBe("/english/foo");
  });
});

describe("stripBase", () => {
  it("returns the path unchanged when base is empty", () => {
    expect(stripBase("/posts/foo")).toBe("/posts/foo");
    expect(stripBase("/")).toBe("/");
  });
});

describe("getAssetPath", () => {
  it("prefixes an asset path with a leading slash", () => {
    expect(getAssetPath("og.png")).toBe("/og.png");
  });

  it("normalizes an already-rooted path", () => {
    expect(getAssetPath("/og.png")).toBe("/og.png");
  });

  it("returns the root for an empty path", () => {
    expect(getAssetPath("")).toBe("/");
  });
});
