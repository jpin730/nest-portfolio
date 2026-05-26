import { ClassSerializerInterceptor, FactoryProvider } from '@nestjs/common'
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core'

export const CLASS_SERIALIZER_INTERCEPTOR_PROVIDER: FactoryProvider<ClassSerializerInterceptor> = {
  provide: APP_INTERCEPTOR,
  useFactory: (reflector: Reflector) => new ClassSerializerInterceptor(reflector),
  inject: [Reflector],
}
