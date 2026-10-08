import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Image URLs (from the DB / seed data) often request ~2000px Unsplash originals.
// Ask Unsplash's CDN for a size that matches where the image is shown.
export function optimizeImage(url: string | undefined | null, width: number): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'images.unsplash.com') return url;
    parsed.searchParams.set('w', String(width));
    parsed.searchParams.set('q', '75');
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    return parsed.toString();
  } catch {
    return url;
  }
}
