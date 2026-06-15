/**
 * AnimatedStat
 *
 * Counts a numeric value up from zero when scrolled into view.
 * Extracted from Home.jsx so it can be shared across sections.
 *
 * Props:
 *   value   — target number
 *   suffix  — string appended after the number (e.g. "+")
 *   label   — primary label below the number
 *   sub     — optional secondary label (smaller, muted)
 */

import { useRef, useState, useEffect } from "react";
import { useInView, animate } from "framer-motion";

function AnimatedStat({ value, suffix = "", label, sub }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(Math.round(v));
      },
    });
    return controls.stop;
  }, [isInView, value]);

  return (
    <div ref={ref} className="py-4 text-center lg:text-left">
      <div className="font-display-hero text-4xl sm:text-5xl font-bold tabular-nums text-foreground leading-none">
        {value >= 1000 ? display.toLocaleString() : display}
        {suffix}
      </div>
      <div className="text-sm font-medium text-foreground/70 mt-2">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

export default AnimatedStat;
