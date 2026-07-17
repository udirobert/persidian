import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import type {
  CreateReportInput,
  CreateReportResult,
  PublicXrayReport,
  XrayReportRecord,
} from "@/lib/reports/types";
import { SITE_URL } from "@/lib/site";

const REPORT_TTL_MS =
  (Number(process.env.REPORTS_TTL_DAYS) || 30) * 24 * 60 * 60 * 1000;

const memoryStore = new Map<string, XrayReportRecord>();

function reportsDir(): string {
  return process.env.REPORTS_DIR || path.join(process.cwd(), ".data", "reports");
}

function reportPath(id: string): string {
  return path.join(reportsDir(), `${id}.json`);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isValidId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

function isExpired(record: XrayReportRecord): boolean {
  return Date.parse(record.expiresAt) < Date.now();
}

function toPublic(record: XrayReportRecord): PublicXrayReport {
  const { deletionTokenHash: _hash, email: _email, consent: _consent, ...rest } = record;
  return rest;
}

async function writeRecord(record: XrayReportRecord): Promise<void> {
  memoryStore.set(record.id, record);
  try {
    const dir = reportsDir();
    await mkdir(dir, { recursive: true });
    await writeFile(reportPath(record.id), JSON.stringify(record), "utf8");
  } catch {
    // Read-only or ephemeral filesystem — memory fallback only
  }
}

async function readRecord(id: string): Promise<XrayReportRecord | null> {
  if (!isValidId(id)) return null;

  const cached = memoryStore.get(id);
  if (cached) {
    if (isExpired(cached)) {
      await deleteRecord(id);
      return null;
    }
    return cached;
  }

  try {
    const raw = await readFile(reportPath(id), "utf8");
    const record = JSON.parse(raw) as XrayReportRecord;
    if (isExpired(record)) {
      await deleteRecord(id);
      return null;
    }
    memoryStore.set(id, record);
    return record;
  } catch {
    return null;
  }
}

async function deleteRecord(id: string): Promise<void> {
  memoryStore.delete(id);
  try {
    await unlink(reportPath(id));
  } catch {
    // already gone
  }
}

function sanitizeEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const trimmed = email.trim().toLowerCase().slice(0, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : undefined;
}

export async function createReport(input: CreateReportInput): Promise<CreateReportResult> {
  const id = crypto.randomUUID();
  const deletionToken = randomBytes(24).toString("hex");
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + REPORT_TTL_MS).toISOString();

  const record: XrayReportRecord = {
    id,
    createdAt,
    expiresAt,
    deletionTokenHash: hashToken(deletionToken),
    consent: true,
    email: sanitizeEmail(input.email),
    path: input.path,
    scannedUrl: input.scannedUrl?.slice(0, 500),
    scanDomain: input.scanDomain?.slice(0, 200),
    facts: (input.facts ?? []).slice(0, 30),
    confirmedFactIds: (input.confirmedFactIds ?? []).slice(0, 30),
    answers: input.answers,
    recommendation: input.recommendation,
  };

  await writeRecord(record);

  return {
    id,
    shareUrl: `${SITE_URL}/x-ray/${id}`,
    expiresAt,
    deletionToken,
  };
}

export async function getPublicReport(id: string): Promise<PublicXrayReport | null> {
  const record = await readRecord(id);
  return record ? toPublic(record) : null;
}

export async function deleteReport(id: string, deletionToken: string): Promise<boolean> {
  const record = await readRecord(id);
  if (!record) return false;

  const provided = hashToken(deletionToken);
  const expected = Buffer.from(record.deletionTokenHash, "hex");
  const actual = Buffer.from(provided, "hex");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return false;
  }

  await deleteRecord(id);
  return true;
}
