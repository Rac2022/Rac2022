import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plug Trust Pass",
  description: "Verified device certification for refurbished phone resellers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-plug-gray min-h-screen text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
