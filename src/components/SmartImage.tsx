import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  priority?: boolean;
}

/**
 * Resilient, zero-flicker editorial image renderer.
 * - Detects already-cached browser images on mount to avoid opacity flash
 * - Resets load/error state cleanly whenever `src` changes
 * - Uses async decoding + explicit fetchPriority to prevent buffering jank
 * - Falls back to a styled branded gradient plate if loading ever fails
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full',
  fallbackTitle = 'EMPLOYABILITY UNIVERSE With Kapil',
  fallbackSubtitle = 'Visual Learning Asset',
  priority = false,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative overflow-hidden bg-gradient-to-br from-[#0B1733] via-[#132859] to-[#091229] text-white flex flex-col items-center justify-center p-5 text-center ${containerClassName}`}
      >
        <Sparkles className="w-7 h-7 text-amber-400 mb-2 shrink-0" />
        <div className="font-display text-sm font-bold leading-snug">
          {fallbackTitle}
        </div>
        <div className="font-mono text-[11px] text-slate-300 mt-1">
          {fallbackSubtitle}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#081229] ${containerClassName}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-950/70"
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`block transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};
