"use client";

import { usePostHog } from "posthog-js/react";

export function useTracking() {
  const posthog = usePostHog();

  const track = (eventName: string, properties?: Record<string, any>) => {
    posthog?.capture(eventName, properties);
  };

  return { track };
}
