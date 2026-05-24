import { NestFactory } from '@nestjs/core'
import morgan from 'morgan'

import { ApiConfigService } from '@api-config/api-config.service'

import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const apiConfigService = app.get(ApiConfigService)
  const { cookieSecret, port } = apiConfigService

  app.use(morgan('tiny'))

  app.use(cookieParser(cookieSecret))

  await app.listen(port)
}
void bootstrap()
