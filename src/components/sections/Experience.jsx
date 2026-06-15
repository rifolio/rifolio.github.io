import { motion } from "framer-motion";
import { experience } from "@/data/experience.js";
import { companies } from "@/data/companies.js";
import { LOGO_ASSETS } from "@/lib/logo-assets.js";
import LogoWall from "@/components/sections/LogoWall.jsx";
import { cn } from "@/lib/utils";

// Resolve a company name → its real brand asset metadata (or null if none).
function getLogoForCompany(companyName) {
  const match = companies.find((c) => c.name === companyName);
  if (!match) return null;
  return LOGO_ASSETS[match.logo] ?? null;
}

const motionEntry = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
};

export default function Experience() {
  return (
    <section
      id="experience"
      className="section-wrap py-20 sm:py-28 safe-px border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-12 max-w-2xl"
          {...motionEntry}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Experience
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Where I have worked
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Roles spanning AI engineering, research, and teaching across
            startups, enterprise, and academia.
          </p>
        </motion.div>

        {/* Who I've worked with — animated logo wall */}
        <motion.div className="mb-12" {...motionEntry}>
          <p className="font-pixel text-[9px] tracking-[0.2em] text-amber-500/80 mb-3 uppercase">
            Who I&apos;ve worked with
          </p>
          <LogoWall />
        </motion.div>

        {/* My roles */}
        <motion.div {...motionEntry} transition={{ ...motionEntry.transition, delay: 0.1 }}>
          <p className="font-pixel text-[9px] tracking-[0.2em] text-amber-500/80 mb-6 uppercase">
            My roles
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-8 sm:pl-10 border-l border-border space-y-10 sm:space-y-12">
          {experience.map((entry, i) => {
            const logo = getLogoForCompany(entry.company);
            const isActive = entry.period.toLowerCase().includes("present");

            return (
              <motion.article
                key={`${entry.company}-${i}`}
                {...motionEntry}
                transition={{
                  ...motionEntry.transition,
                  delay: i * 0.07,
                }}
                className="relative"
              >
                {/* Timeline node */}
                <div
                  className={`absolute -left-[calc(2rem+5.5px)] sm:-left-[calc(2.5rem+5.5px)] mt-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-background border-muted-foreground/40"
                  }`}
                />

                {/* Card */}
                <div className="rounded-xl border border-border p-5 sm:p-6 transition-colors duration-300 hover:border-white/20 group">
                  {/* Top row: logo + meta */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {logo && (
                        <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-md border border-border/60 bg-white/[0.03] p-1.5 overflow-hidden">
                          <img
                            src={logo.img}
                            alt={`${entry.company} logo`}
                            loading="lazy"
                            className={cn(
                              "max-w-full max-h-full w-auto h-auto object-contain transition-all duration-300",
                              // White silhouette at rest
                              "brightness-0 invert",
                              // Restore the asset's baked brand color on card hover
                              logo.colorOnHover &&
                                "group-hover:brightness-100 group-hover:invert-0"
                            )}
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-display text-base sm:text-lg font-semibold leading-snug tracking-tight truncate">
                          {entry.role}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground truncate">
                          {entry.company}
                        </p>
                      </div>
                    </div>

                    {/* Period badge */}
                    <span
                      className={`shrink-0 text-[0.65rem] font-mono tabular-nums px-2 py-0.5 rounded-md border ${
                        isActive
                          ? "border-primary/40 text-primary bg-primary/5"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {entry.period}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {entry.summary}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
