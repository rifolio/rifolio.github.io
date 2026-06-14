import { PeermindCompositeLogo } from "@/components/ui/logos/peermind-composite";
import { cn } from "@/lib/utils";

const baseUrl = import.meta.env.BASE_URL || "/";

const logos = [
  {
    src: `${baseUrl}logos/tryp.svg`,
    alt: "Tryp.com",
  },
  {
    component: <PeermindCompositeLogo />,
    alt: "Peermind",
  },
  {
    src: `${baseUrl}logos/novo-nordisk.svg`,
    alt: "Novo Nordisk",
    size: "lg",
  },
  {
    src: `${baseUrl}logos/ruc.svg`,
    alt: "Roskilde University (RUC)",
  },
];

export function LogosSection({ className }) {
  return (
    <section
      className={cn(
        "section-wrap safe-px relative border-t border-border py-12 sm:py-16",
        className
      )}
      aria-label="Companies I worked with"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground mb-8">
          Companies I worked with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16">
          {logos.map((logo) =>
            logo.component ? (
              <div
                key={logo.alt}
                className="flex items-center opacity-50 transition-opacity duration-300 hover:opacity-100"
              >
                {logo.component}
              </div>
            ) : (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className={cn(
                  "w-auto select-none object-contain opacity-50 transition-opacity duration-300 hover:opacity-100 dark:brightness-0 dark:invert",
                  logo.size === "lg"
                    ? "h-6 max-h-7 max-w-[150px] md:h-7"
                    : "h-5 max-h-6 max-w-[110px]"
                )}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
