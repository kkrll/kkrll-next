import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const ImgPlaceholder = ({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "sm";
}) => {
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

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 flex items-center justify-center bg-background p-8 w-full animate-pulse min-h-60",
        className,
      )}
    >
      <pre className={cn(placeholderVariants({ size }))}>
        {`
              :+++:                                              
           .X$$$$$$$X                                            
          :XXXXXXXXXXX.                                          
          ;xxxxxxxxxxx;                                          
          :+++++++++++:                                          
           ;;;;;;;;;;:                                           
            ...::.:..                   x                        
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
            ............................................         `}
      </pre>
    </div>
  );
};

export default ImgPlaceholder;
