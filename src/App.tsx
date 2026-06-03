import React, { useEffect, useRef, useState } from 'react';
import VideoThumbnail from "./components/VideoThumbnail";
import { Mail, Instagram, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplashScreen } from './components/SplashScreen';

gsap.registerPlugin(ScrollTrigger);

function setMobileVH() {
  if (window.innerWidth < 768) {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--mobile-vh', `${vh}px`);
  }
}

const isMobile = () => window.innerWidth < 768;

const mobileImages = [
  { src: '/mobile/mbname.webp',    delay: 2,   isStatic: false, zIndex: 16 },
  { src: '/mobile/7.webp',         delay: 1.6, isStatic: false, zIndex: 15 },
  { src: '/mobile/mb5-6.webp',     delay: 1.8, isStatic: false, zIndex: 14 },
  { src: '/mobile/mb3-4.webp',     delay: 1.9, isStatic: false, zIndex: 13 },
  { src: '/mobile/mb1-2.webp',     delay: 2.1, isStatic: false, zIndex: 12 },
  { src: '/mobile/mbme.webp',      delay: 2.2, isStatic: false, zIndex: 11 },
  { src: '/mobile/mobile bg.webp', isStatic: true,              zIndex: 10 },
];

const desktopImages = [
  { src: '/pc/me.webp',    delay: 2.2, isStatic: true,  noHover: true },
  { src: '/pc/me 2.webp',  delay: 2.4, isStatic: true,  noHover: true },
  { src: '/pc/5-6.webp',   delay: 3.2, noHover: true },
  { src: '/pc/3-4.webp',   delay: 2.9, noHover: true },
  { src: '/pc/1-2.webp',   delay: 2.0, isStatic: true,  noHover: true },
  { src: '/pc/7.webp',     delay: 2.2, isStatic: true,  noHover: true },
  { src: '/pc/name.webp',  delay: 2.7, isSmall: true },
];

const socialVideos = Array.from({ length: 12 }, (_, i) =>
  `https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/${i + 1}.webm`
);

const featuredVideos = [
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/1.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/2.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/3.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/4.mp4",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/5.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/6.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/7.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/8.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/9.webm",
];

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '50+', label: 'Projects Delivered' },
  { value: '12', label: 'Social Formats' },
  { value: '∞', label: 'Creative Ideas' },
];

