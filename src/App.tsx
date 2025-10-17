import React, { useEffect, useRef, useState } from 'react';
import VideoThumbnail from "./components/VideoThumbnail";
import { Mail, Instagram, Linkedin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LazyVideo } from './components/LazyVideo';
import { useThrottledMouseTracking } from './hooks/useThrottledMouseTracking';
import { MobileBadgeCarousel } from './components/MobileBadgeCarousel';
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

// Mobile viewport height helper
const getMobileVH = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return window.innerHeight;
  }
  return null;
};
const mobileImages = [
  { src: '/mobile/mbname.png', delay: 2, isStatic: false, zIndex: 16 },
  { src: '/mobile/7.png', delay: 1.6, isStatic: false, zIndex: 15 },
  { src: '/mobile/mb5-6.png', delay: 1.8, isStatic: false, zIndex: 14 },
  { src: '/mobile/mb3-4.png', delay: 1.9, isStatic: false, zIndex: 13 },
  { src: '/mobile/mb1-2.png', delay: 2.1, isStatic: false, zIndex: 12 },
  { src: '/mobile/mbme.png', delay: 2.2, isStatic: false, zIndex: 11 },
  { src: '/mobile/mobile bg.png', isStatic: true, zIndex: 10 },
];

const desktopImages = [ 
  { src: '/pc/me.png', delay: 1.2, isStatic: true },
  { src: '/pc/me 2.png', delay: 1.4, isStatic: true },
  { src: '/pc/5-6.png', delay: 2.2},
  { src: '/pc/3-4.png', delay: 1.9 },
  { src: '/pc/1-2.png', delay: 1.0, isStatic: true}, 
  { src: '/pc/7.png', delay: 1.2, isStatic: true },
  { src: '/pc/name.png', delay: 2  }, 
 
];

 

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showContact, setShowContact] = React.useState(false);
  const [showArrow, setShowArrow] = React.useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const fixedBackgroundRef = useRef<HTMLDivElement>(null);
  const mobileImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const desktopImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [mobileVH, setMobileVH] = useState<number | null>(null);


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
    backgroundImage: `url('/pc/bg.png')`,
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
       "https://dl.dropboxusercontent.com/scl/fi/pwwqqr0udlh9lyqnyvmce/inkwell-carzyyyy2.mp4?rlkey=p0q4xhsk159o7q9mjpnymrqzu&e=1&st=rcxplfbp&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/6vjf62q3ny95rkm7z60qi/Inklwell-media-reel-1-v3.mp4?rlkey=187o3g2uhr6k681618apyo7j4&st=7ltz4jfg&dl=0",
   "https://dl.dropboxusercontent.com/scl/fi/7rpdvpqjj53i7nw4pvsqh/portfolio-m-gaya.mov?rlkey=5dyfxpjpxerzfdmw3g85rypev&st=vdbtrv04&dl=0",
  "https://dl.dropboxusercontent.com/scl/fi/ep6i1nh9psacxklap9wlf/6.mp4?rlkey=1fimr2idaogb09tqi1lhtzphr&st=a6q6p54b&dl=0",
   "https://dl.dropboxusercontent.com/scl/fi/89cdqhmea8bdvwdczzb9l/profolio-m-gaya2.mp4?rlkey=0ia4rj1swa5xvuqofmawyuvv4&st=jj9sbqkb&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/2vajlhlzupgin3iten16a/inkwell-media-video-1-v2.mp4?rlkey=w6m18qb4r1xq1qy1e8i4t3htn&st=t5kmul8t&dl=0",
       "https://dl.dropboxusercontent.com/scl/fi/mgx0x7kkywirp2csum6j0/sample.mp4?rlkey=5o58dsyynqe010dbemvgs7jal&st=spbeur7t&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/nod06cahi9gohmge9fezf/Inkwell-media-v2-FINAL.mp4?rlkey=v02x7t9sgvgnjpkwn3coqhs6d&st=4vfdjj2b&dl=0",
     "https://dl.dropboxusercontent.com/scl/fi/82quzwvxe2e6dtup6f7im/Mj-real_2.mp4?rlkey=79i125xw51r2dvt4e1frnlkmm&st=2ckhelc8&dl=0",
      "https://ia801002.us.archive.org/18/items/shorts-2-part/mj%20realtyyyyy2.mp4",
      "https://dl.dropboxusercontent.com/scl/fi/fazsi0lkj5k19jh6iic3j/Inkwell-Media-ki-videooo.mp4?rlkey=xnbz8x4d9mrgwqpqoi0nqq17h&st=0za1s9l9&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/vg857kk1uqm6jqi9awus9/mj-realtyyyyy2.mp4?rlkey=z4s649idherip1hrj4ywk3n8l&st=lwt5wlkw&dl=0"
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
        "https://dl.dropboxusercontent.com/scl/fi/qns6c92ug9h30rm2pq0ah/Outworking-everyone-isn-t-that-hard-v1.mp4?rlkey=10rwbqrmgm8g84baccdcq8zqy&e=2&st=tn3mr5x1&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/wxbrjspcn21e4v9jk3k4i/1.mp4?rlkey=ml7vvdqjbmpthuqjxm5d1dxkj&e=5&st=66ifnkek&dl=0",
"https://dl.dropboxusercontent.com/scl/fi/e5igp36newl4kg60t30jo/Never-running-out-of-things-to-say-is-easy-actually-isn-t-that-hard-v1.mp4?rlkey=ibhvo5biqkxxtxnq87yz8kgre&st=t9jg3jz3&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/5bpaj1ghqqb2l09jh8fey/Crime-video.mp4?rlkey=gs8errfj4jzsgdm8f8apg221z&st=ok4a15jk&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/7bwo8dc89eeqmlsv655rs/2.mp4?rlkey=2ub1x9xdq75n1hhs6tbwckq84&st=b790pngi&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/7u0swmj6jsmzrx6ag8d4h/3.mp4?rlkey=6brz1jkth5kc9nkbarvoydono&st=dufyi669&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/vqp4h38st2i2etbu07bb4/Flirting-with-women-isn-t-that-hard-v1.mp4?rlkey=ayt6iz2khevwoerrpqtvg95iu&st=28jyhqon&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/xhsb2bbkj5qrawzfrju5x/4.mp4?rlkey=w7z93e20momg95hb7iysm2l4k&st=z5w5em4q&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/25vbrjp5hcedekdiy0vae/5.mp4?rlkey=v5ycvzmqlab3h6iald9nbtt53&st=ftb6c421&dl=0",
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
