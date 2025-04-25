import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// TODO: auth
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.id;

	if (!id) {
		return new Response(null, { status: 404 });
	}

	try {
		const account = await db.delete(accounts).where(eq(accounts.id, id)).returning();
		const accountBody = JSON.stringify({ account: account[0] });

		return new Response(JSON.stringify({ account: accountBody }), { status: 200 });
	} catch (error) {
		return new Response(null, { status: 404 });
	}
};
