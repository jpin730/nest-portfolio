import { ValueTransformer } from 'typeorm'

import { toTrim } from '@common/utils/to-trim'

export const TrimTransformer: ValueTransformer = {
  to: toTrim,
  from: (value: unknown) => value,
}
