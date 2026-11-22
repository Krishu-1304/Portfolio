import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#141210",
          borderRadius: "40px",
          border: "5px solid rgba(201, 154, 91, 0.4)",
        }}
      >
        <span
          style={{
            fontFamily: "serif",
            fontSize: 96,
            fontWeight: 700,
            color: "#C99A5B",
            letterSpacing: "-2px",
          }}
        >
          KP
        </span>
      </div>
    ),
    { ...size }
  );
}
