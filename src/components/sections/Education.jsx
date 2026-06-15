import { motion } from "framer-motion";

const motionSafe = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
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

        <div className="relative pl-8 sm:pl-10 border-l border-border space-y-12 sm:space-y-14">
          <motion.article {...motionSafe}>
            <div className="absolute w-2.5 h-2.5 rounded-full -left-[5.5px] mt-1.5 bg-primary" />
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

          <motion.article
            {...motionSafe}
            transition={{ ...motionSafe.transition, delay: 0.06 }}
          >
            <div className="absolute w-2.5 h-2.5 rounded-full -left-[5.5px] mt-1.5 bg-muted-foreground/40" />
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
    </section>
  );
}
