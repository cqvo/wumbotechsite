import { describe, it, expect, afterEach, vi } from "vitest";
import { makePost } from "@/test/makePost";
import { postFilter } from "./postFilter";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("postFilter", () => {
  it("always excludes drafts", () => {
    vi.stubEnv("DEV", true);
    expect(postFilter(makePost("a", { draft: true }))).toBe(false);
  });

  it("includes non-draft posts in dev regardless of pubDatetime", () => {
    vi.stubEnv("DEV", true);
    const future = makePost("future", {
      pubDatetime: new Date(Date.now() + 60 * 60 * 1000),
    });
    expect(postFilter(future)).toBe(true);
  });

  it("excludes scheduled (future) posts in production", () => {
    vi.stubEnv("DEV", false);
    // beyond the default 15-minute scheduledPostMargin
    const future = makePost("future", {
      pubDatetime: new Date(Date.now() + 60 * 60 * 1000),
    });
    expect(postFilter(future)).toBe(false);
  });

  it("includes already-published posts in production", () => {
    vi.stubEnv("DEV", false);
    const past = makePost("past", {
      pubDatetime: new Date(Date.now() - 60 * 60 * 1000),
    });
    expect(postFilter(past)).toBe(true);
  });
});
