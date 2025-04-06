import Link from "next/link";
import SponsorTag from "@/Components/SponsorTag";
import Navigation from "@/Components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white w-full">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
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
        <div className="relative flex flex-col min-h-screen">
          {/* Text Content */}
          <div className="flex-1 flex items-start mt-72 md:mt-80 lg:mt-96 justify-center">
            <div className="text-center px-4 md:px-6 -mt-20">
              <h1 className="text-5xl md:text-7xl font-bold mb-12 leading-tight tracking-wider uppercase">
                RUN
                <br />
                RESOLUTION
                <br />
                SERIES!
              </h1>
              <Link
                href="https://exultant-elephant-4d8.notion.site/14daf21a78918042b5d7f82f2658c660?pvs=105"
                className="inline-block bg-primary text-black px-12 py-4 rounded-full text-xl font-bold hover:bg-primary/90 transition"
              >
                Join Now
              </Link>
            </div>
          </div>
          
          {/* Runner Illustration */}
          <div className="absolute bottom-24 left-0 right-0">
            <div className="relative w-[150%] -ml-[25%] md:w-[100%] md:-ml-[0%] lg:w-[50%] lg:-ml-[0%]">
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
      <section className="relative pt-32 pb-32 md:pt-36 md:pb-36 bg-primary w-full overflow-visible -mt-24 md:-mt-32 z-10">
        {/* Top Pattern */}
        <div className="absolute -top-20 left-0 w-full">
          <img 
            src="/Images/illustrations/top_pattern_illustration.png" 
            alt="Top Pattern" 
            className="w-full h-24 object-cover"
          />
        </div>
        {/* Bottom Pattern */}
        <div className="absolute -bottom-20 left-0 w-full">
          <img 
            src="/Images/illustrations/bottom_pattern_illustration.png" 
            alt="Bottom Pattern" 
            className="w-full h-24 object-cover"
          />
        </div>
        
        <div className="w-full px-4 md:px-6 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <div className="flex-1 max-w-xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 italic uppercase">
                What is RRS?
              </h2>
              <p className="text-black text-lg md:text-xl mb-8">
                Run Resolution Series is a year-long fitness initiative to motivate individuals to stay active and build healthy habits. Through running challenges and leaderboards, RRS transforms fitness into a shared journey of achievement and fun.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-[300px] text-center bg-black/10 backdrop-blur-sm text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-black/20 transition cursor-pointer">
                  Structured Running Events
                </div>
                <div className="w-[300px] text-center bg-black/10 backdrop-blur-sm text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-black/20 transition cursor-pointer">
                  Fitness Community
                </div>
                <div className="w-[300px] text-center bg-black/10 backdrop-blur-sm text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-black/20 transition cursor-pointer">
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
      <section className="py-16 md:py-20 bg-[#0A0A0A] w-full">
        <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6 uppercase tracking-wider">
            Challenges
          </h2>
          <p className="text-primary text-center text-base md:text-lg mb-16">
            3 CHALLENGES THROUGHOUT THE YEAR
          </p>

          <div className="flex flex-col items-center space-y-12 md:space-y-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-primary text-4xl md:text-5xl font-bold mb-4">1</div>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Kick-off Challenge</h3>
              <p className="text-base md:text-lg text-primary italic">January 11 - February 9</p>
            </div>

            <div className="text-center">
              <div className="text-primary text-4xl md:text-5xl font-bold mb-4">2</div>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Momentum Challenge</h3>
              <p className="text-base md:text-lg text-primary italic">May 1 - February 30</p>
            </div>

            <div className="text-center">
              <div className="text-primary text-4xl md:text-5xl font-bold mb-4">3</div>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Resolution Challenge</h3>
              <p className="text-base md:text-lg text-primary italic">November 1 - November 30</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative pt-32 pb-32 md:pt-36 md:pb-36 bg-primary w-full overflow-visible">
        {/* Top Pattern */}
        <div className="absolute -top-20 left-0 w-full">
          <img 
            src="/Images/illustrations/top_pattern_illustration.png" 
            alt="Top Pattern" 
            className="w-full h-24 object-cover"
          />
        </div>
        {/* Bottom Pattern */}
        <div className="absolute -bottom-20 left-0 w-full">
          <img 
            src="/Images/illustrations/bottom_pattern_illustration.png" 
            alt="Bottom Pattern" 
            className="w-full h-24 object-cover"
          />
        </div>

        <div className="w-full px-4 md:px-6 max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-black">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6">
              <div className="text-black text-4xl md:text-5xl mb-3 md:mb-4">1</div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-black">Sign Up</h3>
              <p className="text-base md:text-lg text-black/80">Create your account and join the running community</p>
            </div>
            <div className="text-center p-4 md:p-6">
              <div className="text-black text-4xl md:text-5xl mb-3 md:mb-4">2</div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-black">Track Progress</h3>
              <p className="text-base md:text-lg text-black/80">Log your runs and monitor your improvements</p>
            </div>
            <div className="text-center p-4 md:p-6">
              <div className="text-black text-4xl md:text-5xl mb-3 md:mb-4">3</div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-black">Compete</h3>
              <p className="text-base md:text-lg text-black/80">Join challenges and compete with other runners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 md:py-20 bg-black w-full">
        <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Our Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-center justify-items-center max-w-4xl mx-auto">
            <div className="w-full max-w-[12rem] h-32 flex items-center justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
              <img 
                src="/Images/partners/white_cmf_logo.png" 
                alt="CMF Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[12rem] h-32 flex items-center justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
              <img 
                src="/Images/partners/white_arc_logo.png" 
                alt="ARC Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[12rem] h-32 flex items-center justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
              <img 
                src="/Images/partners/white_monoliza_Logo.png" 
                alt="Monoliza Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[12rem] h-32 flex items-center justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
              <img 
                src="/Images/partners/white_blitcore_logo.png" 
                alt="Blitcore Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
