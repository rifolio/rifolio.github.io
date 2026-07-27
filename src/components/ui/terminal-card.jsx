import { useEffect, useRef, useState } from "react";

import { unlockAchievement } from "@/lib/achievements.js";
import { cn } from "@/lib/utils";

/**
 * Modern macOS-style terminal panel with a typewriter animation.
 *
 * Lines type out sequentially (input/comment lines char-by-char, output
 * lines revealed at once like real command output), and the sequence ends
 * with a blinking `_` prompt cursor. Animation starts when the panel
 * scrolls into view and is disabled under prefers-reduced-motion.
 *
 * With `interactive`, the final prompt becomes a real input once the
 * animation finishes and visitors can run a few toy commands.
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

const out = (...texts) => texts.map((text) => ({ type: "output", text }));

const COMMANDS = {
  help: {
    desc: "list available commands",
    run: () =>
      Object.entries(COMMANDS).map(([name, cmd]) => ({
        type: "output",
        text: `${name.padEnd(14)}${cmd.desc}`,
      })),
  },
  ls: { desc: "list what I work with", run: (dirs) => dirs },
  whoami: {
    desc: "who is typing this",
    run: () =>
      out(
        "Vladyslav Horbatenko — AI engineer & co-founder, MSc @ DTU,",
        "shipping LLM systems from Copenhagen. Runs on coffee and retries."
      ),
  },
  "cat cv.pdf": {
    desc: "open my CV",
    run: () => {
      window.open(import.meta.env.BASE_URL + "CV.pdf", "_blank");
      return out("opening cv.pdf…");
    },
  },
  "sudo hire-me": {
    desc: "escalate privileges",
    run: () => {
      window.location.href = "mailto:vladyslav.horbatenko.work@gmail.com";
      return out("permission granted. opening mail…");
    },
  },
  konami: {
    desc: "nothing to see here",
    run: () => out("try it on the keyboard: ↑ ↑ ↓ ↓ ← → ← → B A"),
  },
  clear: { desc: "clear the screen", run: () => null },
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function TerminalCard({
  title = "zsh",
  lines = [],
  interactive = false,
  className,
}) {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [rendered, setRendered] = useState([]);
  const [done, setDone] = useState(false);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [hinted, setHinted] = useState(false);

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

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rendered]);

  function submit() {
    const raw = value.trim().replace(/\s+/g, " ");
    setValue("");
    setHinted(true);
    if (!raw) return;

    const key = raw.toLowerCase();
    const command = COMMANDS[key];
    const echo = { type: "input", text: raw };

    if (!command) {
      setRendered((prev) => [
        ...prev,
        echo,
        ...out(`zsh: command not found: ${key.split(" ")[0]}`),
        { type: "comment", text: "# try 'help'" },
      ]);
      return;
    }

    unlockAchievement("terminal");

    // ponytail: `ls` echoes whatever dirs the intro already listed, so the
    // stack lives in one place (the `lines` prop).
    const result = command.run(
      lines.filter((line) => line.type === "output" && line.text.endsWith("/"))
    );
    setRendered(result ? (prev) => [...prev, echo, ...result] : []);
  }

  const editable = interactive && done;

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={ref}
        onClick={editable ? () => inputRef.current?.focus() : undefined}
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-2xl ring-1",
          focused
            ? "border-primary/40 ring-primary/20"
            : "border-border ring-white/5",
          editable && "cursor-text"
        )}
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
          <div className="relative">
            {/* Ghost: reserves the final height so the card never resizes
                while lines type in. Mirrors the full content + prompt line. */}
            <div className="invisible space-y-1" aria-hidden="true">
              {lines.map((line, idx) => (
                <p
                  key={`ghost-${idx}`}
                  className={cn("whitespace-pre-wrap", lineClass(line.type))}
                >
                  {line.type === "input" && <Prompt />}
                  {line.text || " "}
                </p>
              ))}
              {interactive && <p>{"# type 'help'"}</p>}
              <p className="text-foreground">
                <Prompt />_
              </p>
            </div>

            {/* Animated content, overlaid on top of the reserved space —
                scrolls once typed commands outgrow it. */}
            <div ref={scrollRef} className="absolute inset-0 space-y-1 overflow-y-auto">
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

            {done && !interactive && (
              <p className="text-foreground">
                <Prompt />
                <Cursor />
              </p>
            )}

            {editable && (
              <>
                {!hinted && (
                  <p className={lineClass("comment")}>{"# type 'help'"}</p>
                )}
                <p className="flex items-center text-foreground">
                  <Prompt />
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label="terminal input"
                    autoComplete="off"
                    spellCheck="false"
                    className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-foreground caret-primary outline-none"
                  />
                  {!focused && !value && <Cursor />}
                </p>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
