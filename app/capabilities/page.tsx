import type { Metadata } from "next";
import { ContentLink, ContentPage, ContentSection } from "@/components/ContentPage";
import { buildAgentCard } from "@/lib/agent-card";
import { PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Persidian — Agent capabilities",
  description:
    "Machine-readable capabilities, public API operations, and trust boundaries for agents integrating with Persidian.",
  alternates: { canonical: "/capabilities" },
  openGraph: {
    title: "Persidian — Agent capabilities",
    description:
      "Machine-readable capabilities, public API operations, and trust boundaries for agents integrating with Persidian.",
    url: `${SITE_URL}/capabilities`,
    type: "website",
  },
};

export default function CapabilitiesPage() {
  const card = buildAgentCard();

  return (
    <ContentPage title="Agent capabilities" kicker="For agents and integrators">
      <ContentSection title="Operating principle">
        <p>{card.operating_principle}</p>
      </ContentSection>

      <ContentSection title="Machine-readable surfaces">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <ContentLink href="/openapi.json">OpenAPI specification</ContentLink> — public X-ray and
            concierge endpoints
          </li>
          <li>
            <a href="/.well-known/agent.json" className="underline underline-offset-4 hover:text-foreground transition-colors">
              /.well-known/agent.json
            </a>{" "}
            — capability and trust card
          </li>
          <li>
            <ContentLink href="/llms.txt">llms.txt</ContentLink> — curated routing document
          </li>
          <li>
            <ContentLink href="/sitemap.xml">sitemap.xml</ContentLink> — canonical URL inventory
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Safe public actions">
        <ul className="list-disc pl-5 space-y-3">
          {card.public_actions.map((action) => (
            <li key={action.id}>
              <code className="text-sm text-foreground">{action.method} {action.path}</code>
              <span className="block text-sm mt-1">{action.description}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          These endpoints do not write to customer systems. Rate limits apply. See{" "}
          <ContentLink href="/trust">Trust</ContentLink> and{" "}
          <ContentLink href="/security">Security</ContentLink> for boundaries.
        </p>
      </ContentSection>

      <ContentSection title="Product entity pages">
        <ul className="list-disc pl-5 space-y-2">
          {PRODUCTS.map((p) => (
            <li key={p.slug}>
              <ContentLink href={p.entityHref}>{p.name}</ContentLink> — canonical reference at{" "}
              {SITE_URL}{p.entityHref}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title="Limitations">
        <ul className="list-disc pl-5 space-y-2">
          {card.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title="MCP">
        <p>
          A narrowly scoped MCP server for Persidian public operations is planned. Until then, use
          the OpenAPI spec above or call the REST endpoints directly. No MCP write tools are
          published for customer systems.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
