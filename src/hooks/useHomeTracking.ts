'use client'

import { usePostHog } from 'posthog-js/react'

export function useHomeTracking() {
  const posthog = usePostHog()

  const trackSelection = (item: any, source: 'click' | 'keyboard') => {
    posthog?.capture('Item Selected', {
      item_id: item.globalId,
      item_title: item.title,
      category: item.category,
      source,
    })
  }

  const trackNavigation = (direction: 'up' | 'down') => {
    posthog?.capture('Navigation', {
      direction,
      method: 'keyboard',
    })
  }

  const trackOpen = (item: any, method: 'click' | 'keyboard') => {
    posthog?.capture('Item Opened', {
      item_id: item.globalId,
      item_title: item.title,
      category: item.category,
      method,
    })
  }

  return { trackSelection, trackNavigation, trackOpen }
}
