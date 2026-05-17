import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/shared/lib/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		autoSignIn: false,
	},
	session: {
		expiresIn: 30 * 24 * 60 * 60,
	},
	plugins: [tanstackStartCookies()],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
