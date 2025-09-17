import React, { useEffect, useRef, useState } from 'react';
import VideoThumbnail from "./components/VideoThumbnail";
import { Mail, Instagram, Linkedin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplashScreen } from './components/SplashScreen';
import { LazyVideo } from './components/LazyVideo';
import { useThrottledMouseTracking } from './hooks/useThrottledMouseTracking';
import { MobileBadgeCarousel } from './components/MobileBadgeCarousel';

// Mobile viewport height handler
function setMobileVH() {
  if (window.innerWidth < 768) {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--mobile-vh', `${vh}px`);
  }
}

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Check if device is mobile
const isMobile = () => window.innerWidth < 768;

// Mobile viewport height helper
const getMobileVH = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return window.innerHeight;
  }
  return null;
};
interface TestimonialBadge {
  image: string;
  position: { top: string; left: string };
  delay: number;
  shineDelay: number;
  shineDuration: number;
  scale: number;
}
 
const testimonialBadges: TestimonialBadge[] = [ 
  { image: "/badges/1.png", position: { top: "30%", left: "24%" }, delay: 1.5, shineDelay: 1.3, shineDuration: 14, scale: 1.0 },
  
  { image: "/badges/4.png", position: { top: "60%", left: "71%" }, delay: 2.8, shineDelay: 0.2, shineDuration: 12, scale: 0.8 }, 
  
  { image: "/badges/3.png", position: { top: "50%", left: "29%" }, delay: 1.1, shineDelay: 1.7, shineDuration: 15, scale: 0.9 },  
  
  { image: "/badges/2.png", position: { top: "25%", left: "85%" }, delay: 3.4, shineDelay: 0.1, shineDuration: 13, scale: 0.7 },
  
  { image: "/badges/5.png", position: { top: "25%", left: "10%" }, delay: 2.7, shineDelay: 1.9, shineDuration: 16, scale: 1.1 },
   
  { image: "/badges/6.png", position: { top: "42%", left: "78%" }, delay: 1.0, shineDelay: 0.8, shineDuration: 12, scale: 0.8 },
  
  { image: "/badges/7.png", position: { top: "60%", left: "17%" }, delay: 3.3, shineDelay: 1.5, shineDuration: 14, scale: 0.9 },
  { image: "/badges/8.png", position: { top: "42%", left: "13%" }, delay: 2.6, shineDelay: 0.2, shineDuration: 13, scale: 0.6 }, 
  
  { image: "/badges/9.png", position: { top: "50%", left: "58%" }, delay: 1.9, shineDelay: 1.7, shineDuration: 15, scale: 0.9 },
  { image: "/badges/10.png", position: { top: "30%", left: "66%" }, delay: 3.2, shineDelay: 0.1, shineDuration: 16, scale: 0.8 },
];

export function TestimonialBadgesGroup() {
  return (
    <>
      {testimonialBadges.map((badge, index) => (
        <TestimonialBadge key={index} badge={badge} />
      ))}
    </>
  );
}

