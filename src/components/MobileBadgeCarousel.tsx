import React, { useState, useEffect } from 'react';

interface Badge {
  image: string;
  delay: number;
  shineDelay: number;
  shineDuration: number;
}

const badges: Badge[] = [
  { image: "/badges/1.png", delay: 0, shineDelay: 1.3, shineDuration: 14 },
  { image: "/badges/2.png", delay: 0, shineDelay: 0.2, shineDuration: 12 },
  { image: "/badges/3.png", delay: 0, shineDelay: 1.7, shineDuration: 15 },
  { image: "/badges/4.png", delay: 0, shineDelay: 0.1, shineDuration: 13 },
  { image: "/badges/5.png", delay: 0, shineDelay: 1.9, shineDuration: 16 },
  { image: "/badges/6.png", delay: 0, shineDelay: 0.8, shineDuration: 12 }, 
  { image: "/badges/7.png", delay: 0, shineDelay: 1.5, shineDuration: 14 },
  { image: "/badges/8.png", delay: 0, shineDelay: 0.2, shineDuration: 13 },
  { image: "/badges/9.png", delay: 0, shineDelay: 1.7, shineDuration: 15 },
  { image: "/badges/10.png", delay: 0, shineDelay: 0.1, shineDuration: 16 },
];

export function MobileBadgeCarousel() {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, change badge and fade in
      setTimeout(() => {
        setCurrentBadgeIndex((prev) => (prev + 1) % badges.length);
        setIsVisible(true);
      }, 500); // 300ms fade out duration
      
    }, 4000); // 3 seconds total cycle time 

    return () => clearInterval(interval);
  }, []);

  const currentBadge = badges[currentBadgeIndex];

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
      <div className="relative w-300 h-300">
        {/* Base Badge PNG */}
        <img
          src={currentBadge.image}
          alt="testimonial badge"
          className={`w-full h-auto block relative z-10 transition-opacity duration-300 ${
            isVisible ? 'opacity-60' : 'opacity-0'
          }`}
        />

        {/* Shine Overlay */}
        <div
          className={`absolute inset-0 z-20 pointer-events-none animate-shine-diagonal transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            WebkitMaskImage: `url(${currentBadge.image})`,
            maskImage: `url(${currentBadge.image})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            animationDelay: `${currentBadge.shineDelay}s`,
            animationDuration: `${currentBadge.shineDuration}s`,
            '--shine-delay': `${currentBadge.shineDelay}s`,
            '--shine-duration': `${currentBadge.shineDuration}s`,
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}