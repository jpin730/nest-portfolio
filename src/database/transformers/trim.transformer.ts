import { ValueTransformer } from 'typeorm'

export const TrimTransformer: ValueTransformer = {
  to: (value: unknown) => {
    if (typeof value !== 'string') {
      return value
    }
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  },
  from: (value: unknown) => value,
}
