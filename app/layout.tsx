import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PyVisuals",
  description: "A browser-native Python IDE for NumPy and Pandas visualization."
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
