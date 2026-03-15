import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classroom Clash: Tug of War Math",
  description:
    "A fun, competitive math game for classrooms. Two teams race to solve problems and pull the rope!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}
