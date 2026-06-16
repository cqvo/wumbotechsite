import type { CollectionEntry } from "astro:content";

type PostData = CollectionEntry<"posts">["data"];

/**
 * Builds a minimal `CollectionEntry<"posts">` for tests. Only the `data` fields
 * read by the post utilities are meaningful; everything else is stubbed so the
 * object satisfies the type without pulling in the full content pipeline.
 */
export function makePost(
  id: string,
  data: Partial<PostData> = {}
): CollectionEntry<"posts"> {
  return {
    id,
    collection: "posts",
    data: {
      title: id,
      pubDatetime: new Date("2024-01-01T00:00:00Z"),
      draft: false,
      tags: ["others"],
      ...data,
    },
  } as unknown as CollectionEntry<"posts">;
}
