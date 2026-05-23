// Note model definitions for the application
export interface Note {
	id: string;
	userId: string;
	notebookId: string | null;
	title: string;
	content: string;
	wordCount: number;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}

export interface NoteInput {
	id?: string;
	userId: string;
	notebookId?: string | null;
	title?: string;
	content?: string;
	wordCount?: number;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date | null;
}

export interface NoteCreateInput {
	title?: string;
	content?: string;
	notebookId?: string | null;
}

export interface NoteUpdateInput {
	title?: string;
	content?: string;
	notebookId?: string | null;
	wordCount?: number;
}

export const createNoteDefaults = (): NoteCreateInput => ({
	title: "Untitled",
	content: "",
	notebookId: null,
});
