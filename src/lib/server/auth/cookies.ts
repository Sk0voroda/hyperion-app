import type { Cookies } from '@sveltejs/kit';

export const setSessionTokenCookie = (cookies: Cookies, token: string, expiresAt: Date) => {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
};

export const deleteSessionTokenCookie = (cookies: Cookies) => {
	cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
};
