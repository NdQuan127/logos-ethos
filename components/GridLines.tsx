/**
 * Decorative vertical grid lines — purely visual, pointer-events: none.
 * Renders as a fixed overlay to give the layout a "printed journal" grid feel.
 *
 * Performance: Instead of 4 full-height <div> elements (= 5 DOM nodes + 4 paint
 * layers), we use a single div whose background is drawn with
 * repeating-linear-gradient. This reduces DOM nodes from 5 → 1 and collapses the
 * 4 separate compositing layers into one, lowering paint cost and layer memory.
 */
export function GridLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 hidden md:block"
      aria-hidden="true"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            to right,
            var(--border-color) 0px,
            var(--border-color) 1px,
            transparent 1px,
            transparent 25%
          )
        `,
        opacity: 0.5,
      }}
    />
  );
}
