import React, { useEffect, useRef, useState } from 'react';
import VideoThumbnail from "./components/VideoThumbnail";
import { Mail, Instagram, Linkedin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplashScreen } from './components/SplashScreen';

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
const mobileImages = [
  { src: '/mobile/mbname.webp', delay: 2, isStatic: false, zIndex: 16 },
  { src: '/mobile/7.webp', delay: 1.6, isStatic: false, zIndex: 15 },
  { src: '/mobile/mb5-6.webp', delay: 1.8, isStatic: false, zIndex: 14 },
  { src: '/mobile/mb3-4.webp', delay: 1.9, isStatic: false, zIndex: 13 },
  { src: '/mobile/mb1-2.webp', delay: 2.1, isStatic: false, zIndex: 12 },
  { src: '/mobile/mbme.webp', delay: 2.2, isStatic: false, zIndex: 11 },
  { src: '/mobile/mobile bg.webp', isStatic: true, zIndex: 10 },
];

const desktopImages = [ 
  { src: '/pc/me.webp', delay: 2.2, isStatic: true },
  { src: '/pc/me 2.webp', delay: 2.4, isStatic: true },
  { src: '/pc/5-6.webp', delay: 3.2},
  { src: '/pc/3-4.webp', delay: 2.9 },
  { src: '/pc/1-2.webp', delay: 2.0, isStatic: true}, 
  { src: '/pc/7.webp', delay: 2.2, isStatic: true },
  { src: '/pc/name.webp', delay: 2.7  }, 
 
];

 

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const fixedBackgroundRef = useRef<HTMLDivElement>(null);
  const mobileImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const desktopImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setMobileVH();

    const updateMobileVH = () => {
      setMobileVH();
    };

    window.addEventListener('resize', updateMobileVH);
    window.addEventListener('orientationchange', updateMobileVH);
    window.addEventListener('scroll', setMobileVH);

    return () => {
      window.removeEventListener('resize', updateMobileVH);
      window.removeEventListener('orientationchange', updateMobileVH);
      window.removeEventListener('scroll', setMobileVH);
    };
  }, []);
  

useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  if (portfolioSectionRef.current) {
    const mobile = isMobile();
    // Use GSAP's class selector for desktop and mobile images
    const desktopElements = gsap.utils.toArray(".desktop-image");
    const mobileElements = gsap.utils.toArray(".mobile-image");

    // Hide desktop images when portfolio section covers the screen
    gsap.to(desktopElements, {
      opacity: 0,
      scrollTrigger: {
        trigger: portfolioSectionRef.current,
        start: "center top",
        end: "top top",
        scrub: 0,
      }
    });

    gsap.to(mobileElements, {
      opacity: 0,
      scrollTrigger: {
        trigger: portfolioSectionRef.current,
        start: "top top",
        end: "top center",
        scrub: 0,
      }
    });

    // Create a timeline for desktop images with scroll animation
    gsap.timeline({
      scrollTrigger: {
        trigger: portfolioSectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
        markers: false, // Set to true for debugging
      }
    }).to(desktopElements, { y: 200, ease: "power1.out" });

    // Section parallax (works on both mobile and desktop)
    gsap.to(portfolioSectionRef.current, {
      y: mobile ? -900 : -900,
      scrollTrigger: {
        trigger: portfolioSectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      }
    });

    // Hide arrow when portfolio section covers the screen
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: portfolioSectionRef.current,
          start: "top bottom",
          end: "top center",
          scrub: 0,
          markers: false,
          onEnter: () => setShowArrow(false),
          onLeaveBack: () => setShowArrow(true),
        }
      });
    }

    // Show/hide contact section
    ScrollTrigger.create({
      trigger: portfolioSectionRef.current,
      start: "center bottom",
      fastScrollEnd: true,
      onEnter: () => setShowContact(true),
      onLeaveBack: () => setShowContact(false),
    });
  }

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);



  return (
    <div className="relative">
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}


