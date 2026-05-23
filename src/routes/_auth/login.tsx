import { createFileRoute, redirect } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { LoginForm } from "#/modules/auth/components/login-form";
import { requireSessionFn } from "@/modules/auth/auth.api";
import {
	BookOpen,
	CheckCircle,
	FileText,
	LayoutGrid,
	Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_auth/login")({
	beforeLoad: async () => {
		const session = await requireSessionFn();
		if (session) {
			throw redirect({
				to: "/app",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2 bg-background">
			{/* Left Panel - Minimalist Branding & Hero */}
			<div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-r border-border p-10 xl:p-14">
				{/* Decorative elements - subtle gradient grid line */}
				<div className="absolute inset-0 pointer-events-none opacity-30">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage:
								"radial-gradient(var(--border) 1px, transparent 1px)",
							backgroundSize: "24px 24px",
						}}
					/>
				</div>

				{/* Brand Logo */}
				<div className="relative z-10 flex items-center gap-2.5">
					<div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
						<BookOpen className="w-4.5 h-4.5" />
					</div>
					<span className="text-lg font-semibold tracking-tight text-foreground">
						StudyVault AI
					</span>
				</div>

				{/* Center Content */}
				<div className="relative z-10 flex-1 flex flex-col justify-center max-w-md my-auto">
					<div className="mb-6">
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-900 border border-border text-muted-foreground">
							<Sparkles className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
							AI-Powered Learning
						</span>
					</div>

					<h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight mb-3">
						Welcome back.
					</h1>

					<p className="text-sm text-muted-foreground leading-relaxed mb-8">
						Access your personal digital vault and resume your learning journey
						powered by intelligent AI feedback.
					</p>

					{/* Features list - minimal cards with thin borders */}
					<div className="space-y-4">
						{[
							{
								icon: (
									<FileText className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
								),
								title: "Smart Notes",
								desc: "Capture concepts with our distraction-free, fluid writing environment",
							},
							{
								icon: (
									<LayoutGrid className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
								),
								title: "Notebooks & Trash",
								desc: "Organize files efficiently and retrieve deleted items at any time",
							},
							{
								icon: (
									<CheckCircle className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
								),
								title: "AI Summarization",
								desc: "Generate concise summaries and takeaways from notes automatically",
							},
						].map((feature) => (
							<div
								key={feature.title}
								className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card shadow-xs transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
							>
								<div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg border border-border bg-muted shrink-0 mt-0.5">
									{feature.icon}
								</div>
								<div>
									<h4 className="text-xs font-semibold text-foreground">
										{feature.title}
									</h4>
									<p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
										{feature.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Bottom Quote block */}
				<div className="relative z-10 pt-6 border-t border-border">
					<p className="text-xs text-muted-foreground leading-relaxed italic">
						"StudyVault AI completely streamlines my study workflow. Keeping
						notes structured and summarized in one workspace saves hours."
					</p>
					<p className="text-[11px] text-foreground font-semibold mt-2">
						— StudyVault Platform
					</p>
				</div>
			</div>

			{/* Right Panel - Centered Login Form */}
			<div className="flex flex-col justify-between p-6 md:p-10 lg:p-14">
				<div className="flex items-center justify-between">
					<Link
						to="/"
						className="flex items-center gap-2 font-medium group lg:hidden"
					>
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-800">
							<BookOpen className="w-4 h-4" />
						</div>
						<span className="text-base font-semibold tracking-tight text-foreground">
							StudyVault AI
						</span>
					</Link>
				</div>

				<div className="flex flex-1 items-center justify-center py-10">
					<div className="w-full max-w-sm">
						<LoginForm />
					</div>
				</div>

				<div className="text-center text-xs text-muted-foreground">
					Protected by StudyVault security system.
				</div>
			</div>
		</div>
	);
}
