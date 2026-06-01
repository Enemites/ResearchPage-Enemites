import type { APIRoute } from 'astro';
import {
  createPendingComment,
  hasHoneypotValue,
  jsonResponse,
  listApprovedComments,
  parseJsonBody,
  validateNewComment,
  validatePaperSlug,
} from '../../lib/comments';

export const prerender = false;

export const GET = (async ({ url }) => {
  const paperSlug = validatePaperSlug(url.searchParams.get('paperSlug'));

  if (!paperSlug.ok || !paperSlug.value) {
    return jsonResponse({ ok: false, error: paperSlug.error }, 400);
  }

  try {
    const comments = await listApprovedComments(paperSlug.value);
    return jsonResponse({ ok: true, comments });
  } catch (error) {
    console.error('Failed to list public comments', error);
    return jsonResponse({ ok: false, error: 'Comments are unavailable.' }, 500);
  }
}) satisfies APIRoute;

export const POST = (async ({ request }) => {
  const payload = await parseJsonBody(request);

  if (hasHoneypotValue(payload)) {
    return jsonResponse({ ok: true, status: 'pending' }, 202);
  }

  const comment = validateNewComment(payload);

  if (!comment.ok || !comment.value) {
    return jsonResponse({ ok: false, error: comment.error }, 400);
  }

  try {
    const result = await createPendingComment(comment.value);

    if (result.limited) {
      return jsonResponse({ ok: false, error: 'Too many pending comments. Try again later.' }, 429);
    }

    return jsonResponse({ ok: true, status: 'pending' }, 202);
  } catch (error) {
    console.error('Failed to create pending comment', error);
    return jsonResponse({ ok: false, error: 'Comment could not be submitted.' }, 500);
  }
}) satisfies APIRoute;
