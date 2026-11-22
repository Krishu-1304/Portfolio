import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "112px",
          border: "14px solid rgba(201, 154, 91, 0.4)",
        }}
      >
        <span
          style={{
            fontFamily: "serif",
            fontSize: 270,
            fontWeight: 700,
            color: "#C99A5B",
            letterSpacing: "-6px",
          }}
        >
          KP
        </span>
      </div>
    ),
    { ...size }
  );
}
