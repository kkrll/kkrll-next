import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const placeholderVariants = cva(
  "font-mono leading-[0.9] text-foreground whitespace-pre select-none",
  {
    variants: {
      size: {
        sm: "text-[4px] md:text-[4px]",
        md: "text-[6px] md:text-[8px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const ImgPlaceholder = ({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "sm";
}) => {
  return (
    <div
      className={cn(
        // inset-0 already sizes this to the parent, so no w-full/min-h here —
        // a min-height taller than the parent would push the art below centre
        // and get its bottom clipped by the parent's overflow-hidden.
        "absolute inset-0 z-0 flex items-center justify-center bg-background p-8 animate-pulse",
        className,
      )}
    >
      <pre className={cn(placeholderVariants({ size }))}>
        {`              :+++:
           .X$$$$$$$X
          :XXXXXXXXXXX.
          ;xxxxxxxxxxx;
          :+++++++++++:
           :::;;;;;:::
              .....                     x
                                      .$&$
                                     .$$$$$:
                                    :$$$$$$$;
                                   ;XXXXXXXXX+
                                  +XXXXXXXXXXX+.
                   :+.           +xxxxxx+xxxxxx+:
                  ;++++        .+++++++++++++++++:
                 ;++++++;     :++;+++;;++;++;+;;++;
               .;;;;;;;;;;. .:;;;;;;;;;;;;;;;;;;;;;;
              .:;;:;;:;:;:::;;:;;;::;;:::;;:;:;:;;:;:.
             :::::::::::::::::::::::::::::::::::::::::.
            ............................................`}
      </pre>
    </div>
  );
};

export default ImgPlaceholder;
