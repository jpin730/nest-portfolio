import { TransformFnParams } from 'class-transformer'

import { toNumber } from '../utils/to-number'

export const numberTransform = ({ value }: TransformFnParams): unknown => toNumber(value)
