import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative bg-secondary py-16 md:py-24 z-0">
      {/* Top Pattern */}
      <div className="absolute -top-20 left-0 w-full">
        <img 
          src="/Images/illustrations/sm_top_pattern_illustration.png" 
          alt="Top Pattern" 
          className="w-full h-24 object-cover md:hidden"
        />
        <img 
          src="/Images/illustrations/lg_top_pattern_illustration.png" 
          alt="Top Pattern" 
          className="hidden md:block w-full h-24 object-cover"
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-12">
            <img 
              src="/Images/logo.png"
              alt="RRS Logo"
              className="w-16 h-16"
            />
          </div>

          {/* Quick Links */}
          <div className="mb-12">
            <h3 className="text-primary text-xl font-bold mb-6 text-center font-thuast">Quick Links</h3>
            <nav className="flex flex-col items-center space-y-3">
              <Link href="/" className="text-primary hover:text-primary/80 font-dm-sans">
                Home
              </Link>
              <Link href="/challenges" className="text-primary hover:text-primary/80 font-dm-sans">
                Challenges
              </Link>
              <Link href="/app" className="text-primary hover:text-primary/80 font-dm-sans">
                App
              </Link>
              <Link href="/faq" className="text-primary hover:text-primary/80 font-dm-sans">
                FAQ
              </Link>
              <Link href="/contact" className="text-primary hover:text-primary/80 font-dm-sans">
                Contact
              </Link>
            </nav>
          </div>

          {/* Copyright and Made by */}
          <div className="text-center mb-8">
            <p className="text-primary font-dm-sans">
              Made by <span className="font-bold">Blitcore</span>. All rights reserved
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <Link href="#" className="hover:opacity-80">
              <img 
                src="/Images/icons/x_icon.png"
                alt="X (Twitter)"
                className="w-6 h-6"
              />
            </Link>
            <Link href="#" className="hover:opacity-80">
              <img 
                src="/Images/icons/instagram_icon.png"
                alt="Instagram"
                className="w-6 h-6"
              />
            </Link>
            <Link href="#" className="hover:opacity-80">
              <img 
                src="/Images/icons/tiktok_icon.png"
                alt="TikTok"
                className="w-6 h-6"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 