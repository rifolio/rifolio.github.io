export function PeermindLogo({ className }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Rounded square (squircle) with neural/brain-like pattern */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M14 24c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4zm16 0c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z"
        fill="currentColor"
      />
      <path
        d="M24 14c-2 0-4 2-4 4h2c0-1 1-2 2-2s2 1 2 2h2c0-2-2-4-4-4z"
        fill="currentColor"
      />
      <path
        d="M18 20c-1 1-2 3-2 4h2c0-1 1-2 2-2 1 0 2 1 2 2h2c0-1-1-3-2-4-2-1-4-1-6 0z"
        fill="currentColor"
      />
      <path
        d="M24 30c2 0 4-2 4-4h-2c0 1-1 2-2 2s-2-1-2-2h-2c0 2 2 4 4 4z"
        fill="currentColor"
      />
      <path
        d="M16 28c-1-1-2-2-2-4h-2c0 2 1 4 2 5 2 1 4 1 6 0 1-1 2-3 2-5h-2c0 2-1 3-2 4-2 1-4 1-6 0z"
        fill="currentColor"
      />
    </svg>
  );
}
