export function CoreAILogo({ className }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Abstract AI / neural node */}
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M24 16v-4M24 36v4M16 24h-4M36 24h4M18 18l-3-3M33 33l3 3M18 30l-3 3M33 18l3-3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  );
}
