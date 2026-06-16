import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { makePost } from "@/test/makePost";
import { getUniqueTags } from "./getUniqueTags";

beforeEach(() => {
  vi.stubEnv("DEV", true);
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getUniqueTags", () => {
  it("collects unique tags sorted by slug", () => {
    const posts = [
      makePost("a", { tags: ["Zebra", "Apple"] }),
      makePost("b", { tags: ["Mango"] }),
    ];
    expect(getUniqueTags(posts)).toEqual([
      { tag: "apple", tagName: "Apple" },
      { tag: "mango", tagName: "Mango" },
      { tag: "zebra", tagName: "Zebra" },
    ]);
  });

  it("de-duplicates tags that share a slug, keeping the first label", () => {
    const posts = [
      makePost("a", { tags: ["Astro"] }),
      makePost("b", { tags: ["astro"] }),
    ];
    const tags = getUniqueTags(posts);
    expect(tags).toHaveLength(1);
    expect(tags[0].tag).toBe("astro");
    expect(tags[0].tagName).toBe("Astro");
  });

  it("ignores tags from drafts", () => {
    const posts = [
      makePost("draft", { draft: true, tags: ["secret"] }),
      makePost("live", { tags: ["public"] }),
    ];
    expect(getUniqueTags(posts).map(t => t.tag)).toEqual(["public"]);
  });
});
