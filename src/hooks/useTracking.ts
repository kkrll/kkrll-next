"use client";

import { useCallback } from "react";
import { usePostHog } from "posthog-js/react";

export function useTracking() {
  const posthog = usePostHog();

  const track = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      posthog?.capture(eventName, properties);
    },
    [posthog]
  );

  return { track };
}
