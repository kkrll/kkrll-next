interface SvgBlurProps {
  level: number;
  backdrop?: boolean;
}

const SvgBlur: React.FC<SvgBlurProps> = ({ level, backdrop = false }) => (
  <svg
    width="0"
    height="0"
    style={{
      position: "absolute",
      pointerEvents: "none",
    }}
    aria-hidden="true"
  >
    <defs>
      <filter id="solidBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur
          in={backdrop ? "SourceGraphic" : "BackgroundImage"}
          stdDeviation={level}
          edgeMode="duplicate"
        />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="1 1" />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

export default SvgBlur;
