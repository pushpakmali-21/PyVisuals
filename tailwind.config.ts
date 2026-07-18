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
        electric: "#38bdf8",
        violet: "#a78bfa",
        warn: "#f59e0b",
        error: "#ef4444",
        surface: "#0f1623",
        surfaceHigh: "#161d2a"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Consolas", "'Courier New'", "monospace"]
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(79,209,197,0.12) 0%, transparent 70%)",
        "card-gradient": "linear-gradient(135deg, rgba(28,35,48,0.9) 0%, rgba(21,25,34,0.95) 100%)",
        "accent-gradient": "linear-gradient(135deg, #4fd1c5 0%, #60a5fa 50%, #a78bfa 100%)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out"
      }
    }
  },
  plugins: []
};

export default config;
