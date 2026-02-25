/**
 * Shared blur placeholder utilities for next/image.
 *
 * A tiny JPEG (10×10 px, Q=10) encoded as base64.
 * Used as `blurDataURL` on every <Image> so that there is a smooth
 * fade-in instead of a jarring white flash while the real image loads.
 *
 * This is intentionally a warm-grey tone that matches the paper/leather
 * palette so it blends naturally in both light and dark modes.
 *
 * When real images are self-hosted (Phase 2, item 5), each image can have
 * its own blur hash generated with `sharp` at build time and stored
 * in MDX frontmatter. Until then this shared placeholder handles CLS.
 */
export const IMAGE_BLUR_PLACEHOLDER =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAIhAAAQQBBAMAAAAAAAAAAAAAAQIDBBEABRIhMVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Ap+3K1p1vp8LJaS4pWLDJqbOxSMH8FYoYgmJ+12KuaiFlMt2KNQ3vV7ND2qF4IQqsqqvPOKKTP//Z';
