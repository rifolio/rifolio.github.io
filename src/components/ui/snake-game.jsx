import { useCallback, useEffect, useRef, useState } from "react";
import { unlockAchievement } from "@/lib/achievements.js";

const GRID = 20;
const CELL = 16;
const SIZE = GRID * CELL;

const BG = "#0B0B0B";
const BODY = "#F59E0B";
const HEAD = "#FCD34D";
const FOOD = "#FDE68A";

const KEYS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
};

function spawnFood(snake) {
  // ponytail: reject-sample; fine on a 400-cell board, swap for a free-cell list if the grid grows
  let f;
  do {
    f = { x: (Math.random() * GRID) | 0, y: (Math.random() * GRID) | 0 };
  } while (snake.some((p) => p.x === f.x && p.y === f.y));
  return f;
}

function freshState() {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  return {
    snake,
    dir: { x: 1, y: 0 },
    next: { x: 1, y: 0 },
    food: spawnFood(snake),
    score: 0,
    delay: 140,
  };
}

const pad = (n) => String(n).padStart(4, "0");

export default function SnakeGame({ onQuit }) {
  const canvasRef = useRef(null);
  const state = useRef(freshState());
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    unlockAchievement("snake");
  }, []);

  const setDir = useCallback((x, y) => {
    const s = state.current;
    if (s.next.x + x === 0 && s.next.y + y === 0) return; // no 180s
    s.next = { x, y };
  }, []);

  // keyboard — arrows + WASD, and stop the page scrolling underneath
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const v = KEYS[k];
      if (!v) return;
      e.preventDefault();
      setDir(v[0], v[1]);
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [setDir]);

  // game loop — self-scheduling timeout so the speed can change mid-run
  useEffect(() => {
    if (over) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const draw = () => {
      const s = state.current;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = FOOD;
      ctx.fillRect(s.food.x * CELL + 3, s.food.y * CELL + 3, CELL - 6, CELL - 6);
      s.snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? HEAD : BODY;
        ctx.fillRect(p.x * CELL, p.y * CELL, CELL - 1, CELL - 1);
      });
    };

    const tick = () => {
      const s = state.current;
      s.dir = s.next;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= GRID ||
        head.y >= GRID ||
        s.snake.some((p) => p.x === head.x && p.y === head.y)
      ) {
        setOver(true);
        return false;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score += 1;
        setScore(s.score);
        s.food = spawnFood(s.snake);
        s.delay = Math.max(70, 140 - s.score * 4);
      } else {
        s.snake.pop();
      }
      return true;
    };

    let id;
    const run = () => {
      const alive = tick();
      draw();
      if (alive) id = setTimeout(run, state.current.delay);
    };
    draw();
    id = setTimeout(run, state.current.delay);
    return () => clearTimeout(id);
  }, [over, round]);

  const restart = () => {
    state.current = freshState();
    setScore(0);
    setOver(false);
    setRound((r) => r + 1);
  };

  const dpad =
    "flex items-center justify-center w-11 h-11 font-sans text-lg leading-none " +
    "text-primary bg-transparent border-2 border-primary/50 " +
    "active:bg-primary/20 select-none touch-manipulation";

  const btn =
    "font-pixel text-[0.6rem] tracking-wider uppercase px-4 py-3 leading-relaxed " +
    "transition-all duration-75 " +
    "hover:translate-x-[2px] hover:translate-y-[2px] " +
    "active:shadow-none active:translate-x-[4px] active:translate-y-[4px]";

  return (
    <div className="flex flex-col items-center">
      {/* Score */}
      <p className="font-pixel text-[0.6rem] text-primary tracking-widest uppercase mb-4">
        SCORE {pad(score)}
      </p>

      {/* Board */}
      <div className="relative border-2 border-primary/50 shadow-[4px_4px_0px_0px_oklch(0.769_0.188_70_/_0.2)]">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          aria-label="Snake game board"
          className="block w-[min(80vw,320px)] h-[min(80vw,320px)] bg-[#0B0B0B] [image-rendering:pixelated]"
        />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/85 px-4 text-center">
            <p className="font-pixel text-sm sm:text-base text-primary tracking-widest">
              GAME OVER
            </p>
            <p className="font-pixel text-[0.6rem] text-foreground tracking-widest">
              SCORE {pad(score)}
            </p>
          </div>
        )}
      </div>

      {/* D-pad */}
      <div className="mt-5 grid grid-cols-3 gap-1.5">
        <span />
        <button type="button" className={dpad} aria-label="Up" onClick={() => setDir(0, -1)}>
          ↑
        </button>
        <span />
        <button type="button" className={dpad} aria-label="Left" onClick={() => setDir(-1, 0)}>
          ←
        </button>
        <button type="button" className={dpad} aria-label="Down" onClick={() => setDir(0, 1)}>
          ↓
        </button>
        <button type="button" className={dpad} aria-label="Right" onClick={() => setDir(1, 0)}>
          →
        </button>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
        {over && (
          <button
            type="button"
            onClick={restart}
            className={`${btn} bg-primary text-primary-foreground border-2 border-primary shadow-[4px_4px_0px_0px_oklch(0.5_0.188_70)] hover:shadow-[2px_2px_0px_0px_oklch(0.5_0.188_70)]`}
          >
            PLAY AGAIN
          </button>
        )}
        <button
          type="button"
          onClick={onQuit}
          className={`${btn} bg-transparent text-primary border-2 border-primary/50 shadow-[4px_4px_0px_0px_oklch(0.769_0.188_70_/_0.2)] hover:shadow-[2px_2px_0px_0px_oklch(0.769_0.188_70_/_0.2)] hover:border-primary/80`}
        >
          QUIT
        </button>
      </div>

      <p className="font-pixel text-[0.5rem] text-muted-foreground/40 mt-6 tracking-widest uppercase">
        ARROWS / WASD
      </p>
    </div>
  );
}
