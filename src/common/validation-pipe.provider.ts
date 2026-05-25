import { FactoryProvider, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'

export const VALIDATION_PIPE_PROVIDER: FactoryProvider<ValidationPipe> = {
  provide: APP_PIPE,
  useFactory: () =>
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: true,
    }),
}
