// Only top-level database column names are converted. JSON content is preserved.
export function toRow(value: object): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value)
    .filter(([, item]) => item !== undefined)
    .map(([key, item]) => [key.replace(/[A-Z]/g, char => '_' + char.toLowerCase()), item]));
}
export function fromRow<T>(value: Record<string, unknown>): T {
  return Object.fromEntries(Object.entries(value)
    .map(([key, item]) => [key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase()), item])) as T;
}
