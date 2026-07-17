import type { Metadata } from "next";
import { ContentLink, ContentPage, ContentSection } from "@/components/ContentPage";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Persidian — Trust and data handling",
  description:
    "How Persidian handles public website scans, diagnostic data, model providers, retention, logging, and human approval boundaries.",
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Persidian — Trust and data handling",
    description:
      "How Persidian handles public website scans, diagnostic data, model providers, retention, logging, and human approval boundaries.",
    url: `${SITE_URL}/trust`,
    type: "website",
  },
};

export default function TrustPage() {
  return (
    <ContentPage title="Trust and data handling" kicker="Trust">
      <ContentSection title="Operating principle">
        <p>
          Every Persidian agent acts inside the systems where risk lives — and keeps a human at the
          approval gate on every write or execution. The Business X-ray follows the same pattern:
          show what was found, label what was inferred, and ask only what the public web cannot
          answer.
        </p>
      </ContentSection>

      <ContentSection title="Business X-ray — saved reports">
        <p>
          If you choose to save a shareable report, we store the recommendation, your answers, and
          public scan findings for up to 30 days. Reports are accessible only via an unguessable
          link. Optional email is used only for follow-up if you provide it.
        </p>
        <p className="mt-3">
          Each saved report includes a deletion token. Use it with{" "}
          <code className="text-sm text-foreground">DELETE /api/reports/[id]</code> or email
          hello@persidian.com to request removal.
        </p>
      </ContentSection>

      <ContentSection title="Business X-ray — URL scans">
        <p>
          When you submit a company website, Persidian inspects public pages only. No login, no
          changes to your site, and no email required to start. Scans are anonymous and ephemeral
          unless you choose to save or share a report.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>We read publicly accessible HTTP/HTTPS content and respect robots.txt.</li>
          <li>We do not attempt authenticated areas, private networks, or localhost targets.</li>
          <li>Crawled text is treated as untrusted input — site content cannot trigger tools or outbound actions.</li>
          <li>Deletion: close the session or email hello@persidian.com to request removal of any saved report.</li>
        </ul>
      </ContentSection>

      <ContentSection title="Model providers">
        <p>
          Diagnostic explanations and concierge chat may use third-party LLM providers (OpenRouter,
          NVIDIA NIM) when API keys are configured. Prompts include only what you share in the
          diagnostic or chat — not your full website crawl unless you explicitly include it in a
          message.
        </p>
      </ContentSection>

      <ContentSection title="Retention and logging">
        <p>
          Anonymous X-ray sessions are not persisted by default. Contact form submissions and
          demo requests are retained only as long as needed to respond. Server logs may include
          IP addresses for rate limiting — see{" "}
          <ContentLink href="/privacy">Privacy</ContentLink>.
        </p>
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <ContentLink href="/security">Security</ContentLink> ·{" "}
          <ContentLink href="/privacy">Privacy</ContentLink> ·{" "}
          <ContentLink href="/about">About</ContentLink>
        </p>
      </ContentSection>
    </ContentPage>
  );
}
