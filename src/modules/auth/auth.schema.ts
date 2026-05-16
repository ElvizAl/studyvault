import { z } from "zod";

export const registerSchema = z
	.object({
		name: z
			.string()
			.min(1, "Nama wajib diisi")
			.min(2, "Nama minimal 2 karakter"),
		email: z
			.string()
			.min(1, "Email wajib diisi")
			.email("Format email tidak valid"),
		password: z
			.string()
			.min(1, "Kata sandi wajib diisi")
			.min(8, "Kata sandi minimal 8 karakter"),
		password_confirmation: z
			.string()
			.min(1, "Konfirmasi kata sandi wajib diisi"),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: "Konfirmasi kata sandi tidak cocok",
		path: ["password_confirmation"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;
