import type { APIRoute } from 'astro';
import {
  authorizeAdminRequest,
  jsonResponse,
  parseJsonBody,
  reviewComment,
  validateReviewStatus,
  validateReviewerNote,
} from '../../../../lib/comments';

export const prerender = false;

export const PATCH = (async ({ params, request }) => {
  const unauthorized = authorizeAdminRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  const id = params.id;
  if (!id) {
    return jsonResponse({ ok: false, error: 'Comment id is required.' }, 400);
  }

  const payload = await parseJsonBody(request);
  if (!payload || typeof payload !== 'object') {
    return jsonResponse({ ok: false, error: 'Invalid request body.' }, 400);
  }

  const record = payload as Record<string, unknown>;
  const status = validateReviewStatus(record.status);
  const reviewerNote = validateReviewerNote(record.reviewerNote);

  if (!status.ok || !status.value) {
    return jsonResponse({ ok: false, error: status.error }, 400);
  }

  if (!reviewerNote.ok) {
    return jsonResponse({ ok: false, error: reviewerNote.error }, 400);
  }

  try {
    const comment = await reviewComment(id, status.value, reviewerNote.value ?? null);

    if (!comment) {
      return jsonResponse({ ok: false, error: 'Comment not found.' }, 404);
    }

    return jsonResponse({ ok: true, comment });
  } catch (error) {
    console.error('Failed to review comment', error);
    return jsonResponse({ ok: false, error: 'Comment could not be updated.' }, 500);
  }
}) satisfies APIRoute;
