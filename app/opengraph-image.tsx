import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "Neelam Academy - E-Learning Platform"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "40px",
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "20px",
          }}
        >
          {/* Logo Circle */}
          <div
            style={{
              width: "150px",
              height: "150px",
              background: "white",
              borderRadius: "75px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "60px",
              fontWeight: "bold",
              color: "#667eea",
              marginBottom: "20px",
            }}
          >
            NA
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 70,
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            Neelam Academy
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: "#f0f0f0",
              fontWeight: "normal",
            }}
          >
            Quality E-Learning Platform for Developers
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "30px",
              fontSize: "24px",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>📚 Ebooks</div>
            <div style={{ display: "flex", alignItems: "center" }}>🎓 Live Courses</div>
            <div style={{ display: "flex", alignItems: "center" }}>⭐ Expert Support</div>
          </div>
        </div>

        {/* Website URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "24px",
            color: "#f0f0f0",
            opacity: 0.9,
          }}
        >
          helloneelammaam.com
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}

