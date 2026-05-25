import { ValueTransformer } from 'typeorm'

export const composeTransformers = (...transformers: ValueTransformer[]): ValueTransformer => ({
  to: (value: unknown) => transformers.reduce((acc, t) => t.to(acc), value),
  from: (value: unknown) => transformers.reduceRight((acc, t) => t.from(acc), value),
})
