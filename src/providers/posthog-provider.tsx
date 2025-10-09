"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

      if (key) {
        posthog.init(key, {
          api_host: host,
          person_profiles: 'identified_only', // Recommended for GDPR compliance
          loaded: (posthog) => {
            if (process.env.NODE_ENV === "development") {
              posthog.debug();
            }
          },
        });
      } else {
        console.warn('PostHog key not found. Analytics will not work.');
      }
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
