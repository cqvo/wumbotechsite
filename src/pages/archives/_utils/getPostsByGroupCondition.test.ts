import { describe, it, expect } from "vitest";
import { makePost } from "@/test/makePost";
import { getPostsByGroupCondition } from "./getPostsByGroupCondition";

describe("getPostsByGroupCondition", () => {
  it("groups posts by the key returned from the group function", () => {
    const posts = [
      makePost("a", { pubDatetime: new Date("2024-05-01T00:00:00Z") }),
      makePost("b", { pubDatetime: new Date("2023-05-01T00:00:00Z") }),
      makePost("c", { pubDatetime: new Date("2024-09-01T00:00:00Z") }),
    ];

    const grouped = getPostsByGroupCondition(posts, post =>
      post.data.pubDatetime.getFullYear()
    );

    expect(Object.keys(grouped).sort()).toEqual(["2023", "2024"]);
    expect(grouped[2024].map(p => p.id)).toEqual(["a", "c"]);
    expect(grouped[2023].map(p => p.id)).toEqual(["b"]);
  });

  it("passes the index to the group function", () => {
    const posts = [makePost("a"), makePost("b"), makePost("c")];

    const grouped = getPostsByGroupCondition(posts, (_post, index) =>
      index! % 2 === 0 ? "even" : "odd"
    );

    expect(grouped.even.map(p => p.id)).toEqual(["a", "c"]);
    expect(grouped.odd.map(p => p.id)).toEqual(["b"]);
  });

  it("returns an empty object for an empty input", () => {
    expect(getPostsByGroupCondition([], () => "x")).toEqual({});
  });
});
