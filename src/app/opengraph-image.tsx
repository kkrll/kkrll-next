import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/constants";

export const alt = SITE_DESCRIPTION;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 80,
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>
        kkrll
      </div>
      <div style={{ fontSize: 36, color: "#a3a3a3", marginTop: 12 }}>
        product designer
      </div>
    </div>,
    size,
  );
}
