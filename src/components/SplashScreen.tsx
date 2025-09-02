import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onLoadComplete: () => void;
}

export function SplashScreen({ onLoadComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('LOADING');

  useEffect(() => {
    const loadingTexts = ['LOADING', 'PREPARING', 'CRAFTING', 'BUILDING'];
    let textIndex = 0;
    
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[textIndex]);
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(() => onLoadComplete(), 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
  
   

      <div className="text-center z-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bosenAlt text-white tracking-tight mb-4">
            AAMIR NAQVI
          </h1>
          <p className="text-white/60 font-bosenAlt text-sm tracking-wide">
            VISUAL STORYTELLER
          </p>
        </div>

        <div className="mb-8">
          <div className="w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 font-bosenAlt text-xs mt-4 tracking-widest">
            {loadingText}... {Math.round(progress)}%
          </p>
        </div>

        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}