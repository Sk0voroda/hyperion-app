import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { accountTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	try {
		const accountsResult = await db.select().from(accountTable);

		return { accounts: accountsResult };
	} catch (error) {
		console.error(error);
		return { accounts: [] };
	}
};

export const actions = {
	delete_account: async ({ url }) => {
		const id = url.searchParams.get('id');

		if (!id) {
			return fail(404, { error: true, message: 'Id is missing' });
		}

		try {
			await db.delete(accountTable).where(eq(accountTable.id, id));
			return { success: true };
		} catch {
			return fail(400, { error: true, message: 'Something went wrong!' });
		}
	}
} satisfies Actions;
