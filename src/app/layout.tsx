import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CE Strategy Snapshot',
  description:
    'See what a cleaner CE strategy could look like for your therapy team. An illustrative planning tool for rehab directors and therapy managers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}
