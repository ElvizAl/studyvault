import { dbMiddleware } from "@/shared/middleware/db.middleware";
import { createServerFn } from "@tanstack/react-start";
import { registerSchema } from "@/modules/auth/auth.schema";
import { auth, type ErrorCode } from "@/shared/lib/auth";

type RegisterResult =
	| { success: true; message: string }
	| { success: false; error: string; code: ErrorCode };

const errorMessages: Record<string, string> = {
	USER_ALREADY_EXISTS:
		"Email sudah terdaftar. Silakan gunakan email lain atau login.",
	INVALID_EMAIL: "Format email tidak valid.",
	PASSWORD_TOO_SHORT: "Password terlalu pendek. Minimal 8 karakter.",
	INVALID_EMAIL_OR_PASSWORD: "Email atau password tidak valid.",
};

export const registerServerFn = createServerFn({ method: "POST" })
	.middleware([dbMiddleware])
	.inputValidator(registerSchema)
	.handler(async ({ data }): Promise<RegisterResult> => {
		try {
			await auth.api.signUpEmail({
				body: {
					name: data.name,
					email: data.email,
					password: data.password,
				},
			});

			return {
				success: true,
				message: "Akun berhasil dibuat! Silakan login.",
			};
		} catch (error: unknown) {
			console.error("[Register Error]", error);

			// Better Auth errors may come as plain Error or Response-like objects
			// Try to extract error code from various error shapes
			let errorCode: string | undefined;
			let errorMessage: string | undefined;

			if (error && typeof error === "object") {
				// Handle APIError-like objects (has body with code)
				if ("body" in error && error.body && typeof error.body === "object") {
					const body = error.body as Record<string, unknown>;
					errorCode = typeof body.code === "string" ? body.code : undefined;
					errorMessage =
						typeof body.message === "string" ? body.message : undefined;
				}

				// Handle errors with status and message directly
				if (!errorCode && "message" in error) {
					errorMessage = (error as { message: string }).message;
				}

				// Handle Response-like errors (fetch-based)
				if ("status" in error && "statusText" in error) {
					const status = (error as { status: number }).status;
					if (status === 422 || status === 400) {
						errorMessage = errorMessage ?? "Data yang dikirim tidak valid.";
					}
				}
			}

			const friendlyMessage =
				(errorCode ? errorMessages[errorCode] : undefined) ??
				errorMessage ??
				"Terjadi kesalahan saat mendaftar. Silakan coba lagi.";

			return {
				success: false,
				error: friendlyMessage,
				code: (errorCode as ErrorCode) ?? "UNKNOWN",
			};
		}
	});
