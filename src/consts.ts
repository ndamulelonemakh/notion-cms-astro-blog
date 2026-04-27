// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Astro with Notion'
export const SITE_DESCRIPTION = 'A rudimentary implementation of a CMS using Notion as the backend and Astro Content Collection API';

// ---------------------------------------------------------------------------
// Placeholder hero images
// ---------------------------------------------------------------------------
// `source.unsplash.com` was shut down by Unsplash in June 2024. We now use
// picsum.photos with an optional seed so the same post always resolves to
// the same image (better for caching, no layout shift between visits).
const PICSUM_BASE = 'https://picsum.photos';

export const placeholderImage = (
    width = 720,
    height = 360,
    seed?: string,
): string =>
    seed
        ? `${PICSUM_BASE}/seed/${encodeURIComponent(seed)}/${width}/${height}`
        : `${PICSUM_BASE}/${width}/${height}`;

export const PLACEHOLDER_IMAGE_URL = placeholderImage(720, 360);
export const PLACEHOLDER_IMAGE_URL_LG = placeholderImage(1600, 900);