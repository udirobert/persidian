import { deleteReport, getPublicReport } from "@/lib/reports/store";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const report = await getPublicReport(id);
  if (!report) {
    return NextResponse.json({ error: "Report not found or expired" }, { status: 404 });
  }
  return NextResponse.json(report);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let deletionToken =
    request.headers.get("x-deletion-token") ||
    new URL(request.url).searchParams.get("token") ||
    "";

  if (!deletionToken) {
    try {
      const body = (await request.json()) as { deletionToken?: string };
      deletionToken = body.deletionToken ?? "";
    } catch {
      // no body
    }
  }

  if (!deletionToken) {
    return NextResponse.json({ error: "Deletion token required" }, { status: 400 });
  }

  const deleted = await deleteReport(id, deletionToken);
  if (!deleted) {
    return NextResponse.json({ error: "Report not found or invalid token" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
