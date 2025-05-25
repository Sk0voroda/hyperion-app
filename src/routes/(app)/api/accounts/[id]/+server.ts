import { db } from '$lib/server/db';
import { accountTable } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// TODO: auth
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.id;

	if (!id) {
		return new Response(null, { status: 404 });
	}

	try {
		const account = await db.delete(accountTable).where(eq(accountTable.id, id)).returning();
		const accountBody = JSON.stringify({ account: account[0] });

		return new Response(JSON.stringify({ account: accountBody }), { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response(null, { status: 404 });
	}
};
