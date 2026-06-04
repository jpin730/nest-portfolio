import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { ERROR_MESSAGE } from '../consts/error-message.const'
import { ApiResponse } from '../interfaces/api-response.interface'
import { isStringArray } from '../utils/is-string-array.util'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(error: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const statusCode = this.getStatusCode(error)
    const message = this.getMessage(error)
    const body: ApiResponse = { message }
    this.logger.error(message)
    httpAdapter.reply(ctx.getResponse(), body, statusCode)
  }

  private getStatusCode(error: unknown): number {
    if (error instanceof HttpException) {
      return error.getStatus()
    }
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private getMessage(error: unknown): string {
    const isError = error instanceof Error
    if (!isError) {
      return ERROR_MESSAGE.FALLBACK
    }
    if (error instanceof HttpException) {
      const response = error.getResponse()
      const message = this.getMessageFromResponse(response)
      if (message) {
        return message
      }
    }
    return error.message
  }

  // TODO: (zod validation) will be removed
  private getMessageFromResponse(response: unknown): string | null {
    const isObjectWithMessage =
      typeof response === 'object' && response !== null && 'message' in response
    if (!isObjectWithMessage) {
      return null
    }
    if (typeof response.message === 'string') {
      return response.message
    }
    if (isStringArray(response.message)) {
      return response.message.join(', ')
    }
    return null
  }
}
