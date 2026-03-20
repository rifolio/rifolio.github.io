import { cn } from "@/lib/utils";

const baseUrl = import.meta.env.BASE_URL || "/";

export function PeermindCompositeLogo({ className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 shrink-0",
        className
      )}
      aria-hidden
    >
      <img
        src={`${baseUrl}logos/peermind.png`}
        alt=""
        className="h-4 max-h-5 w-auto min-w-0 object-contain object-center dark:invert md:h-5 md:max-h-6"
      />
      <span className="text-sm font-semibold text-foreground whitespace-nowrap md:text-base">
        Peermind
      </span>
    </div>
  );
}
