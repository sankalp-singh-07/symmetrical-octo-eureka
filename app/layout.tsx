import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coffee & Matcha — Iced Matcha Latte',
  description:
    'A premium scrollytelling experience. Discover the Coffee & Matcha Iced Matcha Latte — cold, bold, and brilliantly crafted.',
  openGraph: {
    title: 'Coffee & Matcha — Iced Matcha Latte',
    description: 'Pure Matcha. Pure Moment.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {/* Film grain */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
