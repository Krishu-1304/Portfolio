import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Krish Prajapati | Computer Engineer & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#141210",
          backgroundImage:
            "radial-gradient(circle at 50% 40%, #1e1b18 0%, #141210 80%)",
          border: "16px solid rgba(201, 154, 91, 0.25)",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Monogram Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 20,
              backgroundColor: "#1C1A17",
              border: "2px solid rgba(201, 154, 91, 0.4)",
              color: "#C99A5B",
              fontSize: 34,
              fontWeight: 700,
              fontFamily: "serif",
              marginBottom: 32,
            }}
          >
            KP
          </div>

          {/* Large Serif Title */}
          <div
            style={{
              fontSize: 70,
              fontFamily: "serif",
              fontWeight: 700,
              color: "#F5EFE6",
              letterSpacing: "-1px",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Krish Prajapati
          </div>

          {/* Amber Accent Line */}
          <div
            style={{
              width: 120,
              height: 3,
              backgroundColor: "#C99A5B",
              borderRadius: 2,
              marginBottom: 24,
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: "#C99A5B",
              fontFamily: "sans-serif",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Computer Engineering · Builder
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
