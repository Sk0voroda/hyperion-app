import type { Handle } from '@sveltejs/kit';

import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;

	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;

		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event.cookies, token, session.expiresAt);

		event.locals.session = session;
		event.locals.user = user;
	} else {
		deleteSessionTokenCookie(event.cookies);
	}

	return resolve(event);
};
