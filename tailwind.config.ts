import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexiera: {
          navy: {
            DEFAULT: "#0F172A", // Text utama & Header
            light: "#1E293B",   // Card background / dark container
            dark: "#080D1A",    // Deep accent
          },
          blue: {
            DEFAULT: "#2563EB", // Primary Brand Accent & CTA Buttons
            hover: "#1D4ED8",   // Button hover state
            light: "#EFF6FF",   // Soft blue container & badge background
          },
          cyan: {
            DEFAULT: "#06B6D4", // Highlight accent & glow
            light: "#67E8F9",
          },
          slate: {
            DEFAULT: "#64748B", // Subtitle & muted text
            light: "#F8FAFC",   // Page background
            border: "#E2E8F0",  // Divider & card border
          },
        },
      },
      borderRadius: {
        card: "16px",
        button: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
