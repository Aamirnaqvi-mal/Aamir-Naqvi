import React, { useRef, useEffect, useState } from 'react';
import { Maximize2, X, Play } from 'lucide-react';

interface LazyVideoProps {
  src: string;
  title: string;
  isShowreel?: boolean;
  className?: string;
  aspectRatio?: 'video' | 'vertical';
}

export function LazyVideo({ src, title, isShowreel = false, className = '', aspectRatio = 'video' }: LazyVideoProps) {
  const [isInView, setIsInView] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { 
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(container);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleVideoClick = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!videoLoaded) {
        setIsLoading(true);
        // Load the video source
        videoRef.current.src = src;
        videoRef.current.load();
      }
      
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing video:', error);
        setIsLoading(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const aspectClasses = aspectRatio === 'vertical' ? 'aspect-[9/16]' : 'aspect-video';
  const playButtonSize = aspectRatio === 'vertical' 
    ? (isFullscreen ? 'w-20 h-20' : 'w-12 h-12')
    : (isFullscreen ? 'w-24 h-24' : 'w-16 h-16');

  return (
    <div 
      ref={containerRef}
      className={`relative group cursor-pointer ${aspectClasses} rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] !rounded-none !aspect-auto w-screen h-screen bg-black' 
          : 'hover:shadow-xl hover:scale-105'
      } ${className}`}
      onClick={handleVideoClick}
    >
    

      {/* Video element (only loads when clicked) */}
      {isInView && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            isFullscreen ? 'object-contain' : 'object-cover'
          } ${videoLoaded && isPlaying ? 'opacity-100' : 'opacity-0'}`}
          loop={isShowreel}
          playsInline
          preload="none"
          onLoadedData={() => {
            setVideoLoaded(true);
            setIsLoading(false);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            console.error('Video failed to load:', src);
          }}
        />
      )}
      
      {/* Play button overlay */}
      {(!isPlaying || !videoLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className={`bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${playButtonSize} ${
            isLoading ? 'animate-pulse' : (isMobile() ? '' : 'group-hover:bg-white/30')
          }`}>
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            ) : (
              <Play className={`text-white ml-1 ${
                aspectRatio === 'vertical' 
                  ? (isFullscreen ? 'w-8 h-8' : 'w-5 h-5')
                  : (isFullscreen ? 'w-10 h-10' : 'w-6 h-6')
              }`} />
            )}
          </div>
        </div>
      )}

      {/* Hover overlay */}
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
      )}
      
      {/* Fullscreen button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          isFullscreen 
            ? 'top-8 right-8 w-12 h-12 opacity-100' 
            : 'top-4 right-4 w-10 h-10 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isFullscreen ? (
          <X size={20} className="text-white" />
        ) : (
          <Maximize2 size={16} className="text-white" />
        )}
      </button>
      
      {/* Title Badge */}
      <div className={`absolute transition-all duration-300 ${
        isFullscreen 
          ? 'bottom-8 left-8 opacity-100' 
          : 'bottom-4 left-4 opacity-0 group-hover:opacity-100'
      }`}>
        <span className={`text-white font-bosenAlt bg-black/50 px-3 py-1 rounded-full ${
          isFullscreen ? 'text-lg' : 'text-sm'
        }`}>
          {title}
        </span>
      </div>
    </div>
  );
}

export default VideoThumbnail;