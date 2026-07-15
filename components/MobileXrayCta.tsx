"use client";

import { useEffect, useState } from "react";

/**
 * Small-screen sticky CTA back to the Business X-ray.
 *
 * On mobile the diagnostic scrolls away quickly; this keeps the one
 * conversion action a thumb-tap away. Hidden while the diagnostic or
 * the contact form is on screen so it never covers what it points to.
 */
export function MobileXrayCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = ["diagnostic", "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const intersecting = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        intersecting.set(entry.target, entry.isIntersecting);
      }
      setVisible(![...intersecting.values()].some(Boolean));
    });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1.25rem)" }}
      aria-hidden={!visible}
    >
      <a
        href="#diagnostic"
        tabIndex={visible ? 0 : -1}
        className={`${
          visible ? "pointer-events-auto" : ""
        } inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium shadow-lg shadow-foreground/20 active:scale-[0.97] transition-transform`}
      >
        Business X-ray →
      </a>
    </div>
  );
}
