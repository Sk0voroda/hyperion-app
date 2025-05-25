// import type { User, Session } from './db.js';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

import { eq } from 'drizzle-orm';
import { db } from '../db';
import { sessionTable, userTable, type Session, type User } from '../db/schema';

export const generateSessionToken = () => {
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
};

export const createSession = async (token: string, userId: string) => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		// expire time 30 days
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};

	// TODO: error handling
	await db.insert(sessionTable).values(session);
	return session;
};

export const validateSessionToken = async (token: string) => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const result = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.id, sessionId))
		.get();

	if (!result) {
		return { session: null, user: null };
	}

	const { user, session } = result;

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessionTable.id, session.id));
	}

	return { session, user };
};

export const invalidateSession = async (sessionId: string) => {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
};

export const invalidateAllSessions = async (userId: string) => {
	await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
};

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
