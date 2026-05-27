import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

export const validatePlanToInstance = <T extends object>(
  classType: ClassConstructor<T>,
  planObject: unknown,
): T => {
  if (typeof planObject !== 'object' || planObject === null) {
    throw new Error('Invalid plan object')
  }
  const instance = plainToInstance(classType, planObject)
  const errors = validateSync(instance, { skipMissingProperties: false })
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.toString()).join(', '))
  }
  return instance
}
