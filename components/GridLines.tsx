/**
 * Decorative vertical grid lines — purely visual, pointer-events: none.
 * Renders as a fixed overlay to give the layout a "printed journal" grid feel.
 */
export function GridLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 max-w-7xl mx-auto w-full"
      aria-hidden="true"
    >
      <div className="w-px h-full bg-[var(--border-color)] opacity-50" />
      <div className="hidden md:block w-px h-full bg-[var(--border-color)] opacity-50" />
      <div className="hidden lg:block w-px h-full bg-[var(--border-color)] opacity-50" />
      <div className="w-px h-full bg-[var(--border-color)] opacity-50" />
    </div>
  );
}
