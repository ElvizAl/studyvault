import { Link } from "@tanstack/react-router";
import { Home, AlertCircle } from "lucide-react";

export function NotFoundComponent() {
	return (
		<div className="min-h-screen bg-black/95 flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
				<div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
					<AlertCircle className="w-10 h-10 text-red-500" />
				</div>
				<h1 className="text-4xl font-black text-white mb-2 tracking-tight">
					404
				</h1>
				<h2 className="text-xl font-semibold text-neutral-200 mb-4">
					Page Not Found
				</h2>
				<p className="text-neutral-400 mb-8 leading-relaxed">
					The page you are looking for doesn't exist or has been moved. Let's
					get you back on track.
				</p>
				<Link
					to="/"
					className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all active:scale-95 group"
				>
					<Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
					Back to Home
				</Link>
			</div>
		</div>
	);
}
