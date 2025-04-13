import Link from "next/link";
import SponsorTag from "@/Components/SponsorTag";
import Navigation from "@/Components/Navigation";
import Footer from "@/Components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white w-full">
      {/* Navigation - Fixed at top */}
      <div className="relative mt-0 z-50">
        <Navigation />
      </div>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden">
          {/* Pattern Background */}
          <div className="absolute top-0 right-0 w-full">
            {/* Small screen pattern */}
            <img 
              src="/Images/illustrations/sm_pattern_illustration.png" 
              alt="Pattern Background" 
              className="w-full md:hidden"
            />
            {/* Large screen pattern */}
            <img 
              src="/Images/illustrations/lg_pattern_illustration.png" 
              alt="Pattern Background" 
              className="hidden md:block w-full"
            />
          </div>
          
          {/* Content */}
          <div className="relative flex flex-col min-h-[120vh] md:min-h-[80vh] lg:min-h-[70vh]">
            {/* Text Content */}
            <div className="flex-1 flex items-start justify-center">
              <div className="text-center px-4 mt-48">
                <h1 className="text-primary text-4xl md:text-5xl font-bold mb-12 leading-tight tracking-wider uppercase font-thuast">
                  <span className="md:hidden">
                    RUN
                    <br />
                    RESOLUTION
                    <br />
                    SERIES!
                  </span>
                  <span className="hidden md:inline">
                    RUN RESOLUTION SERIES!
                  </span>
                </h1>
                <Link
                  href="https://exultant-elephant-4d8.notion.site/14daf21a78918042b5d7f82f2658c660?pvs=105"
                  className="inline-block bg-primary text-secondary px-12 py-4 rounded-full text-xl font-bold hover:bg-primary/90 transition font-dm-sans"
                >
                  Join Now
                </Link>
              </div>
            </div>
            
            {/* Runner Illustration */}
            <div className="absolute w-full min-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[500px] mx-auto bottom-24 left-0 right-0">
              <div className="relative">
                <img 
                  src="/Images/illustrations/illustration_1.png" 
                  alt="Runner Illustration" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is RRS Section */}
        <section id="about" className="relative pt-32 pb-32 md:pt-36 md:pb-36 bg-primary w-full overflow-visible -mt-24 md:-mt-32 z-10">
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Text Content */}
              <div className="flex-1 max-w-xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 italic uppercase font-thuast">
                  What is RRS?
                </h2>
                <p className="text-secondary text-lg md:text-xl mb-8 font-dm-sans">
                  Run Resolution Series is a year-long fitness initiative to motivate individuals to stay active and build healthy habits. Through running challenges and leaderboards, RRS transforms fitness into a shared journey of achievement and fun.
                </p>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-[300px] text-center bg-secondary/10 backdrop-blur-sm text-secondary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-secondary/20 transition cursor-pointer font-dm-sans">
                    Structured Running Events
                  </div>
                  <div className="w-[300px] text-center bg-secondary/10 backdrop-blur-sm text-secondary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-secondary/20 transition cursor-pointer font-dm-sans">
                    Fitness Community
                  </div>
                  <div className="w-[300px] text-center bg-secondary/10 backdrop-blur-sm text-secondary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-secondary/20 transition cursor-pointer font-dm-sans">
                    Rewards and Recognition
                  </div>
                </div>
              </div>

              {/* Illustration */}
              <div className="flex-1 flex justify-center">
                <img 
                  src="/Images/illustrations/illustration_2.png" 
                  alt="Runner with Medal" 
                  className="w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="py-16 md:py-32 bg-background w-full">
          <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6 uppercase tracking-wider font-thuast">
              Challenges
            </h2>
            <p className="text-primary text-center text-base md:text-lg mb-16 font-dm-sans">
              3 CHALLENGES THROUGHOUT THE YEAR
            </p>

            <div className="flex flex-col items-center space-y-12 md:space-y-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-primary text-4xl md:text-5xl font-bold mb-4 font-thuast">1</div>
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 font-dm-sans">Kick-off Challenge</h3>
                <p className="text-base md:text-lg text-primary italic font-dm-sans">January 11 - February 9</p>
              </div>

              <div className="text-center">
                <div className="text-primary text-4xl md:text-5xl font-bold mb-4 font-thuast">2</div>
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 font-dm-sans">Momentum Challenge</h3>
                <p className="text-base md:text-lg text-primary italic font-dm-sans">May 1 - February 30</p>
              </div>

              <div className="text-center">
                <div className="text-primary text-4xl md:text-5xl font-bold mb-4 font-thuast">3</div>
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 font-dm-sans">Resolution Challenge</h3>
                <p className="text-base md:text-lg text-primary italic font-dm-sans">November 1 - November 30</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative pt-32 pb-32 md:pt-36 md:pb-36 bg-primary w-full overflow-visible">
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-secondary italic font-thuast">HOW IT WORKS</h2>
            <div className="flex flex-col md:flex-row gap-12 md:gap-8 max-w-5xl mx-auto justify-center items-center">
              <div className="flex flex-col items-center gap-2">
                <img 
                  src="/Images/icons/sign_icon.png" 
                  alt="Sign Up Icon" 
                  className="w-12 h-12"
                />
                <p className="text-secondary italic font-dm-sans">Sign up for a challenge</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img 
                  src="/Images/icons/run_icon.png" 
                  alt="Attend Icon" 
                  className="w-12 h-12"
                />
                <p className="text-secondary italic font-dm-sans">Attend Sessions</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img 
                  src="/Images/icons/flag_icon.png" 
                  alt="Milestone Icon" 
                  className="w-12 h-12"
                />
                <p className="text-secondary italic font-dm-sans">Hit milestones</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img 
                  src="/Images/icons/medal_icon.png" 
                  alt="Reward Icon" 
                  className="w-12 h-12"
                />
                <p className="text-secondary italic font-dm-sans">Get rewarded</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 md:py-32 bg-background w-full">
          <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-thuast">Our Partners</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 items-center justify-items-center max-w-4xl mx-auto">
              <img 
                src="/Images/partners/white_cmf_logo.png" 
                alt="CMF Logo" 
                className="w-24 h-auto object-contain"
              />
              <img 
                src="/Images/partners/white_arc_logo.png" 
                alt="ARC Logo" 
                className="w-24 h-auto object-contain"
              />
              <img 
                src="/Images/partners/white_monoliza_Logo.png" 
                alt="Monoliza Logo" 
                className="w-24 h-auto object-contain"
              />
              <img 
                src="/Images/partners/white_blitcore_logo.png" 
                alt="Blitcore Logo" 
                className="w-24 h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative pt-32 pb-32 md:pt-36 md:pb-36 bg-primary w-full overflow-visible">
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
          <div className="absolute -bottom-20 left-0 w-full z-10">
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-secondary font-thuast">Contact Us</h2>
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <p className="text-secondary text-lg md:text-xl">
                Have questions about Run Resolution Series? We'd love to hear from you.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-secondary font-semibold text-xl mb-2">Email</h3>
                  <a href="mailto:info@blitcore.com" className="text-secondary hover:text-secondary/80">
                    info@blitcore.com
                  </a>
                </div>
                <div>
                  <h3 className="text-secondary font-semibold text-xl mb-2">Phone</h3>
                  <a href="tel:+2348039555588" className="text-secondary hover:text-secondary/80">
                    +234 803 955 5588
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
