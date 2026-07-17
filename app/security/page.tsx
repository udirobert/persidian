import type { Metadata } from "next";
import { ContentLink, ContentPage, ContentSection } from "@/components/ContentPage";
import { CONTACT_EMAIL } from "@/lib/site";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Persidian — Security",
  description:
    "Persidian security posture: integration scopes, encryption, incident contact, and approval boundaries for autonomous agents.",
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Persidian — Security",
    description:
      "Persidian security posture: integration scopes, encryption, incident contact, and approval boundaries for autonomous agents.",
    url: `${SITE_URL}/security`,
    type: "website",
  },
};

export default function SecurityPage() {
  return (
    <ContentPage title="Security" kicker="Trust">
      <ContentSection title="Integration scopes">
        <p>
          Each Persidian agent requests the minimum OAuth or API scopes needed for its job. Product
          entity pages list what each agent can read and write. Write paths are gated at the tool
          layer — not only in prompts.
        </p>
      </ContentSection>

      <ContentSection title="Encryption and transport">
        <p>
          All public surfaces are served over HTTPS. Third-party integrations use provider-standard
          OAuth and TLS. Credentials are stored in environment-isolated configuration, never in
          client-side code.
        </p>
      </ContentSection>

      <ContentSection title="SSRF and scan safeguards">
        <p>
          The Business X-ray blocks private, localhost, link-local, and cloud metadata addresses.
          Redirects are revalidated. Page, time, and redirect budgets cap each scan.
        </p>
      </ContentSection>

      <ContentSection title="Incident contact">
        <p>
          Report a security concern to{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Security report`} className="underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          . Include reproduction steps and affected product if known.
        </p>
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <ContentLink href="/trust">Trust and data handling</ContentLink> ·{" "}
          <ContentLink href="/privacy">Privacy</ContentLink>
        </p>
      </ContentSection>
    </ContentPage>
  );
}
