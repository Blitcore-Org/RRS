import localFont from "next/font/local";
import { DM_Sans } from 'next/font/google';
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const thuast = localFont({
  src: "./fonts/Thuast.otf",
  variable: "--font-thuast",
});

export const metadata = {
  title: "Run Resolution Series",
  description: "Join us for the run resolution series 2025, each challenge lasting 30 days. Participants can run up to 150k for a gold medal, 100k for a silver medal, or 50k for a bronze medal. The top 5 runners who exceed 150k will win prize money.",
  manifest: '/manifest.json'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050E1E" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${dmSans.variable} ${thuast.variable} font-dm-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
