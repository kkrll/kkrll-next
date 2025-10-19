import { useEffect, useState, useRef } from "react";
import type { SelectedItemType } from "./types";
import ProjectView from "./ProjectView";
import WritingsView from "./WritingsView";
import WorkView from "./WorkView";
import PosterView from "./PosterView";

const ContentWindow = ({
  selectedItem,
}: {
  selectedItem: SelectedItemType;
}) => {
  const [newValue, setNewValue] = useState(selectedItem);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastChangeRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastChange = now - lastChangeRef.current;
    lastChangeRef.current = now;

    // Debounce: if navigating quickly, wait for pause
    if (timeSinceLastChange < 150) {
      // Wait 200ms to see if user stops navigating
      const debounceTimer = setTimeout(() => {
        setIsTransitioning(true);
        const transitionTimer = setTimeout(() => {
          setNewValue(selectedItem);
          setIsTransitioning(false);
        }, 200);
        return () => clearTimeout(transitionTimer);
      }, 200);

      return () => clearTimeout(debounceTimer);
    }

    // If enough time passed, update immediately with transition
    setIsTransitioning(true);
    const transitionTimer = setTimeout(() => {
      setNewValue(selectedItem);
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(transitionTimer);
  }, [selectedItem]);

  if ("isViewAll" in newValue && newValue.isViewAll) {
    return <p>Enter to open</p>;
  } else {
    switch (newValue.type) {
      case "projects": {
        return (
          <ProjectView project={newValue} isTransitioning={isTransitioning} />
        );
      }
      case "writings": {
        return (
          <WritingsView writing={newValue} isTransitioning={isTransitioning} />
        );
      }
      case "work": {
        return <WorkView work={newValue} isTransitioning={isTransitioning} />;
      }
      case "posters": {
        return (
          <PosterView poster={newValue} isTransitioning={isTransitioning} />
        );
      }
    }
  }
};

export default ContentWindow;
