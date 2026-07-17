import type { Metadata } from "next";
import { ContentLink, ContentPage, ContentSection } from "@/components/ContentPage";
import { PRODUCTS } from "@/lib/products";
import {
  CONTACT_EMAIL,
  FOUNDER_GITHUB,
  FOUNDER_NAME,
  FOUNDER_X,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Persidian — About",
  description:
    "Who operates Persidian, why these claims are credible, and where to verify the six live agents.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Persidian — About",
    description:
      "Who operates Persidian, why these claims are credible, and where to verify the six live agents.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <ContentPage title="About Persidian" kicker="The studio">
      <ContentSection title="Who we are">
        <p>
          Persidian is a studio building six autonomous agents for compounding business risks —
          cash, outreach, signals, data, grants, and currency. {FOUNDER_NAME} operates the studio.
          Connect on{" "}
          <a href={FOUNDER_X} className="underline underline-offset-4" rel="noopener noreferrer">
            X
          </a>{" "}
          or{" "}
          <a href={FOUNDER_GITHUB} className="underline underline-offset-4" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection title="Why these claims are credible">
        <p>
          All six agents are open source with public repositories, deployment surfaces, and —
          where applicable — on-chain scorecards or decision ledgers. Proof is linked from each{" "}
          <ContentLink href="/studio">studio</ContentLink> section and every{" "}
          <ContentLink href="/#portfolio">agent entity page</ContentLink>. Pilot features are
          labeled explicitly; they are not claimed as live production functionality.
        </p>
      </ContentSection>

      <ContentSection title="The six agents">
        <ul className="list-disc pl-5 space-y-2">
          {PRODUCTS.map((p) => (
            <li key={p.slug}>
              <ContentLink href={p.entityHref}>{p.name}</ContentLink> — {p.tagline}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title="Contact">
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </p>
      </ContentSection>
    </ContentPage>
  );
}
