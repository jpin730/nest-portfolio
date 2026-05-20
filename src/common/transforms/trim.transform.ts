import { TransformFnParams } from 'class-transformer'

import { toTrim } from '../utils/to-trim'

export const trimTransform = ({ value }: TransformFnParams): unknown => toTrim(value)
