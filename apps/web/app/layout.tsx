import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pocket CTO",
  description: "Evidence-native engineering mission control.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
