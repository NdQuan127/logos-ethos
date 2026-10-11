/** Returns true the first time it is called for an element, false afterwards. */
export function bindOnce(element: HTMLElement, key: string): boolean {
  const flag = `bound${key[0].toUpperCase()}${key.slice(1)}`;
  if (element.dataset[flag]) return false;
  element.dataset[flag] = 'true';
  return true;
}
