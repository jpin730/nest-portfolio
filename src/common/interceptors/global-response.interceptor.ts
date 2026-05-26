import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { ApiResponse } from '../interfaces/api-response.interface'

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<ApiResponse | null> {
    return next.handle().pipe(map((data: unknown) => (data ? { data } : null)))
  }
}
