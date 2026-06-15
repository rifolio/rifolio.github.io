import { motion } from "framer-motion";

const motionSafe = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
};

// Dots just fade in where they are — no vertical movement.
const dotAppear = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.3, ease: "easeOut" },
};

export default function Education() {
  return (
    <section
      id="education"
      className="section-wrap py-20 sm:py-28 safe-px border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-12 max-w-2xl" {...motionSafe}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Background
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Education
          </h2>
        </motion.div>

        <div className="relative border-l border-border space-y-12 sm:space-y-14">
          <div className="relative">
            <motion.span
              className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary"
              {...dotAppear}
            />
            <motion.article className="pl-8 sm:pl-10" {...motionSafe}>
              <p className="text-xs tabular-nums text-muted-foreground mb-2 font-mono">
                2025 — 2027
              </p>
              <h3 className="font-display text-xl font-semibold">
                MSc, Human-Centered Artificial Intelligence
              </h3>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Technical University of Denmark (DTU)
              </p>
            </motion.article>
          </div>

          <div className="relative">
            <motion.span
              className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-muted-foreground/40"
              {...dotAppear}
              transition={{ ...dotAppear.transition, delay: 0.06 }}
            />
            <motion.article
              className="pl-8 sm:pl-10"
              {...motionSafe}
              transition={{ ...motionSafe.transition, delay: 0.06 }}
            >
              <p className="text-xs tabular-nums text-muted-foreground mb-2 font-mono">
                2022 — 2025
              </p>
              <h3 className="font-display text-xl font-semibold">
                BSc, Computer Science &amp; Mathematics
              </h3>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Roskilde University (RUC)
              </p>
              <p className="text-muted-foreground text-sm mt-3 max-w-xl leading-relaxed">
                Focus on AI, machine learning, and mathematical modeling.
              </p>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
