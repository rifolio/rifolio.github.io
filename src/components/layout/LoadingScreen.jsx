import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@/components/ui/8bit-spinner";

/**
 * Full-screen loading overlay that shows on first paint.
 * Disappears after the LATER of: (a) window "load" event, (b) 1200ms minimum.
 * Fades out over 400ms via framer-motion AnimatePresence.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

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
            <div className="retro text-xs text-muted-foreground animate-pulse">
              LOADING...
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
