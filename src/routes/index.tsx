import { Button } from "#/shared/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	CheckCircle,
	FileText,
	Sparkles,
	ArrowRight,
	Zap,
	Brain,
	Target,
	Shield,
	Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	return (
		<div className="min-h-svh bg-background text-foreground overflow-x-hidden">
			{/* Nav */}
			<header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2.5 group">
						<div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
							<BookOpen className="w-4.5 h-4.5" />
						</div>
						<span className="text-lg font-semibold tracking-tight text-foreground">
							StudyVault AI
						</span>
					</Link>
					<div className="hidden md:flex items-center gap-8">
						<a
							href="#features"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Features
						</a>
						<a
							href="#how-it-works"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							How it works
						</a>
						<a
							href="#testimonials"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Reviews
						</a>
					</div>
					<div className="flex items-center gap-3">
						<Link
							to="/login"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
						>
							Log In
						</Link>
						<Link to="/register">
							<Button className="text-sm font-medium bg-zinc-900 dark:text-white px-5 py-2 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all border border-zinc-200 dark:border-zinc-800">
								Get Started Free
							</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-linear-to-br from-violet-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl" />
					<div className="absolute top-40 right-0 w-100 h-100 bg-linear-to-bl from-fuchsia-500/10 to-transparent rounded-full blur-3xl" />
					<div className="absolute top-60 left-0 w-75 h-75 bg-linear-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
				</div>
				<div
					className="absolute inset-0 pointer-events-none opacity-[0.03]"
					style={{
						backgroundImage:
							"linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
						backgroundSize: "60px 60px",
					}}
				/>

				<div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-36 lg:pb-28">
					<div className="max-w-4xl mx-auto text-center space-y-8">
						<div className="flex justify-center">
							<span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-900 border border-border text-muted-foreground">
								<Sparkles className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
								Powered by AI — Smarter Study Starts Here
							</span>
						</div>
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
							Study smarter,
							<br />
							<span className="text-muted-foreground">not harder</span>
						</h1>
						<p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
							Your AI-powered notebook that doesn't just store your notes — it
							understands them. Get instant summaries, key takeaways, and
							flashcards generated automatically.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
							<Link to="/register">
								<Button
									size="lg"
									className="items-center gap-2.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-8 py-6.5 rounded-2xl text-base font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm border border-zinc-200 dark:border-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
								>
									Start for free
									<ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
								</Button>
							</Link>
							<Link
								to="/login"
								className="inline-flex items-center gap-2 border border-border bg-background px-8 py-3.5 rounded-2xl text-base font-semibold text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
							>
								Sign in
							</Link>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-muted-foreground">
							<div className="flex items-center gap-1.5 text-xs">
								<CheckCircle className="w-4 h-4 text-emerald-500" /> Free
								forever plan
							</div>
							<div className="flex items-center gap-1.5 text-xs">
								<CheckCircle className="w-4 h-4 text-emerald-500" /> No credit
								card required
							</div>
							<div className="flex items-center gap-1.5 text-xs">
								<CheckCircle className="w-4 h-4 text-emerald-500" /> Set up in
								30 seconds
							</div>
						</div>
					</div>

					{/* App Preview Mockup */}
					<div className="mt-16 lg:mt-20 max-w-5xl mx-auto relative">
						<div className="rounded-2xl border border-border/80 bg-zinc-950 shadow-2xl overflow-hidden">
							{/* Browser chrome */}
							<div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
								<div className="flex gap-1.5">
									<div className="w-3 h-3 rounded-full bg-zinc-700" />
									<div className="w-3 h-3 rounded-full bg-zinc-700" />
									<div className="w-3 h-3 rounded-full bg-zinc-700" />
								</div>
								<div className="flex-1 flex justify-center">
									<div className="px-4 py-1 rounded-md bg-zinc-800 text-[10px] text-zinc-500 font-mono">
										studentvault.my.id/app
									</div>
								</div>
							</div>
							{/* App content mockup */}
							<div className="flex min-h-80 lg:min-h-105">
								{/* Sidebar */}
								<div className="hidden md:block w-55 border-r border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
									<div className="flex items-center gap-2 mb-6">
										<div className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
											<BookOpen className="w-3 h-3 text-zinc-100 dark:text-zinc-900" />
										</div>
										<span className="text-xs font-semibold text-zinc-300">
											StudyVault AI
										</span>
									</div>
									<div className="space-y-1.5">
										<div className="h-7 rounded-lg bg-zinc-800 border border-zinc-700" />
										<div className="h-7 rounded-lg bg-zinc-800/50" />
										<div className="h-7 rounded-lg bg-zinc-800/50" />
										<div className="h-7 rounded-lg bg-zinc-800/50" />
									</div>
									<div className="pt-4 space-y-1.5">
										<div className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold">
											Recent Notes
										</div>
										<div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
											<FileText className="w-3 h-3 text-zinc-500" />
											<div className="h-2 w-20 rounded bg-zinc-700" />
										</div>
										<div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/30">
											<FileText className="w-3 h-3 text-zinc-600" />
											<div className="h-2 w-16 rounded bg-zinc-700" />
										</div>
									</div>
								</div>
								{/* Main content */}
								<div className="flex-1 p-6 lg:p-8">
									<div className="max-w-md space-y-4">
										<div className="h-6 w-48 rounded bg-zinc-700/60" />
										<div className="h-2 w-full rounded bg-zinc-800" />
										<div className="h-2 w-5/6 rounded bg-zinc-800" />
										<div className="h-2 w-4/6 rounded bg-zinc-800" />
										<div className="h-2 w-3/6 rounded bg-zinc-800" />
										<div className="mt-6 p-4 rounded-xl border border-zinc-700 bg-zinc-800/50">
											<div className="flex items-center gap-2 mb-3">
												<div className="w-5 h-5 rounded-md bg-zinc-100 flex items-center justify-center">
													<Sparkles className="w-2.5 h-2.5 text-zinc-900" />
												</div>
												<span className="text-[11px] font-bold text-zinc-300">
													AI Summary
												</span>
											</div>
											<div className="h-2 w-full rounded bg-zinc-700" />
											<div className="h-2 w-4/5 rounded bg-zinc-700/60 mt-1.5" />
											<div className="h-2 w-3/5 rounded bg-zinc-700/40 mt-1.5" />
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Glow under the card */}
						<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-linear-to-r from-zinc-500/20 via-zinc-400/10 to-zinc-500/20 blur-3xl rounded-full" />
					</div>
				</div>
			</section>

			{/* Logo Bar */}
			<section className="border-y border-border/50 bg-zinc-50/50 dark:bg-zinc-950/50 py-8">
				<div className="max-w-7xl mx-auto px-6">
					<p className="text-center text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold mb-6">
						Trusted by students at
					</p>
					<div className="flex items-center justify-center gap-8 lg:gap-14 text-muted-foreground/40">
						{["MIT", "Stanford", "Harvard", "Oxford", "Cambridge"].map(
							(name) => (
								<span
									key={name}
									className="text-lg lg:text-xl font-bold tracking-tight"
								>
									{name}
								</span>
							),
						)}
					</div>
				</div>
			</section>

			{/* Features Bento Grid */}
			<section id="features" className="py-24 lg:py-32">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-16">
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-900 border border-border text-muted-foreground mb-4">
							<Zap className="w-3 h-3" /> Features
						</span>
						<h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4">
							Everything you need
							<br />
							<span className="text-muted-foreground">to ace your studies</span>
						</h2>
						<p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
							A thoughtfully designed workspace that combines powerful
							note-taking with intelligent AI assistance.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* Feature 1 - Large */}
						<div className="lg:col-span-2 p-8 rounded-2xl border border-border bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
							<div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-5 shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
								<Brain className="w-6 h-6 text-zinc-100 dark:text-zinc-900" />
							</div>
							<h3 className="text-xl font-bold mb-2">AI-Powered Summaries</h3>
							<p className="text-sm text-muted-foreground leading-relaxed max-w-md">
								Stop re-reading endless notes. Our AI reads them for you and
								generates concise summaries with key concepts, definitions, and
								takeaways — so you can focus on understanding, not highlighting.
							</p>
						</div>
						{/* Feature 2 */}
						<div className="p-8 rounded-2xl border border-border bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
							<div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-5 shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
								<FileText className="w-6 h-6 text-zinc-100 dark:text-zinc-900" />
							</div>
							<h3 className="text-xl font-bold mb-2">
								Distraction-Free Editor
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								A clean, fluid writing environment that gets out of your way.
								Write in markdown, organize with tags, and let your ideas flow
								freely.
							</p>
						</div>
						{/* Feature 3 */}
						<div className="p-8 rounded-2xl border border-border bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
							<div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-5 shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
								<Target className="w-6 h-6 text-zinc-100 dark:text-zinc-900" />
							</div>
							<h3 className="text-xl font-bold mb-2">Smart Organization</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Keep all your notes structured and searchable. Find what you
								need instantly with powerful search and intuitive notebook
								organization.
							</p>
						</div>
						{/* Feature 4 */}
						<div className="p-8 rounded-2xl border border-border bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
							<div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-5 shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
								<Shield className="w-6 h-6 text-zinc-100 dark:text-zinc-900" />
							</div>
							<h3 className="text-xl font-bold mb-2">Safe & Recoverable</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Accidentally deleted something? No worries. Your notes go to
								trash first, so you can always recover them.
							</p>
						</div>
						{/* Feature 5 - Large */}
						<div className="lg:col-span-2 p-8 rounded-2xl border border-border bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
							<div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-5 shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
								<Sparkles className="w-6 h-6 text-zinc-100 dark:text-zinc-900" />
							</div>
							<h3 className="text-xl font-bold mb-2">
								AI That Learns With You
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed max-w-md">
								Every note you write makes the AI smarter. It learns your study
								patterns and content to generate increasingly relevant summaries
								and study materials tailored to your needs.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How it Works */}
			<section
				id="how-it-works"
				className="border-y border-border/50 bg-zinc-50/50 dark:bg-zinc-950/50 py-24 lg:py-32"
			>
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-16">
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-900 border border-border text-muted-foreground mb-4">
							<Zap className="w-3 h-3" /> How it works
						</span>
						<h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4">
							From notes to mastery
							<br />
							<span className="text-muted-foreground">
								in three simple steps
							</span>
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-8 lg:gap-12">
						{[
							{
								step: "01",
								title: "Write your notes",
								desc: "Capture lectures, textbook highlights, or any learning material in our beautiful distraction-free editor. Supports rich text and markdown.",
							},
							{
								step: "02",
								title: "AI summarizes instantly",
								desc: "Our AI engine analyzes your notes in real-time and generates concise summaries, key concepts, and study highlights automatically.",
							},
							{
								step: "03",
								title: "Study smarter, score higher",
								desc: "Review AI-generated summaries instead of re-reading pages of notes. Focus on what matters and retain more in less time.",
							},
						].map((item) => (
							<div key={item.step} className="relative text-center group">
								<div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-6 text-zinc-100 dark:text-zinc-900 font-extrabold text-xl shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
									{item.step}
								</div>
								<h3 className="text-lg font-bold mb-2">{item.title}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section id="testimonials" className="py-24 lg:py-32">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-16">
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-900 border border-border text-muted-foreground mb-4">
							<Star className="w-3 h-3" /> Testimonials
						</span>
						<h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4">
							Loved by
							<span className="text-muted-foreground"> students</span>
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-5">
						{[
							{
								quote:
									"StudyVault AI completely changed how I review for exams. The AI summaries are scarily accurate and save me hours every week.",
								name: "Sarah K.",
								role: "Medical Student",
								avatar: "SK",
							},
							{
								quote:
									"I used to dread organizing my notes. Now I just write and the AI does the rest. It's like having a personal study assistant.",
								name: "Alex M.",
								role: "CS Major",
								avatar: "AM",
							},
							{
								quote:
									"The smart organization and trash recovery are lifesavers. I accidentally deleted a whole notebook and got it back in seconds.",
								name: "Jordan P.",
								role: "Law Student",
								avatar: "JP",
							},
						].map((t) => (
							<div
								key={t.name}
								className="p-6 rounded-2xl border border-border bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
							>
								<div className="flex gap-0.5 mb-4">
									{[1, 2, 3, 4, 5].map((i) => (
										<Star
											key={i}
											className="w-4 h-4 fill-amber-400 text-amber-400"
										/>
									))}
								</div>
								<p className="text-sm text-foreground/80 leading-relaxed mb-5">
									"{t.quote}"
								</p>
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-900 text-xs font-bold">
										{t.avatar}
									</div>
									<div>
										<p className="text-sm font-semibold">{t.name}</p>
										<p className="text-xs text-muted-foreground">{t.role}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="border-t border-border/50 py-24 lg:py-32">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<div className="space-y-6">
						<h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
							Ready to study
							<span className="text-muted-foreground"> smarter</span>?
						</h2>
						<p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
							Join thousands of students who are already using AI to learn
							faster and retain more. Get started in 30 seconds — no credit card
							needed.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
							<Link
								to="/register"
								className="group inline-flex items-center gap-2.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm border border-zinc-200 dark:border-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
							>
								Get started — it's free
								<ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
							</Link>
							<Link
								to="/login"
								className="inline-flex items-center gap-2 border border-border bg-background px-8 py-3.5 rounded-2xl text-base font-semibold text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
							>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border bg-zinc-50 dark:bg-zinc-950">
				<div className="max-w-7xl mx-auto px-6 py-10">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-center gap-2.5">
							<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
								<BookOpen className="w-4 h-4" />
							</div>
							<span className="text-sm font-semibold tracking-tight text-foreground">
								StudyVault AI
							</span>
						</div>
						<div className="flex items-center gap-6 text-xs text-muted-foreground">
							<a
								href="#features"
								className="hover:text-foreground transition-colors"
							>
								Features
							</a>
							<a
								href="#how-it-works"
								className="hover:text-foreground transition-colors"
							>
								How it works
							</a>
							<a
								href="#testimonials"
								className="hover:text-foreground transition-colors"
							>
								Reviews
							</a>
							<Link
								to="/login"
								className="hover:text-foreground transition-colors"
							>
								Log In
							</Link>
							<Link
								to="/register"
								className="hover:text-foreground transition-colors"
							>
								Sign Up
							</Link>
						</div>
						<p className="text-xs text-muted-foreground">
							© {new Date().getFullYear()} StudyVault AI. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
