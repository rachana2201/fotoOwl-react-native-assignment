import { useCallback, useEffect, useRef, useState } from "react";
import { API } from "../constants";
import { fetchImages } from "../services/imageApi";
import type { ImageItem } from "../types";
import { mergeUnique } from "../utils/imageQuery";

const MAX_RANDOM_START_PAGE = 20;

function getRandomPage(excludePage?: number | null): number {
  let nextPage: number;

  do {
    nextPage = Math.floor(Math.random() * MAX_RANDOM_START_PAGE) + 1;
  } while (
    excludePage != null &&
    MAX_RANDOM_START_PAGE > 1 &&
    nextPage === excludePage
  );

  return nextPage;
}

export function usePaginatedImages(pageSize: number = API.PAGE_SIZE_FROM_API) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true); // first load
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const page = useRef<number | null>(null);
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(
    async (mode: "initial" | "refresh" | "more") => {
      if (inFlight.current) return;
      inFlight.current = true;

      const targetPage =
        mode === "more" ? (page.current ?? 1) + 1 : getRandomPage(page.current);
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);
      if (mode === "more") setLoadingMore(true);

      try {
        const data = await fetchImages(targetPage, pageSize);
        if (!mounted.current) return;
        page.current = targetPage;
        setError(null);
        setHasMore(data.length === pageSize);
        setImages((prev) => (mode === "more" ? mergeUnique(prev, data) : data));
      } catch (e) {
        if (!mounted.current) return;
        // A failed "load more" is silent (existing data stays visible, user can scroll again).
        // A failed first load / refresh surfaces an error the screen can show with a Retry button.
        if (mode !== "more")
          setError((e as Error).message || "Something went wrong.");
      } finally {
        inFlight.current = false;
        if (mounted.current) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      }
    },
    [pageSize],
  );

  useEffect(() => {
    load("initial");
  }, [load]);

  return {
    images,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    retry: useCallback(() => load("initial"), [load]),
    refresh: useCallback(() => load("refresh"), [load]),
    loadMore: useCallback(() => load("more"), [load]),
  };
}
