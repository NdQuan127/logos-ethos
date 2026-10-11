import { describe, expect, it } from 'vitest';
import { slugify } from './slug';

describe('slugify', () => {
  it.each([
    ['Nhận thức luận', 'nhan-thuc-luan'],
    ['Đạo đức luận', 'dao-duc-luan'],
    ['Gödel', 'godel'],
    ['  tự   tham chiếu! ', 'tu-tham-chieu'],
    ['Định lý #2: Bất toàn', 'dinh-ly-2-bat-toan'],
  ])('%s → %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});
