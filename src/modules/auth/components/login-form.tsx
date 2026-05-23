import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldSeparator,
	FieldLabel,
} from "@/shared/components/ui/field.tsx";
import { Input } from "@/shared/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { loginServerFn } from "@/modules/auth/auth.api";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { loginSchema, type LoginFormValues } from "@/modules/auth/auth.schema";
import { toast } from "sonner";
import { authClient } from "@/shared/lib/auth-client";
import { FileText, LayoutGrid, Sparkles } from "lucide-react";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: standardSchemaResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: LoginFormValues) {
		try {
			const result = await loginServerFn({ data });

			if (!result) {
				const message = "Terjadi kesalahan pada server. Silakan coba lagi.";
				setError("root", { message });
				toast.error(message);
				return;
			}

			if (result.success) {
				toast.success(result.message);
				navigate({ to: "/app" });
			} else {
				setError("root", { message: result.error });
				toast.error(result.error);
			}
		} catch (error: unknown) {
			console.error("[Login Client Error]", error);
			let message = "Terjadi kesalahan. Silakan coba lagi.";

			if (error && typeof error === "object") {
				if ("result" in error) {
					const res = (error as { result: { error?: string } }).result;
					if (res?.error) message = res.error;
				} else if ("message" in error) {
					message = (error as { message: string }).message || message;
				}
			}

			setError("root", { message });
			toast.error(message);
		}
	}

	return (
		<form
			className={cn("flex flex-col gap-5", className)}
			onSubmit={handleSubmit(onSubmit)}
			{...props}
		>
			<FieldGroup className="gap-5">
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-xl font-semibold tracking-tight text-foreground">
						Welcome Back
					</h1>
					<p className="text-xs text-muted-foreground leading-relaxed">
						Log in to your StudyVault AI account
					</p>
				</div>

				{/* Mobile-only feature badges - clean gray theme */}
				<div className="flex flex-wrap justify-center gap-1.5 lg:hidden">
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-border">
						<FileText className="w-3 h-3" />
						Notes
					</span>
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-border">
						<LayoutGrid className="w-3 h-3" />
						Notebooks
					</span>
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-border">
						<Sparkles className="w-3 h-3" />
						AI Summary
					</span>
				</div>

				{/* General server error */}
				{errors.root && (
					<div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
						{errors.root.message}
					</div>
				)}

				<Field data-invalid={!!errors.email} className="gap-1">
					<FieldLabel htmlFor="email" className="text-xs">
						Email
					</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						disabled={isSubmitting}
						{...register("email")}
						className="h-8 text-xs rounded-lg"
					/>
					{errors.email ? (
						<FieldError className="text-[11px]">
							{errors.email.message}
						</FieldError>
					) : (
						<FieldDescription className="text-[10px] text-muted-foreground">
							Enter your registered email address.
						</FieldDescription>
					)}
				</Field>

				<Field data-invalid={!!errors.password} className="gap-1">
					<FieldLabel htmlFor="password" className="text-xs">
						Password
					</FieldLabel>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						disabled={isSubmitting}
						{...register("password")}
						className="h-8 text-xs rounded-lg"
					/>
					{errors.password && (
						<FieldError className="text-[11px]">
							{errors.password.message}
						</FieldError>
					)}
				</Field>

				<Field className="mt-2">
					<Button
						type="submit"
						className="w-full h-8 text-xs rounded-lg font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<svg
									className="mr-1.5 h-3.5 w-3.5 animate-spin text-current"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Logging in...
							</>
						) : (
							<span>Log In</span>
						)}
					</Button>
				</Field>

				<FieldSeparator className="text-[10px] text-muted-foreground my-1">
					Or continue with
				</FieldSeparator>

				<Field>
					<Button
						variant="outline"
						type="button"
						className="w-full h-8 text-xs rounded-lg font-medium border border-border bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground"
						disabled={isSubmitting}
						onClick={async () => {
							await authClient.signIn.social({
								provider: "google",
								callbackURL: "/app",
							});
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							className="w-3.5 h-3.5 mr-1"
						>
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Google
					</Button>
				</Field>

				<div className="text-center text-xs text-muted-foreground mt-1">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="font-medium text-foreground hover:underline"
					>
						Sign up here
					</Link>
				</div>
			</FieldGroup>
		</form>
	);
}
