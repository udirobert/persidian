import { Mark } from "@/components/Mark";
import { BraunClock } from "@/components/BraunClock";

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

interface Project {
  number: string;
  name: string;
  href: string;
  tagline: string;
  icon: () => React.ReactElement;
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
      "Autonomous signal intelligence — every thesis scored, traded, and proof-chained on-chain before the market moves.",
    icon: PulseIcon,
    bg: "var(--lenitnes-bg)",
    fg: "var(--lenitnes-fg)",
    accent: "var(--lenitnes-accent)",
    fontClass: "font-mono",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
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
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-5xl">
          <div className="max-w-xl order-2 lg:order-1" data-enter style={{ "--enter-delay": "0ms" } as React.CSSProperties}>
            {/* The name's provenance, shown rather than explained: the
                bright letters spell PERSI + DIAN = PERSIDIAN. */}
            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.1em] sm:tracking-[0.15em] mb-4">
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
              We build tools tuned to the rhythm of a business — daily,
              weekly, always on. No dashboards for their own sake. Just
              software that keeps working, on schedule, in the background.
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

      <section className="px-5 sm:px-10 pb-16">
        <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted mb-4">
          Projects
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROJECTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <a
                key={p.name}
                href={p.href}
                data-enter
                className="project-card relative isolate overflow-hidden rounded-2xl border p-5"
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
    </div>
  );
}
