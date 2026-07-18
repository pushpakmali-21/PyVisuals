import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PyVisuals — Interactive Python Learning Platform",
    template: "%s · PyVisuals"
  },
  description:
    "Visualize, learn, and master Python libraries in your browser. Interactive compiler with live visualization plus structured NumPy, Pandas, and Matplotlib learning modules — no installation required.",
  keywords: ["Python", "NumPy", "Pandas", "Matplotlib", "learning", "visualizer", "IDE", "browser"]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
