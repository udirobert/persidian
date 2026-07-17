import { buildAgentCard } from "@/lib/agent-card";

export function GET() {
  return Response.json(buildAgentCard(), {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}
