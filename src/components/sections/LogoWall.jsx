import { useCallback, useEffect, useRef } from "react";
import { companies } from "@/data/companies";
import { LOGO_ASSETS } from "@/lib/logo-assets.js";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Pixel canvas — lightweight canvas-based shimmer that ripples outward from
 * the center on hover and fades when the pointer leaves. Adapted from the
 * pixel-logo-grid component (@smammar100/pixel-logo-grid).
 * ------------------------------------------------------------------------ */

function createPixel(ctx, canvas, x, y, color, baseSpeed, delay) {
  const rand = (min, max) => Math.random() * (max - min) + min;
  const p = {
    x, y, color, ctx,
    speed: rand(0.1, 0.9) * baseSpeed,
    size: 0,
    sizeStep: Math.random() * 0.4,
    minSize: 0.5,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: Math.random() * 4 + (canvas.width + canvas.height) * 0.01,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) { p.counter += p.counterStep; return; }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) p.shimmer(); else p.size += p.sizeStep;
      p.draw();
    },
    disappear() {
      p.isShimmer = false;
      p.counter = 0;
      if (p.size <= 0) { p.isIdle = true; return; }
      p.size -= 0.1;
      p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed; else p.size += p.speed;
    },
  };
  return p;
}

function PixelCanvas({ colors, gap = 5, speed = 30 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(0);
  const lastFrameRef = useRef(performance.now());
  const reducedMotionRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const effectiveSpeed = reducedMotionRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels = [];
    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy);
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }
    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode) => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;
    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel[mode]();
      if (pixels.every((p) => p.isIdle)) cancelAnimationFrame(animationRef.current);
    };
    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();
    const resizeObserver = new ResizeObserver(() => init());
    if (wrapRef.current) resizeObserver.observe(wrapRef.current);
    const card = wrapRef.current?.parentElement;
    const handleEnter = () => animate("appear");
    const handleLeave = () => animate("disappear");
    card?.addEventListener("mouseenter", handleEnter);
    card?.addEventListener("mouseleave", handleLeave);
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
      card?.removeEventListener("mouseenter", handleEnter);
      card?.removeEventListener("mouseleave", handleLeave);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Single company cell — real logo, white at rest, brand color on hover, with
 * the pixel shimmer rippling behind it.
 * ------------------------------------------------------------------------ */
function LogoCell({ company }) {
  const meta = LOGO_ASSETS[company.logo];
  const label = company.label ?? company.name;

  if (!meta) {
    return (
      <div className="relative flex flex-col items-center justify-center gap-2 border border-border/40 bg-card/50 p-4 min-h-[110px]">
        <span className="font-pixel text-[8px] text-muted-foreground text-center leading-relaxed">
          {label}
        </span>
      </div>
    );
  }

  const { img, colorOnHover, brandColor, pixelColors, wallHeight } = meta;

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-card cursor-pointer select-none isolate",
        "border border-border/40 transition-all duration-300",
        "hover:z-[2]",
        "[--brand:var(--brand-color)]",
        "hover:shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--brand)_30%,transparent),0_0_0_1px_color-mix(in_srgb,var(--brand)_45%,transparent)]"
      )}
      style={{ "--brand-color": brandColor }}
    >
      <PixelCanvas colors={pixelColors} gap={5} speed={30} />

      <img
        src={img}
        alt={label}
        loading="lazy"
        className={cn(
          "relative z-[1] w-auto object-contain transition-all duration-300",
          "group-hover:scale-[1.06]",
          "brightness-0 invert",
          colorOnHover && "group-hover:brightness-100 group-hover:invert-0"
        )}
        style={{ height: `${wallHeight}px`, maxHeight: `${wallHeight}px` }}
      />

      <span
        className={cn(
          "relative z-[1] font-pixel text-[6px] text-muted-foreground/40 transition-colors duration-300 text-center leading-relaxed px-2",
          "group-hover:text-[var(--brand-color)]/70"
        )}
      >
        {label}
      </span>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Animated logo wall — the grid of company logos with the pixel shimmer.
 * Rendered inside the Experience section as the "who I worked with" band.
 * ------------------------------------------------------------------------ */
export default function LogoWall({ className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-border/30 border border-border/30",
        className
      )}
      style={{ gridAutoRows: "110px" }}
    >
      {companies.map((company) => (
        <LogoCell key={company.name} company={company} />
      ))}
    </div>
  );
}
