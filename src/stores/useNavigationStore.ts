import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavigationStore {
  selectedItemId: string | null;
  setSelectedItemId: (id: string) => void;
  selectNext: (allItems: string[]) => void; // arrow down
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
    }
  )
);
