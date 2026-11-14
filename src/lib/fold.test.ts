import { describe, expect, it } from 'vitest';
import { fold } from './fold';

describe('fold', () => {
  it('strips Vietnamese diacritics and đ', () => {
    expect(fold('Định lý Bất toàn của Gödel')).toBe('dinh ly bat toan cua godel');
  });

  it('keeps one character per character, so positions line up', () => {
    const text = 'Người thanh niên 25 tuổi';
    expect(fold(text)).toHaveLength(text.length);
  });

  it('treats decomposed input like composed input', () => {
    expect(fold('Định'.normalize('NFD'))).toBe('dinh');
  });
});
