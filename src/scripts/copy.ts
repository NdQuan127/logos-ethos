import { announce } from './announce';
import { bindOnce } from './bind';

const CONFIRM_MS = 1600;

/** Copies text, swaps the button's icon to a check for a moment and announces it. */
export async function copyWithFeedback(button: HTMLElement, text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    announce('Không chép được. Hãy chọn và chép thủ công.');
    return;
  }
  const swap = button.querySelector<HTMLElement>('[data-swap]');
  swap?.setAttribute('data-swapped', '');
  const tip = button.dataset.tip;
  if (tip) button.dataset.tip = 'Đã chép';
  announce(message);
  window.clearTimeout(Number(button.dataset.copyTimer));
  button.dataset.copyTimer = String(
    window.setTimeout(() => {
      swap?.removeAttribute('data-swapped');
      if (tip) button.dataset.tip = tip;
    }, CONFIRM_MS),
  );
}

/** The page's address without the #fragment of whatever section is in view. */
export function pageUrl(): string {
  return location.href.split('#')[0];
}

export function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy-code]').forEach((button) => {
    if (!bindOnce(button, 'copy')) return;
    button.addEventListener('click', () => {
      const code = button.closest('.code-block')?.querySelector('pre')?.textContent ?? '';
      void copyWithFeedback(button, code.replace(/\n$/, ''), 'Đã chép đoạn code');
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-copy-link]').forEach((button) => {
    if (!bindOnce(button, 'copy')) return;
    button.addEventListener('click', () => void copyWithFeedback(button, pageUrl(), 'Đã chép liên kết bài viết'));
  });
}
