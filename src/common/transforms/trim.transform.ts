import { TransformFnParams } from 'class-transformer'

import { toTrim } from '../utils/to-trim.util'

export const trimTransform = ({ value }: TransformFnParams): unknown => toTrim(value)
