import { neon } from '@neondatabase/serverless';

export const COMMENT_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type CommentStatus = (typeof COMMENT_STATUSES)[number];
export type ReviewStatus = Extract<CommentStatus, 'approved' | 'rejected'>;

export interface PublicComment {
  id: string;
  paperSlug: string;
  emailLabel: string;
  body: string;
  createdAt: string;
}

export interface AdminComment extends PublicComment {
  email: string;
  status: CommentStatus;
  reviewerNote: string | null;
  reviewedAt: string | null;
}

export interface NewCommentInput {
  paperSlug: string;
  email: string;
  body: string;
}

export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  error?: string;
}

const ALLOWED_PAPER_SLUGS = new Set(['ai-cognitive-replication']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let cachedSql: ReturnType<typeof neon> | null = null;

function getSql(): ReturnType<typeof neon> {
  const databaseUrl = import.meta.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  cachedSql ??= neon(databaseUrl);
  return cachedSql;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function validatePaperSlug(value: unknown): ValidationResult<string> {
  if (typeof value !== 'string' || !ALLOWED_PAPER_SLUGS.has(value)) {
    return { ok: false, error: 'Invalid paper slug.' };
  }

  return { ok: true, value };
}

export function validateStatus(value: unknown): ValidationResult<CommentStatus> {
  if (typeof value !== 'string' || !COMMENT_STATUSES.includes(value as CommentStatus)) {
    return { ok: false, error: 'Invalid comment status.' };
  }

  return { ok: true, value: value as CommentStatus };
}

export function validateReviewStatus(value: unknown): ValidationResult<ReviewStatus> {
  if (value !== 'approved' && value !== 'rejected') {
    return { ok: false, error: 'Review status must be approved or rejected.' };
  }

  return { ok: true, value };
}

export function validateNewComment(payload: unknown): ValidationResult<NewCommentInput> {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Invalid request body.' };
  }

  const record = payload as Record<string, unknown>;
  const paperSlug = validatePaperSlug(record.paperSlug);

  if (!paperSlug.ok || !paperSlug.value) {
    return { ok: false, error: paperSlug.error };
  }

  if (typeof record.email !== 'string') {
    return { ok: false, error: 'Email is required.' };
  }

  const email = record.email.trim();
  if (email.length === 0 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }

  if (typeof record.body !== 'string') {
    return { ok: false, error: 'Comment is required.' };
  }

  const body = normalizeCommentBody(record.body);
  if (body.length < 10 || body.length > 2000) {
    return { ok: false, error: 'Comment must be 10 to 2000 characters.' };
  }

  return {
    ok: true,
    value: {
      paperSlug: paperSlug.value,
      email,
      body,
    },
  };
}

export function validateReviewerNote(value: unknown): ValidationResult<string | null> {
  if (value == null || value === '') {
    return { ok: true, value: null };
  }

  if (typeof value !== 'string') {
    return { ok: false, error: 'Reviewer note must be text.' };
  }

  const note = value.trim();
  if (note.length > 500) {
    return { ok: false, error: 'Reviewer note must be 500 characters or fewer.' };
  }

  return { ok: true, value: note.length > 0 ? note : null };
}

export function hasHoneypotValue(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false;

  const website = (payload as Record<string, unknown>).website;
  return typeof website === 'string' && website.trim().length > 0;
}

export function authorizeAdminRequest(request: Request): Response | null {
  const token = import.meta.env.COMMENT_ADMIN_TOKEN;

  if (!token) {
    return jsonResponse({ ok: false, error: 'Comment admin token is not configured.' }, 500);
  }

  const authorization = request.headers.get('Authorization') ?? '';
  if (authorization !== `Bearer ${token}`) {
    return jsonResponse({ ok: false, error: 'Unauthorized.' }, 401);
  }

  return null;
}

export async function createPendingComment(input: NewCommentInput): Promise<{ ok: boolean; limited?: boolean }> {
  const sql = getSql();
  const emailNormalized = input.email.toLowerCase();

  const rateRows = asRows(await sql`
    select count(*)::int as count
    from paper_comments
    where paper_slug = ${input.paperSlug}
      and email_normalized = ${emailNormalized}
      and status = 'pending'
      and created_at > now() - interval '1 hour'
  `);
  const pendingCount = Number(rateRows[0]?.count ?? 0);

  if (pendingCount >= 5) {
    return { ok: false, limited: true };
  }

  await sql`
    insert into paper_comments (id, paper_slug, email, email_normalized, body, status)
    values (${globalThis.crypto.randomUUID()}, ${input.paperSlug}, ${input.email}, ${emailNormalized}, ${input.body}, 'pending')
  `;

  return { ok: true };
}

export async function listApprovedComments(paperSlug: string): Promise<PublicComment[]> {
  const sql = getSql();
  const rows = asRows(await sql`
    select id, paper_slug, email, body, created_at
    from paper_comments
    where paper_slug = ${paperSlug}
      and status = 'approved'
    order by created_at desc
    limit 100
  `);

  return rows.map((row) => toPublicComment(row));
}

export async function listAdminComments(status: CommentStatus): Promise<AdminComment[]> {
  const sql = getSql();
  const rows = asRows(await sql`
    select id, paper_slug, email, body, status, created_at, reviewed_at, reviewer_note
    from paper_comments
    where status = ${status}
    order by created_at desc
    limit 100
  `);

  return rows.map((row) => toAdminComment(row));
}

export async function reviewComment(
  id: string,
  status: ReviewStatus,
  reviewerNote: string | null
): Promise<AdminComment | null> {
  const sql = getSql();
  const rows = asRows(await sql`
    update paper_comments
    set status = ${status},
        reviewer_note = ${reviewerNote},
        reviewed_at = now()
    where id = ${id}
    returning id, paper_slug, email, body, status, created_at, reviewed_at, reviewer_note
  `);

  if (!rows[0]) return null;
  return toAdminComment(rows[0]);
}

function asRows(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function normalizeCommentBody(value: string): string {
  return value.trim().replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
}

function toPublicComment(row: Record<string, unknown>): PublicComment {
  const email = String(row.email ?? '');

  return {
    id: String(row.id),
    paperSlug: String(row.paper_slug),
    emailLabel: maskEmail(email),
    body: String(row.body),
    createdAt: toIsoDate(row.created_at),
  };
}

function toAdminComment(row: Record<string, unknown>): AdminComment {
  const publicComment = toPublicComment(row);

  return {
    ...publicComment,
    email: String(row.email ?? ''),
    status: row.status as CommentStatus,
    reviewerNote: row.reviewer_note == null ? null : String(row.reviewer_note),
    reviewedAt: row.reviewed_at == null ? null : toIsoDate(row.reviewed_at),
  };
}

function toIsoDate(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@');
  const [domainName = '', ...domainRest] = domain.split('.');
  const domainSuffix = domainRest.join('.') || 'email';

  return `${maskPart(local)}@${maskPart(domainName)}.${domainSuffix}`;
}

function maskPart(value: string): string {
  if (value.length <= 1) return '*';
  if (value.length === 2) return `${value[0]}*`;
  return `${value[0]}***${value[value.length - 1]}`;
}
