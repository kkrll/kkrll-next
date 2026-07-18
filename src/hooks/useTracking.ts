"use client";

import { usePostHog } from "posthog-js/react";
import { useCallback } from "react";

type PostTaskScheduler = {
  postTask: (
    callback: () => void,
    options?: { priority?: "user-blocking" | "user-visible" | "background" },
  ) => Promise<unknown>;
};

export function useTracking() {
  const posthog = usePostHog();

  const track = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      const capture = () => posthog?.capture(eventName, properties);
      requestAnimationFrame(() => {
        const { scheduler } = window as { scheduler?: PostTaskScheduler };
        if (scheduler?.postTask) {
          void scheduler.postTask(capture, { priority: "background" });
        } else {
          setTimeout(capture, 0);
        }
      });
    },
    [posthog],
  );

  return { track };
}
