export function NovoNordiskLogo({ className }) {
  return (
    <svg
      viewBox="0 0 100 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Apis bull - simplified outline */}
      <path
        d="M50 6c-6 0-11 4-13 9l-3-2-1 2 3 2c-1 3-1 6 0 9l-3 2 1 2 4-2c1 2 3 4 6 4 6 0 11-5 11-11s-5-11-11-11zm0 4c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7z"
        fill="currentColor"
      />
      <circle cx="42" cy="14" r="2.5" fill="currentColor" />
      <path
        d="M38 20c0-1 1-2 2-2s2 1 2 2v1h-4v-1z"
        fill="currentColor"
      />
      {/* Wordmark */}
      <text
        x="50"
        y="38"
        fill="currentColor"
        fontSize="12"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="500"
        textAnchor="middle"
      >
        novo nordisk
      </text>
    </svg>
  );
}
