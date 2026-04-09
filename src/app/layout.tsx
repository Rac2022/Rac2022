import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trend Radar",
  description: "Collect, score, and review early trend signals for business opportunities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
