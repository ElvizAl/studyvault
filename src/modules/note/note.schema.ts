import { z } from "zod";

export const createNoteSchema = z.object({
	title: z.string().optional(),
	content: z.string().optional(),
	notebookId: z.string().uuid().nullable().optional(),
});

export const updateNoteSchema = z.object({
	id: z.string().uuid(),
	title: z.string().optional(),
	content: z.string().optional(),
	notebookId: z.string().uuid().nullable().optional(),
});

export const deleteNoteSchema = z.object({
	id: z.string().uuid(),
});

export const restoreNoteSchema = z.object({
	id: z.string().uuid(),
});

export const permanentDeleteNoteSchema = z.object({
	id: z.string().uuid(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;
export type RestoreNoteInput = z.infer<typeof restoreNoteSchema>;
export type PermanentDeleteNoteInput = z.infer<
	typeof permanentDeleteNoteSchema
>;
