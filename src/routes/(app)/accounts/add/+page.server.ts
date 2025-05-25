import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { accountTable } from '$lib/server/db/schema';

// TODO: validation transformation
export const actions = {
	add_account: async ({ request, locals }) => {
		const data = await request.formData();
		const phoneNumber = data.get('phoneNumber')?.toString();
		const name = data.get('name')?.toString();

		if (!locals.user) {
			return fail(401, { error: true, message: 'Unathoried access' });
		}

		if (!phoneNumber || phoneNumber.length === 0) {
			return fail(400, { error: true, message: 'Wrong phone number!' });
		}
		if (!name) {
			return fail(400, { error: true, message: 'Name is required!' });
		}

		try {
			await db.insert(accountTable).values({ name, phoneNumber, userId: locals.user.id });
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
