import { Mark } from "@/components/Mark";
import { BraunClock } from "@/components/BraunClock";
import Image from "next/image";

/** Simple single-stroke icons, one per project, tied to what each
 * actually does — not decorative, and not borrowed from an icon set. */
const ICON_PROPS = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-full h-full",
};

function ReceiptIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M8 4h16a1 1 0 0 1 1 1v22l-3-2-3 2-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1Z" />
      <path d="M12 11h8M12 16h8M12 21h5" />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M28 4 4 14.5l9.5 3.5M28 4 17.5 27.5 13.5 18M28 4 13.5 18" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M3 17h5l3-9 6 18 3-13 2 4h7" />
    </svg>
  );
}

function WatcherIcon() {
  /* An eye — DataBard is the always-on watcher of the data estate.
     Almond lid + pupil, single stroke, same weight as the others. */
  return (
    <svg {...ICON_PROPS}>
      <path d="M2 16s5-8 14-8 14 8 14 8-5 8-14 8S2 16 2 16Z" />
      <circle cx="16" cy="16" r="4" />
    </svg>
  );
}

interface Project {
  number: string;
  name: string;
  href: string;
  tagline: string;
  icon: () => React.ReactElement;
  shot: string;
  bg: string;
  fg: string;
  accent: string;
  fontClass?: string;
}

