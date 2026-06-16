import { describe, it, expect } from "vitest";
import { slugifyStr, slugifyAll } from "./slugify";

describe("slugifyStr", () => {
  it("lower-cases and hyphenates Latin strings", () => {
    expect(slugifyStr("E2E Testing")).toBe("e2e-testing");
    expect(slugifyStr("Hello World")).toBe("hello-world");
  });

  it("expands '&' to 'and' for Latin strings", () => {
    // slugify's default charmap turns "&" into "and"
    expect(slugifyStr("cats & dogs")).toBe("cats-and-dogs");
  });

  it("keeps non-Latin characters via kebab-case", () => {
    // strings with non-ASCII chars route through lodash.kebabcase, which
    // preserves the original characters instead of dropping them
    expect(slugifyStr("你好 世界")).toBe("你好-世界");
  });

  it("returns an empty string for empty input", () => {
    expect(slugifyStr("")).toBe("");
  });
});

describe("slugifyAll", () => {
  it("slugifies every entry in the array", () => {
    expect(slugifyAll(["E2E Testing", "Hello World"])).toEqual([
      "e2e-testing",
      "hello-world",
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(slugifyAll([])).toEqual([]);
  });
});
