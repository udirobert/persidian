/**
 * A clock-face baton divider.
 *
 * A thin diameter line with short perpendicular ticks at each end,
 * borrowed from the Braun clock motif. Used sparingly as a chapter
 * break between major page sections.
 */
export function BatonRule({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full max-w-5xl mx-auto px-5 sm:px-10 ${className}`}>
      <svg
        width="100%"
        height="12"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        className="opacity-20"
        aria-hidden="true"
      >
        <line x1="0" y1="6" x2="100" y2="6" />
        <line x1="0" y1="1" x2="0" y2="11" />
        <line x1="100" y1="1" x2="100" y2="11" />
      </svg>
    </div>
  );
}
