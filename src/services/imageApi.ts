import { API } from '../constants';
import type { ImageItem } from '../types';

export class ApiError extends Error {}

export async function fetchImages(
  page: number,
  limit: number = API.PAGE_SIZE_FROM_API,
  signal?: AbortSignal,
): Promise<ImageItem[]> {
  let response: Response;
  try {
    response = await fetch(`${API.BASE_URL}?page=${page}&limit=${limit}`, { signal });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    throw new ApiError('Unable to reach the server. Check your internet connection.');
  }
  if (!response.ok) {
    throw new ApiError(`Server responded with an error (${response.status}). Please try again.`);
  }
  try {
    const data = (await response.json()) as ImageItem[];
    if (!Array.isArray(data)) throw new Error();
    return data;
  } catch {
    throw new ApiError('Received an unexpected response from the server.');
  }
}

/** picsum lets us request a resized version - much lighter than `download_url` (up to 5000px). */
export const imageUrl = (item: ImageItem, width: number, height?: number) =>
  `https://picsum.photos/id/${item.id}/${Math.round(width)}/${Math.round(
    height ?? (width * item.height) / item.width,
  )}`;

export const thumbnailUrl = (item: ImageItem) => imageUrl(item, 600, 400);

/** Full-size image used in details/fullscreen and for downloads (max 1600px wide). */
export const fullImageUrl = (item: ImageItem) => imageUrl(item, Math.min(item.width, 1600));
