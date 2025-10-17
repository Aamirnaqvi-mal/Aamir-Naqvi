import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    tl.set(containerRef.current, { opacity: 1 })
      .fromTo(dotRef.current,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 10,
          duration: 0.8,
          ease: 'power2.out'
        }
      )
      .fromTo(textRef.current,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        },
        '-=0.2'
      )
      .to({}, { duration: 0.4 })
      .to(dotRef.current,
        {
          scale: 100,
          duration: 1.2,
          ease: 'power2.inOut'
        }
      )
      .to(textRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in'
        },
        '-=1.0'
      )
      .to(containerRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut'
        },
        '-=0.3'
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black opacity-0"
      style={{ pointerEvents: 'none' }}
    >
      <div className="relative flex flex-col items-center justify-center">
        <div
          ref={dotRef}
          className="absolute w-8 h-8 bg-white rounded-full"
          style={{ transformOrigin: 'center center' }}
        />
        <div
          ref={textRef}
          className="relative z-10 opacity-0"
        >
          <h1 className="text-[70px] md:text-[80px] font-bosenAlt text-black tracking-wider">
            HELLOOO!
          </h1>
        </div>
      </div>
    </div>
  );
}
