import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 40,
  height: 40,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <code
        style={{
          fontSize: 24,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "8px",
        }}
      >
        SD
      </code>
    ),
    // ImageResponse options
    {
      ...size,
    },
  );
}
