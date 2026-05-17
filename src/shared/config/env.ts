import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	BETTER_AUTH_URL: z.string().url(),
	BETTER_AUTH_SECRET: z.string(),
	OPENAI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
