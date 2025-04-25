import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bigInt from 'big-integer';
import { Effect } from 'effect';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';

import { Cookies, sendCode } from '$lib/server/actions';
import { clientsMap, getClient } from '$lib/server/telegram';

type TError = {
	errorMessage: string;
};

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	if (!id) {
		return { account: undefined };
	}

	try {
		const account = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1).get();

		return { account };
	} catch (error) {
		console.error(error);
		return { account: undefined };
	}
};

export const actions = {
	delete_account: async ({ params }) => {
		const id = params.id;

		if (!id) {
			return fail(404, { message: 'Account doesnt exist!' });
		}

		try {
			const account = await db
				.delete(accounts)
				.where(eq(accounts.id, id))
				.limit(1)
				.returning()
				.get();

			if (account) {
				clientsMap.delete(account.phoneNumber);
			}
			return { success: true };
		} catch {
			return fail(400, { error: true, message: 'Something went wrong!' });
		}
	},
	send_code: ({ cookies, params }) =>
		sendCode(params.id).pipe(
			Effect.match({
				onSuccess: (success) => success,
				onFailure: (error) => fail(404, { error: true, status: error.status })
			}),
			Effect.provideService(Cookies, { set: cookies.set.bind(cookies) }),
			Effect.runPromise
		),
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const phoneCode = data.get('code')?.toString();
		const password = data.get('password')?.toString();

		const phoneNumber = cookies.get('phoneNumber');
		const phoneCodeHash = cookies.get('phoneCodeHash');

		if (!password || !phoneCode) {
			return fail(400, { error: true, status: 'PASSWORD_IS_MISSING' });
		}

		if (!phoneCodeHash || !phoneNumber) {
			return fail(400, { error: true, status: 'NO_CODE_SENT' });
		}

		const client = getClient(phoneNumber);

		try {
			await client.start({
				phoneNumber: () => Promise.resolve(phoneNumber),
				password: () => Promise.resolve(password),
				phoneCode: () => Promise.resolve(phoneCode),
				onError: (err) => {
					throw err;
				}
			});

			cookies.delete('phoneNumber', { path: '/' });
			cookies.delete('phoneCodeHash', { path: '/' });

			const token = client.session.authKey?.getKey();
			await db.update(accounts).set({ sessionToken: token });

			return { success: true, authorized: true };
		} catch (error) {
			const err = error as TError;
			return fail(400, { error: true, status: err.errorMessage });
		}
	}
	// // test get message form change action
	// get_message: async ({ params }) => {
	// 	// temporary
	// 	const account = await db
	// 		.select()
	// 		.from(accounts)
	// 		.where(eq(accounts.id, params.id))
	// 		.limit(1)
	// 		.get();

	// 	if (!account) {
	// 		return fail(400, { error: true, status: 'ERROR' });
	// 	}

	// 	const client = getClient(account.phoneNumber);

	// 	await client.connect();

	// 	try {
	// 		for await (const message of client.iterMessages(bigInt('-1001536630827'))) {
	// 			console.log(message);
	// 			break;
	// 		}
	// 	} catch (error) {
	// 		console.log({ error });
	// 	}

	// 	return { retrieved: true };
	// }
} satisfies Actions;
