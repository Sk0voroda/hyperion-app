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
