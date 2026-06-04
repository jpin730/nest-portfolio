import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppLogger } from '@common/classes/app-logger.class'
import { httpLogger } from '@common/middlewares/http-logger.middleware'
import { ConfigService } from '@config/services/config.service'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: new AppLogger() })

  // Configuration
  const { cookieSecret, port, nodeEnv } = app.get(ConfigService)

  // Middlewares
  app.use(httpLogger)
  app.use(cookieParser(cookieSecret))

  // Initialization
  const logger = new Logger('Bootstrap')
  await app.listen(port)
  logger.log(`Environment: ${nodeEnv}`)
  logger.log(`App listening on port: ${port}`)
}
void bootstrap()
