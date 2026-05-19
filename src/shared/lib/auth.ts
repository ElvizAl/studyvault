import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/shared/lib/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const baseURL =
	process.env.BETTER_AUTH_URL ||
	process.env.VITE_BETTER_AUTH_URL ||
	"http://localhost:3000";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (process.env.NODE_ENV === "production") {
	if (!process.env.BETTER_AUTH_SECRET) {
		console.warn(
			"[auth] BETTER_AUTH_SECRET is not set. Authentication will fail in production.",
		);
	}
	if (!googleClientId || !googleClientSecret) {
		console.warn(
			"[auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set. Google sign-in will fail.",
		);
	}
}

export const auth = betterAuth({
	baseURL,
	secret: process.env.BETTER_AUTH_SECRET,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [
		baseURL,
		"http://localhost:3000",
		"https://studentvault.my.id",
	],
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		autoSignIn: false,
	},
	socialProviders: {
		google: {
			clientId: googleClientId ?? "",
			clientSecret: googleClientSecret ?? "",
			redirectURI: `${baseURL.replace(/\/$/, "")}/api/auth/callback/google`,
		},
	},
	session: {
		expiresIn: 30 * 24 * 60 * 60,
	},
	plugins: [tanstackStartCookies()],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
