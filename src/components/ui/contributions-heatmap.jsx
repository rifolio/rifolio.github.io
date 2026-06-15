/**
 * ContributionsHeatmap
 *
 * A GitHub-style contributions grid built for this portfolio.
 * Accepts a flat array of day objects: { date: "YYYY-MM-DD", count: number, level: 0..4 }
 * Lays them out in columns of 7 days (weeks), left = oldest, right = newest.
 * Colors by level using the site's amber/gold primary accent.
 */

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const LEVEL_CLASSES = [
  "bg-white/[0.04] border-white/[0.06]",         // 0 — no contributions
  "bg-amber-500/20 border-amber-500/25",          // 1 — low
  "bg-amber-500/40 border-amber-500/45",          // 2 — medium-low
  "bg-amber-500/65 border-amber-500/60",          // 3 — medium-high
  "bg-amber-500 border-amber-400/80",             // 4 — max
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Groups a flat day array into week columns of 7.
 * The first week may have fewer than 7 days (padded from the front).
 */
function groupIntoWeeks(days) {
  if (!days || days.length === 0) return [];

  // Determine weekday of the first day (0=Sun) so we can left-pad
  const firstDate = new Date(days[0].date + "T00:00:00");
  const startDow = firstDate.getDay(); // 0 = Sunday

  // Build full flat array with leading nulls
  const padded = [...Array(startDow).fill(null), ...days];

  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function ContributionsHeatmap({ days = [], className }) {
  const weeks = useMemo(() => groupIntoWeeks(days), [days]);

  // Build month label positions: for each week column, check if a new month starts in it
  const monthPositions = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstReal = week.find(Boolean);
      if (!firstReal) return;
      const m = new Date(firstReal.date + "T00:00:00").getMonth();
      if (m !== lastMonth) {
        labels.push({ weekIndex: wi, month: MONTH_LABELS[m] });
        lastMonth = m;
      }
    });
    return labels;
  }, [weeks]);

  if (weeks.length === 0) {
    return (
      <div className={cn("text-xs text-muted-foreground", className)}>
        No contribution data yet.
      </div>
    );
  }

  return (
    <div className={cn("w-full pb-1", className)}>
      {/* Month row — mirrors the grid structure so labels align with columns */}
      <div className="flex mb-1.5 w-full">
        {/* spacer matching the day-of-week label column */}
        <div className="w-4 sm:w-5 mr-1 shrink-0" aria-hidden="true" />
        <div className="flex flex-1 gap-[2px]">
          {weeks.map((_, wi) => {
            const label = monthPositions.find((m) => m.weekIndex === wi);
            return (
              <div
                key={wi}
                className="flex-1 text-[0.55rem] sm:text-[0.6rem] text-muted-foreground/60 leading-none whitespace-nowrap"
              >
                {label ? label.month : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: day-labels column + fluid week columns */}
      <div className="flex w-full items-stretch">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-[2px] mr-1 shrink-0 w-4 sm:w-5">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <div
              key={i}
              className="flex-1 text-[0.45rem] sm:text-[0.5rem] text-muted-foreground/50 leading-none flex items-center justify-end"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Week columns — each fills an equal share of the available width */}
        <div className="flex flex-1 gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-1 flex-col gap-[2px]">
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di];
                if (!day) {
                  // padding cell
                  return (
                    <div
                      key={di}
                      className="aspect-square w-full rounded-[2px] border border-transparent"
                    />
                  );
                }
                return (
                  <div
                    key={di}
                    title={`${formatDate(day.date)}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                    className={cn(
                      "aspect-square w-full rounded-[2px] border transition-opacity duration-150 hover:opacity-80 cursor-default",
                      LEVEL_CLASSES[day.level ?? 0]
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[0.6rem] text-muted-foreground/50">Less</span>
        {LEVEL_CLASSES.map((cls, i) => (
          <div
            key={i}
            className={cn("rounded-[2px] border", cls)}
            style={{ width: "0.75rem", height: "0.75rem" }}
          />
        ))}
        <span className="text-[0.6rem] text-muted-foreground/50">More</span>
      </div>
    </div>
  );
}

export default ContributionsHeatmap;
