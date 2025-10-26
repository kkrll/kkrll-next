import { cn } from "@/lib/utils";

const ImgPlaceholder = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "inset-0 flex items-center justify-center bg-background p-8 w-full animate-pulse min-h-60",
        className
      )}
    >
      <pre
        className="font-mono text-[6px] md:text-[8px] leading-[0.9]
text-foreground whitespace-pre select-none"
      >
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
