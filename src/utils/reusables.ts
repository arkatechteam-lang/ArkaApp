export const PAGE_SIZE = 20;

export function getRange(page: number) {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  return { from, to };
}