import { describe, it, expect } from "vitest";
import { toTransitionName } from "./toTransitionName";

describe("toTransitionName", () => {
  it("produces a slug-like ident for ordinary titles", () => {
    expect(toTransitionName("Hello World")).toBe("hello-world");
  });

  it("replaces dots with hyphens", () => {
    expect(toTransitionName("v1.2.3")).toBe("v1-2-3");
  });

  it("hex-encodes non-ASCII characters", () => {
    // 你 is U+4F60 → "u004f60"; the encoding keeps the ident ASCII-only
    expect(toTransitionName("你")).toBe("u004f60");
  });

  it("prefixes results that start with a digit", () => {
    expect(toTransitionName("2024 recap")).toBe("p-2024-recap");
  });

  it("collapses consecutive hyphens and trims edges", () => {
    expect(toTransitionName("--a   b--")).toBe("a-b");
  });

  it("falls back to 'post' when nothing usable remains", () => {
    expect(toTransitionName("!!!")).toBe("post");
    expect(toTransitionName("")).toBe("post");
  });
});
