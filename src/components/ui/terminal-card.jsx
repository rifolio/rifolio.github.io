import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Modern macOS-style terminal panel with a typewriter animation.
 *
 * Lines type out sequentially (input/comment lines char-by-char, output
 * lines revealed at once like real command output), and the sequence ends
 * with a blinking `_` prompt cursor. Animation starts when the panel
 * scrolls into view and is disabled under prefers-reduced-motion.
 */

const CHAR_DELAY = 22; // ms per character while typing
const PAUSE = { input: 240, comment: 120, output: 70 }; // ms after a line completes

function lineClass(type) {
  if (type === "input") return "text-foreground";
  if (type === "comment") return "text-muted-foreground/60";
  return "text-muted-foreground";
}

function Prompt() {
  return (
    <span className="mr-2 select-none text-primary" aria-hidden="true">
      ❯
    </span>
  );
}

function Cursor() {
  return (
    <span className="typed-cursor typed-cursor--blink text-primary" aria-hidden="true">
      _
    </span>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function TerminalCard({ title = "zsh", lines = [], className }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [rendered, setRendered] = useState([]);
  const [done, setDone] = useState(false);

  // Start typing once the panel scrolls into view.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      setRendered(lines);
      setDone(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [lines]);

  // Drive the typewriter sequence.
  useEffect(() => {
    if (!started) return;

    let cancelled = false;
    let timer;
    const out = [];
    let li = 0;
    let ci = 0;

    setRendered([]);
    setDone(false);

    const tick = () => {
      if (cancelled) return;

      if (li >= lines.length) {
        setDone(true);
        return;
      }

      const line = lines[li];

      // Output (and blank) lines appear instantly, like real command output.
      if (line.type === "output" || line.text === "") {
        out.push({ ...line });
        setRendered([...out]);
        li += 1;
        ci = 0;
        timer = setTimeout(tick, PAUSE.output);
        return;
      }

      // Typed lines: reveal one character at a time.
      ci += 1;
      setRendered([...out, { ...line, text: line.text.slice(0, ci) }]);

      if (ci >= line.text.length) {
        out.push({ ...line });
        li += 1;
        ci = 0;
        timer = setTimeout(tick, PAUSE[line.type] ?? PAUSE.output);
      } else {
        timer = setTimeout(tick, CHAR_DELAY);
      }
    };

    timer = setTimeout(tick, 280);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [started, lines]);

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={ref}
        className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-white/5"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 font-mono text-xs tracking-tight text-muted-foreground">
            {title}
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-4 font-mono text-[13px] leading-relaxed">
          <div className="min-h-[18rem] space-y-1">
            {rendered.map((line, idx) => {
              const isLast = idx === rendered.length - 1;
              const showInlineCursor =
                !done && isLast && line.type !== "output" && line.text !== "";

              return (
                <p
                  key={`${idx}-${line.type}`}
                  className={cn("whitespace-pre-wrap", lineClass(line.type))}
                >
                  {line.type === "input" && <Prompt />}
                  {line.text || " "}
                  {showInlineCursor && <Cursor />}
                </p>
              );
            })}

            {done && (
              <p className="text-foreground">
                <Prompt />
                <Cursor />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
