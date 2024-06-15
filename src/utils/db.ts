import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import config from './config';

const connectionString = config.POSTGRES_DB_URL;

const db = drizzle(postgres(connectionString));

export default db;
