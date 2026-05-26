import { ClassProvider } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { GlobalResponseInterceptor } from '../interceptors/global-response.interceptor'

export const GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER: ClassProvider<GlobalResponseInterceptor> = {
  provide: APP_INTERCEPTOR,
  useClass: GlobalResponseInterceptor,
}
