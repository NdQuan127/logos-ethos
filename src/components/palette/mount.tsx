/** Loaded on first use by scripts/palette-loader.ts; mounts the palette once per page, already open. */
import { createRoot } from 'react-dom/client';
import Palette from './Palette';
import './palette.css';

let mounted = false;

/** Mounts the palette open. Returns false when it was already mounted. */
export function mount(): boolean {
  if (mounted) return false;
  mounted = true;
  const host = document.createElement('div');
  host.id = 'palette-root';
  document.body.append(host);
  createRoot(host).render(<Palette defaultOpen />);
  return true;
}
