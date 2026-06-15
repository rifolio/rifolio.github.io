/**
 * GithubStats section — Task 2.4
 *
 * Displays four animated counters (repos, stars, followers, contributions)
 * and a GitHub-style contributions heatmap, all fed by useGithub().
 *
 * NOT wired into Home.jsx yet — that happens in a later composition task.
 */

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { useGithub } from "@/hooks/use-github.js";
import AnimatedStat from "@/components/ui/animated-stat.jsx";
import { ContributionsHeatmap } from "@/components/ui/contributions-heatmap.jsx";
import Spinner from "@/components/ui/8bit-spinner.jsx";

// Simple relative-time helper (no deps)
function relativeTime(isoString) {
  if (!isoString) return null;
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const motionSafe = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
};

export function GithubStats() {
  const { data, refreshing } = useGithub();

  const stats = [
    { value: data.repos,              label: "Repositories",            suffix: "" },
    { value: data.stars,              label: "Stars earned",            suffix: "" },
    { value: data.followers,          label: "Followers",               suffix: "" },
    { value: data.contributionsTotal, label: "Contributions this year", suffix: "+" },
  ];

  const updated = relativeTime(data.updatedAt);

  return (
    <section
      id="github"
      className="section-wrap py-16 sm:py-20 safe-px border-t border-border/40"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <motion.div className="mb-10 max-w-2xl" {...motionSafe}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Open Source
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              By the{" "}
              <span className="font-pixel text-primary text-xl sm:text-2xl inline-block leading-none translate-y-[0.12em]">
                numbers
              </span>
            </h2>

            {/* Syncing indicator */}
            {refreshing && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Spinner variant="diamond" className="text-primary" />
                syncing…
              </span>
            )}
          </div>

          {/* Updated timestamp */}
          {!refreshing && updated && (
            <p className="mt-1.5 text-xs text-muted-foreground/60 flex items-center gap-1.5">
              <Github className="w-3 h-3 opacity-50" />
              updated {updated}
            </p>
          )}

          <p className="mt-3 text-muted-foreground leading-relaxed">
            A snapshot of my GitHub activity — repos, stars, and a year of commits.
          </p>
        </motion.div>

        {/* ── Stat counters ────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 mb-10 border-y border-border/40 py-2"
          {...motionSafe}
          transition={{ ...motionSafe.transition, delay: 0.05 }}
        >
          {stats.map(({ value, label, suffix }) => (
            <AnimatedStat
              key={label}
              value={value ?? 0}
              label={label}
              suffix={suffix}
            />
          ))}
        </motion.div>

        {/* ── Contributions heatmap ────────────────────────────────── */}
        <motion.div
          {...motionSafe}
          transition={{ ...motionSafe.transition, delay: 0.1 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground mb-4">
            Contributions — last 12 months
          </p>
          <ContributionsHeatmap days={Array.isArray(data.weeks) ? data.weeks : []} />
        </motion.div>
      </div>
    </section>
  );
}

export default GithubStats;
