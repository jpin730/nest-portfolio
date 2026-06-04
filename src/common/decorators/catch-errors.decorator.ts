import { HttpException, HttpStatus, Logger } from '@nestjs/common'

import { ERROR_MESSAGE } from '../consts/error-message.const'
import { getErrorMessage } from '../utils/get-error-message.util'

type AsyncMethod = (...args: unknown[]) => Promise<unknown>

const logger = new Logger('CatchErrors')

export const CatchErrors = (
  message: string = ERROR_MESSAGE.FALLBACK,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
): MethodDecorator => {
  return ((_, __, descriptor: TypedPropertyDescriptor<AsyncMethod>) => {
    const original = descriptor.value
    if (!original) return descriptor
    descriptor.value = async (...args: unknown[]): Promise<unknown> => {
      try {
        return await original.apply(this, args)
      } catch (error) {
        if (error instanceof HttpException) {
          throw error
        }
        logger.error(getErrorMessage(error))
        throw new HttpException(message, status)
      }
    }
    return descriptor
  }) as MethodDecorator
}
