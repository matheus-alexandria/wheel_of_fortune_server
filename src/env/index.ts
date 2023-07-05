import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production']),
  CSV_FILES_PATH: z.string(),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
