import { eq, sql } from 'drizzle-orm';

import { db } from '..';
import { sessionTable, userTable } from '../schema';

export const getSessionQuery = db
	.select({ user: userTable, session: sessionTable })
	.from(sessionTable)
	.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
	.where(eq(sessionTable.id, sql.placeholder('sessionId')))
	.limit(1)
	.prepare();

export const deleteSessionQuery = db
	.delete(sessionTable)
	.where(eq(sessionTable.id, sql.placeholder('sessionId')))
	.prepare();

export const deleteUserSessionsQuery = db
	.delete(sessionTable)
	.where(eq(sessionTable.userId, sql.placeholder('userId')))
	.prepare();

export const selectUserByEmailQuery = db
	.select()
	.from(userTable)
	.where(eq(userTable.email, sql.placeholder('email')))
	.limit(1)
	.prepare();