function TestimonialBadge({ badge }: { badge: TestimonialBadge }) {
  return (
    <div
      className={`absolute opacity-0 animate-fade-up`}
      style={{
        top: badge.position.top,
        left: badge.position.left,
        animationDelay: `${badge.delay}s`,
        animationFillMode: "forwards",
        transform: `scale(${badge.scale})`,
      }}
    >
      <div className="relative w-auto h-auto max-w-[50px] sm:max-w-[0px] md:max-w-[100px] lg:max-w-[230px]">
        {/* Base Badge PNG */}
        <img
          src={badge.image}
          alt="testimonial badge"
          className="w-full h-auto block relative z-10 opacity-10 hover:opacity-50 transition-opacity duration-300"
        />

        {/* Shine Overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none animate-shine-diagonal"
            style={{
              WebkitMaskImage: `url(${badge.image})`,
              maskImage: `url(${badge.image})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              animationDelay: `${badge.shineDelay}s`,
              animationDuration: `${badge.shineDuration}s`,
              '--shine-delay': `${badge.shineDelay}s`,
              '--shine-duration': `${badge.shineDuration}s`,
            } as React.CSSProperties}
          />

      </div>
    </div>
  );
}



function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showTestimonials, setShowTestimonials] = React.useState(true);
  const [showContact, setShowContact] = React.useState(false);
 const [showportrait, setShowportrait] = React.useState(true);
   const [showbase, setShowbase] = React.useState(true);
   const [showeyes, setShoweyes] = React.useState(true);
  const [showMobileBadges, setShowMobileBadges] = React.useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const backgroundTextRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const newMainTextRef = useRef<HTMLDivElement>(null);
  const newScrollIndicatorRef = useRef<HTMLDivElement>(null);
  const fixedBackgroundRef = useRef<HTMLDivElement>(null); 
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [mobileVH, setMobileVH] = useState<number | null>(null);

  // Use throttled mouse tracking hook
  const { mousePosition, handleMouseEnter, handleMouseLeave } = useThrottledMouseTracking(!isMobile());

  // Handle mobile viewport height
  useEffect(() => {
    // Initialize mobile viewport height
    setMobileVH();
    
    const updateMobileVH = () => {
      if (window.innerWidth < 768) {
        setMobileVH(window.innerHeight);
        // Also update CSS custom property
        setMobileVH();
      } else {
        setMobileVH(null);
      }
    };

    window.addEventListener('resize', updateMobileVH);
    window.addEventListener('orientationchange', updateMobileVH);
    // Also listen for viewport changes (URL bar hide/show)
    window.addEventListener('scroll', setMobileVH);

    return () => {
      window.removeEventListener('resize', updateMobileVH);
      window.removeEventListener('orientationchange', updateMobileVH);
      window.removeEventListener('scroll', setMobileVH);
    };
  }, []);
  // Handle splash screen completion
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.registerPlugin(ScrollTrigger);

    // Desktop-only hero animations
    if (!isMobile()) {
      // Create a single timeline for all hero elements
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: portfolioSectionRef.current,
          start: "top bottom",
          end: "top 70%",
          scrub: 4,
          invalidateOnRefresh: false,
          ease: "power2.out",
        }
      });

      // Batch hero elements animation
      const heroElements = [portraitRef.current, baseRef.current, eyesRef.current, newScrollIndicatorRef.current];
      heroElements.forEach(element => {
        if (element) {
          heroTl.to(element, { 
            y: 50,
            ease: "power2.out"
          }, 0);
        }
      }); 

      // New main text animation
      gsap.to(newMainTextRef.current, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: portraitRef.current,
          start: "top top",
          end: "top+=3000",
          scrub: 0.5
        }
      }); 

      // Background text animation
      gsap.to(backgroundTextRef.current, {
        y: -200,
        scaleY: 1,
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "center center",
          end: "bottom top",
          scrub: 1,
        }
      });
    }

    // Portfolio section animation
    if (portfolioSectionRef.current) {
      gsap.to(portfolioSectionRef.current, {
        y: -900,
        scrollTrigger: {
          trigger: portfolioSectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    }

    // Visibility triggers
    const visibilityTriggers = [
      {
        start: "center top",
        onEnter: () => setShowTestimonials(false),
        onLeaveBack: () => setShowTestimonials(true),
      },
      {
        start: "center bottom",
        onEnter: () => {
          setShowContact(true);
          setShowbase(false);
          setShoweyes(false);
        },
        onLeaveBack: () => {
          setShowContact(false);
          setShowbase(true);
          setShoweyes(true);
        },
      },
      {
        start: "center bottom",
        onEnter: () => setShowportrait(false),
        onLeaveBack: () => setShowportrait(true),
      }
    ];

    visibilityTriggers.forEach(trigger => {
      ScrollTrigger.create({
        trigger: portfolioSectionRef.current,
        start: trigger.start,
        fastScrollEnd: true,
        onEnter: trigger.onEnter,
        onLeaveBack: trigger.onLeaveBack,
      });
    });

    // Mobile badge visibility trigger
    ScrollTrigger.create({
      trigger: portfolioSectionRef.current,
      start: "top center",
      fastScrollEnd: true,
      onEnter: () => setShowMobileBadges(false),
      onLeaveBack: () => setShowMobileBadges(true),
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
 
  return ( 
    <div className="relative">
     
      {/* Cinematic Effects Overlay */}
      <div className="vignette-effect" style={{ pointerEvents: 'none' }} />
      <div className="edge-blur" style={{ pointerEvents: 'none' }} />
      <div className="film-grain" style={{ pointerEvents: 'none' }} />
       
      {/* Splash Screen */}
      {isLoading && <SplashScreen onLoadComplete={handleLoadComplete} />}

      {/* Mobile Badge Carousel - Only visible on mobile */}
      <MobileBadgeCarousel isVisible={showMobileBadges} />

<div
  ref={fixedBackgroundRef}
  className="fixed inset-0 bg-center bg-no-repeat z-[-1] 
             bg-cover 
             sm:bg-cover 
             max-sm:bg-cover max-sm:bg-center"
  style={{
    backgroundImage: `url('/bg.png')`,
    backgroundAttachment: 'fixed',
    backgroundSize: window.innerWidth < 640 ? 'cover' : 'cover'
  }}
>

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/0" />
</div>
 
      {/* Main Hero Section */} 
      <div 
        ref={heroRef}
        className="relative w-full overflow-hidden bg-transparent chromatic-aberration"
        style={{ 
          minHeight: window.innerWidth < 768 ? 'calc(var(--mobile-vh) * 100)' : '100vh',
          height: window.innerWidth < 768 ? 'calc(var(--mobile-vh) * 100)' : '100vh'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

         {/* Base */}
      <div
        ref={baseRef}
        className={`fixed inset-0 flex items-center justify-center z-20 transition-opacity duration-100`}
        style={{
          top: window.innerWidth < 768 ? "30%" : "10%",
          left: "0%",
          opacity: showbase ? 1 : 0,
          pointerEvents: showbase ? "auto" : "none",
        }}
      > 
        <div className="relative">
          <div
            className="
              w-[34.65rem] h-[34.65rem]
              sm:w-[540px] sm:h-[540px]
              md:w-[45rem] md:h-[45rem]
              lg:w-[56.25rem] lg:h-[56.25rem]
              overflow-hidden
            "
          >
            <img
              src="/base.png"
              alt="Base"
              className="w-full h-full object-cover"
              style={{ transform: "scale(1.05)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Portrait */}
      <div
        ref={portraitRef}
        className={`fixed inset-0 flex items-center justify-center z-40 transition-opacity duration-100`}
        style={{
          top: window.innerWidth < 768 ? "30%" : "10%", 
          left: "0%",
          opacity: showportrait ? 1 : 0,
          pointerEvents: showportrait ? "auto" : "none",
        }}
      >
        <div className="relative"> 
          <div
            className="
              w-[34.65rem] h-[34.65rem] 
              lg:w-[56.25rem] lg:h-[56.25rem]
              overflow-hidden
            "
          >
            <img
              src="/me.png"
              alt="Portrait"
              className="w-full h-full object-cover"
              style={{ transform: "scale(1.05)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Eyes */}
      <div
        ref={eyesRef}
        className={`fixed inset-0 flex items-center justify-center z-30 transition-opacity duration-100`}
        style={{
          top: window.innerWidth < 768 ? "30%" : "10%",
          left: "0%",
          opacity: showeyes ? 1 : 0,
          pointerEvents: showeyes ? "auto" : "none",
          transform: isMobile() ? 'none' : `translate(${mousePosition.x * 8}px, ${mousePosition.y * 8}px)`,
        }}
      >
        <div className="relative">
          <div
            className="
              w-[34.65rem] h-[34.65rem]
              sm:w-[540px] sm:h-[540px]
              md:w-[45rem] md:h-[45rem]
              lg:w-[56.25rem] lg:h-[56.25rem]
              overflow-hidden
              grayscale contrast-110 brightness-90
            "
          >
            <img
              src="/eyes.png"
              alt="Eyes"
              className="w-full h-full object-cover"
              style={{ transform: "scale(1.05)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent" />
          </div>
        </div>
      </div>
        {/* Background Text - Aamir Naqvi at Bottom */}
        <div 
          ref={backgroundTextRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 hidden md:flex"
          style={{ 
                            letterSpacing: '2em',
            top: '65%',
            transition: isMobile() ? 'none' : 'transform 0.4s ease-out'
          }}
        >
          <div  
            className={`text-[3.6rem] md:text-[9rem] lg:text-[18rem] font-bosenAlt text-black/40 select-none leading-none opacity-0 animate-fade-in-delayed`}
            style={{
              animationDelay: '0.1s',  
              animationFillMode: 'forwards', 
              textShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            AAMIR NAQVI
          </div>
        </div>
        
        {/* New Main Typography - Full Width Light Font */}
        <div 
          ref={newMainTextRef}
          className="absolute top-0 left-0 right-0 flex items-start justify-center z-40 w-full px-6" 
          style={{ top: '0%' }}
        >
          <div className="w-full text-center">
            <h1 
              className="text-3xl md:text-6xl lg:text-4xl text-white/100 leading-none opacity-0 animate-fade-in-delayed"
              style={{ 
                fontFamily: 'IBM Plex Sans, sans-serif',
                fontWeight: '100', 
                fontSize: '100%',
                letterSpacing: '0.4em',
                wordSpacing: '2em',
                animationDelay: '0.8s', 
                animationFillMode: 'forwards',
                textShadow: '0 10px 20px rgba(0,0,0,0.3)'
              }}
            >
           I EDIT VISUALS            THAT BUILD BRAND
            </h1>
          </div>
        </div>
      

        {/* New Scroll Indicator */}
        <div 
          ref={newScrollIndicatorRef}
          className="fixed inset-0 left-[-0.6%] top-[90%] -translate-x-1/2 opacity-0 animate-fade-in-delayed z-40 cursor-pointer"
          style={{ 
            bottom: '10%', 
            animationDelay: '2.5s', 
            animationFillMode: 'forwards'
          }}
          onClick={() => {
            portfolioSectionRef.current?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          <div className="flex flex-col items-center group">
            {/* Animated scroll indicator */}
            <div className="relative">
              {/* Outer ring */}
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/50 transition-all duration-300">
                {/* Inner animated chevron */}
                <div className="flex flex-col items-center animate-pulse">
                  <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-white/70 mb-1" />
                  <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-white/50" />
                </div>
              </div>
              
              {/* Pulsing background effect */}
              <div className="absolute inset-0 rounded-full bg-white/5 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
            
            <p className="text-white/50 text-xs font-bosenAlt mt-3 uppercase tracking-widest group-hover:text-white/70 transition-colors duration-300">
              Explore Work
            </p>
          </div>
        </div>
 
        {/* Floating Testimonial Badges */}
        {showTestimonials && (
          <div
            className="
              fixed 
              top-10       /* distance from top */
              left-10      /* distance from left */
              right-24     /* distance from right */
              bottom-10    /* distance from bottom */ 
              z-0 
              pointer-events-none 
              overflow-hidden 
              transform -translate-y-20
            "
            style={{ pointerEvents: 'none' }}
          >
            <div className="hidden md:block h-[20%] w-[20%]">
              {testimonialBadges.map((badge, index) => (
                <TestimonialBadge key={index} badge={badge} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Section */}
      <div 
        ref={portfolioSectionRef} 
        className="relative w-full bg-white z-[100] rounded-t-[3rem] rounded-b-[3rem] opacity-100"
        style={{ 
          minHeight: window.innerWidth < 768 ? 'calc(var(--mobile-vh) * 100)' : '100vh',
          zIndex: 9999 
        }}
      >

        <div className="container mx-auto px-6 py-20">
          <div className="relative text-center mb-16 z-20">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bosenAlt text-black/90 mb-6 tracking-tight">
              PORTFOLIO
            </h2>
            <p className="text-xl md:text-2xl text-black/60 max-w-3xl mx-auto leading-relaxed">
              Visual stories that shape brands and captivate audiences worldwide
            </p>
          </div>
          
  {/* Show Reel Section */}
          <div className="relative mb-20 z-20">
            <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
              SHOW REEL
            </h3>
            <div className="max-w-4xl mx-auto">
              <VideoThumbnail
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                title="SHOW REEL"
                isShowreel={true}
                thumbnailIndex={1}
              />
            </div>
          </div>

{/* 3x3 Grid of 16:9 Videos */}
<div className="relative mb-20 z-30">
  <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
    FEATURED WORK
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
    {[
      "https://ia600904.us.archive.org/35/items/portfolio_202508/Outworking%20everyone%20isn%E2%80%99t%20that%20hard%20v1.mp4",
      "https://ia600904.us.archive.org/35/items/portfolio_202508/What%20is%20the%20most%20normal%20episode%20of%20Family%20Guy%20v3.mp4",
"https://ia600904.us.archive.org/35/items/portfolio_202508/Never%20running%20out%20of%20things%20to%20say%20is%20easy%2C%20actually%20isn%27t%C2%A0that%C2%A0hard%20v1.mp4",
      "https://ia600904.us.archive.org/35/items/portfolio_202508/sample1_V1.mp4",
      "https://ia600904.us.archive.org/35/items/portfolio_202508/The%20entire%20history%20of%20Thomas%20Shelby%20v2_1.mp4",
      "https://ia600904.us.archive.org/35/items/portfolio_202508/WOLF%27S%20LAIR%20WHAT%20AI%20FOUND%20IN%20THIS%20HIDDEN%20NAZI%20BUNKER%20FROM%20WORLD%20WAR%20II%20IS%20TERRIFYING.mp4",
      "https://ia800906.us.archive.org/16/items/flirting-with-women-isnt-that-hard-v-1/Flirting%20with%20women%20isn%27t%20that%20hard%20v1.mp4",
      "https://ia600904.us.archive.org/35/items/portfolio_202508/Young%20Actresses%20Who%20Tragically%20Passed%20Away.mp4",
      "https://ia601002.us.archive.org/33/items/sample-1-1/sample1%20%281%29.mp4",
    ].map((url, i) => (
      <VideoThumbnail
        key={i}
        src={url}
        title={`PROJECT ${String(i + 1).padStart(2, "0")}`}
        isShowreel={false}
        thumbnailIndex={i + 2} // Start from 2 since showreel uses 1
      />
    ))}
  </div>
</div>

{/* 6x4 Grid of 9:16 Videos */}
<div className="relative mb-20 z-30">
  <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
    SOCIAL CONTENT
  </h3>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
    {[
      "https://ia801704.us.archive.org/11/items/inkuuuu/inkuuuu.mp4",
      "https://ia600902.us.archive.org/33/items/part-1-shorts/Inklwell%20media%20reel%201%20v3.mp4",
   "https://ia601005.us.archive.org/0/items/profolio-m-gaya-2/portfolio%20m%20gaya.mp4",
      "https://ia801002.us.archive.org/18/items/shorts-2-part/Mj%20real_2.mp4",
   "https://ia601005.us.archive.org/0/items/profolio-m-gaya-2/profolio%20m%20gaya2.mp4",
      "https://ia801007.us.archive.org/2/items/inkwell-media-video-1-v-2/inkwell%20media%20video%201%20v2.mp4",
       "https://ia601005.us.archive.org/0/items/profolio-m-gaya-2/sample.mp4",
      "https://ia800902.us.archive.org/33/items/part-1-shorts/Inkwell%20media%20v2%20FINAL.mp4",
      "https://ia600902.us.archive.org/33/items/part-1-shorts/Inkwell%20Media%20ki%20videooo.mp4",
      "https://ia801002.us.archive.org/18/items/shorts-2-part/mj%20realtyyyyy2.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
    ].map((url, i) => (
      <VideoThumbnail
        key={i}
        src={url}
        title={`SOCIAL ${String(i + 1).padStart(2, "0")}`}
        aspectRatio="vertical"
        thumbnailIndex={i + 11} // Start from 11 (after the 9 featured work videos + showreel)
      />
    ))}
  </div> 
</div>


        </div>
      </div>


     {/* Contact Section */}
      {showContact && (
        <div
          id="contact-section"
          className={`fixed bottom-0 left-0 right-0 w-full overflow-hidden flex flex-col items-center justify-center z-30 bg-transparent opacity-0 animate-fade-in-delayed`}
          style={{
            height: window.innerWidth < 768 ? 'calc(var(--mobile-vh) * 100)' : '100vh',
            animationDelay: '0.2s', 
            animationFillMode: 'forwards',
            pointerEvents: 'auto'
          }}
        > 
         {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-bosenAlt text-white/80 text-center mb-0 tracking-wide">
            LET'S START A CONVERSATION
          </h2>

         {/* Subheading */}
<p className="text-white/30 text-1xl md:text-4xl lg:text-4xl ibm-font mb-8 text-center">
  Drop me a message, let's make something users will love.
</p>

<div className="space-y-10 text-center">
            {/* Email */}
            <div className="flex flex-col items-center gap-2">
              <Mail className="text-white/70 w-8 h-8" />
              <a
                href="https://mail.google.com/mail/?view=cm&to=broskiagency@gmail.com" target="_blank"
                className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                BROSKIAGENCY@GMAIL.COM
              </a>
              <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
  Let's create something that actually works.
</p>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col items-center gap-0">
              <Linkedin className="text-white/70 w-8 h-8" />
              <a
                href="https://www.linkedin.com/in/aamir-naqvi/"
                target="_blank"
                rel="noopener noreferrer"
  className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                LINKEDIN
              </a>
              <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
                See how UX meets business - connect with me.
              </p>
            </div>

            {/* Instagram */}
            <div className="flex flex-col items-center gap-2">
              <Instagram className="text-white/70 w-8 h-8" />
              <a
                href="https://www.instagram.com/aamir.naqvii/"
                target="_blank"
                rel="noopener noreferrer"
                  className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                INSTAGRAM
              </a>
           <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
                Tap in for visuals with purpose. - follow the flow.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
