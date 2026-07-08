"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Mark } from "./Mark";

const DEFAULT_RING_SIZE = 28;
const DEFAULT_MARK_SIZE = 22;
const STROKE = 1.5;

/**
 * Persidian mark wrapped in a clock-like scroll-progress ring.
 *
 * The ring fills as the visitor reads down the page, reinforcing the
 * circadian/time motif from the hero clock without competing with the
 * product content. Falls back to a plain mark when reduced motion is
 * preferred or before hydration.
 */
export function ScrollProgressMark({
  ringSize = DEFAULT_RING_SIZE,
}: {
  ringSize?: number;
}) {
  const rafRef = useRef<number | null>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  const prefersReducedMotion = useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  const scale = ringSize / DEFAULT_RING_SIZE;
  const radius = (ringSize - STROKE * scale) / 2;
  const circumference = 2 * Math.PI * radius;
  const markSize = Math.round(DEFAULT_MARK_SIZE * scale);

  const initialProgress =
    typeof window !== "undefined"
      ? Math.max(
          0,
          window.scrollY /
            Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        )
      : 0;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const update = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollH =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollH > 0 ? window.scrollY / scrollH : 0;
        const offset = circumference * (1 - progress);
        ringRef.current?.style.setProperty(
          "stroke-dashoffset",
          offset.toFixed(2)
        );
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, circumference]);

  const initialOffset = circumference * (1 - initialProgress);

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: ringSize, height: ringSize }}
    >
      <svg
        width={ringSize}
        height={ringSize}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE * scale}
          strokeOpacity={0.15}
        />
        {/* Progress */}
        <circle
          ref={ringRef}
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE * scale}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={prefersReducedMotion ? circumference : initialOffset}
          className="transition-[stroke-dashoffset] duration-75"
        />
      </svg>
      <span className="relative z-10">
        <Mark size={markSize} />
      </span>
    </span>
  );
}
