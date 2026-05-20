import {
  ArgumentsHost,
  Catch,
  ClassProvider,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core'

import { ApiResponse } from './api-response.interface'

@Catch()
class GlobalExceptionFilter implements ExceptionFilter<unknown> {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message = HttpStatus[statusCode]

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
    }
    if (exception instanceof Error && exception.message) {
      message = exception.message
    }

    const body: ApiResponse = { message }

    httpAdapter.reply(ctx.getResponse(), body, statusCode)
  }
}

export const GLOBAL_EXCEPTION_FILTER_PROVIDER: ClassProvider<GlobalExceptionFilter> = {
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
}
