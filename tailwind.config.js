import daisyui from "daisyui";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    styled: true,          // must be true for .btn, .btn-primary, etc.
    utils: true,           // keeps bg-primary utilities
    base: true,
    themes: [
      {
        club: {
          primary: "#4CAF50", // Only override primary
        },
      },
      "light",
      "dark",
    ],
  },
};

export default config;