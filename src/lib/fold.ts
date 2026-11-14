/**
 * Lower-case text with Vietnamese diacritics removed, so "dinh ly" finds
 * "Định lý". Each character of an NFC string maps to exactly one character,
 * so match positions in the folded text are positions in the original too.
 */
export function fold(text: string): string {
  return text
    .normalize('NFC')
    .split('')
    .map((char) => (char === 'đ' || char === 'Đ' ? 'd' : char.normalize('NFD').replace(/[̀-ͯ]/g, '')))
    .join('')
    .toLowerCase();
}
