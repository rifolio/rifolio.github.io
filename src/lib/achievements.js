import { toast } from "sonner";

const STORAGE_KEY = "vh-achievements";

const ACHIEVEMENTS = {
  kill: "TASK MANAGER — killed vladyslav.jpg",
  crt: "TIME TRAVELER — entered CRT mode",
  terminal: "SHELL ACCESS — ran a terminal command",
  snake: "INSERT COIN — played snake",
  bottom: "COMPLETIONIST — scrolled to exit 0",
};

const TOAST_STYLE = { className: "font-pixel text-[10px]" };

// In-memory mirror so unlocks still dedupe when localStorage is unavailable
let unlocked = null;

function load() {
  if (unlocked) return unlocked;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    unlocked = Array.isArray(stored) ? stored : [];
  } catch {
    unlocked = [];
  }
  return unlocked;
}

/** Unlock an achievement by id. Safe to call repeatedly — fires once. */
export function unlockAchievement(id) {
  const label = ACHIEVEMENTS[id];
  if (!label) return;

  const ids = load();
  if (ids.includes(id)) return;
  ids.push(id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ponytail: private mode — toast still fires, it just won't survive a reload
  }

  toast("ACHIEVEMENT UNLOCKED", { description: label, ...TOAST_STYLE });

  if (ids.length === Object.keys(ACHIEVEMENTS).length) {
    toast("100% COMPLETION", {
      description: "you actually explored everything",
      ...TOAST_STYLE,
    });
  }
}
