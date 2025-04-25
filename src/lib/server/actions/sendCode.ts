import { Context, Effect } from 'effect';
import type { Cookies as CookiesType } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { accounts } from '../db/schema';

import { getClient } from '../telegram';

import { API_HASH, API_ID } from '$env/static/private';

export class Cookies extends Context.Tag('Cookies')<
	CookiesType,
	{ readonly set: CookiesType['set'] }
>() {}

// export class GramClient extends Context.Tag('GramClient')<
// 	TelegramClient,
// 	{ readonly connect: TelegramClient['connect']; readonly sendCode: TelegramClient['sendCode'] }
// >() {}

export const sendCode = (
	id: string
): Effect.Effect<
	{
		success: boolean;
		authorized?: boolean;
	},
	{
		status: string;
	},
	CookiesType
> =>
	Effect.gen(function* () {
		const cookies = yield* Cookies;

		const account = yield* Effect.tryPromise({
			try: () => db.select().from(accounts).where(eq(accounts.id, id)).limit(1).get(),
			catch: () => ({ status: 'DB_CONNECTION_ERROR' })
		});

		if (!account) {
			return yield* Effect.fail({ status: 'ACCOUNT_NOT_FOUND' });
		}

		// TODO: add phone validation
		if (!account.phoneNumber) {
			return yield* Effect.fail({ status: 'INVALID_PHONE_NUMBER_FORMAT' });
		}

		if (account.sessionToken) {
			return yield* Effect.succeed({ success: true, authorized: true });
		}

		const client = getClient(account.phoneNumber);

		yield* Effect.tryPromise({
			try: () => client.connect(),
			catch: () => ({ status: 'TELEGRAM_CLIENT_ERROR' })
		});

		const sendCodeResult = yield* Effect.tryPromise({
			try: () =>
				client.sendCode(
					{
						apiId: Number(API_ID),
						apiHash: API_HASH
					},
					account.phoneNumber
				),
			catch: (err) => ({ status: (err as { errorMessage: string }).errorMessage })
		});

		// TODO: make const
		yield* Effect.try({
			try: () => {
				cookies.set('phoneNumber', account.phoneNumber, { path: '/' });
				cookies.set('phoneCodeHash', sendCodeResult.phoneCodeHash, { path: '/' });
			},
			catch: () => ({ status: 'COOKIE_SET_ERROR' })
		});

		return yield* Effect.succeed({ success: true });
	});
