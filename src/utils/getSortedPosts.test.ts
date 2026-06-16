import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { makePost } from "@/test/makePost";
import { getSortedPosts } from "./getSortedPosts";

// Keep scheduling out of the picture so assertions focus on sort order.
beforeEach(() => {
  vi.stubEnv("DEV", true);
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSortedPosts", () => {
  it("sorts by pubDatetime descending", () => {
    const posts = [
      makePost("old", { pubDatetime: new Date("2023-01-01T00:00:00Z") }),
      makePost("new", { pubDatetime: new Date("2024-01-01T00:00:00Z") }),
      makePost("mid", { pubDatetime: new Date("2023-06-01T00:00:00Z") }),
    ];
    expect(getSortedPosts(posts).map(p => p.id)).toEqual(["new", "mid", "old"]);
  });

  it("uses modDatetime over pubDatetime when present", () => {
    const posts = [
      makePost("a", {
        pubDatetime: new Date("2024-01-01T00:00:00Z"),
      }),
      makePost("b", {
        pubDatetime: new Date("2023-01-01T00:00:00Z"),
        modDatetime: new Date("2025-01-01T00:00:00Z"),
      }),
    ];
    // b is older by pubDatetime but was updated most recently
    expect(getSortedPosts(posts).map(p => p.id)).toEqual(["b", "a"]);
  });

  it("drops drafts", () => {
    const posts = [makePost("draft", { draft: true }), makePost("live", {})];
    expect(getSortedPosts(posts).map(p => p.id)).toEqual(["live"]);
  });
});
