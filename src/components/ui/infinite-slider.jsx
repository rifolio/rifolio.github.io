"use client";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee with seamless loop.
 * Uses pure CSS animation - no JS animation, no restarts, truly infinite.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.gap=16]
 * @param {number} [props.duration=25]
 * @param {'horizontal' | 'vertical'} [props.direction='horizontal']
 * @param {boolean} [props.reverse=false]
 * @param {string} [props.className]
 */
export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  direction = "horizontal",
  reverse = false,
  className,
}) {
  const isHorizontal = direction === "horizontal";
  const animationName = isHorizontal
    ? reverse
      ? "marquee-x-reverse"
      : "marquee-x"
    : "marquee-x";

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="flex w-max items-center"
        style={{
          gap: `${gap}px`,
          flexDirection: isHorizontal ? "row" : "column",
          animation: `${animationName} ${duration}s linear infinite`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
