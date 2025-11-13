import daisyui from "daisyui";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      zIndex: {
        dropdown: "50",
        modal: "100",
        toast: "150",
      },
    },
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