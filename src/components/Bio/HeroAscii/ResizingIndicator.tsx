import { memo } from "react";

interface ResizingIndicatorProps {
  isResizing: boolean;
  isDrawingMode: boolean;
}

const ResizingIndicator = memo(
  ({ isResizing, isDrawingMode }: ResizingIndicatorProps) => {
    if (!isResizing || !isDrawingMode) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50 pointer-events-none">
        <div className="px-6 py-3 bg-foreground/10 text-foreground rounded-lg font-mono text-sm">
          Resizing canvas...
        </div>
      </div>
    );
  },
);

export default ResizingIndicator;
