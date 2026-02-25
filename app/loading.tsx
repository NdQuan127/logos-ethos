export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent-primary)] rounded-full animate-spin"
          role="status"
          aria-label="Đang tải..."
        />
        <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest">
          Đang tải...
        </span>
      </div>
    </div>
  );
}
