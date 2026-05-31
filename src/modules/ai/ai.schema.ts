import { z } from "zod";

export const getSummarySchema = z.object({
	noteId: z.string().uuid(),
});

export const generateSummarySchema = z.object({
	noteId: z.string().uuid(),
	content: z.string(),
});

export type GetSummaryInput = z.infer<typeof getSummarySchema>;
export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;
