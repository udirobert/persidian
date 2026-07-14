"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

interface PinnedSectionProps {
  id?: string;
  children: ReactNode[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * StickySections-style pinned viewport.
 *
 * The wrapper is N × 100vh tall. The inner container sticks at the top.
 * As the user scrolls through the wrapper, we calculate progress and
 * reveal each "beat" in turn. On mobile and reduced-motion preferences
 * the section falls back to a normal stacked layout so scroll never
 * feels trapped and nobody gets motion sickness.
 *
 * No heavy animation libraries — just a throttled scroll listener,
 * CSS custom properties, and transitions. On mobile (narrow viewports)
 * or reduced-motion preferences, the section falls back to a normal
 * stacked layout.
 */
export function PinnedSection({
  id,
  children,
  className = "",
  style,
}: PinnedSectionProps) {
  const beats = Array.isArray(children) ? children : [children];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(-1);

  const prefersReducedMotion = useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  const isNarrow = useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(max-width: 640px)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(max-width: 640px)").matches,
    () => false
  );

  const disablePinning = prefersReducedMotion || isNarrow;

  useEffect(() => {
    if (disablePinning) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const rect = wrapper.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const travel = rect.height - viewportH;
        if (travel <= 0) return;

        const progress = Math.min(
          1,
          Math.max(0, -rect.top / travel)
        );

        if (progress !== lastProgressRef.current) {
          lastProgressRef.current = progress;
          wrapper.style.setProperty("--section-progress", progress.toFixed(4));
          const nextActive = Math.min(
            beats.length - 1,
            Math.floor(progress * beats.length)
          );
          setActive(nextActive);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [disablePinning, beats.length]);

  // Reduced motion or narrow viewport: render as a normal stacked layout.
  if (disablePinning) {
    return (
      <div id={id} className={`${className}`} style={style}>
        {beats.map((beat, i) => (
          <section key={i} className="min-h-screen py-24 px-5 sm:px-10" style={style}>
            {beat}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      id={id}
      ref={wrapperRef}
      className={`relative ${className}`}
      style={{
        height: `${beats.length * 100}vh`,
      }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ willChange: "transform", ...style }}
      >
        {beats.map((beat, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <div
              key={i}
              className="pinned-beat absolute inset-0 flex items-center px-5 sm:px-10"
              data-active={isActive}
              data-direction={isPast ? "past" : "future"}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              <div className="w-full max-w-5xl mx-auto">{beat}</div>
            </div>
          );
        })}

        {/* Progress dots — subtle orientation for long pinned sections. Hidden on small screens where horizontal space is tight. */}
        <div
          className="hidden sm:flex absolute right-5 sm:right-10 top-1/2 -translate-y-1/2 flex-col gap-2"
          aria-hidden="true"
        >
          {beats.map((_, i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{
                background: i === active ? "currentColor" : "currentColor",
                opacity: i === active ? 1 : 0.25,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
