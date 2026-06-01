import type { APIRoute } from 'astro';
import {
  authorizeAdminRequest,
  jsonResponse,
  listAdminComments,
  validateStatus,
} from '../../../lib/comments';

export const prerender = false;

export const GET = (async ({ request, url }) => {
  const unauthorized = authorizeAdminRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  const status = validateStatus(url.searchParams.get('status') ?? 'pending');

  if (!status.ok || !status.value) {
    return jsonResponse({ ok: false, error: status.error }, 400);
  }

  try {
    const comments = await listAdminComments(status.value);
    return jsonResponse({ ok: true, comments });
  } catch (error) {
    console.error('Failed to list admin comments', error);
    return jsonResponse({ ok: false, error: 'Comments are unavailable.' }, 500);
  }
}) satisfies APIRoute;
