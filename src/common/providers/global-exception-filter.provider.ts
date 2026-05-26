import { ClassProvider } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { GlobalExceptionFilter } from '../filters/global-exception.filter'

export const GLOBAL_EXCEPTION_FILTER_PROVIDER: ClassProvider<GlobalExceptionFilter> = {
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
}
