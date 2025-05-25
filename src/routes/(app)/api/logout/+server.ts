import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	if (!locals.session) {
		return new Response(null, { status: 404 });
	}

	try {
		await invalidateSession(locals.session.id);
		deleteSessionTokenCookie(cookies);
		return new Response(null, { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response(null, { status: 404 });
	}
};
