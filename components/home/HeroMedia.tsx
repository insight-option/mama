"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const videos = (process.env.NEXT_PUBLIC_HERO_VIDEOS ?? "")
  .split(",")
  .filter(Boolean)
  .map((file) => ({
    src: `/videos/${file}`,
    type: file.endsWith(".webm") ? "video/webm" : "video/mp4",
  }));

/**
 * Hero background: the hero video when one is uploaded to public/videos,
 * otherwise the poster photo with a slow zoom. The poster is always
 * rendered first, so the hero is never empty while the video loads.
 */
export function HeroMedia({ poster, alt }: { poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasVideo = videos.length > 0 && !failed;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Only play while visible, and never for reduced-motion users.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce.matches) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [hasVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-night">
      <Image
        src={poster}
        alt={hasVideo ? "" : alt}
        aria-hidden={hasVideo || undefined}
        fill
        priority
        sizes="100vw"
        className={`object-cover ${hasVideo ? "" : "animate-slow-zoom"} transition-opacity duration-700 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />
      {hasVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          {videos.map((v) => (
            <source key={v.src} src={v.src} type={v.type} />
          ))}
        </video>
      )}
    </div>
  );
}
