let region: HTMLElement | undefined;

/** Reads a short status message to screen readers without moving focus. */
export function announce(message: string) {
  if (!region) {
    region = document.createElement('div');
    region.className = 'sr-only';
    region.setAttribute('role', 'status');
    document.body.append(region);
  }
  // Clearing first makes a repeated message ("Đã chép" twice) speak again.
  region.textContent = '';
  window.setTimeout(() => {
    if (region) region.textContent = message;
  }, 50);
}
