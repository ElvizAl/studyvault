import { createAuthClient } from "better-auth/react";
import { env } from "@/shared/config/env";

export const authClient = createAuthClient({
	baseURL: env.BETTER_AUTH_URL,
});

export const { signUp, signOut, signIn, useSession } = authClient;
