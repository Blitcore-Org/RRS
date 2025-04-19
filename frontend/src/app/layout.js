import localFont from "next/font/local";
import { DM_Sans } from 'next/font/google';
import "./globals.css";
import { UserProvider } from '@/context/UserContext';

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${thuast.variable} font-dm-sans antialiased`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
