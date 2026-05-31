import { useEffect, useRef, useState, useCallback } from "react";
import {
	Sparkles,
	Loader2,
	AlertCircle,
	RefreshCw,
	Lightbulb,
	BookOpen,
	HelpCircle,
} from "lucide-react";
import { getSummaryFn, generateSummaryFn } from "../ai.api";
import type { AISummaryContent } from "../ai.api";

interface AISummarySidebarProps {
	noteId: string;
	wordCount: number;
	isTyping: boolean;
	contentForRegen?: string;
	onRegenRequested?: () => void;
}

type SummaryStatus = "FRESH" | "STALE" | "GENERATING" | "FAILED";

interface SummaryState {
	content: AISummaryContent | null;
	status: SummaryStatus | null;
	generatedAt: Date | null;
}

export function AISummarySidebar({
	noteId,
	wordCount,
	isTyping,
	contentForRegen,
	onRegenRequested,
}: AISummarySidebarProps) {
	const [summary, setSummary] = useState<SummaryState>({
		content: null,
		status: null,
		generatedAt: null,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [displayedSummary, setDisplayedSummary] = useState<SummaryState>({
		content: null,
		status: null,
		generatedAt: null,
	});

	const hasGenerated = useRef(false);
	const generatingRef = useRef(false);
	const pollingRef = useRef<NodeJS.Timeout | null>(null);

	// Fetch current summary from server
	const fetchSummary = useCallback(async () => {
		try {
			const result = await getSummaryFn({ data: { noteId } });
			if (result) {
				const parsed = (() => {
					try {
						return JSON.parse(result.content) as AISummaryContent;
					} catch {
						return null;
					}
				})();

				setSummary({
					content: parsed,
					status: result.status as SummaryStatus,
					generatedAt: result.generatedAt ? new Date(result.generatedAt) : null,
				});
			} else {
				setSummary({ content: null, status: null, generatedAt: null });
			}
		} catch {
			// Silently fail on fetch errors
		}
	}, [noteId]);

	const triggerGeneration = useCallback(
		async (content: string) => {
			if (generatingRef.current) return;
			generatingRef.current = true;
			setIsLoading(true);

			// Optimistically mark generating so old content is preserved
			setSummary((prev) => ({
				...prev,
				status: "GENERATING",
			}));

			try {
				await generateSummaryFn({ data: { noteId, content } });
				await fetchSummary();
				onRegenRequested?.();
			} catch {
				// Error is handled by the server (marks FAILED), just re-fetch
				await fetchSummary();
			} finally {
				setIsLoading(false);
				generatingRef.current = false;
			}
		},
		[noteId, fetchSummary, onRegenRequested],
	);

	// Poll while GENERATING
	useEffect(() => {
		if (summary.status === "GENERATING") {
			pollingRef.current = setInterval(async () => {
				await fetchSummary();
			}, 2000);
		} else {
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
				pollingRef.current = null;
			}
		}
		return () => {
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
			}
		};
	}, [summary.status, fetchSummary]);

	// Fetch on mount and when noteId changes
	useEffect(() => {
		hasGenerated.current = false;
		generatingRef.current = false;
		fetchSummary();
	}, [fetchSummary]);

	// Auto-generate when word count first crosses 150 threshold
	useEffect(() => {
		if (
			wordCount >= 150 &&
			!hasGenerated.current &&
			!generatingRef.current &&
			summary.status === null &&
			contentForRegen
		) {
			hasGenerated.current = true;
			triggerGeneration(contentForRegen);
		}
	}, [wordCount, summary.status, contentForRegen, triggerGeneration]);

	// Update displayed summary only when not typing (prevents flicker)
	useEffect(() => {
		if (!isTyping) {
			setDisplayedSummary(summary);
		}
	}, [isTyping, summary]);

	const handleManualRegen = () => {
		if (contentForRegen && wordCount >= 150) {
			hasGenerated.current = true;
			triggerGeneration(contentForRegen);
		}
	};

	const effective = isTyping ? displayedSummary : summary;
	const isGenerating =
		effective.status === "GENERATING" ||
		(isLoading && effective.status !== "FRESH");
	const hasSummary = effective.content !== null;
	const isFailed = effective.status === "FAILED" && !hasSummary;

	return (
		<aside
			className="flex flex-col border-l border-border bg-zinc-50/50 dark:bg-zinc-950/20 overflow-y-auto shrink-0"
			style={{ width: "clamp(280px, 300px, 360px)" }}
		>
			{/* Header */}
			<div className="p-4 border-b border-border flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center shadow-xs">
						<Sparkles className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
					</div>
					<span className="text-xs font-semibold text-foreground tracking-tight">
						AI Spark Summary
					</span>
				</div>

				{/* Status badge + regen button */}
				<div className="flex items-center gap-2">
					{effective.status && (
						<span
							className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
								effective.status === "FRESH"
									? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
									: effective.status === "STALE"
										? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
										: effective.status === "GENERATING"
											? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
											: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
							}`}
						>
							{effective.status === "GENERATING"
								? "Generating…"
								: effective.status}
						</span>
					)}

					{hasSummary &&
						wordCount >= 150 &&
						effective.status !== "GENERATING" && (
							<button
								type="button"
								onClick={handleManualRegen}
								disabled={isGenerating || wordCount < 150}
								title="Regenerate summary"
								className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
							>
								<RefreshCw className="w-3 h-3" />
							</button>
						)}
				</div>
			</div>

			{/* Body */}
			<div className="flex-1 p-4 space-y-4">
				{/* Under 150 words — empty state */}
				{wordCount < 150 && !hasSummary && (
					<div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-3">
						<div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center">
							<Sparkles className="w-5 h-5 text-zinc-400" />
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
							Tulis minimal 150 kata untuk mendapatkan AI summary
						</p>
						<div className="text-[10px] text-muted-foreground/50 tabular-nums">
							{wordCount} / 150 kata
						</div>
					</div>
				)}

				{/* Generating state — show spinner, but preserve old content below if any */}
				{isGenerating && !hasSummary && (
					<div className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
						<Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
						<p className="text-xs text-muted-foreground">Generating summary…</p>
					</div>
				)}

				{/* Failed state — no content at all */}
				{isFailed && !isGenerating && wordCount >= 150 && (
					<div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 p-4 flex flex-col items-center gap-3 text-center">
						<AlertCircle className="w-5 h-5 text-rose-500" />
						<p className="text-xs text-rose-600 dark:text-rose-400">
							Gagal membuat summary. Klik tombol refresh untuk mencoba lagi.
						</p>
						<button
							type="button"
							onClick={handleManualRegen}
							className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
						>
							Coba lagi
						</button>
					</div>
				)}

				{/* Summary content */}
				{hasSummary && effective.content && (
					<div className="space-y-4 animate-in fade-in duration-300">
						{/* Generating indicator on top of existing content */}
						{isGenerating && (
							<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
								<Loader2 className="w-3 h-3 text-blue-500 animate-spin shrink-0" />
								<span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
									Regenerating…
								</span>
							</div>
						)}

						{/* Failed indicator on top of existing content */}
						{effective.status === "FAILED" && !isGenerating && (
							<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
								<AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
								<span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
									Regen gagal — menampilkan summary sebelumnya
								</span>
							</div>
						)}

						{/* Takeaway */}
						<div className="rounded-xl border border-border bg-card p-3.5 space-y-2 shadow-xs">
							<div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
								<Lightbulb className="w-3 h-3" />
								<span>Key Takeaway</span>
							</div>
							<p className="text-xs text-foreground leading-relaxed font-medium">
								{effective.content.takeaway}
							</p>
						</div>

						{/* Key Concepts */}
						{effective.content.keyConcepts?.length > 0 && (
							<div className="rounded-xl border border-border bg-card p-3.5 space-y-2 shadow-xs">
								<div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
									<BookOpen className="w-3 h-3" />
									<span>Key Concepts</span>
								</div>
								<ul className="space-y-1.5">
									{effective.content.keyConcepts.map((concept, i) => (
										<li
											key={i}
											className="flex items-start gap-2 text-xs text-foreground/80"
										>
											<span className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
											{concept}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Recall Hooks */}
						{effective.content.recallHooks?.length > 0 && (
							<div className="rounded-xl border border-border bg-card p-3.5 space-y-2 shadow-xs">
								<div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
									<HelpCircle className="w-3 h-3" />
									<span>Recall Hooks</span>
								</div>
								<ul className="space-y-2">
									{effective.content.recallHooks.map((hook, i) => (
										<li
											key={i}
											className="text-xs text-foreground/80 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 border border-border/60 leading-relaxed"
										>
											{hook}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Generated at timestamp */}
						{effective.generatedAt && (
							<p className="text-[10px] text-muted-foreground/50 text-center">
								Generated{" "}
								{effective.generatedAt.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						)}
					</div>
				)}
			</div>
		</aside>
	);
}
