import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "light", // Default light theme
      "dark",  // Default dark theme
      {
        mytheme: {
          primary: "#4CAF50", // Green for buttons and links
          secondary: "#FF9800", // Orange for accents
          accent: "#03A9F4", // Blue for highlights
          neutral: "#3d4451", // Neutral background
          "base-100": "#ffffff", // Background for light mode
          "base-200": "#f9fafb", // Paper background for light mode
          "base-content": "#1f2937", // Text color for light mode
        },
      },
    ],
  },
  plugins: [daisyui],
};

export default config;