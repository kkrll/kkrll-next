import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavigationStore {
  selectedItemId: string | null;
  setSelectedItemId: (id: string) => void;
  selectNext: (allItems: string[]) => void;
  selectPrevious: (allItems: string[]) => void;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set) => ({
      selectedItemId: null,
      setSelectedItemId: (id) => set({ selectedItemId: id }),
      selectNext: (allItems) =>
        set((state) => {
          if (!state.selectedItemId) return { selectedItemId: allItems[0] };
          const currentIndex = allItems.indexOf(state.selectedItemId);
          const nextIndex = (currentIndex + 1) % allItems.length;
          return { selectedItemId: allItems[nextIndex] };
        }),
      selectPrevious: (allItems) =>
        set((state) => {
          if (!state.selectedItemId) return { selectedItemId: allItems[0] };
          const currentIndex = allItems.indexOf(state.selectedItemId);
          const previousIndex =
            (currentIndex - 1 + allItems.length) % allItems.length;
          return { selectedItemId: allItems[previousIndex] };
        }),
    }),
    {
      name: "navigation-storage", // localStorage key
    },
  ),
);

/**
 * persist() reads localStorage synchronously when the store is created, so on
 * the client `selectedItemId` already holds the stored value during the very
 * first render — while the server rendered it as null. Reading the store
 * directly at that point is a hydration mismatch.
 *
 * This starts false on the server and on the first client render so the two
 * agree, then flips after mount, by which point rehydration has long finished.
 */
export const useNavigationHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
};
