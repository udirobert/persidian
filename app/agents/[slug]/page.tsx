import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Header, Footer } from "@/components/SiteChrome";
import { productJsonLd } from "@/lib/json-ld";
import { getProductEntity } from "@/lib/product-entities";
import { PRODUCT_SLUGS, getProductBySlug } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const entity = getProductEntity(slug);
  if (!product || !entity) return {};

  const title = `${product.name} — ${entity.headline}`;
  const description = entity.problem;

  return {
    title,
    description,
    alternates: { canonical: product.entityHref },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${product.entityHref}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AgentPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const entity = getProductEntity(slug);
  if (!product || !entity) notFound();

  const sections = [
    { label: "What is it?", content: entity.headline },
    { label: "Who is it for?", content: entity.whoFor },
    { label: "What problem does it solve?", content: entity.problem },
    { label: "Which systems does it connect to?", content: entity.systems.join(", ") },
    { label: "What can it read?", content: entity.canRead },
    { label: "What can it write or execute?", content: entity.canWrite },
    { label: "Where is human approval required?", content: entity.approvalGate },
    { label: "What is demonstrably live?", content: entity.liveToday },
    { label: "What is the next step?", content: entity.nextStep },
  ];

  return (
    <div className="flex flex-col flex-1 w-full">
      <JsonLd data={productJsonLd(product)} />
      <Header />
      <main
        className="px-5 sm:px-10 pt-32 pb-24"
        style={{ background: product.bg, color: product.fg }}
      >
        <article className="max-w-4xl mx-auto">
          <p className="section-kicker mb-4" style={{ color: product.muted }}>
            {product.number} / {product.thesisLabel}
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
            {product.name}
          </h1>
          <p className="mt-4 text-lg sm:text-xl leading-relaxed" style={{ color: product.muted }}>
            {entity.headline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={product.href}
              className="inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ borderColor: product.accent, color: product.accent }}
            >
              Visit {product.name} →
            </a>
            <a
              href={product.repo}
              className="inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ borderColor: product.muted, color: product.muted }}
            >
              Source →
            </a>
            <Link
              href="/#diagnostic"
              className="inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ borderColor: product.muted, color: product.muted }}
            >
              Run the X-ray →
            </Link>
          </div>

          <div className="mt-12 space-y-5 text-base leading-relaxed" style={{ color: product.muted }}>
            {entity.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16 space-y-8">
            {sections.map((section) => (
              <section key={section.label}>
                <h2 className="text-sm font-mono uppercase tracking-wider mb-2" style={{ color: product.accent }}>
                  {section.label}
                </h2>
                {Array.isArray(section.content) ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.content.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{section.content}</p>
                )}
              </section>
            ))}

            <section>
              <h2 className="text-sm font-mono uppercase tracking-wider mb-3" style={{ color: product.accent }}>
                What evidence verifies that?
              </h2>
              <ul className="space-y-2">
                {entity.evidence.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="underline underline-offset-4 hover:opacity-80 transition-opacity"
                      style={{ color: product.fg }}
                      rel="noopener noreferrer"
                    >
                      {link.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-mono uppercase tracking-wider mb-2" style={{ color: product.accent }}>
                Buyer intents
              </h2>
              <p>{entity.buyerIntents.join(" · ")}</p>
            </section>
          </div>

          <p className="mt-12 text-sm" style={{ color: product.muted }}>
            Product subdomain:{" "}
            <a href={product.href} className="underline underline-offset-4">
              {product.href}
            </a>
            . This page is the canonical Persidian entity reference.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
