"use client";

import { useEffect, useRef, useState, forwardRef } from "react";

const CENTER = 100;
const FACE_R = 96;

/** 12 tick marks — longer/bolder at each hour, like a Braun wall clock's
 * baton indices. No numerals; the marks alone read as "clock" instantly. */
function Ticks() {
  const marks = [];
  for (let i = 0; i < 60; i++) {
    const isHour = i % 5 === 0;
    const angle = (i / 60) * 360;
    const rad = (angle * Math.PI) / 180;
    const outer = FACE_R - 4;
    const inner = isHour ? outer - 10 : outer - 5;
    // Fixed precision: the shortest-round-trip string for a float can
    // legitimately differ by a trailing digit between server and client
    // V8 builds — a real hydration mismatch we hit on first render.
    // toFixed() guarantees an identical string both times.
    const x1 = (CENTER + inner * Math.sin(rad)).toFixed(2);
    const y1 = (CENTER - inner * Math.cos(rad)).toFixed(2);
    const x2 = (CENTER + outer * Math.sin(rad)).toFixed(2);
    const y2 = (CENTER - outer * Math.cos(rad)).toFixed(2);
    marks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--foreground)"
        strokeOpacity={isHour ? 0.85 : 0.3}
        strokeWidth={isHour ? 2.5 : 1}
        strokeLinecap="round"
      />,
    );
  }
  return <>{marks}</>;
}

const Hand = forwardRef<
  SVGLineElement,
  {
    length: number;
    width: number;
    color: string;
    opacity?: number;
    defaultAngle?: number;
  }
>(({ length, width, color, opacity = 1, defaultAngle = 0 }, ref) => {
  return (
    <line
      ref={ref}
      x1={CENTER}
      y1={CENTER}
      x2={CENTER}
      y2={CENTER - length}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      opacity={opacity}
      transform={`rotate(${defaultAngle} ${CENTER} ${CENTER})`}
    />
  );
});
Hand.displayName = "ClockHand";

/**
 * A working analog clock in the Braun / Dieter Rams idiom — stark face,
 * baton indices, no numerals, one signature orange second hand. This is
 * the hero centerpiece, not a decoration: it's real, ticking, local time.
 * Rendered static (12:00) until mount to avoid a server/client mismatch;
 * after mount the hands are driven by requestAnimationFrame for smooth,
 * sub-second motion.
 */
export function BraunClock({ className = "w-full h-full" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const hourRef = useRef<SVGLineElement>(null);
  const minuteRef = useRef<SVGLineElement>(null);
  const secondRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    let rafId: number;
    const update = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const seconds = now.getSeconds() + ms / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      hourRef.current?.setAttribute(
        "transform",
        `rotate(${(hours * 30).toFixed(3)} ${CENTER} ${CENTER})`
      );
      minuteRef.current?.setAttribute(
        "transform",
        `rotate(${(minutes * 6).toFixed(3)} ${CENTER} ${CENTER})`
      );
      secondRef.current?.setAttribute(
        "transform",
        `rotate(${(seconds * 6).toFixed(3)} ${CENTER} ${CENTER})`
      );

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={`rounded-full bg-background aspect-square ${className}`}
      style={{
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.06), 0 12px 32px rgba(28,25,23,0.10), inset 0 0 0 1px var(--border)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 200 200">
        <Ticks />
        <Hand ref={hourRef} length={48} width={4.5} color="var(--foreground)" />
        <Hand ref={minuteRef} length={72} width={3} color="var(--foreground)" />
        <Hand
          ref={secondRef}
          length={78}
          width={1.5}
          color="var(--accent)"
          opacity={mounted ? 1 : 0}
        />
        <circle cx={CENTER} cy={CENTER} r="4" fill="var(--foreground)" />
        <circle cx={CENTER} cy={CENTER} r="2" fill="var(--accent)" />
      </svg>
    </div>
  );
}
