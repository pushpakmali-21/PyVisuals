import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        panel: "#151922",
        panelSoft: "#1c2330",
        line: "#2f394a",
        accent: "#4fd1c5",
        warn: "#f59e0b",
        error: "#ef4444"
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
