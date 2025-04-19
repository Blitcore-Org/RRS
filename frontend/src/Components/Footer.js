import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative bg-background py-16 md:py-24 z-0">

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
              Made by <Link href="https://www.blitcore.com/" className="font-bold hover:text-white">Blitcore</Link>. All rights reserved
            </p>
            <div className="mt-4">
              <img 
                src="/Images/api_logo_cptblWith_strava_stack_white.png"
                alt="Strava Logo"
                className="h-7 mx-auto"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <Link href="https://x.com/runresolutionseries" className="hover:opacity-80">
              <img 
                src="/Images/icons/x_icon.png"
                alt="X (Twitter)"
                className="w-6 h-6"
              />
            </Link>
            <Link href="https://www.instagram.com/runresolutionseries" className="hover:opacity-80">
              <img 
                src="/Images/icons/instagram_icon.png"
                alt="Instagram"
                className="w-6 h-6"
              />
            </Link>
            <Link href="https://www.tiktok.com/@runresolutionseries" className="hover:opacity-80">
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