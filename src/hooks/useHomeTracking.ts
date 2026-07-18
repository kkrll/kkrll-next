"use client";

import { useTracking } from "@/hooks/useTracking";

type TrackedItem = {
  globalId: string;
  title?: string;
  category?: string;
};

export function useHomeTracking() {
  const { track } = useTracking();

  const trackSelection = (item: TrackedItem, source: "click" | "keyboard") => {
    track("Item Selected", {
      item_id: item.globalId,
      item_title: item.title,
      category: item.category,
      source,
    });
  };

  const trackNavigation = (direction: "up" | "down") => {
    track("Navigation", {
      direction,
      method: "keyboard",
    });
  };

  const trackOpen = (item: TrackedItem, method: "click" | "keyboard") => {
    track("Item Opened", {
      item_id: item.globalId,
      item_title: item.title,
      category: item.category,
      method,
    });
  };

  return { trackSelection, trackNavigation, trackOpen };
}
