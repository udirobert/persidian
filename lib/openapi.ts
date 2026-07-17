import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export function buildOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: `${SITE_NAME} Public API`,
      version: "1.0.0",
      description:
        "Safe, read-mostly public operations for the Persidian Business X-ray and concierge. No authenticated write paths to customer systems are exposed here.",
    },
    servers: [{ url: SITE_URL }],
    paths: {
      "/api/scan": {
        post: {
          operationId: "scanWebsite",
          summary: "Scan a public company website",
          description:
            "Fetches and analyzes publicly accessible pages only. Respects robots.txt, blocks private networks, and returns cited facts with confidence levels.",
          tags: ["X-ray"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["url"],
                  properties: {
                    url: {
                      type: "string",
                      format: "uri",
                      example: "https://example.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Scan completed",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ScanResult" },
                },
              },
            },
            "400": { description: "Invalid or disallowed URL" },
            "422": { description: "Scan failed" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
      "/api/diagnose": {
        post: {
          operationId: "diagnoseBusiness",
          summary: "Recommend a Persidian agent from diagnostic signals",
          description:
            "Deterministic product fit scoring with optional LLM-enhanced reasoning. Product recommendation is scored, not invented.",
          tags: ["X-ray"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DiagnosticAnswers" },
              },
            },
          },
          responses: {
            "200": {
              description: "Recommendation returned",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DiagnoseResult" },
                },
              },
            },
            "400": { description: "Missing diagnostic signals" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
      "/api/chat": {
        post: {
          operationId: "conciergeChat",
          summary: "Ask the Persidian concierge about a recommendation",
          description:
            "Short-form Q&A about a recommended agent. Does not execute product integrations.",
          tags: ["Concierge"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["message"],
                  properties: {
                    message: { type: "string" },
                    productKey: { type: "string" },
                    role: { type: "string" },
                    painPoints: { type: "array", items: { type: "string" } },
                    tools: { type: "array", items: { type: "string" } },
                    timeline: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Concierge reply",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { reply: { type: "string" } },
                  },
                },
              },
            },
            "429": { description: "Rate limit exceeded" },
            "503": { description: "Concierge unavailable" },
          },
        },
      },
    },
    components: {
      schemas: {
        DiagnosticAnswers: {
          type: "object",
          properties: {
            role: { type: "string" },
            painPoints: { type: "array", items: { type: "string" } },
            tools: { type: "array", items: { type: "string" } },
            timeline: { type: "string" },
          },
        },
        DiagnoseResult: {
          type: "object",
          properties: {
            product: { type: "object", nullable: true },
            reasoning: { type: "string" },
            agentSays: { type: "string" },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
            scores: { type: "array", items: { type: "object" } },
          },
        },
        ScanResult: {
          type: "object",
          properties: {
            url: { type: "string" },
            domain: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            facts: { type: "array", items: { type: "object" } },
            followUpQuestion: { type: "object" },
            suggestedAnswers: { $ref: "#/components/schemas/DiagnosticAnswers" },
            escalatedToBrowser: { type: "boolean" },
          },
        },
      },
    },
    tags: [
      { name: "X-ray", description: "Business X-ray diagnostic operations" },
      { name: "Concierge", description: "Post-recommendation Q&A" },
    ],
    externalDocs: {
      description: `${SITE_NAME} trust and operating boundaries`,
      url: `${SITE_URL}/trust`,
    },
  };
}

export const OPENAPI_DESCRIPTION = SITE_DESCRIPTION;
