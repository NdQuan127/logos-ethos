/**
 * Canonical base URL for the site.
 *
 * Resolved from the SITE_URL env var (set on Netlify / Firebase / etc.)
 * with a sensible default for local dev and preview builds.
 */
export const SITE_URL =
    process.env.SITE_URL ?? 'https://logos-ethos.netlify.app';
