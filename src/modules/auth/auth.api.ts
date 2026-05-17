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

async function parseErrorFromResponse(
	response: Response,
): Promise<{ code?: string; message?: string }> {
	try {
		const body = await response.json();
		return {
			code: typeof body.code === "string" ? body.code : undefined,
			message: typeof body.message === "string" ? body.message : undefined,
		};
	} catch {
		return {
			message: response.statusText || "Terjadi kesalahan pada server.",
		};
	}
}

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

			let errorCode: string | undefined;
			let errorMessage: string | undefined;

			// Better Auth can throw a Response object
			if (error instanceof Response) {
				const parsed = await parseErrorFromResponse(error);
				errorCode = parsed.code;
				errorMessage = parsed.message;
			} else if (error && typeof error === "object") {
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
