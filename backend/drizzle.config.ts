import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/models/*.ts',
  out: './drizzle',
  dialect:'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
