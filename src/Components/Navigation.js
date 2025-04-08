"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-colors duration-200 ${hasScrolled ? 'nav-scrolled' : ''}`}>
        {/* Blurred background */}
        <div className={`absolute inset-0 transition-all duration-200 ${
          hasScrolled ? 'bg-[#0B2349]/80 backdrop-blur-md' : ''
        }`}></div>
        
        <div className="relative mt-12 w-full px-8 md:px-16 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <Link href="/" className={`flex items-center transition-opacity duration-300 md:opacity-100 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
              <img src="/Images/logo.png" alt="RRS Logo" className="w-12 md:w-16 h-12 md:h-16" />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-primary hover:text-primary/80">
                Dashboard
              </Link>
              <Link 
                href="/login"
                className="bg-primary text-secondary px-6 py-2 rounded-full hover:bg-primary/90 transition"
              >
                Login
              </Link>
            </div>
            {/* Hamburger/Close Button */}
            <button 
              className="md:hidden text-primary p-2 z-50 relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-8 h-8">
                {/* Hamburger Icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className={`w-8 h-8 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                  />
                </svg>
                {/* Close Icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className={`w-8 h-8 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed mt-12 inset-0 z-40 md:hidden transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Content */}
        <div className={`relative w-full h-full p-4 pt-24 transition-all duration-300 ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-8'
        }`}>
          {/* Logo */}
          <div className="mb-12 text-center">
            <img src="/Images/logo.png" alt="RRS Logo" className="w-16 h-16 mx-auto" />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center space-y-6">
            <Link 
              href="/"
              className="w-64 bg-primary text-secondary py-3 rounded-lg text-center font-semibold text-lg hover:bg-primary/90 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/challenges"
              className="w-64 bg-primary text-secondary py-3 rounded-lg text-center font-semibold text-lg hover:bg-primary/90 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Challenges
            </Link>
            <Link 
              href="/dashboard"
              className="w-64 bg-primary text-secondary py-3 rounded-lg text-center font-semibold text-lg hover:bg-primary/90 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              App
            </Link>
            <Link
              href="#"
              className="w-64 bg-primary text-secondary py-3 rounded-lg text-center font-semibold text-lg hover:bg-primary/90 transition"
            >
              About
            </Link>
            <Link
              href="#"
              className="w-64 bg-primary text-secondary py-3 rounded-lg text-center font-semibold text-lg hover:bg-primary/90 transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 