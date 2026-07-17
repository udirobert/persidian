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

function buildLlmsTxt(): string {
  const agentLines = PRODUCTS.map(
    (p) =>
      `- ${p.name}: ${p.tagline} Canonical: ${SITE_URL}${p.entityHref} Live product: ${p.href} Repository: ${p.repo}`
  ).join("\n");

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Persidian is a studio building six autonomous agents for compounding business risks.
Shared operating principle: agents act inside the systems where risk lives, with a human approval gate on every write or execution.

## Agents

${agentLines}

## Trust and security

- Trust, data handling, and approval boundaries: ${SITE_URL}/trust
- Security, integrations, and scopes: ${SITE_URL}/security
- About the studio and operator: ${SITE_URL}/about
- Privacy: ${SITE_URL}/privacy
- Terms: ${SITE_URL}/terms

## Public proof

All six agents are open source. Repositories, contracts, scorecards, and deployment surfaces are linked from ${SITE_URL}/studio and each agent entity page.
Pilot or demonstration features are labeled explicitly on the relevant product pages — they are not claimed as live production functionality.

## Operator

${FOUNDER_NAME}
- X: ${FOUNDER_X}
- GitHub: ${FOUNDER_GITHUB}
- Contact: ${CONTACT_EMAIL}

## Discovery

- Sitemap: ${SITE_URL}/sitemap.xml
- Business X-ray (URL-first diagnostic): ${SITE_URL}/#diagnostic
- Studio thesis: ${SITE_URL}/studio
- Agent capabilities and public API: ${SITE_URL}/capabilities
- OpenAPI: ${SITE_URL}/openapi.json
- Agent card: ${SITE_URL}/.well-known/agent.json
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
