import {
  CallHandler,
  ClassProvider,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { map, Observable } from 'rxjs'

import { ApiResponse } from './api-response.interface'

@Injectable()
class GlobalResponseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<ApiResponse | null> {
    return next.handle().pipe(map((data: unknown) => (data ? { data } : null)))
  }
}

export const GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER: ClassProvider<GlobalResponseInterceptor> = {
  provide: APP_INTERCEPTOR,
  useClass: GlobalResponseInterceptor,
}
