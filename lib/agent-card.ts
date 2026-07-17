import { PRODUCTS } from "@/lib/products";
import {
  CONTACT_EMAIL,
  FOUNDER_GITHUB,
  FOUNDER_NAME,
  FOUNDER_X,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export function buildAgentCard() {
  return {
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    version: "1.0.0",
    operator: {
      name: FOUNDER_NAME,
      contact: CONTACT_EMAIL,
      sameAs: [FOUNDER_X, FOUNDER_GITHUB],
    },
    operating_principle:
      "Agents act inside the systems where risk lives, with a human approval gate on every write or execution.",
    trust: {
      data_handling: `${SITE_URL}/trust`,
      security: `${SITE_URL}/security`,
      privacy: `${SITE_URL}/privacy`,
      terms: `${SITE_URL}/terms`,
    },
    discovery: {
      sitemap: `${SITE_URL}/sitemap.xml`,
      llms_txt: `${SITE_URL}/llms.txt`,
      openapi: `${SITE_URL}/openapi.json`,
      capabilities: `${SITE_URL}/capabilities`,
    },
    public_actions: [
      {
        id: "scan_website",
        method: "POST",
        path: "/api/scan",
        description: "Scan a public company website for Business X-ray prefills",
        safe: true,
        requires_auth: false,
      },
      {
        id: "diagnose",
        method: "POST",
        path: "/api/diagnose",
        description: "Score diagnostic signals and recommend a Persidian agent",
        safe: true,
        requires_auth: false,
      },
      {
        id: "concierge_chat",
        method: "POST",
        path: "/api/chat",
        description: "Ask short follow-up questions about a recommendation",
        safe: true,
        requires_auth: false,
      },
      {
        id: "save_xray_report",
        method: "POST",
        path: "/api/reports",
        description: "Save a consent-based shareable X-ray report (30-day retention)",
        safe: false,
        requires_auth: false,
        consent_required: true,
        side_effects: ["persists_report"],
      },
    ],
    products: PRODUCTS.map((p) => ({
      name: p.name,
      slug: p.slug,
      canonical: `${SITE_URL}${p.entityHref}`,
      live_url: p.href,
      repository: p.repo,
      tagline: p.tagline,
    })),
    limitations: [
      "No customer system write access through public endpoints",
      "Website scans inspect public pages only",
      "Product subdomains own detailed product UX; entity pages are canonical for discovery",
      "Pilot features are labeled on entity pages and must not be cited as mainnet production",
    ],
  };
}
