export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-6 max-w-xs text-center">
        {/* Editorial loading state: a rhythmic pulsing logo badge instead of generic spinner */}
        <div 
          className="w-12 h-12 bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-mono text-xl font-bold rounded-sm animate-pulse shadow-xl" 
          aria-hidden="true"
        >
          L
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-[0.2em] font-medium">
            Đang truy xuất dữ liệu
          </p>
          <div className="flex justify-center gap-1">
            <span className="w-1 h-1 bg-[var(--accent-primary)] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 bg-[var(--accent-primary)] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 bg-[var(--accent-primary)] rounded-full animate-bounce" />
          </div>
        </div>

        {/* Academic detail text — Idea: "Finding truth between lines" */}
        <p className="font-serif italic text-[var(--muted)] text-sm opacity-60">
          "Tìm kiếm sự thật giữa những dòng kẻ..."
        </p>
      </div>
    </div>
  );
}
