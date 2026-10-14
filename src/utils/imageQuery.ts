import type { FilterOption, ImageItem, ImageQuery } from "../types";

const firstLetter = (author: string) => author.trim().charAt(0).toUpperCase();

export function matchesFilter(author: string, filter: FilterOption): boolean {
  if (filter === "all") return true;
  const letter = firstLetter(author);
  if (letter < "A" || letter > "Z") return false;
  return filter === "a-m" ? letter <= "M" : letter >= "N";
}

/**
 * Single pure pipeline: search -> filter -> sort.
 * Keeping it pure makes Search + Filter + Sort work together predictably
 * and trivial to unit test.
 */
export function applyImageQuery(
  images: ImageItem[],
  query: ImageQuery,
): ImageItem[] {
  const needle = query.search.trim().toLowerCase();

  const result = images.filter(
    (img) =>
      (needle === "" || img.author.trim().toLowerCase().startsWith(needle)) &&
      matchesFilter(img.author, query.filter),
  );

  if (query.sort === "default") return result;
  const dir = query.sort === "asc" ? 1 : -1;
  // slice() not needed: filter already returned a new array
  return result.sort((a, b) => dir * a.author.localeCompare(b.author));
}

/** Merge pages, keeping the first occurrence of every id. */
export function mergeUnique(
  existing: ImageItem[],
  incoming: ImageItem[],
): ImageItem[] {
  const seen = new Set(existing.map((i) => i.id));
  const fresh = incoming.filter((i) => !seen.has(i.id));
  return fresh.length ? [...existing, ...fresh] : existing;
}
