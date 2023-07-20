import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production']),
  PORT: z.coerce.number().default(3333),
});

const envParsed = envSchema.safeParse(process.env);

if (envParsed.success === false) {
  console.log('Incorrect env variables', envParsed.error.format());

  throw new Error('Incorrect env variables');
}

export const env = envParsed.data;
