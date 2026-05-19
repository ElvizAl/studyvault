import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { dbMiddleware } from "@/shared/middleware/db.middleware";
import { auth } from "@/shared/lib/auth";
import {
	createNoteSchema,
	updateNoteSchema,
	deleteNoteSchema,
	restoreNoteSchema,
	permanentDeleteNoteSchema,
} from "./note.schema";
import { z } from "zod";

// Helper to get session and throw if unauthenticated
async function requireSession() {
	const session = await auth.api.getSession({
		headers: getRequestHeaders(),
	});
	if (!session) {
		throw new Error("Unauthenticated");
	}
	return session;
}

// Calculate word count helper
function getWordCount(text: string) {
	return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export const createNoteFn = createServerFn({ method: "POST" })
	.middleware([dbMiddleware])
	.inputValidator(createNoteSchema)
	.handler(async ({ context, data }) => {
		const session = await requireSession();

		const note = await context.db.note.create({
			data: {
				userId: session.user.id,
				title: data.title || "Untitled",
				content: data.content || "",
				wordCount: getWordCount(data.content || ""),
				notebookId: data.notebookId || null,
			},
		});

		return note;
	});

export const updateNoteFn = createServerFn({ method: "POST" })
	.middleware([dbMiddleware])
	.inputValidator(updateNoteSchema)
	.handler(async ({ context, data }) => {
		const session = await requireSession();

		const existing = await context.db.note.findFirst({
			where: { id: data.id, userId: session.user.id },
		});

		if (!existing) {
			throw new Error("Note not found or access denied");
		}

		const updated = await context.db.note.update({
			where: { id: data.id },
			data: {
				title: data.title ?? existing.title,
				content: data.content ?? existing.content,
				wordCount: data.content !== undefined ? getWordCount(data.content) : existing.wordCount,
				notebookId: data.notebookId !== undefined ? data.notebookId : existing.notebookId,
			},
		});

		return updated;
	});

export const deleteNoteFn = createServerFn({ method: "POST" })
	.middleware([dbMiddleware])
	.inputValidator(deleteNoteSchema)
	.handler(async ({ context, data }) => {
		const session = await requireSession();

		const existing = await context.db.note.findFirst({
			where: { id: data.id, userId: session.user.id },
		});

		if (!existing) {
			throw new Error("Note not found or access denied");
		}

		await context.db.note.update({
			where: { id: data.id },
			data: {
				deletedAt: new Date(),
			},
		});

		return { success: true };
	});

export const restoreNoteFn = createServerFn({ method: "POST" })
	.middleware([dbMiddleware])
	.inputValidator(restoreNoteSchema)
	.handler(async ({ context, data }) => {
		const session = await requireSession();

		const existing = await context.db.note.findFirst({
			where: { id: data.id, userId: session.user.id },
		});

		if (!existing) {
			throw new Error("Note not found or access denied");
		}

		let notebookId = existing.notebookId;
		if (notebookId) {
			const notebookExists = await context.db.notebook.findFirst({
				where: { id: notebookId, userId: session.user.id, deletedAt: null },
			});
			if (!notebookExists) {
				notebookId = null;
			}
		}

		const restored = await context.db.note.update({
			where: { id: data.id },
			data: {
				deletedAt: null,
				notebookId,
			},
		});

		return restored;
	});

export const permanentDeleteNoteFn = createServerFn({ method: "POST" })
	.middleware([dbMiddleware])
	.inputValidator(permanentDeleteNoteSchema)
	.handler(async ({ context, data }) => {
		const session = await requireSession();

		const existing = await context.db.note.findFirst({
			where: { id: data.id, userId: session.user.id },
		});

		if (!existing) {
			throw new Error("Note not found or access denied");
		}

		await context.db.note.delete({
			where: { id: data.id },
		});

		return { success: true };
	});

export const getNotesFn = createServerFn({ method: "GET" })
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const session = await requireSession();

		const notes = await context.db.note.findMany({
			where: {
				userId: session.user.id,
				deletedAt: null,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});

		return notes;
	});

export const getTrashNotesFn = createServerFn({ method: "GET" })
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const session = await requireSession();

		const notes = await context.db.note.findMany({
			where: {
				userId: session.user.id,
				deletedAt: {
					not: null,
				},
			},
			orderBy: {
				deletedAt: "desc",
			},
		});

		return notes;
	});

export const getNoteByIdFn = createServerFn({ method: "GET" })
	.middleware([dbMiddleware])
	.inputValidator(z.object({ id: z.string().uuid() }))
	.handler(async ({ context, data }) => {
		const session = await requireSession();

		const note = await context.db.note.findFirst({
			where: {
				id: data.id,
				userId: session.user.id,
			},
		});

		return note;
	});
