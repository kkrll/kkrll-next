import { memo, RefObject, KeyboardEventHandler } from "react";
import { ASCII_CHARS } from "./constants";
import NavButton from "./NavButton";
import CustomSymbolButton from "./CustomSymbolButton";

interface SymbolSelectorProps {
  selectedSymbol: number;
  onSelectSymbol: (index: number) => void;
  customSymbol: {
    isActive: boolean;
    symbol: string;
  };
  onCustomSymbolBlur: () => void;
  onCustomSymbolClick: () => void;
  displaySymbol: string | undefined;
  customInputRef: RefObject<HTMLInputElement | null>;
  handleCustomSymbolInput: KeyboardEventHandler<HTMLInputElement>;
}

const SymbolSelector = memo(
  ({
    selectedSymbol,
    onSelectSymbol,
    customSymbol,
    onCustomSymbolBlur,
    onCustomSymbolClick,
    displaySymbol,
    customInputRef,
    handleCustomSymbolInput,
  }: SymbolSelectorProps) => {
    return (
      <div className="flex gap-1">
        {ASCII_CHARS.map((char, index) => (
          <NavButton
            key={char}
            text={char}
            onClick={() => onSelectSymbol(index)}
            isSelected={selectedSymbol === index}
          />
        ))}
        <CustomSymbolButton
          onBlur={onCustomSymbolBlur}
          onNavButtonClick={onCustomSymbolClick}
          displaySymbol={displaySymbol}
          customSymbol={customSymbol}
          selectedSymbol={selectedSymbol}
          customInputRef={customInputRef}
          handleCustomSymbolInput={handleCustomSymbolInput}
        />
      </div>
    );
  },
);

export default SymbolSelector;
