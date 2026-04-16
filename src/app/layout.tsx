import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morning Ledger",
  description:
    "A calm, newspaper-style daily briefing. No feed, no notifications — just today's edition.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
