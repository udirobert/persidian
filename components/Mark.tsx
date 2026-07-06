/**
 * The Persidian mark — two overlapping circles, an eclipse: persistence
 * (the solid disc, always there) meeting circadian (the ring, the cycle).
 * No mascot, no flourish — a Rams-style geometric wordmark accent.
 */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="13" cy="16" r="10" fill="currentColor" />
      <circle
        cx="21"
        cy="16"
        r="9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
