import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";

interface ContentPageProps {
  title: string;
  kicker?: string;
  children: React.ReactNode;
}

export function ContentPage({ title, kicker, children }: ContentPageProps) {
  return (
    <div className="flex flex-col flex-1 w-full">
      <Header />
      <main className="px-5 sm:px-10 pt-32 pb-24 bg-background text-foreground">
        <article className="max-w-3xl mx-auto">
          {kicker && <p className="section-kicker text-muted mb-5">{kicker}</p>}
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-10">
            {title}
          </h1>
          <div className="space-y-6 text-muted leading-relaxed">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-3">{title}</h2>
      {children}
    </section>
  );
}

export function ContentLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="underline underline-offset-4 hover:text-foreground transition-colors">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className="underline underline-offset-4 hover:text-foreground transition-colors"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
