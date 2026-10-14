import type { ImageItem } from "../types";
import {
  applyImageQuery,
  matchesFilter,
  mergeUnique,
} from "../utils/imageQuery";

const img = (id: string, author: string): ImageItem => ({
  id,
  author,
  width: 100,
  height: 100,
  url: "",
  download_url: "",
});

const data = [
  img("1", "Alejandro Escamilla"),
  img("2", "Paul Jarvis"),
  img("3", "Matthew Wiebe"),
  img("4", "Nikola Jovanovic"),
  img("5", "zeke Harris"),
];

describe("applyImageQuery", () => {
  const base = { search: "", filter: "all", sort: "default" } as const;

  it("returns everything for an empty search", () => {
    expect(applyImageQuery(data, base)).toHaveLength(5);
    expect(applyImageQuery(data, { ...base, search: "   " })).toHaveLength(5);
  });

  it("searches case-insensitively by author", () => {
    expect(
      applyImageQuery(data, { ...base, search: "PAUL" }).map((i) => i.id),
    ).toEqual(["2"]);
    expect(
      applyImageQuery(data, { ...base, search: "ZEKE" }).map((i) => i.id),
    ).toEqual(["5"]);
  });

  it("filters A–M and N–Z by first letter of the author", () => {
    expect(
      applyImageQuery(data, { ...base, filter: "a-m" }).map((i) => i.id),
    ).toEqual(["1", "3"]);
    expect(
      applyImageQuery(data, { ...base, filter: "n-z" }).map((i) => i.id),
    ).toEqual(["2", "4", "5"]);
  });

  it("combines prefix search + filter", () => {
    const result = applyImageQuery(data, {
      ...base,
      search: "a",
      filter: "n-z",
    });

    // No author starts with "a" and belongs to the N-Z filter.
    expect(result).toEqual([]);

    const matching = applyImageQuery(data, {
      ...base,
      search: "pa",
      filter: "n-z",
    });

    expect(matching.map((i) => i.id)).toEqual(["2"]);
  });
  it("sorts ascending/descending without mutating the input", () => {
    const copy = [...data];
    const asc = applyImageQuery(data, { ...base, sort: "asc" }).map(
      (i) => i.author,
    );
    expect(asc[0]).toBe("Alejandro Escamilla");
    expect(applyImageQuery(data, { ...base, sort: "desc" })[0].author).toBe(
      "zeke Harris",
    );
    expect(data).toEqual(copy);
  });

  it("applies sort after search and filter", () => {
    const result = applyImageQuery(data, {
      search: "",
      filter: "n-z",
      sort: "desc",
    });
    expect(result.map((i) => i.id)).toEqual(["5", "2", "4"]);
  });
});

describe("matchesFilter", () => {
  it('treats authors starting with non-letters as only matching "all"', () => {
    expect(matchesFilter("1abc", "all")).toBe(true);
    expect(matchesFilter("1abc", "a-m")).toBe(false);
    expect(matchesFilter("1abc", "n-z")).toBe(false);
  });
});

describe("mergeUnique", () => {
  it("appends only new ids and keeps order", () => {
    const merged = mergeUnique(
      [img("1", "A"), img("2", "B")],
      [img("2", "B"), img("3", "C")],
    );
    expect(merged.map((i) => i.id)).toEqual(["1", "2", "3"]);
  });
  it("returns the same reference if nothing is new (avoids re-render)", () => {
    const existing = [img("1", "A")];
    expect(mergeUnique(existing, [img("1", "A")])).toBe(existing);
  });
});
