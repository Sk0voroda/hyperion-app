import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';

// TODO: validation transformation
export const actions = {
	add_account: async ({ request }) => {
		const data = await request.formData();
		const phoneNumber = data.get('phoneNumber')?.toString();
		const name = data.get('name')?.toString();

		if (!phoneNumber || phoneNumber.length === 0) {
			return fail(400, { error: true, message: 'Wrong phone number!' });
		}
		if (!name) {
			return fail(400, { error: true, message: 'Name is required!' });
		}

		try {
			await db.insert(accounts).values({ name, phoneNumber });
			return { success: true };
		} catch (error) {
			const err = error as Error;
			return fail(404, {
				error: true,
				message: err.message
			});
		}
	}
} satisfies Actions;
