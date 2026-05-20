import {
  ArgumentsHost,
  Catch,
  ClassProvider,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core'

import { ApiResponse } from './api-response.interface'

@Catch()
class GlobalExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const statusCode = this.getStatusCode(exception)
    const message = this.getMessage(exception)
    const body: ApiResponse = { message }

    this.logger.error(message.toString())

    httpAdapter.reply(ctx.getResponse(), body, statusCode)
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    }
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private getMessage(exception: unknown): string | string[] {
    const isInstanceOfError = exception instanceof Error
    if (!isInstanceOfError) {
      return HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR]
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      const message = this.getMessageFromResponse(response)
      if (message) {
        return message
      }
    }

    return exception.message
  }

  private getMessageFromResponse(response: unknown): string | string[] | null {
    const isObjectWithMessage =
      typeof response === 'object' && response !== null && 'message' in response

    if (!isObjectWithMessage) {
      return null
    }

    const isStringArray = (value: unknown): value is string[] => {
      return Array.isArray(value) && value.every((m) => typeof m === 'string')
    }

    if (typeof response.message === 'string' || isStringArray(response.message)) {
      return response.message
    }

    return null
  }
}

export const GLOBAL_EXCEPTION_FILTER_PROVIDER: ClassProvider<GlobalExceptionFilter> = {
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
}
