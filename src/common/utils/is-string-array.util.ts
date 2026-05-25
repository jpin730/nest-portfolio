export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((m) => typeof m === 'string')
