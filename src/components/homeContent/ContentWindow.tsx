import { useEffect, useState, useRef } from "react";
import type { SelectedItemType } from "./types";
import ProjectView from "./ProjectView";
import WritingsView from "./WritingsView";
import WorkView from "./WorkView";
import PosterView from "./PosterView";
import { flushSync } from "react-dom";

const ContentWindow = ({
  selectedItem,
}: {
  selectedItem: SelectedItemType;
}) => {
  const [newValue, setNewValue] = useState(selectedItem);
  const lastChangeRef = useRef(Date.now());
  const decbouceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // what's actually on screen right now, seeded from the first render
  const displayedIdRef = useRef(selectedItem.globalId);

  useEffect(() => {
    // whatever was queued is stale the moment the selection moves again
    if (decbouceTimerRef.current) {
      clearTimeout(decbouceTimerRef.current);
      decbouceTimerRef.current = null;
    }

    // Already showing this item, so there's nothing to animate between. Skips
    // the no-op transition on mount (and StrictMode's second effect pass), and
    // the case where a debounced hop lands back on the current item.
    if (selectedItem.globalId === displayedIdRef.current) return;

    const now = Date.now();
    const timeSinceLastChange = now - lastChangeRef.current;
    lastChangeRef.current = now;

    // Debounce: if navigating quickly, wait for pause
    if (timeSinceLastChange < 150) {
      decbouceTimerRef.current = setTimeout(updateWithTransition, 200);
    } else {
      updateWithTransition();
    }

    function updateWithTransition() {
      displayedIdRef.current = selectedItem.globalId;

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          flushSync(() => {
            setNewValue(selectedItem);
          });
        });
      } else {
        setNewValue(selectedItem);
      }
    }

    return () => {
      if (decbouceTimerRef.current) {
        clearTimeout(decbouceTimerRef.current);
      }
    };
  }, [selectedItem]);

  const GetContent = () => {
    if ("isViewAll" in newValue && newValue.isViewAll) {
      return <p>Enter to open</p>;
    } else {
      switch (newValue.type) {
        case "projects": {
          return <ProjectView project={newValue} />;
        }
        case "writings": {
          return <WritingsView writing={newValue} />;
        }
        case "work": {
          return <WorkView work={newValue} />;
        }
        case "posters": {
          return <PosterView poster={newValue} />;
        }
      }
    }
  };

  return (
    <div
      className="bg-background sticky top-0 size-fit p-8 w-full"
      style={{ viewTransitionName: "fade-in-out" }}
    >
      {GetContent()}
    </div>
  );
};

export default ContentWindow;
