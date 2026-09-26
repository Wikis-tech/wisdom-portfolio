import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Okoh Wisdom — Wikis Tech",
    template: "%s | Wikis Tech",
  },
  description:
    "Websites, digital products and intelligent tools built with software, design, AI and strategy.",
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
