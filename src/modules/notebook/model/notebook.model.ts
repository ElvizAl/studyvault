// Notebook model definitions for the application
export interface Notebook {
	id: string;
	userId: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}

export interface NotebookWithNotes extends Notebook {
	notes: Array<{
		id: string;
		userId: string;
		notebookId: string | null;
		title: string;
		content: string;
		wordCount: number;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
	}>;
}

export interface NotebookInput {
	id?: string;
	userId: string;
	name: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date | null;
}

export interface NotebookCreateInput {
	name?: string;
}

export interface NotebookUpdateInput {
	name?: string;
}

export const createNotebookDefaults = (): NotebookCreateInput => ({
	name: "Untitled Notebook",
});

export const isNotebookOwner = (
	notebook: Notebook,
	userId: string,
): boolean => {
	return notebook.userId === userId;
};

export const isNotebookDeleted = (notebook: Notebook): boolean => {
	return notebook.deletedAt !== null;
};
