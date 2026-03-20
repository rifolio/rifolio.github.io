import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

/**
 * @typedef {{ src?: string; alt: string; width?: number; height?: number; light?: boolean; size?: 'default' | 'lg'; component?: React.ReactNode }} Logo
 * @param {Object} props
 * @param {Logo[]} props.logos
 * @param {string} [props.className]
 */
export function LogoCloud({ className, logos, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
        className
      )}
    >
      <InfiniteSlider
        gap={42}
        reverse
        duration={20}
      >
        {logos.map((logo) =>
          logo.component ? (
            <div key={`logo-${logo.alt}`} className="flex items-center shrink-0">
              {logo.component}
            </div>
          ) : (
            <img
              alt={logo.alt}
              className={cn(
                "pointer-events-none w-auto select-none object-contain object-center shrink-0",
                logo.size === "lg"
                  ? "h-6 max-h-7 max-w-[140px] md:h-7 md:max-h-8 md:max-w-[180px]"
                  : "h-4 max-h-5 max-w-[90px] md:h-5 md:max-h-6 md:max-w-[110px]",
                !logo.light && "dark:brightness-0 dark:invert"
              )}
              height={logo.height ?? "auto"}
              key={`logo-${logo.alt}`}
              loading="lazy"
              src={logo.src}
              width={logo.width ?? "auto"}
            />
          )
        )}
      </InfiniteSlider>
    </div>
  );
}
