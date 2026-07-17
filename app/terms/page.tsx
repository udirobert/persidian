import type { Metadata } from "next";
import { ContentLink, ContentPage, ContentSection } from "@/components/ContentPage";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Persidian — Terms",
  description: "Terms of use for persidian.com and the Business X-ray diagnostic.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Persidian — Terms",
    description: "Terms of use for persidian.com and the Business X-ray diagnostic.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <ContentPage title="Terms of use" kicker="Legal">
      <ContentSection title="Service">
        <p>
          Persidian.com provides information about Persidian agents and a free Business X-ray
          diagnostic. Recommendations are starting points, not professional advice. Production
          deployments are governed by separate agreements.
        </p>
      </ContentSection>

      <ContentSection title="Acceptable use">
        <p>
          Do not use the URL scanner against systems you do not have authority to inspect. Do not
          attempt to bypass rate limits, SSRF protections, or robots.txt restrictions.
        </p>
      </ContentSection>

      <ContentSection title="Disclaimer">
        <p>
          Agent capabilities, integrations, and live status change over time. Entity pages and the
          studio thesis describe current production surfaces; pilot features are labeled separately.
        </p>
      </ContentSection>

      <ContentSection title="Contact">
        <p>
          Questions:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </p>
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <ContentLink href="/privacy">Privacy</ContentLink> ·{" "}
          <ContentLink href="/trust">Trust</ContentLink>
        </p>
      </ContentSection>
    </ContentPage>
  );
}
