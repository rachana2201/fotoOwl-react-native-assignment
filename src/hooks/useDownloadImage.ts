import { useCallback, useRef, useState } from "react";
import { downloadImageToGallery } from "../services/downloadService";
import type { ImageItem } from "../types";

export type DownloadFeedback = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

export function useDownloadImage() {
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState<DownloadFeedback>(null);
  const busy = useRef(false);

  const download = useCallback(async (image: ImageItem) => {
    if (busy.current) return;

    busy.current = true;
    setDownloading(true);
    setFeedback(null);

    try {
      await downloadImageToGallery(image);

      setFeedback({
        type: "success",
        title: "Saved to your gallery!",
        message: "Your photo is ready to view in your device gallery.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your photo.";

      setFeedback({
        type: "error",
        title: "Could not save photo",
        message: errorMessage,
      });
    } finally {
      busy.current = false;
      setDownloading(false);
    }
  }, []);

  const dismissFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  return {
    download,
    downloading,
    feedback,
    dismissFeedback,
  };
}
