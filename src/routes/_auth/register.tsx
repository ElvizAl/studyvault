import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SignupForm } from "@/modules/auth/components/signup-form";

export const Route = createFileRoute("/_auth/register")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			{/* Left Panel - Branding & Hero */}
			<div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#173a40] to-[#1a3a2a]">
				{/* Background decorative elements */}
				<div className="absolute inset-0">
					<div className="absolute top-0 left-0 w-full h-full opacity-20">
						<div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-[#4fb8b2]/30 blur-[100px]" />
						<div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-[#2f6a4a]/30 blur-[120px]" />
						<div className="absolute top-[50%] left-[50%] w-64 h-64 rounded-full bg-[#328f97]/20 blur-[80px]" />
					</div>
					{/* Grid pattern overlay */}
					<div
						className="absolute inset-0 opacity-[0.06]"
						style={{
							backgroundImage:
								"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
							backgroundSize: "32px 32px",
						}}
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#4fb8b2]/20 border border-[#4fb8b2]/30">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#4fb8b2"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
								<path d="m9 9.5 2 2 4-4" />
							</svg>
						</div>
						<span className="text-xl font-bold text-white/90 tracking-tight">
							StudyVault AI
						</span>
					</div>

					{/* Hero text */}
					<div className="flex-1 flex flex-col justify-center max-w-lg">
						<div className="mb-6">
							<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#4fb8b2]/15 text-[#60d7cf] border border-[#4fb8b2]/20">
								<span className="w-1.5 h-1.5 rounded-full bg-[#4fb8b2] animate-pulse" />
								AI-Powered Learning
							</span>
						</div>
						<h1
							className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4"
							style={{ fontFamily: "'Fraunces', Georgia, serif" }}
						>
							Your Personal
							<br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fb8b2] to-[#6ec89a]">
								Knowledge Base
							</span>
						</h1>
						<p className="text-base text-white/60 leading-relaxed mb-8">
							Simpan, organisir, dan review materi belajar dengan bantuan AI.
							Lebih dari sekedar notes app — StudyVault AI membantu kamu
							memahami ulang materi kapan saja.
						</p>

						{/* Feature highlights */}
						<div className="space-y-4">
							{[
								{
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
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
									),
									title: "Smart Notes",
									desc: "Catat materi dengan editor yang powerful",
								},
								{
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
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
									),
									title: "Notebooks & Tags",
									desc: "Kelompokkan materi agar mudah ditemukan",
								},
								{
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
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
									),
									title: "AI Review",
									desc: "Pahami ulang materi dengan bantuan AI",
								},
							].map((feature) => (
								<div
									key={feature.title}
									className="flex items-start gap-3 group"
								>
									<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#4fb8b2]/10 text-[#4fb8b2] border border-[#4fb8b2]/15 shrink-0 mt-0.5 group-hover:bg-[#4fb8b2]/20 transition-colors">
										{feature.icon}
									</div>
									<div>
										<p className="text-sm font-semibold text-white/85">
											{feature.title}
										</p>
										<p className="text-xs text-white/45">{feature.desc}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Bottom testimonial / social proof */}
					<div className="pt-6 border-t border-white/10">
						<p className="text-xs text-white/40 italic">
							"StudyVault AI mengubah cara saya belajar. Semua materi bootcamp
							tersimpan rapi dan bisa di-review kapan saja."
						</p>
						<p className="text-xs text-[#4fb8b2]/70 mt-2 font-medium">
							— StudyVault
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Signup Form */}
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link to="/" className="flex items-center gap-2.5 font-medium group">
						<div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#4fb8b2]/15 to-[#2f6a4a]/15 border border-[#4fb8b2]/20 group-hover:border-[#4fb8b2]/40 transition-colors">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#4fb8b2"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
								<path d="m9 9.5 2 2 4-4" />
							</svg>
						</div>
						<span className="text-xl font-bold tracking-tight">
							StudyVault AI
						</span>
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-sm">
						<SignupForm />
					</div>
				</div>
			</div>
		</div>
	);
}
