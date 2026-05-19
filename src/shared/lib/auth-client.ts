import { createAuthClient } from "better-auth/react";

// In the browser, `process.env.BETTER_AUTH_URL` is NOT available (it is a
// server-only env var). When the client falls back to an empty baseURL but
// `window` isn't available yet, requests can be sent to the wrong origin and
// trigger 500s through the reverse proxy. Use the current window origin in
// the browser and fall back to the server env var during SSR.
const baseURL =
	typeof window !== "undefined"
		? window.location.origin
		: process.env.BETTER_AUTH_URL || "";

export const authClient = createAuthClient({
	baseURL,
});

export const { signUp, signOut, signIn, useSession } = authClient;