const skills = ['Motion Design', 'Brand Films', 'Social Content', 'Visual Identity', 'Art Direction', 'Storytelling'];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const mobileImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const desktopImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileVH();
    const update = () => setMobileVH();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.addEventListener('scroll', setMobileVH);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.removeEventListener('scroll', setMobileVH);
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (!portfolioSectionRef.current) return;

    const mobile = isMobile();
    const desktopEls = gsap.utils.toArray(".desktop-image");
    const mobileEls  = gsap.utils.toArray(".mobile-image");

    gsap.to(desktopEls, {
      opacity: 0,
      scrollTrigger: { trigger: portfolioSectionRef.current, start: "center top", end: "top top", scrub: 0 }
    });
    gsap.to(mobileEls, {
      opacity: 0,
      scrollTrigger: { trigger: portfolioSectionRef.current, start: "top top", end: "top center", scrub: 0 }
    });
    gsap.timeline({
      scrollTrigger: { trigger: portfolioSectionRef.current, start: "top bottom", end: "bottom top", scrub: 2 }
    }).to(desktopEls, { y: 200, ease: "power1.out" });

    gsap.to(portfolioSectionRef.current, {
      y: mobile ? -900 : -900,
      scrollTrigger: { trigger: portfolioSectionRef.current, start: "top bottom", end: "bottom top", scrub: 2 }
    });

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: portfolioSectionRef.current, start: "top bottom", end: "top center", scrub: 0,
          onEnter: () => setShowArrow(false), onLeaveBack: () => setShowArrow(true),
        }
      });
    }

    ScrollTrigger.create({
      trigger: portfolioSectionRef.current, start: "center bottom", fastScrollEnd: true,
      onEnter: () => setShowContact(true), onLeaveBack: () => setShowContact(false),
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const vh = (n: number) => window.innerWidth < 768 ? `calc(var(--mobile-vh) * ${n})` : `${n}vh`;

  return (
    <div className="relative">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Fixed background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/pc/bg.webp')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.08)' }} />
      </div>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden bg-transparent"
        style={{ minHeight: vh(100), height: vh(100) }}
      >
        {/* Mobile layers */}
        <div className="md:hidden">
          {mobileImages.map((img, index) => (
            <div
              key={index}
              ref={el => (mobileImagesRef.current[index] = el)}
              className="mobile-image hero-image-layer fixed overflow-hidden"
              style={{
                ...(img.isStatic
                  ? { inset: 0, width: '100%', height: '100%', zIndex: img.zIndex }
                  : {
                      inset: 0, width: '100%', height: '100%',
                      zIndex: img.zIndex,
                      animation: `slideUp 1s ease-out ${img.delay}s forwards`,
                      transform: 'translateY(100vh)',
                    })
              }}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Desktop layers */}
        <div className="hidden md:block">
          {desktopImages.map((img, index) => (
            <div
              key={index}
              ref={el => (desktopImagesRef.current[index] = el)}
              className={`desktop-image hero-image-layer fixed overflow-hidden ${img.noHover ? 'pointer-events-none' : ''}`}
              style={{
                ...((img as any).isSmall
                  ? {
                      top: -10, left: -30, width: '38%', height: 'auto', zIndex: 50,
                      animation: `slideUp 1s ease-out ${img.delay}s forwards`,
                      transform: 'translateY(100vh)',
                    }
                  : {
                      inset: 0, width: '100%', height: '100%',
                      zIndex: img.isStatic ? 0 : index + 10,
                      animation: img.isStatic ? 'none' : `slideUp 1s ease-out ${img.delay}s forwards`,
                      transform: img.isStatic ? 'translateY(0)' : 'translateY(100vh)',
                    })
              }}
            >
              <img src={img.src} alt="" className={(img as any).isSmall ? 'w-full h-auto' : 'w-full h-full object-cover'} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Arrow */}
      {showArrow && (
        <div
          ref={arrowRef}
          className="fixed left-1/2 -translate-x-1/2 z-[90] bounce-arrow"
          style={{ bottom: isMobile() ? '8vh' : '5vh' }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 72, height: 72,
              background: 'rgba(201,168,76,0.12)',
              borderRadius: '50%',
              border: '1px solid rgba(201,168,76,0.35)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Portfolio Panel */}
      <div
        ref={portfolioSectionRef}
        className="relative w-full portfolio-panel z-[9999]"
        style={{
          minHeight: vh(100),
          boxShadow: `0 -30px 80px -10px rgba(255,255,255,0.12), 0 -60px 120px -20px rgba(201,168,76,0.06), inset 0 1px 0 rgba(255,255,255,0.6), 0 30px 80px -10px rgba(0,0,0,0.35)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">

          {/* Header */}
          <div className="text-center mb-20">
            <p className="syne text-xs tracking-[0.35em] uppercase mb-4" style={{ color: 'var(--warm-gray)' }}>
              Selected Work
            </p>
            <h2 className="syne text-black/90 mb-5 leading-none"
                style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.04em' }}>
              PORTFOLIO
            </h2>
            <p className="ibm-font text-black/55 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Visual stories crafted to move people — from scroll-stopping reels to brand-defining films.
            </p>

            {/* Skill tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {skills.map(s => (
                <span key={s} className="tag-pill">{s}</span>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl"
                   style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="syne font-bold text-black/90 stat-number"
                     style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', animationDelay: `${i * 0.1}s` }}>
                  {s.value}
                </div>
                <div className="ibm-font text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--warm-gray)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Showreel */}
          <div className="mb-20">
            <div className="section-rule">
              <span className="syne text-xs font-semibold tracking-[0.25em] uppercase text-black/40 flex items-center gap-2">
                <span className="gold-dot" />
                SHOW REEL
              </span>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden"
                 style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <VideoThumbnail
                src="https://i.ibb.co/fd1NS1n2/New-Project.webp"
                title="SHOW REEL 2026"
                isShowreel={true}
                thumbnailIndex={1}
              />
            </div>
          </div>

          {/* Social Content */}
          <div className="mb-20">
            <div className="section-rule">
              <span className="syne text-xs font-semibold tracking-[0.25em] uppercase text-black/40 flex items-center gap-2">
                <span className="gold-dot" />
                SOCIAL CONTENT
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {socialVideos.map((url, i) => (
                <VideoThumbnail
                  key={i}
                  src={url}
                  title={`REEL ${String(i + 1).padStart(2, '0')}`}
                  aspectRatio="vertical"
                  thumbnailIndex={i + 11}
                />
              ))}
            </div>
          </div>

          {/* Featured Work */}
          <div className="mb-20">
            <div className="section-rule">
              <span className="syne text-xs font-semibold tracking-[0.25em] uppercase text-black/40 flex items-center gap-2">
                <span className="gold-dot" />
                FEATURED WORK
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredVideos.map((url, i) => (
                <VideoThumbnail
                  key={i}
                  src={url}
                  title={`PROJECT ${String(i + 1).padStart(2, '0')}`}
                  isShowreel={false}
                  thumbnailIndex={i + 2}
                />
              ))}
            </div>
          </div>

          {/* Bottom disclaimer */}
          <p className="text-center ibm-font text-xs mt-12 pb-4" style={{ color: 'var(--warm-gray)' }}>
            All content is original work. Brands and clients belong to their respective owners.
          </p>
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
          <h2 className="text-5xl md:text-7xl font-semibold text-[#181f22] text-center mb-0 tracking-wide">
            LET'S START A CONVERSATION
          </h2>

         {/* Subheading */}
<p className="text-[#181f22] text-1xl md:text-4xl lg:text-4xl ibm-font mb-8 text-center">
  Drop me a message, let's cook something.
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

            {/* Whatsapp */}
            <div className="flex flex-col items-center gap-0">
              <svg className="text-[#181f22] w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <a
                href="https://wa.link/uhhv7i"
                target="_blank"
                rel="noopener noreferrer"
  className="text-[#181f22] font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                WHATSAPP
              </a>
              <p className="text-[#181f22] text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
          Lets talk more further
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
