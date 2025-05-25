import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import {
	createSession,
	generateSessionToken,
	isPasswordValid,
	setSessionTokenCookie
} from '$lib/server/auth';
import { selectUserByEmailQuery } from '$lib/server/db/queries';

export const actions = {
	login: async ({ request, cookies }) => {
		// add validation
		const data = await request.formData();

		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(404, { error: true, message: 'field is missing' });
		}

		try {
			const [user] = await selectUserByEmailQuery.all({ email });

			if (!user) {
				return fail(404, { error: true, message: 'user not found' });
			}

			if (!isPasswordValid(password, user.password)) {
				return fail(404, { error: true, message: 'wrong password' });
			}

			const token = generateSessionToken();
			const session = await createSession(token, user.id);

			setSessionTokenCookie(cookies, token, session.expiresAt);
		} catch (error) {
			console.error(error);
			return fail(404, { error: true, message: 'something' });
		}
	}
} satisfies Actions;
