import React, { useRef, useState, useEffect } from "react";
import { Maximize2, X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { thumbnailLoadQueue } from "../utils/thumbnailLoadQueue";
import { videoAutoplayQueue } from "../utils/videoAutoplayQueue";

const isMobile = () => window.innerWidth < 768;

interface ThumbnailImageProps {
  src: string;
  alt: string;
  isFullscreen: boolean;
  isPlaying: boolean;
  onLoad: () => void;
  onError: () => void;
}

function ThumbnailImage({ src, alt, isFullscreen, isPlaying, onLoad, onError }: ThumbnailImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = () => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setImageSrc(src);
          onLoad();
          resolve();
        };
        img.onerror = () => {
          onError();
          reject();
        };
        img.src = src;
      });
    };

    thumbnailLoadQueue.add(loadImage);
  }, [src, onLoad, onError]);

  if (!imageSrc) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`absolute inset-0 w-full h-full ${
        isFullscreen ? 'object-contain' : 'object-cover'
      } transition-opacity duration-300 ${
        isPlaying ? 'opacity-0' : 'opacity-100'
      }`}
    />
  );
}

interface VideoThumbnailProps {
  src: string;
  title: string;
  aspectRatio?: "video" | "vertical";
  className?: string;
  isShowreel?: boolean;
  thumbnailIndex?: number;
}

export function VideoThumbnail({
  src, 
  title,
  aspectRatio = "video",
  className = "",
  isShowreel = false,
  thumbnailIndex,
}: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const aspectClasses = aspectRatio === "vertical" ? "aspect-[9/16]" : "aspect-video";

  // Get thumbnail path
  const getThumbnailPath = () => {
    if (thumbnailIndex) {
      return `/thumbnails/${thumbnailIndex}.jpg`;
    }
    return null;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start loading immediately for non-showreel videos (staggered)
    if (!isShowreel && videoRef.current && !videoLoaded) {
      videoAutoplayQueue.addLoad(async () => {
        if (videoRef.current) {
          videoRef.current.src = src;
          videoRef.current.muted = true;
          videoRef.current.load();
          setVideoLoaded(true);
        }
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();

          // Auto-play when in view (staggered)
          if (!isShowreel && videoRef.current) {
            videoAutoplayQueue.add(async () => {
              if (videoRef.current) {
                setIsLoading(true);

                try {
                  await videoRef.current.play();
                } catch (error) {
                  console.error('Error auto-playing video:', error);
                  setIsLoading(false);
                }
              }
            });
          }
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [isShowreel, src, videoLoaded]);

  const handleClick = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!videoLoaded) {
        setIsLoading(true);
        // Only load the video source if it hasn't been loaded yet
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

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen();
    }
  };

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const playButtonSize = aspectRatio === 'vertical' 
    ? (isFullscreen ? 'w-20 h-20' : 'w-12 h-12')
    : (isFullscreen ? 'w-24 h-24' : 'w-16 h-16');

  const thumbnailPath = getThumbnailPath();

  return (
    <div
      ref={containerRef}
      className={`relative group cursor-pointer ${aspectClasses} rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] !rounded-none !aspect-auto w-screen h-screen bg-black' 
          : (isMobile() ? '' : 'hover:shadow-xl hover:scale-105')
      } ${className}`}
      onClick={handleClick}
    >
      {thumbnailPath && isInView && !hasStartedPlaying && (
        <ThumbnailImage
          src={thumbnailPath}
          alt={`${title} thumbnail`}
          isFullscreen={isFullscreen}
          isPlaying={false}
          onLoad={() => setThumbnailLoaded(true)}
          onError={() => {
            console.warn(`Thumbnail not found: ${thumbnailPath}`);
            setThumbnailLoaded(false);
          }}
        />
      )}

      {/* Video element - always render to allow preloading */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full ${
          isFullscreen ? 'object-contain' : 'object-cover'
        } transition-opacity duration-300 ${
          hasStartedPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        loop
        playsInline
        preload="auto"
        muted={isMuted}
        onLoadedData={() => {
          console.log('Video loaded data');
          setVideoLoaded(true);
        }}
        onPlay={() => {
          console.log('Video started playing');
          setIsPlaying(true);
          setHasStartedPlaying(true);
          setIsLoading(false);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadStart={() => {
          console.log('Video load started');
        }}
        onCanPlay={() => {
          console.log('Video can play');
        }}
        onTimeUpdate={() => {
          if (videoRef.current && !isDragging) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onError={() => {
          console.log('Video error occurred');
          setIsLoading(false);
          setIsPlaying(false);
          console.error('Video failed to load:', src);
        }}
      />

      {/* Fallback background when thumbnail is loading or not available */}
      {(!thumbnailLoaded && !thumbnailPath) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-white/40 text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-bosenAlt">LOADING</p>
          </div>
        </div>
      )}

      {/* Loading overlay with black background */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-bosenAlt">LOADING</p>
          </div>
        </div>
      )}

      {/* Play/Pause button overlay */}
      <div className={`absolute inset-0 flex items-center justify-center z-10`}>
        <div className={`bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${playButtonSize} ${
          isMobile() ? '' : 'group-hover:bg-white/30'
        } ${(isPlaying && !isLoading) || isLoading ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          {isPlaying ? (
            <Pause className={`text-white ${
              aspectRatio === 'vertical' 
                ? (isFullscreen ? 'w-8 h-8' : 'w-5 h-5')
                : (isFullscreen ? 'w-10 h-10' : 'w-6 h-6')
            }`} />
          ) : (
            <Play className={`text-white ml-1 ${
              aspectRatio === 'vertical' 
                ? (isFullscreen ? 'w-8 h-8' : 'w-5 h-5')
                : (isFullscreen ? 'w-10 h-10' : 'w-6 h-6')
            }`} />
          )}
        </div>
      </div>

      {/* Hover overlay */}
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
      )}
      
      {/* Fullscreen button */}
      <button
        onClick={toggleFullscreen}
        className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-20 ${
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

      {/* Progress bar */}
      {videoLoaded && (
        <div
          ref={progressBarRef}
          className={`absolute left-0 right-0 h-1 bg-white/20 cursor-pointer transition-all duration-300 z-20 group/progress ${
            isFullscreen ? 'bottom-20' : 'bottom-0 opacity-0 group-hover:opacity-100'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!videoRef.current || !progressBarRef.current) return;
            const rect = progressBarRef.current.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * videoRef.current.duration;
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsDragging(true);
          }}
          onMouseMove={(e) => {
            if (!isDragging || !videoRef.current || !progressBarRef.current) return;
            e.stopPropagation();
            const rect = progressBarRef.current.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            videoRef.current.currentTime = pos * videoRef.current.duration;
            setCurrentTime(videoRef.current.currentTime);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsDragging(false);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsDragging(false);
          }}
        >
          <div
            className="h-full bg-white group-hover/progress:bg-blue-500 transition-colors"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      )}

      {/* Mute/Unmute button */}
      {!isShowreel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
            }
          }}
          className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-20 ${
            isFullscreen
              ? 'top-8 right-24 w-12 h-12 opacity-100'
              : 'top-4 right-16 w-10 h-10 opacity-0 group-hover:opacity-100'
          }`}
        >
          {isMuted ? (
            <VolumeX size={isFullscreen ? 20 : 16} className="text-white" />
          ) : (
            <Volume2 size={isFullscreen ? 20 : 16} className="text-white" />
          )}
        </button>
      )}
      
      {/* Title Badge */}
      <div className={`absolute transition-all duration-300 z-20 ${
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