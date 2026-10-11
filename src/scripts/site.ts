/**
 * Entry point for scripts every page needs. Each init function is safe to call
 * more than once (e.g. after a client-side navigation): it skips elements it
 * has already wired up.
 */
import { initNav } from './nav';
import { initTheme } from './theme';

export function initSite() {
  initTheme();
  initNav();
}
