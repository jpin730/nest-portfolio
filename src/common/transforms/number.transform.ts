import { TransformFnParams } from 'class-transformer'

import { toNumber } from '../utils/to-number.util'

export const numberTransform = ({ value }: TransformFnParams): unknown => toNumber(value)
