"use client";

import { useEffect, useState } from "react";

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

function Hand({
  angle,
  length,
  width,
  color,
  opacity = 1,
}: {
  angle: number;
  length: number;
  width: number;
  color: string;
  opacity?: number;
}) {
  return (
    <line
      x1={CENTER}
      y1={CENTER}
      x2={CENTER}
      y2={CENTER - length}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      opacity={opacity}
      transform={`rotate(${angle} ${CENTER} ${CENTER})`}
    />
  );
}

/**
 * A working analog clock in the Braun / Dieter Rams idiom — stark face,
 * baton indices, no numerals, one signature orange second hand. This is
 * the hero centerpiece, not a decoration: it's real, ticking, local time.
 * Rendered static (12:00) until mount to avoid a server/client mismatch.
 */
export function BraunClock({ className = "w-full h-full" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const seconds = now?.getSeconds() ?? 0;
  const minutes = now?.getMinutes() ?? 0;
  const hours = now ? now.getHours() % 12 : 0;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

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
        <Hand angle={hourAngle} length={48} width={4.5} color="var(--foreground)" />
        <Hand angle={minuteAngle} length={72} width={3} color="var(--foreground)" />
        <Hand
          angle={secondAngle}
          length={78}
          width={1.5}
          color="var(--accent)"
          opacity={now ? 1 : 0}
        />
        <circle cx={CENTER} cy={CENTER} r="4" fill="var(--foreground)" />
        <circle cx={CENTER} cy={CENTER} r="2" fill="var(--accent)" />
      </svg>
    </div>
  );
}
