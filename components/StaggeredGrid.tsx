"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

interface StaggeredGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * A scroll-triggered 3D staggered entrance for the portfolio index.
 *
 * On entering the viewport, each direct child rises from a gentle
 * perspective tilt into its final position with a staggered delay.
 * Falls back to a simple fade-in when reduced motion is preferred.
 *
 * Implemented with an IntersectionObserver and CSS custom properties
 * so no heavy animation runtime is required.
 */
export function StaggeredGrid({ children, className = "" }: StaggeredGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const prefersReducedMotion = useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`staggered-grid ${className}`}
      data-visible={visible}
      data-reduced-motion={prefersReducedMotion}
    >
      {children}
    </div>
  );
}
