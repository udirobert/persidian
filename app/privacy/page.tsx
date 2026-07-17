import type { Metadata } from "next";
import { ContentLink, ContentPage, ContentSection } from "@/components/ContentPage";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Persidian — Privacy",
  description: "Privacy policy for persidian.com — what we collect, why, and how long we keep it.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Persidian — Privacy",
    description: "Privacy policy for persidian.com — what we collect, why, and how long we keep it.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy" kicker="Legal">
      <ContentSection title="What we collect">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-foreground">Business X-ray:</strong> URLs you submit and answers
            you provide. Anonymous scans are ephemeral unless you request a saved report.
          </li>
          <li>
            <strong className="text-foreground">Contact form:</strong> Name, email, company, and
            message when you book a demo or request the deck.
          </li>
          <li>
            <strong className="text-foreground">Server logs:</strong> IP addresses and request
            metadata for rate limiting and abuse prevention.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="How we use it">
        <p>
          To run the diagnostic, respond to your inquiry, and improve the product. We do not sell
          personal data. LLM providers process concierge chat content under their own terms when
          configured.
        </p>
      </ContentSection>

      <ContentSection title="Your choices">
        <p>
          Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy request`} className="underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>{" "}
          to request deletion of contact form data or saved reports.
        </p>
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <ContentLink href="/trust">Trust</ContentLink> ·{" "}
          <ContentLink href="/terms">Terms</ContentLink>
        </p>
      </ContentSection>
    </ContentPage>
  );
}
