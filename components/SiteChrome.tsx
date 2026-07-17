import Link from "next/link";
import { ScrollProgressMark } from "@/components/ScrollProgressMark";

export const CONNECT_URL = "https://x.com/udirobert";
export const EMAIL = "hello@persidian.com";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-5 sm:px-10 py-5 sm:py-6 flex items-center justify-between mix-blend-difference text-background">
      <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
        <ScrollProgressMark />
        <span className="text-sm font-semibold tracking-tight">
          PERSIDIAN
        </span>
      </Link>
      <a
        href={CONNECT_URL}
        className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
      >
        Connect
      </a>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="px-5 sm:px-10 py-8 sm:py-10 border-t border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <p className="text-xs font-mono text-muted">
        © {new Date().getFullYear()} Persidian
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          href="/about"
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          About
        </Link>
        <Link
          href="/trust"
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          Trust
        </Link>
        <Link
          href="/security"
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          Security
        </Link>
        <Link
          href="/studio"
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          The studio
        </Link>
        <a
          href={`mailto:${EMAIL}`}
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          {EMAIL}
        </a>
        <a
          href={CONNECT_URL}
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          Connect
        </a>
      </div>
    </footer>
  );
}