<div
  ref={fixedBackgroundRef}
  className="fixed inset-0 bg-center bg-no-repeat z-[0] 
             bg-cover 
             sm:bg-cover 
             max-sm:bg-cover max-sm:bg-center"
  style={{
    backgroundImage: `url('/pc/bg.webp')`,
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
        className="relative w-full overflow-hidden bg-transparent"
        style={{
          minHeight: window.innerWidth < 768 ? 'calc(var(--mobile-vh) * 100)' : '100vh',
          height: window.innerWidth < 768 ? 'calc(var(--mobile-vh) * 100)' : '100vh'
        }}
      >
        {/* Mobile Images - Stacked full screen */}
        <div className="md:hidden">
          {mobileImages.map((img, index) => (
            <div
              key={index}
              ref={(el) => (mobileImagesRef.current[index] = el)}
              className="mobile-image hero-image-layer fixed inset-0 w-full h-full"
              style={{
                zIndex: img.zIndex,
                animation: img.isStatic ? 'none' : `slideUp 1s ease-out ${img.delay}s forwards`,
                transform: img.isStatic ? 'translateY(0)' : 'translateY(100vh)',
              }}
            >
              <img
                src={img.src}
                alt={`Mobile layer ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Desktop Images - Stacked full screen */}
        <div className="hidden md:block">
          {desktopImages.map((img, index) => (
            <div
              key={index}
              ref={(el) => (desktopImagesRef.current[index] = el)}
              className="desktop-image hero-image-layer fixed inset-0 w-full h-full overflow-hidden"
              style={{
                zIndex: img.isStatic ? 0 : index + 10,
                animation: img.isStatic ? 'none' : `slideUp 1s ease-out ${img.delay}s forwards`,
                transform: img.isStatic ? 'translateY(0)' : 'translateY(100vh)',
              }}
            >
              <img
                src={img.src}
                alt={`Desktop layer ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bouncing Arrow */}
      {showArrow && (
        <div
          ref={arrowRef}
          className="fixed left-1/2 -translate-x-1/2 z-[90] bounce-arrow"
          style={{
            bottom: window.innerWidth < 768 ? '10vh' : '5vh',
          }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
              borderRadius: '50%',
              backdropFilter: 'blur(10px)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Portfolio Section */}
      <div
        ref={portfolioSectionRef}
        className="relative w-full bg-[#f0f0f0] z-[100] rounded-t-[3rem] rounded-b-[3rem] opacity-100 portfolio-edge-shine"
        style={{
          minHeight: window.innerWidth < 768 ? 'calc(var(--mobile-vh) * 100)' : '100vh',
          zIndex: 9999,
          boxShadow: `
            0 -20px 60px -15px rgba(255, 255, 255, 0.8),
            0 -40px 100px -20px rgba(255, 255, 255, 0.5),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
            0 20px 60px -15px rgba(0, 0, 0, 0.3),
            0 40px 100px -20px rgba(0, 0, 0, 0.2)
          `
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


{/* 6x4 Grid of 9:16 Videos */}
<div className="relative mb-20 z-30">
  <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
    SOCIAL CONTENT
  </h3>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
    {[
 "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/1.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/2.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/3.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/4.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/5.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/6.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/7.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/8.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/9.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/11.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/12.webm"

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
{/* 3x3 Grid of 16:9 Videos */}
<div className="relative mb-20 z-30">
  <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
    FEATURED WORK
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
    {[
        "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/1.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/2.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/3.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/4.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/5.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/6.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/7.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/8.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/9.webm"
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
          <h2 className="text-5xl md:text-7xl font-bosenAlt text-[#181f22] text-center mb-0 tracking-wide">
            LET'S START A CONVERSATION
          </h2>

         {/* Subheading */}
<p className="text-[#181f22] text-1xl md:text-4xl lg:text-4xl ibm-font mb-8 text-center">
  Drop me a message, let's make something users will love.
</p>

<div className="space-y-10 text-center">
            {/* Email */}
            <div className="flex flex-col items-center gap-2">
              <Mail className="text-[#181f22] w-8 h-8" />
              <a
                href="https://mail.google.com/mail/?view=cm&to=Aamirnaqvi03@gmail.com" target="_blank"
                className="text-[#181f22] font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                AAMIRNAQVI03@GMAIL.COM
              </a>
              <p className="text-[#181f22] text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
  Let's create something that actually works.
</p>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col items-center gap-0">
              <Linkedin className="text-[#181f22] w-8 h-8" />
              <a
                href="https://www.linkedin.com/in/aamir-naqvi/"
                target="_blank"
                rel="noopener noreferrer"
  className="text-[#181f22] font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                LINKEDIN
              </a>
              <p className="text-[#181f22] text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
          Explore my work and journey
              </p>
            </div>

            {/* Instagram */}
            <div className="flex flex-col items-center gap-2">
              <Instagram className="text-[#181f22] w-8 h-8" />
              <a
                href="https://www.instagram.com/aamir.naqvii/"
                target="_blank"
                rel="noopener noreferrer"
                  className="text-[#181f22] font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                INSTAGRAM
              </a>
           <p className="text-[#181f22] text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
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
