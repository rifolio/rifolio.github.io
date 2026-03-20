import { LogoCloud } from "@/components/ui/logo-cloud-3";
import { PeermindCompositeLogo } from "@/components/ui/logos/peermind-composite";
import { cn } from "@/lib/utils";

const baseUrl = import.meta.env.BASE_URL || "/";

const logos = [
  {
    src: `${baseUrl}logos/tryp.svg`,
    alt: "Tryp.com",
    light: true,
  },
  {
    component: <PeermindCompositeLogo />,
    alt: "Peermind",
  },
  {
    src: `${baseUrl}logos/novo-nordisk.svg`,
    alt: "Novo Nordisk",
    light: true,
    size: "lg",
  },
  {
    src: `${baseUrl}logos/ruc.svg`,
    alt: "Roskilde University (RUC)",
    light: true,
  },
];

export function LogosSection({ className }) {
  return (
    <section
      className={cn(
        "section-wrap safe-px relative space-y-4 border-t border-border/50 pt-6 pb-10",
        className
      )}
      aria-label="Companies I worked in"
    >
      <h2 className="text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
        Companies I worked in
      </h2>
      <div className="relative z-10 mx-auto max-w-4xl">
        <LogoCloud logos={logos} />
      </div>
    </section>
  );
}