const PROJECTS: Project[] = [
  {
    number: "01",
    name: "Sikizana",
    href: "https://sikizana.persidian.com",
    tagline:
      "Get paid faster, with Xero. Ages your receivables, benchmarks your industry, and chases overdue invoices — automatically, honestly.",
    icon: ReceiptIcon,
    shot: "/shots/sikizana.png",
    bg: "var(--background)",
    fg: "var(--foreground)",
    accent: "var(--sikizana)",
  },
  {
    number: "02",
    name: "Nuncio",
    href: "https://nuncio.persidian.com",
    tagline:
      "Send a video they'll actually watch — your intelligent emissary for personal, researched outreach.",
    icon: PaperPlaneIcon,
    shot: "/shots/nuncio.png",
    bg: "var(--nuncio-bg)",
    fg: "var(--nuncio-fg)",
    accent: "var(--nuncio-accent)",
    fontClass: "font-[Georgia,serif] italic",
  },
  {
    number: "03",
    name: "Lenitnes",
    href: "https://lenitnes.persidian.com",
    tagline:
      "Autonomous signal intelligence — every thesis scored, committed, and proof-chained on-chain before the market moves.",
    icon: PulseIcon,
    shot: "/shots/lenitnes.png",
    bg: "var(--lenitnes-bg)",
    fg: "var(--lenitnes-fg)",
    accent: "var(--lenitnes-accent)",
    fontClass: "font-mono",
  },
  {
    number: "04",
    name: "DataBard",
    href: "https://databard.persidian.com",
    tagline:
      "Watches your data estate — scores health, traces lineage, flags the tests failing silently before they cascade. Delivered as podcasts, dashboards, and on-chain attestations.",
    icon: WatcherIcon,
    shot: "/shots/databard.png",
    bg: "var(--databard-bg)",
    fg: "var(--databard-fg)",
    accent: "var(--databard-accent)",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto">
      <header className="px-5 sm:px-10 py-5 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5 text-foreground">
          <Mark size={22} />
          <span className="text-sm font-semibold tracking-tight">
            PERSIDIAN
          </span>
        </div>
        <a
          href="https://x.com/udirobert"
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          Connect
        </a>
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 sm:px-10 py-8 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="max-w-xl order-2 lg:order-1" data-enter style={{ "--enter-delay": "0ms" } as React.CSSProperties}>
            {/* The name's provenance, shown rather than explained: the
                bright letters spell PERSI + DIAN = PERSIDIAN. */}
            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.1em] sm:tracking-[0.15em] mb-4 whitespace-nowrap">
              <span className="text-accent font-bold">PERSI</span>
              <span className="text-muted">STENCE</span>
              <span className="text-muted"> + </span>
              <span className="text-muted">CIRCA</span>
              <span className="text-accent font-bold">DIAN</span>
            </p>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground">
              Small, dependable software for businesses that run every day.
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted max-w-lg leading-relaxed">
              Invoices age past their terms. Outreach goes unanswered.
              Theses go untested. Data fails silently — and nobody notices
              until it cascades. We build the sentinels that watch for it,
              every day, so you find out before your customer does.
            </p>
          </div>
          <div
            className="w-40 h-40 sm:w-56 sm:h-56 lg:w-60 lg:h-60 shrink-0 order-1 lg:order-2"
            data-enter
            style={{ "--enter-delay": "60ms" } as React.CSSProperties}
          >
            <BraunClock />
          </div>
        </div>
      </main>

      <section className="px-5 sm:px-10 pb-12 sm:pb-16" data-enter style={{ "--enter-delay": "100ms" } as React.CSSProperties}>
        <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted mb-4">
          Studio
        </p>
        <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          Many businesses let small things slide till they&apos;re not
          small — invoices age past their terms & nobody chases them,
          outreach goes out & nobody follows up, data breaks & nobody notices
        . The cost isn&apos;t the breakage; it&apos;s the not-knowing while it
          compounds. Autonomous agents watch — so you find out before your customers do.
        </p>
      </section>

      <section className="px-5 sm:px-10 pb-16">
        <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted mb-4">
          Projects
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {PROJECTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <a
                key={p.name}
                href={p.href}
                data-enter
                className="project-card relative isolate rounded-2xl border p-5"
                style={
                  {
                    background: p.bg,
                    color: p.fg,
                    borderColor: "var(--border)",
                    "--card-accent": p.accent,
                    "--enter-delay": `${120 + i * 50}ms`,
                  } as React.CSSProperties
                }
              >
                {/* Accent glow — present faintly at rest (so touch/mobile
                    users see each project's colour without needing hover),
                    blooming brighter on hover for desktop only (gated in
                    globals.css so a tap doesn't leave it stuck on touch). */}
                <div
                  aria-hidden="true"
                  className="card-glow absolute inset-0 -z-10"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${p.accent}, transparent 60%)`,
                  }}
                />

                {/* Hover preview — desktop only. Floats above the card,
                    scaling from the card's top edge, showing the real
                    product surface at a larger size before the visitor
                    clicks through. Hidden at rest and on touch (no hover
                    state to get stuck on). Keyboard focus also reveals it
                    so tab users get the same peek. */}
                <div className="card-preview" aria-hidden="true">
                  <Image
                    src={p.shot}
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-wide opacity-50">
                    {p.number}
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded"
                    style={{ color: p.accent, background: `color-mix(in srgb, ${p.accent} 15%, transparent)` }}
                  >
                    Live
                  </span>
                </div>

                <div className="card-icon w-8 h-8 mb-4" style={{ color: p.accent }}>
                  <Icon />
                </div>

                <h2 className={`text-base font-semibold mb-1.5 ${p.fontClass ?? ""}`}>
                  {p.name}
                </h2>
                <p className={`text-xs leading-relaxed opacity-80 ${p.fontClass ?? ""}`}>
                  {p.tagline}
                </p>
                <span
                  className="card-visit mt-3 inline-block text-xs font-medium opacity-0 transition-opacity duration-200"
                  style={{ color: p.accent }}
                >
                  Visit →
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <footer className="px-5 sm:px-10 py-8 sm:py-10 border-t border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs font-mono text-muted">
          © {new Date().getFullYear()} Persidian
        </p>
        <div className="flex items-center gap-5">
          <a
            href="mailto:hello@persidian.com"
            className="text-xs font-medium text-muted hover:text-foreground transition-colors"
          >
            hello@persidian.com
          </a>
          <a
            href="https://x.com/udirobert"
            className="text-xs font-medium text-muted hover:text-foreground transition-colors"
          >
            Connect
          </a>
        </div>
      </footer>
    </div>
  );
}
