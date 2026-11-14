/**
 * Entry point for scripts every page needs. Each init function is safe to call
 * more than once: it skips elements it has already wired up.
 */
import { initHeader } from './header';
import { initPalette } from './palette-loader';
import { localizeShortcuts } from './platform';
import { initTheme } from './theme';
import { initTooltips } from './tooltip';

export function initSite() {
  localizeShortcuts();
  initTheme();
  initHeader();
  initTooltips();
  initPalette();
}
