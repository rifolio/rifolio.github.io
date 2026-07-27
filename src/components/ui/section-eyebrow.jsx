/**
 * Terminal-path section eyebrow: `❯ cd ~/about`
 * Sections are directories — one consistent wayfinding device sitewide.
 */
export default function SectionEyebrow({ path }) {
  return (
    <p className="font-pixel text-[9px] tracking-[0.2em] text-amber-500/80 mb-3 uppercase">
      <span className="text-primary mr-1" aria-hidden="true">
        ❯
      </span>
      cd ~/{path}
    </p>
  );
}
