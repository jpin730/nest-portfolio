export const toNumber = (value: unknown): unknown => {
  if (!value) {
    return value
  }
  return Number(value)
}
