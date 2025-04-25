import { drizzle } from 'drizzle-orm/libsql';

// TODO: move to var
export const db = drizzle('file:local.db');
