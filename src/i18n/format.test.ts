import { describe, it, expect } from "vitest";
import { tplStr } from "./format";

describe("tplStr", () => {
  it("replaces a {{key}} placeholder with its value", () => {
    expect(tplStr("Share on {{platform}}", { platform: "Mastodon" })).toBe(
      "Share on Mastodon"
    );
  });

  it("coerces numeric values to strings", () => {
    expect(tplStr("Page {{n}}", { n: 3 })).toBe("Page 3");
  });

  it("replaces a repeated placeholder every time it appears", () => {
    expect(tplStr("{{x}}-{{x}}", { x: "a" })).toBe("a-a");
  });

  it("substitutes missing keys with an empty string", () => {
    expect(tplStr("Hi {{name}}!", {})).toBe("Hi !");
  });

  it("treats null/undefined values as empty strings", () => {
    const vars = { a: undefined, b: null } as unknown as Record<
      string,
      string | number
    >;
    expect(tplStr("{{a}}{{b}}", vars)).toBe("");
  });

  it("leaves a template without placeholders untouched", () => {
    expect(tplStr("nothing to do", { a: "1" })).toBe("nothing to do");
  });
});
