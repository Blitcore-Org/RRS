'use client';

import Link from "next/link";
import Navigation from "@/Components/Navigation";
import Footer from "@/Components/Footer";
import { useState, useEffect } from "react";

export default function Challenges() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 14;
  const visibleDots = 5; // Always show 5 dots

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate which dots to show, always keeping visual center
  const getDotIndices = () => {
    let indices = [];
    // Calculate the range ensuring we don't go out of bounds
    let start = currentSlide - 2;
    if (start < 0) {
      start = totalSlides + start; // Wrap around from the end
    }
    
    // Generate 5 indices, wrapping around if necessary
    for (let i = 0; i < 5; i++) {
      indices.push((start + i) % totalSlides);
    }
    return indices;
  };

  return (
    <div className="min-h-screen bg-background text-white w-full">
      {/* Navigation - Fixed at top */}
      <div className="relative z-50">
        <Navigation />
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative w-full py-32">
          <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
            <h1 className="text-primary text-4xl md:text-5xl font-bold mb-16 text-center font-thuast">
              RRS 2025
            </h1>

            {/* Challenge Cards */}
            <div className="flex flex-col gap-6 w-full max-w-[800px] mx-auto">
              {/* Kick-off Challenge */}
              <Link href="/challenges/kick-off" className="group block relative w-full">
                <div className="relative">
                  <div className="bg-primary rounded-[32px] overflow-hidden h-[150px] w-full shadow-lg transform transition-transform hover:scale-[1.02]">
                    {/* Background Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src="/Images/illustrations/silhouette_1.png" 
                        alt="Runner Silhouette" 
                        className="w-[200px] h-auto opacity-20"
                      />
                    </div>
                    {/* Large Number */}
                    <div className="absolute -left-4 -bottom-4">
                      <div className="text-secondary md:text-[150px] lg:text-[200px] text-[140px] leading-none font-bold font-thuast opacity-90">1</div>
                    </div>
                    {/* Content */}
                    <div className="flex relative h-full items-center pl-32 pt-20">
                      <div>
                        <h2 className="text-secondary text-xs md:text-lg font-black italic uppercase font-thuast tracking-[0.1em] whitespace-nowrap">Kick-off Challenge</h2>
                        <p className="text-secondary/80 text-base font-dm-sans mt-0.5">Jan 11 - Feb 9 2025</p>
                      </div>
                    </div>
                  </div>
                  {/* Floating Button */}
                  <div className="absolute -top-2 -right-2 bg-secondary rounded-full p-2.5 transform transition-all group-hover:scale-110 group-hover:translate-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Momentum Challenge */}
              <Link href="/challenges/momentum" className="group block relative w-full">
                <div className="relative">
                  <div className="bg-primary rounded-[32px] overflow-hidden h-[150px] w-full shadow-lg transform transition-transform hover:scale-[1.02]">
                    {/* Background Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src="/Images/illustrations/silhouette_2.png" 
                        alt="Runner Silhouette" 
                        className="w-[200px] h-auto opacity-20"
                      />
                    </div>
                    {/* Large Number */}
                    <div className="absolute -left-6 -bottom-4">
                      <div className="text-secondary md:text-[150px] lg:text-[200px] text-[140px] leading-none font-bold font-thuast opacity-90">2</div>
                    </div>
                    {/* Content */}
                    <div className="relative h-full flex items-center pl-32 pt-20">
                      <div>
                        <h2 className="text-secondary text-xs md:text-lg font-black italic uppercase font-thuast tracking-[0.1em] whitespace-nowrap">Momentum Challenge</h2>
                        <p className="text-secondary/80 text-base font-dm-sans mt-0.5">May 1 - May 30 2025</p>
                      </div>
                    </div>
                  </div>
                  {/* Floating Button */}
                  <div className="absolute -top-2 -right-2 bg-secondary rounded-full p-2.5 transform transition-all group-hover:scale-110 group-hover:translate-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Resolution Challenge */}
              <Link href="/challenges/resolution" className="group block relative w-full">
                <div className="relative">
                  <div className="bg-primary rounded-[32px] overflow-hidden h-[150px] w-full shadow-lg transform transition-transform hover:scale-[1.02]">
                    {/* Background Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src="/Images/illustrations/silhouette_3.png" 
                        alt="Runner Silhouette" 
                        className="w-[200px] h-auto opacity-20"
                      />
                    </div>
                    {/* Large Number */}
                    <div className="absolute -left-6 -bottom-4">
                      <div className="text-secondary md:text-[150px] lg:text-[200px] text-[140px] leading-none font-bold font-thuast opacity-90">3</div>
                    </div>
                    {/* Content */}
                    <div className="relative h-full flex items-center pl-32 pt-20">
                      <div>
                        <h2 className="text-secondary text-xs md:text-lg font-black italic uppercase font-thuast tracking-[0.1em] whitespace-nowrap">Resolution Challenge</h2>
                        <p className="text-secondary/80 text-base font-dm-sans mt-0.5">Nov 1 - Nov 30 2025</p>
                      </div>
                    </div>
                  </div>
                  {/* Floating Button */}
                  <div className="absolute -top-2 -right-2 bg-secondary rounded-full p-2.5 transform transition-all group-hover:scale-110 group-hover:translate-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="relative w-full ">
          <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
            <h1 className="text-primary text-4xl md:text-5xl font-bold mb-16 text-center font-thuast">
              REWARDS
            </h1>

            {/* Medals Display */}
            <div className="flex justify-center gap-12 mb-24">
              <div className="relative">
                <img 
                  src="/Images/illustrations/gold_medal.png"
                  alt="Gold Medal"
                  className="w-32 h-auto"
                />
              </div>
              <div className="relative">
                <img 
                  src="/Images/illustrations/silver_medal.png"
                  alt="Silver Medal"
                  className="w-32 h-auto"
                />
              </div>
              <div className="relative">
                <img 
                  src="/Images/illustrations/bronze_medal.png"
                  alt="Bronze Medal"
                  className="w-32 h-auto"
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="flex flex-col items-center gap-16 max-w-2xl mx-auto">
              <div className="w-full relative text-center">
                <h2 className="text-[#FFD700]/60 text-7xl font-bold font-thuast italic tracking-wider relative">
                  GO<span className="relative">L</span>D
                  <span className="absolute text-primary text-4xl font-bold top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">150KM</span>
                </h2>
              </div>

              <div className="w-full relative text-center">
                <h2 className="text-[#C0C0C0]/60 text-7xl font-bold font-thuast italic tracking-wider relative">
                  SIL<span className="relative">V</span>ER
                  <span className="absolute text-primary text-4xl font-bold top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">100KM</span>
                </h2>
              </div>

              <div className="w-full relative text-center">
                <h2 className="text-[#CD7F32]/60 text-7xl font-bold font-thuast italic tracking-wider relative">
                  BRO<span className="relative">N</span>ZE
                  <span className="absolute text-primary text-4xl font-bold top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">50KM</span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Top Runner Prizes Section */}
        <section className="relative pt-32 pb-32 md:pt-36 md:pb-36 bg-primary w-full overflow-visible mt-32 z-10">
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
          {/* Bottom Pattern */}
          <div className="absolute -bottom-20 left-0 w-full">
            <img 
              src="/Images/illustrations/sm_bottom_pattern_illustration.png" 
              alt="Bottom Pattern" 
              className="w-full h-24 object-cover md:hidden"
            />
            <img 
              src="/Images/illustrations/lg_bottom_pattern_illustration.png" 
              alt="Bottom Pattern" 
              className="hidden md:block w-full h-24 object-cover"
            />
          </div>
          
          <div className="w-full px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-24 text-secondary italic font-thuast">
              TOP RUNNER<br />PRIZES
            </h2>
            <div className="flex flex-col items-center gap-12 text-secondary">
              <div className="text-center">
                <h2 className="text-3xl font-bold font-thuast italic mb-2 text-transparent [-webkit-text-stroke:1px_#0B2349] [text-stroke:1px_#0B2349]">1ST</h2>
                <p className="text-4xl md:text-5xl font-bold font-dm-sans">₦600,000</p>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold font-thuast italic mb-2 text-transparent [-webkit-text-stroke:1px_#0B2349] [text-stroke:1px_#0B2349]">2ND</h2>
                <p className="text-4xl md:text-5xl font-bold font-dm-sans">₦300,000</p>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold font-thuast italic mb-2 text-transparent [-webkit-text-stroke:1px_#0B2349] [text-stroke:1px_#0B2349]">3RD</h2>
                <p className="text-4xl md:text-5xl font-bold font-dm-sans">₦150,000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="relative w-full py-32 bg-background">
          <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 text-primary italic font-thuast">
              GALLERY
            </h2>

            {/* Gallery Container */}
            <div className="relative max-w-[800px] mx-auto">
              {/* Image Container with consistent aspect ratio */}
              <div className="relative w-full rounded-[32px] overflow-hidden aspect-[4/3]">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <img
                    key={index}
                    src={`/Images/gallery/image_${index + 1}.jpg`}
                    alt={`Gallery Image ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center items-center gap-6 mt-8">
                {getDotIndices().map((index, arrayIndex) => {
                  // Always render dots in visual order (2 small, 2 medium, 1 large in center)
                  const visualPosition = arrayIndex;
                  let dotClasses = "rounded-full transition-all duration-300 ";
                  
                  // Size classes based on position from center
                  if (visualPosition === 2) {
                    // Center dot (largest)
                    dotClasses += "w-4 h-4 bg-primary";
                  } else if (visualPosition === 1 || visualPosition === 3) {
                    // Adjacent dots (medium)
                    dotClasses += "w-3 h-3 border-2 border-primary/60";
                  } else {
                    // Outer dots (smallest)
                    dotClasses += "w-2 h-2 border border-primary/30";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={dotClasses}
                      aria-label={index === currentSlide ? `Current slide ${index + 1}` : `Go to slide ${index + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 