import { TransformFnParams } from 'class-transformer'

export const toNumber = ({ value }: TransformFnParams): unknown => {
  if (!value) {
    return value as unknown
  }
  return Number(value)
}
