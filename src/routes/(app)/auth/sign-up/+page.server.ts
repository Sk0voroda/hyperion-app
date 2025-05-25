import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { hashPassword } from '$lib/server/auth';

export const actions = {
	create_account: async ({ request }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const repeatPassword = data.get('repeat_password');

		if (!email || !password || !repeatPassword) {
			return fail(404, { error: true, message: 'field is missing' });
		}

		if (password !== repeatPassword) {
			return fail(404, { error: true, message: 'passwords are not same' });
		}

		let created = false;
		try {
			const hashedPassword = hashPassword(password);
			await db.insert(userTable).values({ email, password: hashedPassword });

			created = true;
		} catch (error) {
			console.error(error);
			return fail(404, { error: true, message: 'something went wrong!' });
		}

		if (created) {
			redirect(303, '/');
		}
	}
} satisfies Actions;
