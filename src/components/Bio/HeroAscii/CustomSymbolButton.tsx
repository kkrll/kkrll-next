import { type KeyboardEventHandler, memo, type RefObject } from "react";
import NavButton from "./NavButton";

const CustomSymbolButton = memo(
  ({
    customSymbol,
    customInputRef,
    handleCustomSymbolInput,
    onBlur,
    onNavButtonClick,
    selectedSymbol,
    displaySymbol,
  }: {
    onBlur: () => void;
    onNavButtonClick: () => void;
    displaySymbol: string | undefined;
    customSymbol: {
      isActive: boolean;
      symbol: string;
    };
    selectedSymbol: number;
    handleCustomSymbolInput: KeyboardEventHandler<HTMLInputElement>;
    customInputRef: RefObject<HTMLInputElement | null>;
  }) => {
    return customSymbol.isActive ? (
      <input
        ref={customInputRef}
        type="text"
        maxLength={1}
        placeholder="Type symbol"
        onKeyDown={handleCustomSymbolInput}
        onBlur={onBlur}
        className="w-48 h-8 text-sm font-mono rounded bg-background/100 text-foreground text-center border-2 border-foreground"
      />
    ) : (
      <NavButton
        text={displaySymbol || "Enter symbol"}
        onClick={onNavButtonClick}
        isSelected={selectedSymbol > 8}
      />
    );
  }
);

export default CustomSymbolButton;
