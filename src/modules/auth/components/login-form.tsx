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
				navigate({ to: "/" });
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
			className={cn("flex flex-col gap-6", className)}
			onSubmit={handleSubmit(onSubmit)}
			{...props}
		>
			<FieldGroup>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold tracking-tight">Selamat Datang</h1>
					<p className="text-sm text-balance text-muted-foreground leading-relaxed">
						Masuk ke akun StudyVault AI kamu
					</p>
				</div>

				{/* Mobile-only feature badges */}
				<div className="flex flex-wrap justify-center gap-2 lg:hidden">
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#4fb8b2]/10 text-[#328f97] border border-[#4fb8b2]/15">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
						</svg>
						Smart Notes
					</span>
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#4fb8b2]/10 text-[#328f97] border border-[#4fb8b2]/15">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
							<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
						</svg>
						Notebooks
					</span>
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#4fb8b2]/10 text-[#328f97] border border-[#4fb8b2]/15">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
							<path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
						</svg>
						AI Review
					</span>
				</div>

				{/* General server error */}
				{errors.root && (
					<div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{errors.root.message}
					</div>
				)}

				<Field data-invalid={!!errors.email}>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="kamu@email.com"
						disabled={isSubmitting}
						{...register("email")}
					/>
					{errors.email ? (
						<FieldError>{errors.email.message}</FieldError>
					) : (
						<FieldDescription>Masukkan email yang terdaftar.</FieldDescription>
					)}
				</Field>

				<Field data-invalid={!!errors.password}>
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<Input
						id="password"
						type="password"
						disabled={isSubmitting}
						{...register("password")}
					/>
					{errors.password && (
						<FieldError>{errors.password.message}</FieldError>
					)}
				</Field>

				<Field>
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<svg
									className="mr-2 h-4 w-4 animate-spin"
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
								Masuk...
							</>
						) : (
							<>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mr-1.5"
								>
									<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
									<polyline points="10 17 15 12 10 7" />
									<line x1="15" x2="3" y1="12" y2="12" />
								</svg>
								Masuk
							</>
						)}
					</Button>
				</Field>

				<FieldSeparator>Atau masuk dengan</FieldSeparator>

				<Field>
					<Button
						variant="outline"
						type="button"
						className="w-full"
						disabled={isSubmitting}
						onClick={async () => {
							await authClient.signIn.social({
								provider: "google",
								callbackURL: "/",
							});
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							className="w-4 h-4"
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
						Masuk dengan Google
					</Button>
				</Field>

				<div className="text-center text-sm text-muted-foreground">
					Belum punya akun?{" "}
					<Link
						to="/register"
						className="font-medium text-[#328f97] hover:text-[#246f76] underline underline-offset-4 decoration-[#328f97]/40"
					>
						Daftar di sini
					</Link>
				</div>
			</FieldGroup>
		</form>
	);
}
