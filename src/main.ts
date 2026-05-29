import { NestFactory } from '@nestjs/core'
import morgan from 'morgan'

import { ApiConfigService } from '@api-config/services/api-config.service'

import { Logger } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const apiConfigService = app.get(ApiConfigService)
  const { cookieSecret, port, nodeEnv } = apiConfigService

  app.use(morgan('tiny'))

  app.use(cookieParser(cookieSecret))

  const logger = new Logger('Bootstrap')
  await app.listen(port)
  logger.log(`Environment: ${nodeEnv}`)
  logger.log(`App listening on port: ${port}`)
}
void bootstrap()
