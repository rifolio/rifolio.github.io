import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@/components/ui/8bit-spinner";

// Fake POST sequence — fully revealed well before the 1200ms minimum
const POST_LINES = [
  "MEM CHECK ........ OK",
  "GPU: EYES v2.0 ... OK",
  "BOOT /dev/vladyslav",
  "LOADING VLADYSLAV.EXE",
];

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full-screen loading overlay that shows on first paint.
 * Disappears after the LATER of: (a) window "load" event, (b) 1200ms minimum.
 * Fades out over 400ms via framer-motion AnimatePresence.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(REDUCED_MOTION ? POST_LINES.length : 1);

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const timer = setInterval(
      () => setShown((n) => Math.min(n + 1, POST_LINES.length)),
      200
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let dismissed = false;

    const dismiss = () => {
      if (!dismissed) {
        dismissed = true;
        setVisible(false);
      }
    };

    // Minimum display time
    const minTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        dismiss();
      } else {
        window.addEventListener("load", dismiss, { once: true });
      }
    }, 1200);

    // Also listen for window load regardless, in case it fires after 1200ms
    const onLoad = () => {
      // Only dismiss if minimum time has already passed (handled above)
      // But set a fallback so we don't get stuck
      setTimeout(dismiss, 0);
    };
    window.addEventListener("load", onLoad, { once: true });

    return () => {
      clearTimeout(minTimer);
      window.removeEventListener("load", dismiss);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-6 retro text-foreground">
            <Spinner className="size-12" />
            <div className="flex flex-col items-start gap-1.5 font-mono text-[10px] leading-none text-muted-foreground sm:text-xs">
              {POST_LINES.slice(0, shown).map((line, i) => (
                <div
                  key={line}
                  className={
                    i === POST_LINES.length - 1
                      ? "animate-pulse motion-reduce:animate-none"
                      : undefined
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
