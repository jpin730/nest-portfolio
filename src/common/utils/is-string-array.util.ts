// TODO: (zod validation) will be removed
export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((m) => typeof m === 'string')
