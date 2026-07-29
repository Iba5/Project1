"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image component with a built-in blur-up skeleton placeholder.
 * Shows an animated shimmer/pulse while the image loads, then fades in.
 */
type SmartImageProps = ImageProps & {
  /** Optional low-res blur placeholder URL (data: URL). If omitted, uses shimmer. */
  blurDataURL?: string;
};

export function SmartImage({ className, alt, onLoad, blurDataURL, ...props }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && !blurDataURL && (
        <div
          className="absolute inset-0 animate-shimmer bg-gradient-to-br from-secondary via-muted to-secondary"
          aria-hidden
        />
      )}
      <Image
        {...props}
        alt={alt}
        className={cn(
          "transition-all duration-700",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
          className,
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
      />
    </>
  );
}
