import { buildOpenApiSpec } from "@/lib/openapi";

export function GET() {
  return Response.json(buildOpenApiSpec(), {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}
