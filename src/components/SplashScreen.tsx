import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const tl = gsap.timeline({
      onComplete: () => {
        clearInterval(progressInterval);
        onComplete();
      }
    });

    tl.set(containerRef.current, { opacity: 1 })
      .fromTo(textRef.current,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }
      )
      .to({}, { duration: 2.5 })
      .to(textRef.current,
        {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.in'
        }
      )
      .to(containerRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut'
        },
        '-=0.2'
      );

    return () => {
      tl.kill();
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black opacity-0"
      style={{ pointerEvents: 'none' }}
    >
      <div className="relative flex flex-col items-center justify-center text-center px-6 w-full max-w-2xl">
        <div
          ref={textRef}
          className="opacity-0 w-full"
        >
          <h1 className="text-3xl md:text-5xl font-bosenAlt text-white tracking-wide mb-8">
            WAIT, LET ME SET THINGS FOR YOU
          </h1>

          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-white/60 text-lg md:text-xl font-bosenAlt mt-4">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
