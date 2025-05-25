import { blob, check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { init } from '@paralleldrive/cuid2';
import { timestamp } from 'drizzle-orm/gel-core';
import { sql, type InferSelectModel } from 'drizzle-orm';

// TODO: maybe fix id
const cuid = init({ length: 14 });

const EMAIL_LEN = 64;
const PASSWORD_LEN = 64;

export const userTable = sqliteTable(
	'user',
	{
		id: text('id', { length: 14 })
			.$defaultFn(() => cuid())
			.primaryKey(),
		email: text('email', { length: EMAIL_LEN }).notNull().unique(),
		createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
		password: text('password', { length: PASSWORD_LEN }).notNull()
	},
	(table) => [
		// EMAIL_LEN
		check('email', sql`length(${table.email}) <= 64`),
		// PASSWORD_LEN
		check('password', sql`length(${table.password}) <= 64`)
	]
);

export type User = InferSelectModel<typeof userTable>;

export const sessionTable = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at', {
		mode: 'timestamp'
	}).notNull()
});

export type Session = InferSelectModel<typeof sessionTable>;

export const accountTable = sqliteTable('accounts', {
	id: text('id', { length: 14 })
		.$defaultFn(() => cuid())
		.primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	name: text().notNull().unique(),
	phoneNumber: text().notNull().unique(),
	sessionToken: blob({ mode: 'buffer' })
});
