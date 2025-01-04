import localFont from "next/font/local";
import "./globals.css";
import { UserProvider } from '@/context/UserContext';

const chillax = localFont({
  src: [
    {
      path: "./fonts/chillax-extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/chillax-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/chillax-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/chillax-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/chillax-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/chillax-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-chillax",
});

export const metadata = {
  title: "Run Resolution Series",
  description: "Join us for the run resolution series 2025, each challenge lasting 30 days. Participants can run up to 150k for a gold medal, 100k for a silver medal, or 50k for a bronze medal. The top 5 runners who exceed 150k will win prize money.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${chillax.variable} antialiased`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
