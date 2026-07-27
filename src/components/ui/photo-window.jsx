import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { unlockAchievement } from "@/lib/achievements.js";

const PIXEL_GRID = 28; // canvas resolution — lower = chunkier pixels

/**
 * Portrait framed as a tiny macOS window. On hover/focus the photo
 * crossfades to an 8-bit pixelated version rendered on a canvas.
 *
 * Easter egg: the traffic lights work. Red kills the process, yellow
 * minimizes to the title bar, green zooms the window.
 */
export default function PhotoWindow({ src, alt, title = "vladyslav.jpg", className }) {
  const canvasRef = useRef(null);
  const [winState, setWinState] = useState("open"); // open | min | closed
  const [maxed, setMaxed] = useState(false);

  useEffect(() => {
    if (winState !== "open") return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = PIXEL_GRID;
      canvas.height = PIXEL_GRID;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      // cover-crop to square, same as object-cover on the <img>
      const s = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - s) / 2,
        (img.height - s) / 2,
        s,
        s,
        0,
        0,
        PIXEL_GRID,
        PIXEL_GRID
      );
    };
  }, [src, winState]);

  return (
    <div
      tabIndex={0}
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-white/5",
        "rotate-2 transition-all duration-300 hover:rotate-0 focus-visible:rotate-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "motion-reduce:rotate-0 motion-reduce:transition-none",
        maxed ? "w-64 sm:w-80 lg:w-96" : "w-52 sm:w-64 lg:w-72",
        className
      )}
    >
      {/* Title bar — matches TerminalCard chrome */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-white/[0.02] px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Close photo"
            onClick={() => {
              setWinState("closed");
              unlockAchievement("kill");
            }}
            className="size-2.5 rounded-full bg-[#ff5f57] cursor-pointer hover:brightness-125 transition-[filter]"
          />
          <button
            type="button"
            aria-label="Minimize photo"
            onClick={() => setWinState((s) => (s === "min" ? "open" : "min"))}
            className="size-2.5 rounded-full bg-[#febc2e] cursor-pointer hover:brightness-125 transition-[filter]"
          />
          <button
            type="button"
            aria-label="Zoom photo"
            onClick={() => {
              setMaxed((m) => !m);
              setWinState("open");
            }}
            className="size-2.5 rounded-full bg-[#28c840] cursor-pointer hover:brightness-125 transition-[filter]"
          />
        </div>
        <span className="ml-1 font-mono text-[11px] tracking-tight text-muted-foreground">
          {winState === "closed" ? "zsh" : title}
        </span>
      </div>

      {winState === "open" && (
        <>
          {/* Photo — sharp at rest, 8-bit on hover/focus */}
          <div className="relative aspect-square w-full">
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="pixelated pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between border-t border-border/60 bg-white/[0.02] px-3 py-1.5 font-mono text-[10px] text-muted-foreground/70">
            <span>512 × 512 · RGB</span>
            <span className="text-primary/70 hidden sm:inline">hover → 8-bit</span>
          </div>
        </>
      )}

      {winState === "closed" && (
        <div className="px-4 py-6 font-mono text-[12px] leading-relaxed">
          <p className="text-muted-foreground">
            zsh: killed <span className="text-foreground">{title}</span>
          </p>
          <button
            type="button"
            onClick={() => setWinState("open")}
            className="mt-2 cursor-pointer text-primary hover:underline"
          >
            <span className="mr-1.5" aria-hidden="true">❯</span>
            open {title}
          </button>
        </div>
      )}
    </div>
  );
}
