import { ValueTransformer } from 'typeorm'

export const LowercaseTransformer: ValueTransformer = {
  to: (value: unknown) => (typeof value === 'string' ? value.toLowerCase() : value),
  from: (value: unknown) => value,
}
