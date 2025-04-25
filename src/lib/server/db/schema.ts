import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { init } from '@paralleldrive/cuid2';

const cuid = init({ length: 14 });

export const accounts = sqliteTable('accounts', {
	id: text('id', { length: 14 })
		.$defaultFn(() => cuid())
		.primaryKey(),
	name: text().notNull().unique(),
	phoneNumber: text().notNull().unique(),
	sessionToken: blob({ mode: 'buffer' })
});
