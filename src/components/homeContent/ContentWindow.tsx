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

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastChange = now - lastChangeRef.current;
    lastChangeRef.current = now;

    if (decbouceTimerRef.current) {
      clearTimeout(decbouceTimerRef.current);
    }

    // Debounce: if navigating quickly, wait for pause
    if (timeSinceLastChange < 150) {
      decbouceTimerRef.current = setTimeout(() => {
        updateWithTransition();
      }, 200);
    } else {
      updateWithTransition();
    }

    function updateWithTransition() {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          flushSync(() => {
            setNewValue(selectedItem);
          });
        });
      } else {
        setNewValue(selectedItem);
      }

      return () => {
        if (decbouceTimerRef.current) {
          clearTimeout(decbouceTimerRef.current);
        }
      };
    }
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
