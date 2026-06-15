import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BGPattern } from "@/components/ui/bg-pattern";

export default function NotFound() {
  // Ensure dark mode is active (same pattern as Home)
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Grid backdrop with radial fade */}
      <BGPattern
        variant="grid"
        mask="fade-edges"
        size={32}
        fill="oklch(1 0 0 / 0.06)"
      />

      {/* Minimal home link at top */}
      <div className="relative z-10 px-6 pt-6">
        <Link
          to="/"
          className="font-pixel text-[0.55rem] text-primary/60 hover:text-primary transition-colors tracking-widest uppercase"
        >
          VH
        </Link>
      </div>

      {/* Main content — vertically and horizontally centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Glitchy scanline overlay on the 404 */}
        <div className="relative mb-8 select-none">
          {/* Shadow layers for depth */}
          <p
            className="font-pixel text-[4rem] sm:text-[6rem] md:text-[8rem] leading-none text-primary/10 absolute inset-0 translate-x-[4px] translate-y-[4px]"
            aria-hidden="true"
          >
            404
          </p>
          <p
            className="font-pixel text-[4rem] sm:text-[6rem] md:text-[8rem] leading-none text-primary/25 absolute inset-0 translate-x-[2px] translate-y-[2px]"
            aria-hidden="true"
          >
            404
          </p>
          <p className="font-pixel text-[4rem] sm:text-[6rem] md:text-[8rem] leading-none text-primary relative">
            404
          </p>
        </div>

        {/* Separator line */}
        <div className="w-48 sm:w-64 h-px bg-primary/30 mb-8" />

        {/* Primary message */}
        <h1 className="font-pixel text-xs sm:text-sm text-foreground tracking-widest uppercase mb-4 leading-relaxed">
          YOU WANDERED OFF THE MAP
        </h1>

        {/* Muted subtitle */}
        <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-sm mb-12 leading-relaxed">
          this page doesn&apos;t exist — or it got deleted in a commit.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Primary pixel button */}
          <Link
            to="/"
            className="
              inline-flex items-center gap-2
              font-pixel text-[0.6rem] tracking-wider uppercase
              bg-primary text-primary-foreground
              border-2 border-primary
              px-5 py-3
              shadow-[4px_4px_0px_0px_oklch(0.5_0.188_70)]
              hover:shadow-[2px_2px_0px_0px_oklch(0.5_0.188_70)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
              transition-all duration-75
              leading-relaxed
            "
          >
            <span className="font-sans text-sm leading-none">↳</span>
            <span>PRESS START</span>
            <span className="font-sans text-sm leading-none">→</span>
            <span>HOME</span>
          </Link>

          {/* Secondary pixel button */}
          <Link
            to="/blog"
            className="
              font-pixel text-[0.6rem] tracking-wider uppercase
              bg-transparent text-primary
              border-2 border-primary/50
              px-5 py-3
              shadow-[4px_4px_0px_0px_oklch(0.769_0.188_70_/_0.2)]
              hover:shadow-[2px_2px_0px_0px_oklch(0.769_0.188_70_/_0.2)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              hover:border-primary/80
              active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
              transition-all duration-75
              leading-relaxed
            "
          >
            READ THE BLOG
          </Link>
        </div>

        {/* Flavor text */}
        <p className="font-pixel text-[0.5rem] text-muted-foreground/40 mt-16 tracking-widest uppercase">
          GAME OVER — INSERT COIN
        </p>
      </div>
    </div>
  );
}
