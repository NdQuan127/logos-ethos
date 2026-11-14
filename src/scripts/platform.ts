/** True on Apple platforms, where the command key replaces Ctrl in shortcuts. */
export const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

/** "Ctrl K" on Windows and Linux, "⌘ K" on Apple platforms. */
export function platformShortcut(text: string): string {
  return isApple ? text.replace(/\bCtrl\b/g, '⌘') : text;
}

/** Rewrites the shortcut hints rendered at build time (with "Ctrl") for this platform. */
export function localizeShortcuts() {
  if (!isApple) return;
  document.querySelectorAll<HTMLElement>('[data-kbd]').forEach((el) => {
    el.dataset.kbd = platformShortcut(el.dataset.kbd ?? '');
  });
  document.querySelectorAll<HTMLElement>('kbd').forEach((el) => {
    if (el.textContent?.includes('Ctrl')) el.textContent = platformShortcut(el.textContent);
  });
}
